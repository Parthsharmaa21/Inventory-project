CREATE DATABASE loginapp;
USE loginapp;

CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20)
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20)
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    image VARCHAR(512)
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO admin (username, email, password) VALUES
('parth', 'parth@isc.com', '$2b$12$mYyiocDOuzBS0fbLzbwkIeR9wRTJ/qlKvn.0L8gJ0FRuXHPekN/YW'),
('admin2', 'admin2@isc.com', '$2b$12$NQX7SE0G2pFyGWzjNLnuvOmS2NLbL8bo2gW51Oz0tBmuT1uUvhiJa'),
('admin3', 'admin3@isc.com', '$2b$12$CGfFxRPH.fbIj4auADLvmO9PkunpjoMO3DgMZKTC4hmYhoRsenegy');

INSERT INTO users (username, email, password) VALUES
('john', 'john@example.com', '$2b$12$N7N16QUOIfgxa.yX5p2QIu1vEY52OxT0kuUvBglTWYD5T/h7ZVtEK'),
('vaibhav', 'vaibhav@om.com', '$2b$12$KxrcC2g4500jIKBMSj5L3.jg3ApQpAYNthNcMlIg5jVkgK4BRLN.6'),
('rishita','rishita@hashed.com', '$2b$12$zERMvW909pOzjOaI9Wia5el5ghnM579Qnp9OS135YqDZzNxGN91iq');

INSERT INTO products (name, description, price, stock, image) VALUES
('Laptop', 'High performance laptop for work and play.', 800, 10, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'),
('Monitor', '24-inch Full HD monitor with vibrant colors.', 150, 15, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80'),
('Keyboard', 'Mechanical keyboard with RGB lighting.', 25, 30, 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&w=400&q=80'),
('Mouse', 'Wireless mouse with ergonomic design.', 20, 25, 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80');