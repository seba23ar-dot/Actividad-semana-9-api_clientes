# API REST – Gestión de Clientes

**Asignatura:** CIB302 – Taller de Plataformas Web  
**Unidad:** 3 – Introducción a los sistemas de bases de datos  
**Semana:** 9

---

## Descripción del proyecto

API REST desarrollada con Node.js, Express y MySQL que implementa operaciones CRUD sobre la entidad `cliente`. La aplicación permite crear, consultar, actualizar y eliminar clientes de forma segura, utilizando consultas parametrizadas para prevenir inyección SQL y respuestas HTTP adecuadas según cada caso.

---

## Tecnologías utilizadas

| Tecnología | Función                            |
|------------|------------------------------------|
| Node.js    | Entorno de ejecución               |
| Express    | Framework para la API REST         |
| mysql2     | Conexión con MySQL usando Promises |
| dotenv     | Manejo de variables de entorno     |
| MySQL      | Base de datos relacional           |
| Postman    | Pruebas de endpoints               |

---

## Requisitos previos

- Node.js instalado
- MySQL Server activo
- Postman instalado para pruebas
- Git instalado (opcional, para clonar el repositorio)

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/USUARIO/api_clientes.git
cd api_clientes
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo `.env`

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_PASSWORD
DB_NAME=taller_clientes
```

### 4. Crear la base de datos

Ejecutar el archivo `database.sql` en MySQL.

Ejemplo desde terminal:

```bash
mysql -u root -p < database.sql
```

### 5. Iniciar el servidor

```bash
npm start
```

Servidor disponible en:

```bash
http://localhost:3000
```

Recurso principal:

```bash
http://localhost:3000/api/clientes
```

---

## Modelo de datos

Entidad: `cliente`

| Campo | Tipo | Restricción |
|---|---|---|
| id_cliente | INT | PK, AUTO_INCREMENT |
| nombre | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | NOT NULL |
| telefono | VARCHAR(20) | NOT NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

---

## Endpoints disponibles

Base URL:

```bash
http://localhost:3000/api
```

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/clientes` | Lista todos los clientes |
| GET | `/clientes/:id` | Obtiene un cliente por ID |
| POST | `/clientes` | Crea un cliente |
| PUT | `/clientes/:id` | Actualiza un cliente |
| DELETE | `/clientes/:id` | Elimina un cliente |

---

## Ejemplo de solicitud POST

```json
{
  "nombre": "María González",
  "email": "maria@email.com",
  "telefono": "+56934567890"
}
```

---

## Códigos HTTP utilizados

| Código | Uso |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos |
| 404 | Recurso no encontrado |
| 409 | Conflicto por email duplicado |
| 500 | Error interno del servidor |

---

## Seguridad implementada

- Consultas parametrizadas con `?` para evitar inyección SQL.
- Validación de datos de entrada mediante middleware.
- Manejo de errores con códigos HTTP adecuados. 

---

## Estructura del proyecto

```text
api_clientes/
├── middlewares/
│   └── validarCliente.js
├── rutas/
│   └── clientes.js
├── app.js
├── db.js
├── database.sql
├── documento.pdf
├── postman_collection.json
├── package.json
├── package-lock.json
└── README.md
```

---

## Pruebas con Postman

El proyecto incluye el archivo `postman_collection.json` para probar los endpoints principales de la API. La colección debe importarse en Postman y ejecutarse con el servidor activo en `http://localhost:3000`.