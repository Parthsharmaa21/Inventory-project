import mysql.connector
from Backend.login.db_config import get_db_connection

# Check if there are any orders in the database
with get_db_connection() as conn:
    cursor = conn.cursor(dictionary=True)
    
    # Check orders table
    cursor.execute("SELECT * FROM orders")
    orders = cursor.fetchall()
    print("Orders:", orders)
    
    # Check order_items table
    cursor.execute("SELECT * FROM order_items")
    order_items = cursor.fetchall()
    print("Order Items:", order_items)
    
    # Check the analytics queries directly
    cursor.execute("SELECT SUM(total) as total_sales FROM orders")
    total_sales = cursor.fetchone()['total_sales'] or 0
    print("Total Sales:", total_sales)
    
    cursor.execute("SELECT SUM(quantity) as total_products_sold FROM order_items")
    total_products_sold = cursor.fetchone()['total_products_sold'] or 0
    print("Total Products Sold:", total_products_sold)
    
    cursor.close()
