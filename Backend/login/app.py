from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection
import bcrypt

app = Flask(__name__)
CORS(app)
#CORS(app, supports_credentials=True)

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        phone = data.get('phone')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'user')  # Default to 'user' if not provided

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if email already exists in either table
            cursor.execute("SELECT COUNT(*) as count FROM admin WHERE email = %s", (email,))
            admin_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) as count FROM users WHERE email = %s", (email,))
            user_count = cursor.fetchone()[0]
            
            if admin_count > 0 or user_count > 0:
                return jsonify({"message": "Email already exists"}), 409

            # Insert new user into the appropriate table based on role
            if role == 'admin':
                cursor.execute(
                    "INSERT INTO admin (username, email, password) VALUES (%s, %s, %s)",
                    (name, email, hashed_password.decode('utf-8'))
                )
            else:  # Default to user
                cursor.execute(
                    "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                    (name, email, hashed_password.decode('utf-8'))
                )
            conn.commit()
            
            return jsonify({"message": f"Registration successful as {role}"}), 201

    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({"message": "Registration failed"}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        with get_db_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            
            # Check in admin table first
            cursor.execute("SELECT * FROM admin WHERE email = %s", (email,))
            user = cursor.fetchone()
            is_admin = True if user else False
            
            if not user:
                # If not found in admin, check users table
                cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
                user = cursor.fetchone()
                is_admin = False

            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                return jsonify({
                    "message": "Login successful",
                    "id": user['id'],
                    "username": user['username'],
                    "email": user['email'],
                    "role": "admin" if is_admin else "user"
                }), 200
            
            return jsonify({"message": "Invalid email or password"}), 401

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"message": "Login failed"}), 500

@app.route("/orders/<int:user_id>", methods=["GET"])
def get_orders(user_id):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            
            # Get orders
            cursor.execute("""
                SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE o.user_id = %s
                ORDER BY o.order_date DESC
            """, (user_id,))
            
            results = cursor.fetchall()
            
            # Format orders
            orders = {}
            for row in results:
                if row['id'] not in orders:
                    orders[row['id']] = {
                        'id': row['id'],
                        'date': row['order_date'].strftime('%Y-%m-%d %H:%M'),
                        'total': 0.0,
                        'address': row['address'],
                        'items': []
                    }
                orders[row['id']]['items'].append({
                    'id': row['product_id'],
                    'name': row['name'],
                    'quantity': row['quantity'],
                    'price': float(row['price'])
                })
                orders[row['id']]['total'] += float(row['price']) * row['quantity']
            
            return jsonify(list(orders.values()))
            
    except Exception as e:
        print(f"Error getting orders: {str(e)}")
        return jsonify({"message": "Failed to fetch orders"}), 500

@app.route("/orders", methods=["POST"])  # Changed from /order to /orders
def place_order():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        items = data.get('items')
        total = data.get('total')
        address = data.get('address')

        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Create order
            cursor.execute(
                "INSERT INTO orders (user_id, address) VALUES (%s, %s)",
                (user_id, address)
            )
            order_id = cursor.lastrowid

            # Add order items
            for item in items:
                cursor.execute(
                    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s, %s, %s, %s)",
                    (order_id, item['productId'], item['quantity'], item['price'])
                )
                
                # Update product stock
                cursor.execute(
                    "UPDATE products SET stock = stock - %s WHERE id = %s",
                    (item['quantity'], item['productId'])
                )
            
            conn.commit()
            return jsonify({"success": True, "orderId": order_id})

    except Exception as e:
        import traceback
        print(f"Error placing order: {str(e)}")
        traceback.print_exc()
        return jsonify({"message": f"Failed to place order: {str(e)}"}), 500

@app.route("/products", methods=["GET"])
def get_products():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM products")
            products = cursor.fetchall()
            return jsonify(products)
    except Exception as e:
        print(f"Error fetching products: {str(e)}")
        return jsonify({"message": "Failed to fetch products"}), 500

@app.route("/products", methods=["POST"])
def add_product():
    data = request.get_json()
    print(f"Received product data: {data}")  # Added logging for debugging
    name = data["name"]
    description = data.get("description", "")
    price = data["price"]
    stock = data["stock"]
    image = data.get("image", "")
    with get_db_connection() as conn:
         cursor = conn.cursor()
         cursor.execute(
             "INSERT INTO products (name, description, price, stock, image) VALUES (%s, %s, %s, %s, %s)",
             (name, description, price, stock, image)
         )
         conn.commit()
         cursor.close()
    #conn.close()
    return jsonify({"message": "Product added successfully"}), 201

@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
        conn.commit()
        cursor.close()
    #conn.close()
        return jsonify({"message": "Product deleted successfully"})

@app.route("/users", methods=["GET"])
def get_users():
    with get_db_connection() as conn:
         cursor = conn.cursor(dictionary=True)
         cursor.execute("SELECT id, username, email FROM users")
         users = cursor.fetchall()
         cursor.close()
         return jsonify(users)

@app.route("/products/<int:product_id>/stock", methods=["PUT"])
def update_product_stock(product_id):
    data = request.get_json()
    change = data.get('change', 0)
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute(
            "UPDATE products SET stock = stock + %s WHERE id = %s",
            (change, product_id)
            )
            conn.commit()
            cursor.close()
            return jsonify({"message": "Stock updated successfully"}), 200
        except Exception as e:
            cursor.close()
            return jsonify({"error": str(e)}), 500

@app.route("/orders/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Delete order items first due to foreign key constraint
            cursor.execute("DELETE FROM order_items WHERE order_id = %s", (order_id,))
            # Delete the order
            cursor.execute("DELETE FROM orders WHERE id = %s", (order_id,))
            conn.commit()
            return jsonify({"success": True, "message": "Order deleted successfully"})
    except Exception as e:
        import traceback
        print(f"Error deleting order: {str(e)}")
        traceback.print_exc()
        return jsonify({"message": f"Failed to delete order: {str(e)}"}), 500

@app.route("/update_profile", methods=["PUT"])
def update_profile():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        role = data.get('role')
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')

        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Update the appropriate table based on role
            if role == 'admin':
                cursor.execute(
                    "UPDATE admin SET username = %s, email = %s, phone = %s WHERE id = %s",
                    (name, email, phone, user_id)
                )
            else:  # user
                cursor.execute(
                    "UPDATE users SET username = %s, email = %s, phone = %s WHERE id = %s",
                    (name, email, phone, user_id)
                )
            conn.commit()
            
            return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        print(f"Profile update error: {str(e)}")
        return jsonify({"message": "Profile update failed"}), 500

@app.route("/change_password", methods=["PUT"])
def change_password():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        role = data.get('role')
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        with get_db_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            
            # Get current password from the appropriate table based on role
            if role == 'admin':
                cursor.execute("SELECT password FROM admin WHERE id = %s", (user_id,))
            else:  # user
                cursor.execute("SELECT password FROM users WHERE id = %s", (user_id,))
                
            user = cursor.fetchone()
            
            if not user or not bcrypt.checkpw(current_password.encode('utf-8'), user['password'].encode('utf-8')):
                return jsonify({"message": "Current password is incorrect"}), 401

            # Hash the new password
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

            # Update the password in the appropriate table based on role
            if role == 'admin':
                cursor.execute(
                    "UPDATE admin SET password = %s WHERE id = %s",
                    (hashed_password.decode('utf-8'), user_id)
                )
            else:  # user
                cursor.execute(
                    "UPDATE users SET password = %s WHERE id = %s",
                    (hashed_password.decode('utf-8'), user_id)
                )
            conn.commit()
            
            return jsonify({"message": "Password changed successfully"}), 200

    except Exception as e:
        print(f"Password change error: {str(e)}")
        return jsonify({"message": "Password change failed"}), 500

@app.route("/analytics/most-sold", methods=["GET"])
def get_most_sold_products():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT p.id, p.name, SUM(oi.quantity) as total_sold
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                GROUP BY p.id, p.name
                ORDER BY total_sold DESC
                LIMIT 5
            """)
            results = cursor.fetchall()
            return jsonify(results)
    except Exception as e:
        print(f"Error fetching most sold products: {str(e)}")
        return jsonify({"message": "Failed to fetch most sold products"}), 500

@app.route("/analytics/least-sold", methods=["GET"])
def get_least_sold_products():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT p.id, p.name, SUM(oi.quantity) as total_sold
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                GROUP BY p.id, p.name
                ORDER BY total_sold ASC
                LIMIT 5
            """)
            results = cursor.fetchall()
            return jsonify(results)
    except Exception as e:
        print(f"Error fetching least sold products: {str(e)}")
        return jsonify({"message": "Failed to fetch least sold products"}), 500

@app.route("/analytics/product-sales", methods=["GET"])
def get_product_sales():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT p.id, p.name, SUM(oi.quantity * oi.price) as total_sales
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                GROUP BY p.id, p.name
                ORDER BY total_sales DESC
            """)
            results = cursor.fetchall()
            return jsonify(results)
    except Exception as e:
        print(f"Error fetching product sales: {str(e)}")
        return jsonify({"message": "Failed to fetch product sales"}), 500

@app.route("/analytics/overview", methods=["GET"])
def get_analytics_overview():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            
            # Get total sales by summing the product of quantity and price from order_items
            cursor.execute("""
                SELECT SUM(oi.quantity * oi.price) as total_sales 
                FROM order_items oi
                JOIN orders o ON oi.order_id = o.id
            """)
            total_sales_result = cursor.fetchone()
            total_sales = total_sales_result['total_sales'] if total_sales_result['total_sales'] is not None else 0
            
            # Get total products sold
            cursor.execute("SELECT SUM(quantity) as total_products_sold FROM order_items")
            total_products_sold_result = cursor.fetchone()
            total_products_sold = total_products_sold_result['total_products_sold'] if total_products_sold_result['total_products_sold'] is not None else 0
            
            # Get low stock count (products with stock < 5)
            cursor.execute("SELECT COUNT(*) as low_stock_count FROM products WHERE stock < 5")
            low_stock_count = cursor.fetchone()['low_stock_count']
            
            return jsonify({
                "totalSales": float(total_sales),
                "totalProductsSold": int(total_products_sold),
                "lowStockCount": int(low_stock_count)
            })
    except Exception as e:
        print(f"Error fetching analytics overview: {str(e)}")
        return jsonify({"message": "Failed to fetch analytics overview"}), 500

@app.route("/analytics/top-buyers", methods=["GET"])
def get_top_buyers():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT u.id, u.username, SUM(oi.quantity) as total_products_bought
                FROM users u
                JOIN orders o ON u.id = o.user_id
                JOIN order_items oi ON o.id = oi.order_id
                GROUP BY u.id, u.username
                ORDER BY total_products_bought DESC
                LIMIT 5
            """)
            results = cursor.fetchall()
            return jsonify(results)
    except Exception as e:
        print(f"Error fetching top buyers: {str(e)}")
        return jsonify({"message": "Failed to fetch top buyers"}), 500

@app.route("/analytics/user-leaderboard", methods=["GET"])
def get_user_leaderboard():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT 
                    u.id,
                    u.username,
                    u.email,
                    COUNT(DISTINCT o.id) as total_orders,
                    SUM(oi.quantity) as total_products_bought,
                    SUM(oi.quantity * oi.price) as total_amount_spent,
                    AVG(oi.quantity * oi.price) as avg_order_value,
                    MAX(o.order_date) as last_purchase_date,
                    DATEDIFF(CURDATE(), MAX(o.order_date)) as days_since_last_purchase
                FROM users u
                LEFT JOIN orders o ON u.id = o.user_id
                LEFT JOIN order_items oi ON o.id = oi.order_id
                GROUP BY u.id, u.username, u.email
                ORDER BY total_amount_spent DESC
            """)
            results = cursor.fetchall()
            
            # Calculate activity score and format data
            leaderboard_data = []
            for user in results:
                # Calculate activity score (weighted combination of metrics)
                orders = user['total_orders'] or 0
                amount = float(user['total_amount_spent'] or 0)
                products = user['total_products_bought'] or 0
                days_since = user['days_since_last_purchase'] or 999
                
                # Activity score formula
                activity_score = (
                    (orders * 10) + 
                    (amount * 0.1) + 
                    (products * 5) - 
                    (days_since * 2)
                )
                
                leaderboard_data.append({
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'totalOrders': orders,
                    'totalProducts': products,
                    'totalSpent': round(amount, 2),
                    'avgOrderValue': round(float(user['avg_order_value'] or 0), 2),
                    'lastPurchaseDate': user['last_purchase_date'].strftime('%Y-%m-%d') if user['last_purchase_date'] else None,
                    'daysSinceLastPurchase': days_since,
                    'activityScore': round(activity_score, 2),
                    'rank': 0  # Will be calculated in frontend
                })
            
            return jsonify(leaderboard_data)
    except Exception as e:
        print(f"Error fetching user leaderboard: {str(e)}")
        return jsonify({"message": "Failed to fetch user leaderboard"}), 500

if __name__ == "__main__":
    app.run(debug=True)
