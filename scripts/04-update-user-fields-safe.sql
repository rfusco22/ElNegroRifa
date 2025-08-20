-- Actualizar tabla users de forma segura
-- Solo agregar columnas si no existen

-- Verificar y agregar columna city si no existe
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'city';

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE users ADD COLUMN city VARCHAR(100)', 
    'SELECT "Column city already exists" as message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar que la columna cedula tenga el índice único
ALTER TABLE users MODIFY COLUMN cedula VARCHAR(20) UNIQUE;

-- Actualizar usuarios existentes con datos de ejemplo si están vacíos
UPDATE users 
SET city = 'Caracas', 
    cedula = CONCAT('V-', LPAD(id * 1234567, 8, '0'))
WHERE city IS NULL OR city = '' OR cedula IS NULL OR cedula = '';
