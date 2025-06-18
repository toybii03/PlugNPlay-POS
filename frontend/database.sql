-- Create the database
CREATE DATABASE IF NOT EXISTS pos_system;
USE pos_system;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'cashier') NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Store settings table
CREATE TABLE store_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    store_name VARCHAR(100) NOT NULL,
    store_address TEXT NOT NULL,
    store_phone VARCHAR(20) NOT NULL,
    store_email VARCHAR(100) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    receipt_footer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 0,
    supplier_id INT NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Customers table
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    total_orders INT DEFAULT 0,
    loyalty_points INT DEFAULT 0,
    tier ENUM('Bronze', 'Silver', 'Gold', 'Platinum') DEFAULT 'Bronze',
    last_visit TIMESTAMP NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36),
    user_id VARCHAR(36) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'other') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Customer feedback table
CREATE TABLE customer_feedback (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Sales analytics table
CREATE TABLE sales_analytics (
    id VARCHAR(36) PRIMARY KEY,
    date DATE NOT NULL,
    total_sales DECIMAL(10,2) NOT NULL,
    total_orders INT NOT NULL,
    average_order_value DECIMAL(10,2) NOT NULL,
    total_discounts DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
);

-- Inventory analytics table
CREATE TABLE inventory_analytics (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    opening_stock INT NOT NULL,
    closing_stock INT NOT NULL,
    stock_sold INT NOT NULL,
    stock_received INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_product_date (product_id, date)
);

-- Customer analytics table
CREATE TABLE customer_analytics (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    total_spent DECIMAL(10,2) NOT NULL,
    order_count INT NOT NULL,
    average_rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    UNIQUE KEY unique_customer_date (customer_id, date)
);

-- Email templates table
CREATE TABLE email_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type ENUM('receipt', 'welcome', 'feedback') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default store settings
INSERT INTO store_settings (store_name, store_address, store_phone, store_email, currency, tax_rate, receipt_footer)
VALUES ('POS Store', '123 Main Street, City, State 12345', '+1 (555) 123-4567', 'store@example.com', 'USD', 8.0, 'Thank you for your business!');

-- Insert default categories
INSERT INTO categories (name) VALUES
('Electronics'),
('Accessories'),
('Computers'),
('Tablets'),
('Wearables'),
('Audio'),
('Gaming'),
('Home & Garden'),
('Sports'),
('Books');

-- Insert default suppliers
INSERT INTO suppliers (name, email, phone) VALUES
('Apple Inc.', 'contact@apple.com', '+1 (800) 692-7753'),
('Samsung', 'contact@samsung.com', '+1 (800) 726-7864'),
('Microsoft', 'contact@microsoft.com', '+1 (800) 642-7676'),
('Google', 'contact@google.com', '+1 (650) 253-0000'),
('Sony', 'contact@sony.com', '+1 (800) 222-7669'),
('HP', 'contact@hp.com', '+1 (800) 474-6836'),
('Dell', 'contact@dell.com', '+1 (800) 999-3355'),
('Lenovo', 'contact@lenovo.com', '+1 (855) 253-6686');

-- Insert default admin user (password: admin123)
INSERT INTO users (id, username, email, password_hash, role, name)
VALUES (UUID(), 'admin', 'admin@pos.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'admin', 'System Administrator');

-- Insert default cashier user (password: cashier123)
INSERT INTO users (id, username, email, password_hash, role, name)
VALUES (UUID(), 'cashier', 'cashier@pos.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'cashier', 'John Cashier');

-- Insert default email templates
INSERT INTO email_templates (id, name, subject, body, type) VALUES
(UUID(), 'Receipt Template', 'Your Purchase Receipt from {store_name}', 
'Dear {customer_name},\n\nThank you for your purchase!\n\nOrder Details:\n{order_details}\n\nTotal: {total_amount}\n\n{farewell_message}\n\nSincerely,\nThe Team at {store_name}', 
'receipt'),
(UUID(), 'Feedback Request', 'How was your experience with us?', 
'Dear {customer_name},\n\nWe value your feedback! Please take a moment to rate your recent shopping experience with us.\n\n{feedback_link}\n\nThank you for helping us improve our service!\n\nBest regards,\nThe Team at {store_name}', 
'feedback');

-- Insert default manager user (password: manager123)
INSERT INTO users (id, username, email, password_hash, role, name)
VALUES (UUID(), 'manager', 'manager@pos.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX5Yx', 'manager', 'Sarah Manager'); 