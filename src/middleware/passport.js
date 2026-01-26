import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'Credenciales inválidas' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use('jwt', new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret'
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use('current', new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret'
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));