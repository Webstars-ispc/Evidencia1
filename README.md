# Libreria Nazareth📚
 ![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Versión](https://img.shields.io/badge/versión-2.1.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

Plataforma de gestión de stock para un polirrubro. Permite registrar productos, cargarlos masivamente desde Excel, buscar con filtros, escanear códigos de barras y administrar usuarios con roles diferenciados.  

## Fundamentación

Durante la pandemia cuando la economía fluctuaba se tenían que cambiar los precios uno por uno en cada producto del local, el cliente decidió empezar a buscar un método de organización digital, el cual si bien ayudó, con el avance del tiempo y al incrementar la variedad de productos, dicho problema volvió. Entonces en busca de un nuevo método, le ofrecimos un sistema que le dejara registrar sus productos de manera más simple, realizar la carga del producto escaneando con el celular el código de barras, también con un ágil sistema de búsqueda y filtros realizar las venta efectivizando el tiempo tanto del trabajador como del cliente.


## Tecnologías utilizadas 
| Capa | Tecnología | Versión |
|:---|:---|:---| 
| Backend | Django | 6.0.x | 
| API REST | Django RESTFramework | 3.17.x | 
| Autenticación | JWT (Simple JWT) | 5.5.x |
| Base de datos | MySQL / MariaDB | 10.6+ |
| Frontend | Angular |21.x | 
| Lenguajes | Python 3.14 / TypeScript 5.9 |
| Control de versiones | Git / GitHub |
| Gestor de paquetes | pip / npm | |


## Instrucciones de instalación

### Requisitos previos
Antes de empezar, necesitás tener instalado:

- [Python 3.10 o superior](https://www.python.org/downloads/)
- [Node.js 18 o superior](https://nodejs.org/) (incluye npm)
- [Git](https://git-scm.com/downloads)
- [XAMPP](https://www.apachefriends.org/) (incluye MariaDB) o MySQL standalone
- Angular CLI instalado globalmente: `npm install -g @angular/cli`
- Editor de código recomendado: [VS Code](https://code.visualstudio.com/)
- Iriun Webcam (en pc y celular)


### 1. Clonar el repositorio

```bash
git clone https://github.com/Webstars-ispc/LibreriaNazareth.git
cd LibreriaNazareth
git checkout main
```

### 2. Backend — Django
1. Iniciar MySQL/MariaDB: 
Abrí el Panel de Control de XAMPP y hacé clic en Start en la fila de MySQL. Debe aparecer en verde.

2. Crear la base de datos: 
Abrí phpMyAdmin (http://localhost/phpmyadmin) y creá una base de datos con el nombre LibreriaNazareth (o el que prefieras) con cotejamiento utf8mb4_general_ci.

3. Configurar variables de entorno: abri tu editor de codigo, dirigite a la carpeta BackEnd y modifica el archivo ".env_modelo" con tus credenciales:
```
SECRET_KEY=tu-clave-secreta 
DEBUG=True
DB_NAME=LibreriaNazareth
DB_USER=root
DB_PASSWORD=         
DB_HOST=localhost
DB_PORT=3306
```
En caso de que no tengas una clave secreta, generala aleatoriamente: 
```
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
Luego renombra el archivo a .env 

4. Abri una terminal en la carpeta Backend
5. Crear entorno virtual, activarlo e instalar dependencias: 
```
python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```
6. Ejecutar migraciones: crea todas las tablas automaticamente
```
python manage.py migrate
```
7. Las tablas van a estar vacias asi que hay que cargar datos, para no hacerlo manualmente uno por uno ejecutamos 
```
python cargar_datos.py
```
8. Inicializar el servidor:
```
python manage.py runserver
```
El backend estará disponible en http://127.0.0.1:8000/

### 3. Frontend — Angular + Bootstrap
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

## Buscar y filtrar productos

1. Ir a **Catalogo**.
2. Usar el buscador principal para buscar por nombre, código, rubro o marca.
3. Todos los filtros muestran sugerencias automáticas según los productos existentes.

## Cargar productos desde un Excel
1. En el catálogo, hacer clic en 📂 Cargar Excel.  
2. Seleccionar un archivo .xlsx que contenga una hoja llamada PRODUCTOS.   
3. El sistema procesa el archivo, estandariza los nombres y evita duplicados.

## Gestionar equipo (solo Administrador)
1. Ir a Gestionar Equipo desde el panel principal.  
2. Permite listar, crear, editar y eliminar usuarios empleados.  

## Panel de Administración Django
Accesible en http://127.0.0.1:8000/admin para gestión avanzada.



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
