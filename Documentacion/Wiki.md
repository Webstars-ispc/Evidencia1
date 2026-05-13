# Wiki: Librería Nazareth

## 📑 Tabla de Contenidos
* [1. Requerimientos Refinados](Requerimientos)
* [2. Historias de Usuario](Historias-de-Usuario)
* [3. Ceremonias Scrum](Ceremonias-Scrum)

---
#  1. Visión general del proyecto
El sistema de **Libreria Nazareth** es una plataforma web diseñada para facilitar a los usuarios registro, precios, stock y ventas de productos. 

***
## 1.1 ¿De qué trata el proyecto?
Este proyecta utiliza  HTML, CSS, JavaScript, Python, Angular, TypeScript, Node.js, Django y MySQL.

## 1.2 Stack tecnológico
### Primera Etapa (Frontend) 
* **HTML:** Estructura básica de la página web. 
* **CSS:** Estilos para la presentación y el diseño. 
* **JavaScript:** Funcionalidades interactivas para el usuario. 
* **Bootstrap:** Interfaces web responsivas.

### Segunda Etapa (Frontend y Backend) 
* **TypeScript:** Mejora la calidad del código y la productividad en el desarrollo. JavaScript con tipos.
* **Angular:** Framework para organizar el frontend en componentes reutilizables. 
* **Django:** Framework de desarrollo backend en Python para la lógica del negocio y la gestión de datos.  
* **NodeJs:** JavaScript que corre en el servidor.   
* **Base de Datos Relacional:** Utilización de una base de datos relacional MySQL para almacenar la información de los usuarios, xxx, xxx.

# 2. Arquitectura del sistema  
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

# 3. Configuración Entorno de Desarrollo

| Tecnología | Versión | ¿Cómo verifico que está instalado? |
| -- | -- | -- |
| Node.js | 24.14.1 | `node --version`  |
| Angular CLI | 21.2.7 | `ng version` |
| Python | x.xx | `python --version` |
| MySQL | x.x | `mysql --version` |
| Git | cualquier versión reciente | `git --version` |


# 4.  DOCUMENTO IEEE-830
En este apartado proporcionaremos los Requisitos del sistema  mediante el 
[Documento ieee-830](https://docs.google.com/document/d/13waxjjau19He0DEQoe5rO1wuq9TEAJR0/edit?usp=sharing&ouid=110424013422519258081&rtpof=true&sd=true)  
 

# 5. Miembros del equipo:
| **Scrum Master** | Github |
| --- | --- |
| Anabella | [usuario de github](url) |

| **Developer Team** | Github |
| --- | --- |
| Franco | [FrancoTrivini](https://github.com/FrancoTrivini) |
| Claudia | [claudiafarias](https://github.com/claudiafarias2022) |
|Sofia | [SOFILEDESMA](https://github.com/SOFILEDESMA)|
| Jesica | [usuario de github](url) |
| Gabriel | [usuario de github](url) |
