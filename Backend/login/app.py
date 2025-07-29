from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection
import bcrypt

app = Flask(__name__)
CORS(app)


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
    name = data["name"]
    description = data.get("description", "")
    price = data["price"]
    stock = data["stock"]
    image = data.get("image", "")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO products (name, description, price, stock, image) VALUES (%s, %s, %s, %s, %s)",
        (name, description, price, stock, image)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Product added successfully"}), 201

@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Product deleted successfully"})

@app.route("/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, username, email FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

@app.route("/products/<int:product_id>/stock", methods=["PUT"])
def update_product_stock(product_id):
    data = request.get_json()
    change = data.get('change', 0)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "UPDATE products SET stock = stock + %s WHERE id = %s",
            (change, product_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Stock updated successfully"}), 200
    except Exception as e:
        cursor.close()
        conn.close()
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

if __name__ == "__main__":
    app.run(debug=True)
