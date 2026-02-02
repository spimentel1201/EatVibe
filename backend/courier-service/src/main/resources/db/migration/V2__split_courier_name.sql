-- V2: Split name into first_name and last_name in couriers table
ALTER TABLE couriers ADD COLUMN first_name VARCHAR(255);
ALTER TABLE couriers ADD COLUMN last_name VARCHAR(255);

-- Migrar datos existentes (si hay)
UPDATE couriers SET first_name = name, last_name = '';

-- Alterar columnas para que no sean nulas
ALTER TABLE couriers ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE couriers ALTER COLUMN last_name SET NOT NULL;

-- Eliminar columna name
ALTER TABLE couriers DROP COLUMN name;
