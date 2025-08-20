-- Desactivar modo seguro temporalmente
SET SQL_SAFE_UPDATES = 0;

-- Actualizar usuarios existentes que no tengan cédula o ciudad
UPDATE users 
SET 
    city = CASE 
        WHEN city IS NULL OR city = '' THEN 'Caracas' 
        ELSE city 
    END,
    cedula = CASE 
        WHEN cedula IS NULL OR cedula = '' THEN CONCAT('V-', LPAD(id * 1234567, 8, '0'))
        ELSE cedula 
    END
WHERE id > 0;

-- Reactivar modo seguro
SET SQL_SAFE_UPDATES = 1;

-- Verificar que todos los usuarios tengan los campos requeridos
SELECT 
    id, 
    name, 
    email, 
    cedula, 
    phone, 
    city,
    role,
    created_at
FROM users 
ORDER BY id;
