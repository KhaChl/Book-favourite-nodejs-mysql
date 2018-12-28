const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    const query = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (query.length > 0) {
        const user = query[0];
        const validPassword = await helpers.matchpassword(password, user.password);
        if (validPassword) {
            done(null, user);
        } else {
            done(null, false, req.flash('error', 'Incorret password'));
        }
    } else {
        done(null, false, req.flash('error', 'The username not exist'));

    }
}));

passport.use('local.register', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const { name, surname } = req.body;
    const newUser = {
        username,
        password,
        name,
        surname
    };
    const query = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (query.length > 0) {
        return done(null, false, req.flash('error', 'The username already exists'));
    }else{
        newUser.password = await helpers.hashpassword(password);
        const result = await db.query('INSERT INTO users SET ?', [newUser]);
        newUser.id = result.insertId;
        return done(null, newUser, req.flash('success', 'Successful registration'));
    }



}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, user[0]);
});