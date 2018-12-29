const express = require('express');
const route = express.Router();
const db = require('../database');
const { isLoggedIn } = require('../lib/auth');

route.get('/', isLoggedIn, async (req, res) => {
    try {
        const books = await db.query('SELECT * FROM books WHERE user_id = ?', [req.user.id]);
        res.render('books/list', { books });

    } catch (error) {
        console.log(error);
    }
});

route.get('/add', isLoggedIn, (req, res) => {
    res.render('books/add');
});

route.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('url', 'URL is invalid').isURL();
    req.checkBody('description', 'Description is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.render('books/add', {
            errors: errors,
            title,
            url,
            description,
        });
    } else {
        const newBook = {
            title,
            url,
            description,
            user_id: req.user.id
        };

        try {
            await db.query('INSERT INTO books set ?', [newBook])
            req.flash('success', 'Book saved successfully');
        } catch (error) {
            req.flash('error', 'Error saving book');
        }
        res.redirect('/books');
    }
});

route.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM books WHERE id = ?', [id]);
        req.flash('success', 'Book removed successfully');
    } catch (error) {
        req.flash('error', 'Error removed book');
    }
    res.redirect('/books');
});

route.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;

    const books = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    res.render('books/edit', { book: books[0] });
});

route.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('url', 'URL is invalid').isURL();
    req.checkBody('description', 'Description is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const book = {
            id,
            title,
            url,
            description
        };
        res.render('books/edit', {
            errors: errors,
            book
        });
    } else {
        const newBook = {
            title,
            url,
            description
        };

        try {
            await db.query('UPDATE books SET ? WHERE id = ?', [newBook, id]);
            req.flash('success', 'Book edited successfully');
        } catch (error) {
            req.flash('error', 'Error edit');
        }
        res.redirect('/books');
    }
});

module.exports = route;