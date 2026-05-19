// app.js – Punto de entrada principal de la API REST
//
// Este archivo concentra el arranque de la aplicación, la
// configuración general de Express y el registro de las rutas.
// Se mantiene separado de la lógica de negocio para que el
// proyecto quede ordenado, escalable y fácil de mantener.
//
// Tecnologías utilizadas:
// - Node.js como entorno de ejecución.
// - Express como framework para crear la API.
// - dotenv para manejar variables de entorno.

'use strict';

// Carga las variables de entorno.
// Se usa para separar la configuración sensible del código
// fuente y facilitar cambios entre desarrollo y producción.
require('dotenv').config();
// Importa Express para construir la API.
const express         = require('express');
const clientesRouter  = require('./rutas/clientes');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer datos JSON.
// Es necesario para procesar correctamente los cuerpos enviados
// desde Postman o desde un frontend.
app.use(express.json());

// Middleware para datos de formularios.
// Se deja habilitado para aceptar solicitudes URL-encoded.
app.use(express.urlencoded({ extended: true }));


// Rutas
//
// Ruta raíz de verificación.
// Sirve para comprobar que la API está activa.
app.get('/', (req, res) => {
  res.status(200).json({
    status  : 'ok',
    mensaje : 'API REST - Gestión de Clientes activa.',
    version : '1.0.0',
    rutas   : {
      clientes : '/api/clientes'
    }
  });
});

// Monta las rutas del recurso cliente bajo /api/clientes.
// Esto mantiene una estructura REST clara y consistente.
app.use('/api/clientes', clientesRouter);

// Middleware para rutas inexistentes.
// Devuelve 404 cuando se intenta acceder a una URL no definida.
app.use((req, res) => {
  res.status(404).json({
    status  : 'error',
    mensaje : `La ruta "${req.method} ${req.originalUrl}" no existe en esta API.`
  });
});

// Middleware global de errores.
// Permite capturar errores no controlados y responder de forma segura.
app.use((err, req, res, next) => {  
  console.error('[Error global]', err.stack);
  res.status(500).json({
    status  : 'error',
    mensaje : 'Error interno del servidor no controlado.'
  });
});

// Inicia el servidor.
// Desde este punto la API queda disponible para recibir solicitudes.
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Recurso clientes: http://localhost:${PORT}/api/clientes`);
});

module.exports = app;
