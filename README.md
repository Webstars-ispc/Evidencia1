# Libreria Nazareth📚
 ![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Versión](https://img.shields.io/badge/versión-2.0.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

La plataforma para la librería busca agilizar el tiempo del trabajador a la hora de registrar los productos y realizar las ventas.

# Fundamentación🔈

Durante la pandemia cuando la economía fluctuaba se tenían que cambiar los precios uno por uno en cada producto del local, el cliente decidió empezar a buscar un método de organización digital, el cual si bien ayudó, con el avance del tiempo y al incrementar la variedad de productos, dicho problema volvió. Entonces en busca de un nuevo método, le ofrecimos un sistema que le dejara registrar sus productos de manera más simple, realizar la carga del producto escaneando con el celular el código de barras, también con un ágil sistema de búsqueda y filtros realizar las venta efectivizando el tiempo tanto del trabajador como del cliente.


## Tecnologías utilizadas 
| Capa | Tecnología | Versión |
|-------------|-------------------|----------| 
| Backend | Django | 5.x | 
| API REST | Django RESTFramework | 3.x | 
| Base de datos | PostgreSQL | 16.x | 
| Frontend | Angular |21.x | 
| Lenguajes | Python 3.11 / TypeScript 5 | |
| Control de versiones | Git / GitHub |
| Gestor de paquetes | pip / npm | |


# Instrucciones de instalación

## Requisitos previos
Antes de empezar, necesitás tener instalado:

- [Python 3.10 o superior](https://www.python.org/downloads/)
- [Node.js 18 o superior](https://nodejs.org/) (incluye npm)
- [Git](https://git-scm.com/downloads)
- [XAMPP](https://www.apachefriends.org/) (incluye MariaDB) o MySQL standalone
- Angular CLI instalado globalmente: `npm install -g @angular/cli`
- Editor de código recomendado: [VS Code](https://code.visualstudio.com/)
- Irium Cam

# 🚀 Instalación paso a paso

## 1. Clonar el repositorio

```bash
git clone https://github.com/Webstars-ispc/LibreriaNazareth.git
cd LibreriaNazareth
git checkout main
```

## 2. Backend — Django
* Iniciar MySQL/MariaDB: 
Abrí el Panel de Control de XAMPP y hacé clic en Start en la fila de MySQL. Debe aparecer en verde.

* Crear la base de datos: 
Abrí phpMyAdmin (http://localhost/phpmyadmin) y creá una base de datos con el nombre LibreriaNazareth (o el que prefieras) con cotejamiento utf8mb4_general_ci.

* Configurar variables de entorno: abri tu editor de codigo, dirigite a la carpeta BackEnd y modifica el archivo ".env_modelo" con tus credenciales:
```
SECRET_KEY=tu-clave-secreta #la genera django al crear el proyecto
DEBUG=True
DB_NAME=LibreriaNazareth
DB_USER=root
DB_PASSWORD=         # En XAMPP suele estar vacío
DB_HOST=localhost
DB_PORT=3306
```
(En caso de que no tengas una clave secreta, generala aleatoriamente: 
```
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
Luego renombra el archivo a .env

* Abri una terminal en la carpeta Backend
* Crear entorno virtual, activarlo e instalar dependencias: 
```
python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```
* Ejecutar migraciones: crea todas las tablas automaticamente
```
python manage.py migrate
```
* Las tablas van a estar vacias asi que hay que cargar datos, para no hacerlo manualmente uno por uno ejecutamos 
```
python cargar_datos.py
```
* Inicializar el servidor:
```
python manage.py runserver
```
El backend estará disponible en http://127.0.0.1:8000/

## Frontend — Angular + Bootstrap
Abrí otra terminal para la carpeta FrontEnd
```bash
cd frontend
npm install
npm install @zxing/browser   # Dependencia para escanear códigos de barras
ng serve
```

El frontend quedará disponible en http://localhost:4200/

---
# Arquitectura del sistema  
```
+----------------+
|   Navegador    |
|   (Usuario)    |
+-------+--------+
        |
        | (Angular hace peticiones)
        |
+-------v--------+
|   Angular      |  <- Frontend (lo que ve el usuario / interfaz)
|   (Puerto xxxx)|
+-------+--------+
        |
        | (HTTP - peticiones a dos servidores)
        |
+-------v--------+          +----------------+
|   Node.js      |          |    Django      |
|   (Puerto xxxx)|          |   (Puerto xxxx)|
+-------+--------+          +-------+--------+
peticiones rápidas          lógica compleja y seguridad
(búsquedas)                 (pagos, actualización stock)
        |                           |
        | (ambos leen/escriben)     |
        |                           |
        +-----------v---------------+
                    |
            +-------v-------+
            |    MySQL      |  <- Guarda todos los datos 
            |  (Puerto xxxx)| 
            +---------------+
```
# Uso básico

## Acceso al sistema

1. Abrir el navegador en `http://localhost:4200`.
2. Ingresar con las credenciales creadas durante la instalación.
3. El rol asignado (administrador o vendedor) determina las funciones disponibles.

## Registrar un producto

1. Ir a **Catálogo → Nuevo producto**.
2. Completar rubro,nombre,descripción, marca, precio(costo y venta) y stock.
3. Opcionalmente, escanear el código de barras con el celular pulsando el ícono de cámara.
4. Guardar.

## Escanear código de barras

1. Desde cualquier pantalla de búsqueda o registro, pulsar el ícono de escáner.
2. Apuntar la cámara al código del producto.
3. El sistema completa automáticamente los campos del producto si ya existe en el catálogo.

## Control stock

1. Ir a **Buscar → filtros**.
2. Buscar productos por nombre, código o escaneando el código de barras, rubro,marca.
3. seleccionar producto.
4. Mostrar detalle.

## Panel de Administración Django

Accesible en `http://localhost:8000/admin` para gestión avanzada de usuarios,
datos y configuración del sistema.

## Variables de entorno 
Crear un archivo `.env` en la raíz del backend con los siguientes
valores: ```env SECRET_KEY=tu_clave_secreta_django DEBUG=True
DB_NAME=nombre_base_de_datos DB_USER=postgres DB_PASSWORD=tu_contraseña
DB_HOST=localhost DB_PORT=5432 ALLOWED_HOSTS=localhost,127.0.0.1 ```
**Nunca subir el archivo `.env` al repositorio.**
Agregarlo al `.gitignore`.

# Integrantes y Roles

| Nombre                           | Rol           | Correo                         | Github            | DNI      |
| :------------------------------- | :------------ | :---------------------------   | :---------------- | :------- |
| Anabella Lujan Medrano           | Scrum Master  | analujan761@gmail.com          | Anaabella         | 46717059 |
| Sofia Gimena Ledesma             | Desarrollador | ledesmasofiagimena49@gmail.com | SOFILEDESMA       | 33969603 |
| Claudia Del Pilar Farias         | Desarrollador | claudiafarias1881@gmail.com    | Claudiafarias2022 | 28432825 |
| Franco Agustin Trivini De Ejalde | Desarrollador | francodeelejalde@gmail.com     | FrancoTrivini     | 41712450 |
| Jesica Analia Aramayo            | Desarrollador | jessie.aramayo@gmail.com       | Jesica-A          | 38739456 |


## Licencia 
Este proyecto fue desarrollado con fines académicos. Distribuido bajo
licencia [MIT](LICENSE). 
## Contribuciones. 
Este es un proyecto académico. 
Para reportar errores o sugerencias, abrir un [Issue](https://github.com/usuario/repo/issues) en el
repositorio.
