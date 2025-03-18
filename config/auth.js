const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
/**
 * se incluye passport que 
 * es un middleware de autenticación para Node.js
 * sirve para autenticar peticiones de usuarios
 */
const passport = require('passport');
/**
 * tambien se incluyen las estrategias de autenticación
 * de Google y Facebook para autenticar a los usuarios
 * con sus cuentas de Google o Facebook
 * se instalan con npm install passport-google-oauth20 passport-facebook
 */
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const userModel = require('../models/userModel');


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

// JWT strategy
passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await userModel.findById(payload.userId);
    
    if (user) {
      return done(null, user);
    }
    
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google strategy (if configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/social/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const googleId = profile.id;
      const profilePicture = profile.photos[0].value;
      
      const user = await userModel.createOrUpdateWithSocial('google', {
        name,
        email,
        socialId: googleId,
        profilePicture
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
}

// Facebook strategy (if configured)
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/auth/social/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const facebookId = profile.id;
      const profilePicture = profile.photos[0].value;
      
      const user = await userModel.createOrUpdateWithSocial('facebook', {
        name,
        email,
        socialId: facebookId,
        profilePicture
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
}

module.exports = passport;