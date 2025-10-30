-- Script de configuración de base de datos para La Calaverita de Juan
-- Ejecutar en phpMyAdmin o MySQL Workbench

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS calaverita_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE calaverita_db;

-- Crear tabla de puntajes
CREATE TABLE IF NOT EXISTS puntajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    puntos INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_puntos (puntos DESC),
    INDEX idx_fecha (fecha DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de prueba (opcional)
INSERT INTO puntajes (nombre, puntos) VALUES
('Juan Pérez', 150),
('María García', 180),
('Carlos López', 120),
('Ana Martínez', 200),
('Luis Rodríguez', 90);

-- Verificar que la tabla se creó correctamente
SELECT * FROM puntajes ORDER BY puntos DESC LIMIT 10;

-- Mostrar estructura de la tabla
DESCRIBE puntajes;
