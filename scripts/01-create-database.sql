-- Creating database schema for Rifas EL NEGRO
CREATE DATABASE IF NOT EXISTS rifas_el_negro;
USE rifas_el_negro;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Rifas table
CREATE TABLE rifas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  first_prize DECIMAL(10,2) NOT NULL,
  second_prize DECIMAL(10,2) NOT NULL,
  third_prize DECIMAL(10,2) NOT NULL,
  ticket_price DECIMAL(10,2) NOT NULL,
  draw_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Numbers table
CREATE TABLE numbers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rifa_id INT NOT NULL,
  number VARCHAR(3) NOT NULL,
  user_id INT,
  is_paid BOOLEAN DEFAULT FALSE,
  payment_method ENUM('pago_movil', 'binance', 'zelle'),
  payment_reference VARCHAR(255),
  payment_validated BOOLEAN DEFAULT FALSE,
  validated_by INT,
  validated_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rifa_id) REFERENCES rifas(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (validated_by) REFERENCES users(id),
  UNIQUE KEY unique_number_per_rifa (rifa_id, number)
);

-- Payment validations table
CREATE TABLE payment_validations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  number_id INT NOT NULL,
  admin_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (number_id) REFERENCES numbers(id),
  FOREIGN KEY (admin_id) REFERENCES users(id)
);
