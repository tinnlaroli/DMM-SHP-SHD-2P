const { body, param, validationResult } = require('express-validator');

const validateRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateUserUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('bio').optional(),
  body('game_preferences').optional().isArray().withMessage('Game preferences must be an array'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateUserSettings = [
  body('private_profile').optional().isBoolean().withMessage('Private profile must be a boolean'),
  body('notifications_enabled').optional().isBoolean().withMessage('Notifications enabled must be a boolean'),
  body('theme').optional().isIn(['light', 'dark']).withMessage('Theme must be light or dark'),
  body('language').optional().isLength({ min: 2, max: 10 }).withMessage('Language must be a valid language code'),
  body('timezone').optional().isString().withMessage('Timezone must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateUpdateProfile = [
  body('name').optional().isString().trim().isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('bio').optional().isString().trim()
    .withMessage('Bio must be a string'),
  body('profile_picture').optional().isURL()
    .withMessage('Profile picture must be a valid URL'),
  // Aquí se puede agregar la validación personalizada para verificar los resultados
];

const validateAddGame = [
  body('game').isString().trim().isLength({ min: 1, max: 100 })
    .withMessage('Game title is required and must be between 1 and 100 characters')
];

const validateAddPlayTime = [
  body('play_time_id').isInt({ min: 1 })
    .withMessage('Play time ID must be a positive integer')
];

const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Error de validación', 
      errors: errors.array() 
    });
  }
  next();
};

const validateCreatePost = [
  body('content').optional().isString().trim()
    .withMessage('El contenido debe ser texto'),
  
  body('post_type').isIn(['text', 'image', 'video', 'link', 'game_invitation'])
    .withMessage('Tipo de publicación no válido'),
  
  // Validaciones específicas para invitaciones de juego
  body('game_title').if(body('post_type').equals('game_invitation')).notEmpty().isString().trim()
    .withMessage('El título del juego es requerido para invitaciones'),
  
  body('game_platform').if(body('post_type').equals('game_invitation')).notEmpty().isString().trim()
    .withMessage('La plataforma del juego es requerida para invitaciones'),
  
  body('game_date').if(body('post_type').equals('game_invitation')).notEmpty().isISO8601()
    .withMessage('La fecha del juego debe ser válida (formato ISO 8601)'),
  
  body('max_participants').if(body('post_type').equals('game_invitation')).optional().isInt({ min: 2, max: 100 })
    .withMessage('El máximo de participantes debe ser entre 2 y 100'),
  
  validateResults
];

const validateUpdatePost = [
  body('content').optional().isString().trim()
    .withMessage('El contenido debe ser texto'),
  
  body('post_type').optional().isIn(['text', 'image', 'video', 'link', 'game_invitation'])
    .withMessage('Tipo de publicación no válido'),
  
  // Validaciones condicionales si se actualiza a invitación de juego
  body('game_title').if(body('post_type').equals('game_invitation')).notEmpty().isString().trim()
    .withMessage('El título del juego es requerido para invitaciones'),
  
  body('game_platform').if(body('post_type').equals('game_invitation')).notEmpty().isString().trim()
    .withMessage('La plataforma del juego es requerida para invitaciones'),
  
  body('game_date').if(body('post_type').equals('game_invitation')).notEmpty().isISO8601()
    .withMessage('La fecha del juego debe ser válida (formato ISO 8601)'),
  
  body('max_participants').if(body('post_type').equals('game_invitation')).optional().isInt({ min: 2, max: 100 })
    .withMessage('El máximo de participantes debe ser entre 2 y 100'),
  
  validateResults
];

const validateMedia = [
  body('media_type').notEmpty().isIn(['image', 'video'])
    .withMessage('Tipo de medio debe ser image o video'),
  
  body('media_url').notEmpty().isURL()
    .withMessage('URL del medio debe ser una URL válida'),
  
  validateResults
];

const validateIdParam = [
  param('id').isInt().toInt()
    .withMessage('ID debe ser un número entero válido'),
  
  validateResults
];

const validateMediaIdParam = [
  param('id').isInt().toInt()
    .withMessage('ID del post debe ser un número entero válido'),
  
  param('mediaId').isInt().toInt()
    .withMessage('ID del medio debe ser un número entero válido'),
  
  validateResults
];


module.exports = {
  validateRegistration,
  validateLogin,
  validateUserUpdate,
  validateUserSettings,
  validateUpdateProfile,
  validateAddGame,
  validateAddPlayTime,
  validateCreatePost,
  validateUpdatePost,
  validateMedia,
  validateIdParam,
  validateMediaIdParam
};