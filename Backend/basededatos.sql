-- =============================================
-- Script de creación de la base de datos
-- Librería Nazareth - Sistema de Gestión de Stock
-- NOTA DEL EQUIPO: RECOMENDAMOS EJECUTAR "MIGRATE" PARA GENERAR LAS TABLAS Y LUEGO "CARGAR_DATOS.PY" PARA POBLAR LA BASE DE DATOS TAL COMO SE ESXPLICA EN README.MD.
-- =============================================
CREATE DATABASE IF NOT EXISTS LibreriaNazareth CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE LibreriaNazareth;

-- =============================================
-- Tablas del sistema de autenticación (Django)
-- =============================================
CREATE TABLE IF NOT EXISTS `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL DEFAULT 0,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL DEFAULT '',
  `last_name` varchar(150) NOT NULL DEFAULT '',
  `email` varchar(254) NOT NULL DEFAULT '',
  `is_staff` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `date_joined` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
);

CREATE TABLE IF NOT EXISTS `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_uniq` (`user_id`,`group_id`),
  CONSTRAINT `auth_user_groups_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `auth_user_groups_group_id_fk` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
);

-- =============================================
-- Tablas de la aplicación (productos, marcas, rubros)
-- =============================================
CREATE TABLE IF NOT EXISTS `marca` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `rubro` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL UNIQUE,
  `descripcion` longtext,
  `fecha_creacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `producto` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `descripcion` longtext,
  `codigo_barras` varchar(100) UNIQUE,
  `precio_costo` decimal(10,2) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT 0,
  `fecha_creacion` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `rubro_id` bigint NOT NULL,
  `marca_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `producto_rubro_fk` FOREIGN KEY (`rubro_id`) REFERENCES `rubro` (`id`),
  CONSTRAINT `producto_marca_fk` FOREIGN KEY (`marca_id`) REFERENCES `marca` (`id`)
);

-- =============================================
-- NOTA SOBRE USUARIOS
-- Los usuarios no se incluyen en este script porque las contraseñas
-- requieren el hash de Django. Para crearlos, ejecutar:
-- python scripts/cargar_datos.py
-- =============================================

-- Rubros
INSERT INTO `rubro` (`nombre`, `descripcion`) VALUES
('Librería', 'Artículos escolares, oficina y papelería'),
('Juguetería', 'Juguetes para todas las edades'),
('Regalería', 'Artículos de regalo, cotillón y decoración'),
('Limpieza', 'Productos de limpieza para el hogar'),
('Ferretería', 'Herramientas y artículos de ferretería');

-- Marcas
INSERT INTO `marca` (`nombre`) VALUES
('Rivadavia'), ('Bic'), ('Faber-Castell'), ('Pelikan'),
('Mr. Músculo'), ('Ayudín'), ('Lusqtoff'), ('Black & Decker'),
('Tramontina'), ('Genérica');

-- Productos
INSERT INTO `producto` (`nombre`, `descripcion`, `codigo_barras`, `precio_costo`, `precio_venta`, `stock`, `rubro_id`, `marca_id`)
SELECT p.nombre, p.descripcion, p.codigo_barras, p.precio_costo, p.precio_venta, p.stock, r.id, m.id
FROM (
  SELECT 'Cuaderno Rivadavia 100 hojas' AS nombre, 'Cuaderno tapa dura, rayado, 21 x 28 cm' AS descripcion, '7791234567801' AS codigo_barras, 500.00 AS precio_costo, 850.00 AS precio_venta, 100 AS stock, 'Librería' AS rubro_nombre, 'Rivadavia' AS marca_nombre
  UNION SELECT 'Lapicera Bic Azul', 'Lapicera de tinta azul, punta fina', '7791234567802', 50.00, 120.00, 500, 'Librería', 'Bic'
  UNION SELECT 'Lápices de colores Faber-Castell x12', 'Set de 12 lápices de colores, madera reforestada', '7791234567803', 300.00, 550.00, 50, 'Librería', 'Faber-Castell'
  UNION SELECT 'Resma de papel A4 x500', 'Papel blanco 80 gramos, tamaño A4, paquete de 500 hojas', '7791234567804', 1200.00, 1800.00, 30, 'Librería', 'Genérica'
  UNION SELECT 'Pelota de fútbol N°5', 'Pelota de fútbol profesional, cuero sintético', '7791234567805', 2000.00, 3500.00, 20, 'Juguetería', 'Genérica'
  UNION SELECT 'Bloques de construcción x100', 'Set de 100 bloques plásticos encastrables, colores variados', '7791234567806', 800.00, 1400.00, 40, 'Juguetería', 'Genérica'
  UNION SELECT 'Muñeca articulada con accesorios', 'Muñeca de 30 cm, articulada, incluye ropa y accesorios', '7791234567807', 1500.00, 2500.00, 15, 'Juguetería', 'Genérica'
  UNION SELECT 'Vela aromática de vainilla', 'Vela de cera de soja, aroma a vainilla, 200 gramos', '7791234567808', 350.00, 600.00, 60, 'Regalería', 'Genérica'
  UNION SELECT 'Portarretrato de madera 15x20', 'Portarretrato de madera tallada, color nogal, para foto 15x20 cm', '7791234567809', 450.00, 800.00, 25, 'Regalería', 'Genérica'
  UNION SELECT 'Set de cotillón infantil x20', 'Gorros, silbatos, serpentinas y globos para fiesta infantil', '7791234567810', 200.00, 400.00, 80, 'Regalería', 'Genérica'
  UNION SELECT 'Limpiador multiuso Mr. Músculo 500ml', 'Limpiador líquido multiuso, aroma lavanda, gatillo', '7791234567811', 250.00, 450.00, 70, 'Limpieza', 'Mr. Músculo'
  UNION SELECT 'Esponja de acero Ayudín x5', 'Pack de 5 esponjas de acero inoxidable para limpieza profunda', '7791234567812', 100.00, 200.00, 150, 'Limpieza', 'Ayudín'
  UNION SELECT 'Desodorante de piso Lusqtoff 900ml', 'Desodorante y limpiador para pisos, aroma floral, concentrado', '7791234567813', 180.00, 350.00, 90, 'Limpieza', 'Lusqtoff'
  UNION SELECT 'Taladro eléctrico Black & Decker 550W', 'Taladro percutor de 550W, incluye maletín y accesorios', '7791234567814', 8000.00, 12000.00, 10, 'Ferretería', 'Black & Decker'
  UNION SELECT 'Kit de destornilladores Tramontina x8', 'Set de 8 destornilladores, punta imantada, mango ergonómico', '7791234567815', 1200.00, 2000.00, 25, 'Ferretería', 'Tramontina'
) AS p
JOIN rubro r ON r.nombre = p.rubro_nombre
JOIN marca m ON m.nombre = p.marca_nombre;