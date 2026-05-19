-- Script de creación de base de datos
--
-- Este archivo define la estructura inicial del proyecto.
-- Mantenerla en SQL separado permite reconstruir la base
-- fácilmente durante pruebas o reinstalaciones.

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS taller_clientes
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Seleccionar la base de datos.
-- Las siguientes instrucciones se aplicarán sobre este entorno.
USE taller_clientes;


-- Tabla: cliente
-- Entidad principal del modelo de datos
-- 
CREATE TABLE IF NOT EXISTS cliente (
  id_cliente   INT           NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(100)  NOT NULL,
  email        VARCHAR(150)  NOT NULL,
  telefono     VARCHAR(20)   NOT NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

-- Clave primaria de la tabla
  PRIMARY KEY (id_cliente),

-- Restricción de unicidad en el correo
-- Evita que dos clientes compartan el mismo email.
  CONSTRAINT uq_cliente_email UNIQUE (email)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- Datos de prueba (opcional)
--
-- Inserta registros iniciales.
-- Esto facilita probar la API sin tener que crear datos manualmente.
INSERT INTO cliente (nombre, email, telefono) VALUES
  ('Ana Maria Torres',    'ana.torres.23@email.com',    '+56912345678'),
  ('Luis Alfredo Pérez',    'luis.perez.65@email.com',    '+56987654321'),
  ('Carla Estefania Muñoz',   'carla.munoz.72@email.com',   '+56911112345');