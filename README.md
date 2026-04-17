# Libreria Nazareth📚

La plataforma para la librería busca agilizar el tiempo del trabajador a la hora de registrar los productos y realizar las ventas.

# Fundamentación🔈

Durante la pandemia cuando la economía fluctuaba se tenían que cambiar los precios uno por uno en cada producto del local, el cliente decidió empezar a buscar un método de organización digital el cual si bien ayudo, con el avanze del tiempo al incrementar la variedad de productos, volvió al problema principal, entonces en busca de un nuevo método le ofrecimos un sistema que le dejara registrar sus productos de manera más simple, realizar la carga del producto escaneando con el celular el código de barras y con un ágil sistema de búsqueda y filtros realizar las venta efectivizando el tiempo tanto del trabajador como del cliente.

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

# Uso básico

## Acceso al sistema

1. Abrir el navegador en `http://localhost:4200`.
2. Ingresar con las credenciales creadas durante la instalación.
3. El rol asignado (administrador o vendedor) determina las funciones disponibles.

## Registrar un producto

1. Ir a **Catálogo → Nuevo producto**.
2. Completar nombre, categoría, precio y stock.
3. Opcionalmente, escanear el código de barras con el celular pulsando el ícono de cámara.
4. Guardar.

## Escanear código de barras

1. Desde cualquier pantalla de búsqueda o registro, pulsar el ícono de escáner.
2. Apuntar la cámara al código del producto.
3. El sistema completa automáticamente los campos del producto si ya existe en el catálogo.

## Realizar una venta

1. Ir a **Ventas → Nueva venta**.
2. Buscar productos por nombre, código o escaneando el código de barras.
3. Ajustar cantidades en el carrito.
4. Confirmar la venta — el stock se descuenta automáticamente y se genera el comprobante.

## Actualizar precios en masa

1. Ir a **Catálogo → Actualización de precios**.
2. Seleccionar una categoría o productos individuales.
3. Elegir el tipo de ajuste: porcentaje o valor fijo.
4. Confirmar — los precios se actualizan de forma simultánea.

## Panel de administración Django

Accesible en `http://localhost:8000/admin` para gestión avanzada de usuarios,
datos y configuración del sistema.

# Integrantes y Roles


| Nombre                           | Rol           | Correo                       | Github            | DNI      |
| :------------------------------- | :------------ | :--------------------------- | :---------------- | :------- |
| Anabella Lujan Medrano           | Scrum Master  | Analujan761@gmail.com        | Anaabella         | 46717059 |
| Sofia Gimena Ledesma             | Desarrollador | ledesmasofiagimena@gmail.com | SOFILEDESMA       | 33969603 |
| Claudia Del Pilar Farias         | Desarrollador | claudiafarias1881@gmail.com  | Claudiafarias2022 | 28432825 |
| Gabriel Agustin Pavon Molina     | Oyente        | gabi.pavonmolina@gmail.com   | gabipavon01       | 43273165 |
| Franco Agustin Trivini De Ejalde | Desarrollador | francodeelejalde@gmail.com   | Franco Trivini    | 41712450 |
| Jesica Analia Aramayo            | Desarrollador | jessie.aramayo@gmail.com     | Jesica-A          | 38739456 |
