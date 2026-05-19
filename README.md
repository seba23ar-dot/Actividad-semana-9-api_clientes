# API REST – Gestión de Clientes

**Asignatura:** CIB302 – Taller de Plataformas Web
**Unidad:** 3 – Introducción a los sistemas de bases de datos
**Semana:** 9

---

## ¿Qué hace este proyecto?

Una API REST construida con Node.js y Express que se conecta a una base de datos MySQL y expone operaciones CRUD completas sobre la entidad `cliente`. La idea central es que cualquier sistema externo — un frontend, otra API, o Postman — pueda crear, consultar, actualizar y eliminar clientes mediante solicitudes HTTP estándar, sin acceder directamente a la base de datos.

Toda la comunicación usa JSON, todas las consultas SQL usan parámetros preparados para prevenir inyección SQL, y cada respuesta HTTP lleva el código de estado que corresponde a lo que realmente ocurrió.

---

## Stack tecnológico

| Tecnología | Por qué se usa |
|---|---|
| Node.js | Entorno de ejecución JavaScript del lado del servidor |
| Express | Framework minimalista que simplifica la creación de APIs REST |
| mysql2 | Driver MySQL con soporte nativo para Promises y consultas preparadas reales |
| dotenv | Carga las credenciales desde un archivo `.env` sin tocar el código fuente |
| MySQL | Sistema gestor de base de datos relacional |
| Postman | Herramienta para probar y documentar los endpoints |

---

## Requisitos previos

Antes de ejecutar el proyecto necesitás tener instalado Node.js v18 o superior, MySQL Server activo, Postman para probar los endpoints, y Git si vas a clonar el repositorio.

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/seba23ar-dot/Actividad-semana-9-api_clientes.git
cd api_clientes
```

### 2. Instalar dependencias

```bash
npm install
```

Esto descarga Express, mysql2, dotenv y el resto de las librerías definidas en `package.json`.

### 3. Configurar las variables de entorno

Copiá el archivo de ejemplo y completá con tus datos de MySQL:

```bash
cp .env.example .env
```

Editá el `.env` con tus credenciales reales:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=taller_clientes
```

> El archivo `.env` está excluido del repositorio mediante `.gitignore` para que las credenciales nunca queden expuestas públicamente.

### 4. Crear la base de datos

Ejecutá el script SQL incluido en el proyecto. Esto crea la base de datos `taller_clientes`, la tabla `cliente` con sus restricciones, e inserta tres registros de prueba:

```bash
mysql -u root -p < database.sql
```

También podés copiarlo y pegarlo directamente en MySQL Workbench si preferís la interfaz gráfica.

### 5. Iniciar el servidor

```bash
npm start
```

Si todo está bien configurado, verás esto en la consola:

```
✅ Conexión a MySQL establecida correctamente.
🚀 Servidor corriendo en http://localhost:3000
📋 Recurso clientes: http://localhost:3000/api/clientes
```

---

## Modelo de datos

La entidad central es `cliente`, con la siguiente estructura:

| Campo | Tipo | Restricción | Por qué |
|---|---|---|---|
| id_cliente | INT | PK, AUTO_INCREMENT | MySQL genera el ID automáticamente |
| nombre | VARCHAR(100) | NOT NULL | Campo obligatorio en el modelo de negocio |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Identifica unívocamente al cliente. La restricción UNIQUE hace posible detectar duplicados con 409 |
| telefono | VARCHAR(20) | NOT NULL | VARCHAR porque los teléfonos internacionales incluyen +, guiones y espacios |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | MySQL asigna la marca temporal automáticamente al crear el registro |

---

## Endpoints disponibles

Base URL: `http://localhost:3000/api`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/clientes` | Lista todos los clientes ordenados por ID |
| GET | `/clientes/:id` | Obtiene un cliente por su ID |
| POST | `/clientes` | Crea un nuevo cliente |
| PUT | `/clientes/:id` | Actualiza todos los campos de un cliente |
| DELETE | `/clientes/:id` | Elimina un cliente |

### Ejemplo: crear un cliente (POST)

**Solicitud:**
```json
{
  "nombre": "María González",
  "email": "maria@email.com",
  "telefono": "+56934567890"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "status": "ok",
  "mensaje": "Cliente creado exitosamente.",
  "datos": {
    "id_cliente": 4,
    "nombre": "María González",
    "email": "maria@email.com",
    "telefono": "+56934567890",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
}
```

---

## Códigos HTTP implementados

| Código | Cuándo se usa |
|---|---|
| 200 OK | GET, PUT y DELETE ejecutados correctamente |
| 201 Created | POST exitoso — se devuelve el registro completo con su ID autogenerado |
| 400 Bad Request | Datos inválidos o faltantes (capturado por el middleware) o ID no numérico en la URL |
| 404 Not Found | El cliente buscado no existe en la BD, o se accede a una ruta no definida |
| 409 Conflict | El email enviado ya está registrado (violación de la restricción UNIQUE) |
| 500 Internal Server Error | Error inesperado del servidor — se registra en consola para diagnóstico |

---

## Seguridad implementada

Todas las consultas SQL usan parámetros preparados con el operador `?`. Esto significa que los valores del usuario y la estructura del SQL se envían por separado a MySQL, haciendo imposible que un dato modifique la lógica de la consulta. Adicionalmente, el middleware `validarCliente` intercepta las solicitudes POST y PUT antes de que lleguen a la base de datos, verificando que los campos obligatorios estén presentes y que el email tenga formato válido. Las credenciales de conexión viven en el `.env` y nunca se suben al repositorio.

---

## Pruebas con Postman

El repositorio incluye `postman_collection.json` con 14 solicitudes de prueba listas para importar. Cubren todos los endpoints y los escenarios de error más importantes: ID inexistente (404), email duplicado (409), campos faltantes (400) y rutas no definidas (404).

Para importar: abrí Postman → botón **Import** → seleccioná `postman_collection.json`. La variable `base_url` ya está configurada a `http://localhost:3000`.

---

## Estructura del proyecto

```
api_clientes/
├── middlewares/
│   └── validarCliente.js    
├── rutas/
│   └── clientes.js          
├── .env                     
├── .env.example             
├── .gitignore               
├── app.js                   
├── database.sql             
├── db.js                    
├── package.json
├── package-lock.json
├── postman_collection.json  
└── README.md
```