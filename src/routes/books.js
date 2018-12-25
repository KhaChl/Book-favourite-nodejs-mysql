const express = require('express');
const route = express.Router();

const db = require('../database');

route.get('/', async (req,res)=>{
    const books = await db.query('SELECT * FROM books');
    res.render('books/list', {books})
});

route.get('/add', (req, res)=>{
    res.render('books/add');
});

route.post('/add', async (req, res)=>{
    const { title, url, description } = req.body;
    const newBook = {
        title,
        url,
        description
    };
    await db.query('INSERT INTO books set ?', [newBook]);
    req.flash('success', 'Book saved successfully');
    res.redirect('/books');
});

route.get('/delete/:id', async (req,res)=>{
    const {id} = req.params;
    await db.query('DELETE FROM books WHERE id = ?', [id]);
    req.flash('success', 'Book removed successfully');
    res.redirect('/books');
});

route.get('/edit/:id', async (req,res)=>{
    const {id} = req.params;
    const books = await db.query('SELECT * FROM books WHERE id = ?',[id]);
    res.render('books/edit', {book:books[0]});
});

route.post('/edit/:id', async (req,res)=>{
    const {id} = req.params;
    const { title, url, description } = req.body;
    const newBook = {
        title,
        url,
        description
    };
    await db.query('UPDATE books SET ? WHERE id = ?',[newBook,id]);
    req.flash('success', 'Book edited successfully');
    res.redirect('/books');
});

module.exports = route;