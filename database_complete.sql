-- ============================================
-- Base de Datos Completa: La Calaverita de Juan
-- Para MySQL Workbench o phpMyAdmin
-- ============================================

-- Eliminar base de datos si existe (opcional)
DROP DATABASE IF EXISTS calaverita_db;

-- Crear base de datos
CREATE DATABASE calaverita_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE calaverita_db;

-- ============================================
-- Crear tabla de puntajes con avatar
-- ============================================
CREATE TABLE puntajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    puntos INT NOT NULL,
    avatar LONGTEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_puntos (puntos DESC),
    INDEX idx_fecha (fecha DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insertar datos de ejemplo
-- ============================================

-- Ejemplo 1: Juan Pérez (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Juan Pérez', 250, NULL);

-- Ejemplo 2: María García (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('María García', 320, NULL);

-- Ejemplo 3: Carlos López (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Carlos López', 180, NULL);

-- Ejemplo 4: Ana Martínez (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Ana Martínez', 290, NULL);

-- Ejemplo 5: Luis Rodríguez (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Luis Rodríguez', 150, NULL);

-- Ejemplo 6: Sofia Hernández (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Sofia Hernández', 270, NULL);

-- Ejemplo 7: Diego Torres (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Diego Torres', 200, NULL);

-- Ejemplo 8: Valentina Ruiz (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Valentina Ruiz', 310, NULL);

-- Ejemplo 9: Miguel Ángel (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Miguel Ángel', 190, NULL);

-- Ejemplo 10: Isabella Morales (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Isabella Morales', 260, NULL);

-- Ejemplo 11: Santiago Vargas (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Santiago Vargas', 230, NULL);

-- Ejemplo 12: Camila Reyes (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Camila Reyes', 280, NULL);

-- Ejemplo 13: Mateo Jiménez (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Mateo Jiménez', 170, NULL);

-- Ejemplo 14: Lucía Castro (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Lucía Castro', 240, NULL);

-- Ejemplo 15: Sebastián Ortiz (sin avatar)
INSERT INTO puntajes (nombre, puntos, avatar) VALUES 
('Sebastián Ortiz', 210, NULL);

-- ============================================
-- Verificar datos insertados
-- ============================================

-- Ver todos los puntajes ordenados por puntos
SELECT 
    id,
    nombre,
    puntos,
    CASE 
        WHEN avatar IS NULL THEN 'Sin avatar'
        ELSE 'Con avatar'
    END as tiene_avatar,
    fecha
FROM puntajes 
ORDER BY puntos DESC, fecha DESC;

-- Ver top 10
SELECT 
    nombre,
    puntos,
    fecha
FROM puntajes 
ORDER BY puntos DESC 
LIMIT 10;

-- Ver estadísticas
SELECT 
    COUNT(*) as total_jugadores,
    MAX(puntos) as puntaje_maximo,
    MIN(puntos) as puntaje_minimo,
    AVG(puntos) as promedio,
    SUM(CASE WHEN avatar IS NOT NULL THEN 1 ELSE 0 END) as con_avatar,
    SUM(CASE WHEN avatar IS NULL THEN 1 ELSE 0 END) as sin_avatar
FROM puntajes;

-- ============================================
-- Consultas útiles
-- ============================================

-- Buscar por nombre
-- SELECT * FROM puntajes WHERE nombre LIKE '%Juan%';

-- Eliminar puntajes antiguos (más de 30 días)
-- DELETE FROM puntajes WHERE fecha < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Actualizar un puntaje
-- UPDATE puntajes SET puntos = 350 WHERE id = 1;

-- Ver estructura de la tabla
DESCRIBE puntajes;

-- ============================================
-- Información de la base de datos
-- ============================================
SELECT 
    'Base de datos creada exitosamente' as mensaje,
    DATABASE() as base_datos_actual,
    COUNT(*) as registros_ejemplo
FROM puntajes;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. La columna 'avatar' almacena imágenes en formato base64 (LONGTEXT)
-- 2. Los índices mejoran el rendimiento de las consultas
-- 3. El charset utf8mb4 soporta emojis y caracteres especiales
-- 4. Los puntajes se ordenan por puntos DESC y fecha DESC
-- 5. Para producción, considera agregar más validaciones y seguridad
-- ============================================
