const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
require('dotenv').config();

// Importar rutas
const routes = require('./routes');

// Inicializar la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:"],
      "script-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      "connect-src": ["'self'", "http://localhost", "http://localhost:3000"]
    }
  }
}));


app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    docExpansion: 'none',
    persistAuthorization: true
  }
}));

// Rutas
app.use('/api', routes);

// Manejo de errores
app.use((req, res, next) => {
  const error = new Error('Ruta no encontrada');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error del servidor';
  res.status(status).json({
    error: {
      message,
      status
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Documentación de la API disponible en http://localhost:${PORT}/api-docs`);
});

module.exports = app;