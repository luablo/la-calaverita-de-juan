-- Actualizar tabla puntajes para incluir avatar
-- Ejecutar este script en phpMyAdmin

USE calaverita_db;

-- Agregar columna avatar si no existe
ALTER TABLE puntajes ADD COLUMN IF NOT EXISTS avatar LONGTEXT AFTER puntos;

-- Verificar estructura
DESCRIBE puntajes;
