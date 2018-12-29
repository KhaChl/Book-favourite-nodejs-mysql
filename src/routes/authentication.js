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

route.post('/register', (req, res) => {
    const { username, name, surname, password, confirmpassword } = req.body;
    req.checkBody('username', 'Username is invalid').matches(/^[a-zA-Z0-9]+$/, "i");
    req.checkBody('name', 'Name only letters').matches(/^[a-zA-z]+$/, "i");
    req.checkBody('surname', 'Surname only letters').matches(/^[a-zA-Z]+$/, "i");
    req.checkBody('password', 'Password use 5 or more characters').matches(/^[a-zA-Z0-9]{5,100}$/, "i");
    req.checkBody('password', 'Passwords do not match').equals(confirmpassword);
    passport.authenticate('local.register', {
        successRedirect: '/profile',
        failureRedirect: '/register',
        failureFlash: true
    })(req, res);
});

route.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

route.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});


module.exports = route;