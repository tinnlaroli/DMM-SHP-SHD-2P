const { body, validationResult } = require('express-validator');

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
module.exports = {
  validateRegistration,
  validateLogin,
  validateUserUpdate,
  validateUserSettings,
  validateUpdateProfile,
  validateAddGame,
  validateAddPlayTime
};