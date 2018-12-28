const express = require('express');
const route = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

route.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

route.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

route.get('/register', isNotLoggedIn, (req, res) => {
    res.render('auth/register');
});

route.post('/register', passport.authenticate('local.register', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true
}));

route.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

route.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});


module.exports = route;