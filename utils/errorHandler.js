// src/utils/errorHandler.js

/**
 * Manejador centralizado de errores para la API
 * @param {Object} res - Objeto de respuesta Express
 * @param {Error} error - Error a manejar
 */
const errorHandler = (res, error) => {
  console.error('Error:', error);

  // Errores de base de datos PostgreSQL
  if (error.code) {
    switch (error.code) {
      // Error de clave única violada
      case '23505':
        return res.status(409).json({
          success: false,
          message: 'Ya existe un registro con ese valor',
          error: error.detail || 'Conflicto de datos'
        });
      
      // Error de clave foránea violada
      case '23503':
        return res.status(400).json({
          success: false,
          message: 'El registro relacionado no existe',
          error: error.detail || 'Error de referencia'
        });
      
      // Error de restricción NOT NULL
      case '23502':
        return res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos',
          error: error.detail || 'Valor nulo no permitido'
        });
        
      // Error de tipo de datos
      case '22P02':
        return res.status(400).json({
          success: false,
          message: 'Formato de datos inválido',
          error: error.detail || 'Error de tipo de datos'
        });
    }
  }

  // Errores personalizados de la aplicación
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: error.errors
    });
  }

  // Error de autenticación
  if (error.name === 'UnauthorizedError' || error.message === 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
  }

  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  // Error de JWT expirado
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Error personalizado con código de estado
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message || 'Error en la solicitud'
    });
  }

  // Error del sistema de archivos
  if (error.code === 'ENOENT') {
    return res.status(404).json({
      success: false,
      message: 'Archivo no encontrado'
    });
  }

  // Error por defecto (error 500 - Internal Server Error)
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? undefined : error.message
  });
};

/**
 * Crea un error personalizado con código de estado
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP
 * @returns {Error} Error personalizado
 */
errorHandler.createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = errorHandler;