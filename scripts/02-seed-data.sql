-- Seeding initial data
USE rifas_el_negro;

-- Create admin user (password: admin123)
INSERT INTO users (email, password, name, phone, is_admin) VALUES 
('admin@rifaselnego.com', '$2b$10$rOvHPGp8.Anpn/jQOvQdKOKxLQ8qXqJ8QvQdKOKxLQ8qXqJ8QvQdKO', 'Administrador', '+58424000000', TRUE);

-- Create initial rifa
INSERT INTO rifas (title, description, first_prize, second_prize, third_prize, ticket_price, draw_date, created_by) VALUES 
('Rifas EL NEGRO - Octubre 2025', '$1000 a repartir en 3 premios', 700.00, 200.00, 100.00, 400.00, '2025-10-31', 1);
