// clientes.js
// Definición de rutas y lógica CRUD para la entidad "cliente".
//
// Operaciones implementadas:
//   GET    /api/clientes         → listar todos los clientes
//   GET    /api/clientes/:id     → obtener un cliente por ID
//   POST   /api/clientes         → crear un nuevo cliente
//   PUT    /api/clientes/:id     → actualizar un cliente existente
//   DELETE /api/clientes/:id     → eliminar un cliente
//
// Seguridad:
//   - Todas las consultas usan parámetros preparados (?) para
//     prevenir inyección SQL (no concatenación de strings).
//   - Se validan los datos de entrada antes de acceder a la BD.
//   - Se gestionan códigos de estado HTTP semánticamente correctos.

'use strict';

// Importa Express.
// Se necesita para crear el router del recurso cliente.
const express              = require('express');
// Crea una instancia de router.
// Esto permite agrupar las rutas relacionadas en un solo módulo.
const router               = express.Router();
// Importa la conexión a la base de datos.
// Se reutiliza el pool definido en db.js para ejecutar consultas.
const pool                 = require('../db');
// Importa el middleware de validación.
// Se aplica en POST y PUT para filtrar datos inválidos antes de consultar la BD.
const { validarCliente }   = require('../middlewares/validarCliente');

// GET /api/clientes
// Recupera todos los clientes registrados en la base de datos.
router.get('/', async (req, res) => {
  try {
// Consulta todos los campos principales del cliente.
// Se incluyen solo los datos necesarios para identificar y revisar registros.
    const [filas] = await pool.execute(
      'SELECT id_cliente, nombre, email, telefono, created_at FROM cliente ORDER BY id_cliente ASC'
    );

    return res.status(200).json({
      status : 'ok',
      total  : filas.length,
      datos  : filas
    });
  } catch (error) {
// Si falla la consulta, responde con 500.
// El problema ya corresponde al servidor o a la conexión con la base.
    console.error('[GET /clientes] Error:', error.message);
    return res.status(500).json({
      status  : 'error',
      mensaje : 'Error interno del servidor al obtener los clientes.'
    });
  }
});

// GET /api/clientes/:id
// Recupera un cliente específico por su id_cliente.
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

// Valida que el ID sea un número entero positivo
// Así se evita consultar con valores que no tienen sentido en el modelo.
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      status  : 'error',
      mensaje : 'El parámetro "id" debe ser un número entero positivo.'
    });
  }

  try {
// Consulta parametrizada por ID.
// El valor se envía aparte del SQL para reducir el riesgo de inyección.
    const [filas] = await pool.execute(
      'SELECT id_cliente, nombre, email, telefono, created_at FROM cliente WHERE id_cliente = ?',
      [id]
    );

// Si no hay resultados, responde con 404.
// Esto indica que el recurso solicitado no fue encontrado.
    if (filas.length === 0) {
      return res.status(404).json({
        status  : 'error',
        mensaje : `No se encontró ningún cliente con id ${id}.`
      });
    }

    return res.status(200).json({
      status : 'ok',
      datos  : filas[0]
    });
  } catch (error) {
    console.error('[GET /clientes/:id] Error:', error.message);
    return res.status(500).json({
      status  : 'error',
      mensaje : 'Error interno del servidor al obtener el cliente.'
    });
  }
});


// POST /api/clientes
// Crea un nuevo registro de cliente en la base de datos.
//
// Esta ruta crea un nuevo cliente.
// Se aplica el middleware de validación antes de llegar a la consulta SQL.
router.post('/', validarCliente, async (req, res) => {
  const { nombre, email, telefono } = req.body;

  try {
// Inserta el nuevo registro con parámetros preparados.
// Esta forma es más segura que concatenar valores en el SQL.
    const [resultado] = await pool.execute(
      'INSERT INTO cliente (nombre, email, telefono) VALUES (?, ?, ?)',
      [nombre.trim(), email.trim().toLowerCase(), telefono.trim()]
    );

// Consulta el registro recién creado.
// Esto permite devolver el dato final guardado con su ID autogenerado.
    const [nuevoCliente] = await pool.execute(
      'SELECT id_cliente, nombre, email, telefono, created_at FROM cliente WHERE id_cliente = ?',
      [resultado.insertId]
    );

    return res.status(201).json({
      status  : 'ok',
      mensaje : 'Cliente creado exitosamente.',
      datos   : nuevoCliente[0]
    });
  } catch (error) {
// Si el correo ya existe, responde con 409.
// Esto representa un conflicto con una restricción de unicidad.
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status  : 'error',
        mensaje : `El correo electrónico "${email}" ya se encuentra registrado. Utilice un correo diferente.`
      });
    }

    console.error('[POST /clientes] Error:', error.message);
    return res.status(500).json({
      status  : 'error',
      mensaje : 'Error interno del servidor al crear el cliente.'
    });
  }
});


// PUT /api/clientes/:id
// Actualiza completamente un cliente existente.
//
// Esta ruta actualiza un cliente.
// Se valida primero el ID y luego la existencia del registro antes de modificarlo.
router.put('/:id', validarCliente, async (req, res) => {
  const id = parseInt(req.params.id, 10);

// Valida que el ID tenga sentido dentro del modelo.
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      status  : 'error',
      mensaje : 'El parámetro "id" debe ser un número entero positivo.'
    });
  }

  const { nombre, email, telefono } = req.body;

  try {
// Verificar que el cliente existe antes de intentar actualizar
// Esto evita responder éxito sobre un registro inexistente.
    const [existe] = await pool.execute(
      'SELECT id_cliente FROM cliente WHERE id_cliente = ?',
      [id]
    );

    if (existe.length === 0) {
      return res.status(404).json({
        status  : 'error',
        mensaje : `No se encontró ningún cliente con id ${id}.`
      });
    }

// Ejecuta la actualización con parámetros.
// Así se mantiene la consulta segura y consistente.
    await pool.execute(
      'UPDATE cliente SET nombre = ?, email = ?, telefono = ? WHERE id_cliente = ?',
      [nombre.trim(), email.trim().toLowerCase(), telefono.trim(), id]
    );

// Consulta el registro actualizado.
// Esto sirve para confirmar en la respuesta cómo quedó almacenado.
    const [actualizado] = await pool.execute(
      'SELECT id_cliente, nombre, email, telefono, created_at FROM cliente WHERE id_cliente = ?',
      [id]
    );

    return res.status(200).json({
      status  : 'ok',
      mensaje : 'Cliente actualizado exitosamente.',
      datos   : actualizado[0]
    });
  } catch (error) {
// Si el correo ya pertenece a otro cliente, responde con 409.
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status  : 'error',
        mensaje : `El correo electrónico "${email}" ya está en uso por otro cliente.`
      });
    }

    console.error('[PUT /clientes/:id] Error:', error.message);
    return res.status(500).json({
      status  : 'error',
      mensaje : 'Error interno del servidor al actualizar el cliente.'
    });
  }
});


// DELETE /api/clientes/:id
// Elimina un cliente de la base de datos por su ID.
//
// Esta ruta elimina un cliente.
// Antes de borrar, se comprueba que el registro exista.
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

// Valida el ID antes de consultar la base.
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      status  : 'error',
      mensaje : 'El parámetro "id" debe ser un número entero positivo.'
    });
  }

  try {
// Verificar existencia antes de eliminar
// Esto evita indicar éxito cuando el registro no estaba en la tabla.
    const [existe] = await pool.execute(
      'SELECT id_cliente FROM cliente WHERE id_cliente = ?',
      [id]
    );

    if (existe.length === 0) {
      return res.status(404).json({
        status  : 'error',
        mensaje : `No se encontró ningún cliente con id ${id}.`
      });
    }

// Ejecuta la eliminación.
// Solo se hace después de validar el identificador y la existencia.
    await pool.execute(
      'DELETE FROM cliente WHERE id_cliente = ?',
      [id]
    );

    return res.status(200).json({
      status  : 'ok',
      mensaje : `Cliente con id ${id} eliminado exitosamente.`
    });
  } catch (error) {
    console.error('[DELETE /clientes/:id] Error:', error.message);
    return res.status(500).json({
      status  : 'error',
      mensaje : 'Error interno del servidor al eliminar el cliente.'
    });
  }
});

// Exporta el router.
// Esto permite usar estas rutas desde app.js.
module.exports = router;