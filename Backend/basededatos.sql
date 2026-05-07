create DATABASE LibreriaNazareth;

USE LibreriaNazareth;

CREATE TABLE rol (
    rol_id INT PRIMARY KEY AUTO_INCREMENT,
    rol VARCHAR(50) NOT NULL
);

CREATE TABLE usuario (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    contrasena VARCHAR(255),          
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_rol INT NOT NULL,
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol) REFERENCES rol(rol_id)
);

CREATE TABLE IF NOT EXISTS marca (
    marca_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS rubro (
    rubro_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS producto (
    producto_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL,
    descripcion VARCHAR(255),
    stock INT,
    precio_costo DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    id_marca INT NOT NULL,
    codigo_barras VARCHAR(50) NOT NULL,
    id_rubro INT NOT NULL,
    CONSTRAINT fk_producto_rubro
        FOREIGN KEY (id_rubro) REFERENCES rubro(rubro_id),
    CONSTRAINT fk_producto_marca
        FOREIGN KEY (id_marca) REFERENCES marca(marca_id)
);

CREATE TABLE sesion (
    sesion_id INT PRIMARY KEY AUTO_INCREMENT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_sesion_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(usuario_id)
);
