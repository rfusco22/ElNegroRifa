-- Seeding initial data for Rifas EL NEGRO
USE rifas_el_negro;

-- Create admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, phone, cedula, role) VALUES 
('admin@rifaselnego.com', '$2b$10$rOvHPGp8.uRfnAP2nRko/.jO.mq5.l8vKw6jO6lfaD4q4L5Hs5jW6', 'Admin', 'Rifas El Negro', '+58-000-0000000', '00000000', 'admin');

-- Create initial raffle
INSERT INTO raffles (title, description, ticket_price, total_numbers, first_prize, second_prize, third_prize, draw_date, created_by) VALUES 
('Rifas EL NEGRO - Octubre 2025', '$1000 a repartir en 3 premios', 400.00, 1000, 700.00, 200.00, 100.00, '2025-10-31', 1);

-- Generate all numbers (000-999) for the raffle
INSERT INTO numbers (raffle_id, number) 
SELECT 1, LPAD(n, 3, '0') 
FROM (
  SELECT a.N + b.N * 10 + c.N * 100 as n
  FROM 
    (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
    (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
    (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) c
  ORDER BY n
) numbers;
