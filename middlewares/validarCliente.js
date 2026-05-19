// middlewares/validarCliente.js
//
// Este middleware valida los datos enviados por el usuario
// antes de que lleguen a la base de datos.
// Se usa para evitar registros incompletos, reducir errores
// y mejorar la consistencia de la información.

'use strict';

function validarCliente(req, res, next) {
  const { nombre, email, telefono } = req.body;
  const errores = [];

// Se valida que el nombre exista, sea texto y no esté vacío.
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push('El campo "nombre" es obligatorio y no puede estar vacío.');
  }

// Se valida que el email exista y tenga contenido.
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errores.push('El campo "email" es obligatorio y no puede estar vacío.');
  } else {
// Se valida el formato básico del correo electrónico.
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.trim())) {
      errores.push('El campo "email" no tiene un formato válido.');
    }
  }

// Se valida que el teléfono exista y no esté vacío.
  if (!telefono || typeof telefono !== 'string' || telefono.trim() === '') {
    errores.push('El campo "telefono" es obligatorio y no puede estar vacío.');
  }

// Si hay errores, la ejecución se detiene y se responde con 400 Bad Request
  if (errores.length > 0) {
    return res.status(400).json({
      status  : 'error',
      mensaje : 'Los datos enviados son inválidos.',
      errores : errores
    });
  }

// Si no hay errores, la solicitud continúa hacia la ruta.
  next();
}

module.exports = { validarCliente };