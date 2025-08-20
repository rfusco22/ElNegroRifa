-- Adding cedula and city fields to users table
ALTER TABLE users 
ADD COLUMN cedula VARCHAR(20) UNIQUE,
ADD COLUMN city VARCHAR(100);

-- Update existing users with placeholder data
UPDATE users SET 
  cedula = CONCAT('V-', LPAD(id * 1000000, 8, '0')),
  city = 'No especificada'
WHERE cedula IS NULL;

-- Make cedula required for new users
ALTER TABLE users 
MODIFY COLUMN cedula VARCHAR(20) NOT NULL;
