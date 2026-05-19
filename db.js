// db.js
// Este archivo crea la conexión con MySQL usando mysql2/promise.
// Se utiliza un pool de conexiones para reutilizar conexiones
// y evitar abrir una nueva en cada petición.


'use strict';

// Carga las variables de entorno.
// Esto evita dejar credenciales escritas directamente en el código.
require('dotenv').config();
const mysql = require('mysql2/promise');

// Se crea el pool con los datos definidos en el archivo .env.
// Esto permite cambiar la configuración sin tocar el código.
const pool = mysql.createPool({
  host     : process.env.DB_HOST     || 'localhost',
  port     : process.env.DB_PORT     || 3306,
  user     : process.env.DB_USER     || 'root',
  password : process.env.DB_PASSWORD || '',
  database : process.env.DB_NAME     || 'taller_clientes',
  waitForConnections : true,
  connectionLimit    : 10,   
  queueLimit         : 0     
});


// Esta prueba intenta conectarse al iniciar la API.
// Si la conexión falla, el servidor se detiene para evitar
// trabajar con una base de datos no disponible.
(async () => {
  try {
    const connection = await pool.getConnection();
// Si la conexión funciona, se libera al pool.
// Esto evita dejar conexiones abiertas sin uso.
    console.log('✅ Conexión a MySQL establecida correctamente.');
    connection.release(); // devolver la conexión al pool
  } catch (error) {
// Si falla la conexión, la aplicación se detiene.
// No tendría sentido levantar la API sin base de datos.
    console.error('❌ Error al conectar con MySQL:', error.message);
    process.exit(1); 
  }
})();

// Se exporta el pool.
// Así puede reutilizarse desde las rutas sin duplicar la configuración.
module.exports = pool;