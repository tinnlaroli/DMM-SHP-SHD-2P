const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/validation');
const authMiddleware = require('../middlewares/authMiddleware');

// Register new user
router.post('/register', validateRegistration, authController.register);

// Login user
router.post('/login', validateLogin, authController.login);

// Social login routes
router.post('/social/google', authController.googleLogin);
router.post('/social/facebook', authController.facebookLogin);

// Google OAuth routes (if configured)
/**
 * este es el endpoint que se llama cuando se quiere iniciar sesion con google
 * funciona asi :
 * 1. se llama al endpoint /social/google/start
 * 2. se redirige a la pagina de google para que el usuario inicie sesion
 * 3. si el usuario inicia sesion correctamente, google redirige a la pagina de callback
 * 4. en la pagina de callback se llama al endpoint /social/google/callback
 * 5. se llama a la funcion passport.authenticate('google', { session: false }) que es un middleware
 * 6. si el middleware es exitoso, se llama a la funcion authController.socialLoginCallback
 */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/social/google/start', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  }));
  
  router.get('/social/google/callback', passport.authenticate('google', { 
    session: false 
  }), authController.socialLoginCallback);
}

// Facebook OAuth routes (if configured)
/**
 * este es el endpoint que se llama cuando se quiere iniciar sesion con facebook
 * funciona asi :
 * 1. se llama al endpoint /social/facebook/start
 * 2. se redirige a la pagina de facebook para que el usuario inicie sesion
 * 3. si el usuario inicia sesion correctamente, facebook redirige a la pagina de callback
 * 4. en la pagina de callback se llama al endpoint /social/facebook/callback
 * 5. se llama a la funcion passport.authenticate('facebook', { session: false }) que es un middleware
 * 6. si el middleware es exitoso, se llama a la funcion authController.socialLoginCallback
 */
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  router.get('/social/facebook/start', passport.authenticate('facebook', { 
    scope: ['email'] 
  }));
  
  router.get('/social/facebook/callback', passport.authenticate('facebook', { 
    session: false 
  }), authController.socialLoginCallback);
}

// Get current user info
router.get('/me', authController.getCurrentUser);

// Update current user info
router.put('/me', authController.updateCurrentUser);

// Logout user
router.post('/logout', authController.logout);

module.exports = router;