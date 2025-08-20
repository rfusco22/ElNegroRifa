-- Creating database structure for Rifas EL NEGRO
CREATE DATABASE IF NOT EXISTS rifas_el_negro;
USE rifas_el_negro;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Raffles table
CREATE TABLE raffles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  ticket_price DECIMAL(10,2) NOT NULL,
  total_numbers INT NOT NULL DEFAULT 1000,
  first_prize DECIMAL(10,2) NOT NULL,
  second_prize DECIMAL(10,2) NOT NULL,
  third_prize DECIMAL(10,2) NOT NULL,
  draw_date DATE NOT NULL,
  status ENUM('active', 'closed', 'drawn') DEFAULT 'active',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Numbers table (tracks which numbers are available/sold)
CREATE TABLE numbers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  raffle_id INT NOT NULL,
  number VARCHAR(3) NOT NULL,
  status ENUM('available', 'reserved', 'sold') DEFAULT 'available',
  user_id INT NULL,
  reserved_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (raffle_id) REFERENCES raffles(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_raffle_number (raffle_id, number)
);

-- Purchases table
CREATE TABLE purchases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  raffle_id INT NOT NULL,
  numbers JSON NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('pago_movil', 'binance', 'zelle') NOT NULL,
  payment_reference VARCHAR(255),
  payment_proof TEXT,
  status ENUM('pending', 'validated', 'rejected') DEFAULT 'pending',
  validated_by INT NULL,
  validated_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (raffle_id) REFERENCES raffles(id),
  FOREIGN KEY (validated_by) REFERENCES users(id)
);
