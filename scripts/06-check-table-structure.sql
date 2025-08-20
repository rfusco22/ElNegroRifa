-- Verificar la estructura actual de la tabla users
DESCRIBE users;

-- Mostrar todos los usuarios con las columnas correctas
SELECT 
    id,
    full_name,
    email,
    cedula,
    phone,
    city,
    role,
    created_at 
FROM users 
ORDER BY id;
