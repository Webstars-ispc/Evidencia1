# Libreria Nazareth📚
 ![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

La plataforma para la librería busca agilizar el tiempo del trabajador a la hora de registrar los productos y realizar las ventas.

# Fundamentación🔈

Durante la pandemia cuando la economía fluctuaba se tenían que cambiar los precios uno por uno en cada producto del local, el cliente decidió empezar a buscar un método de organización digital el cual si bien ayudo, con el avanze del tiempo al incrementar la variedad de productos, volvió al problema principal, entonces en busca de un nuevo método le ofrecimos un sistema que le dejara registrar sus productos de manera más simple, realizar la carga del producto escaneando con el celular el código de barras y con un ágil sistema de búsqueda y filtros realizar las venta efectivizando el tiempo tanto del trabajador como del cliente.


## Tecnologías utilizadas 
| Capa | Tecnología | Versión |
|-------------|-------------------|----------| 
| Backend | Django | 5.x | 
| API REST | Django RESTFramework | 3.x | 
| Base de datos | PostgreSQL | 16.x | 
| Frontend | Angular |17.x | 
| Lenguajes | Python 3.11 / TypeScript 5 | |
| Control de versiones | Git / GitHub |
| Gestor de paquetes | pip / npm | |


# Instrucciones de instalación

## Requisitos previos

- Python 3.10+
- Node.js 18+
- npm 9+
- Git

## Backend — Django

```bash

git clone https://github.com/tu-org/libreria-nazareth.git
cd libreria-nazareth


python -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

pip install -r requirements.txt

cp .env.example .env

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver
```

El backend quedará disponible en `http://localhost:8000`.

## Frontend — Angular + Bootstrap

```bash

cd frontend

npm install

ng serve
```

El frontend quedará disponible en `http://localhost:4200`.

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



# Requerimientos Funcionales

| ID | Nombre | Descripción | Prioridad | Estado | Módulo |
| ----- | ----- | ----- | :---: | :---: | ----- |
| **`RF-01`** | **Registro de productos** | El sistema debe permitir registrar productos con nombre, descripción, precio de costo, precio de venta, marca,rubro y stock disponible. | **Alta** | Pendiente | Catálogo |
| **`RF-02`** | **Escaneo de código de barras** | El sistema debe permitir cargar y buscar productos escaneando el código de barras con la cámara del dispositivo móvil. | **Alta** | Pendiente | Catálogo |
| **`RF-03`** | **Búsqueda y filtros de productos** | El sistema debe ofrecer un buscador por nombre o código y filtros por rubro, rango de precio y disponibilidad de stock. | **Alta** | Pendiente | Catálogo |
| **`RF-04`** | **Actualización masiva de precios** | El sistema debe permitir actualizar el precio de uno o varios productos simultáneamente, aplicando porcentaje o valor fijo a una selección o categoría completa. | **Alta** | Pendiente | Catálogo |
| **`RF-05`** | **Registro de ventas** | El sistema debe registrar cada venta, descontando el stock de los productos vendidos automáticamente y generando un comprobante con fecha, productos y total. | **Alta** | Pendiente | Ventas |

# Requerimientos No funcionales 

| ID | Nombre | Descripción | Categoría | Criterio de aceptación |
| ----- | ----- | ----- | :---: | ----- |
| **`RNF-01`** | **Usabilidad** | La interfaz debe ser intuitiva y simple, orientada a usuarios sin formación técnica. | **Usabilidad** | Un trabajador nuevo debe poder operar el sistema sin asistencia en menos de 10 minutos de capacitación inicial. |
| **`RNF-02`** | **Rendimiento** | Las búsquedas y filtros deben devolver resultados de forma rápida incluso con catálogos grandes. | **Rendimiento** | Resultados de búsqueda en menos de 2 segundos con un catálogo de hasta 5.000 productos. |
| **`RNF-03`** | **Compatibilidad móvil** | El sistema debe funcionar correctamente en dispositivos móviles para habilitar el escaneo de códigos de barras. | **Portabilidad** | Funcionalidad completa verificada en Android 10+ e iOS 14+ usando Chrome y Safari. |

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

| Nombre                           | Rol           | Correo                       | Github            | DNI      |
| :------------------------------- | :------------ | :--------------------------- | :---------------- | :------- |
| Anabella Lujan Medrano           | Scrum Master  | Analujan761@gmail.com        | Anaabella         | 46717059 |
| Sofia Gimena Ledesma             | Desarrollador | ledesmasofiagimena49@gmail.com | SOFILEDESMA       | 33969603 |
| Claudia Del Pilar Farias         | Desarrollador | claudiafarias1881@gmail.com  | Claudiafarias2022 | 28432825 |
| Gabriel Agustin Pavon Molina     | Oyente        | gabi.pavonmolina@gmail.com   | gabipavon01       | 43273165 |
| Franco Agustin Trivini De Ejalde | Desarrollador | francodeelejalde@gmail.com   | Franco Trivini    | 41712450 |
| Jesica Analia Aramayo            | Desarrollador | jessie.aramayo@gmail.com     | Jesica-A          | 38739456 |


## Licencia 
Este proyecto fue desarrollado con fines académicos. Distribuido bajo
licencia [MIT](LICENSE). 
## Contribuciones. 
Este es un proyecto académico. 
Para reportar errores o sugerencias, abrir un [Issue](https://github.com/usuario/repo/issues) en el
repositorio.
