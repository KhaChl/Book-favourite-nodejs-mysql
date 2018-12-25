const express = require('express');
const route = express.Router();

const db = require('../database');

route.get('/', async (req,res)=>{
    try {
        const books = await db.query('SELECT * FROM books');
        res.render('books/list', {books});

    } catch (error) {
        console.log(error);
    }
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

    try {
        await db.query('INSERT INTO books set ?', [newBook])
        req.flash('success', 'Book saved successfully');
    } catch (error) {
        req.flash('error', 'Error saving book');
    }
    res.redirect('/books');
});

route.get('/delete/:id', async (req,res)=>{
    const {id} = req.params;
    
    try {
        await db.query('DELETE FROM books WHERE id = ?', [id]);
        req.flash('success', 'Book removed successfully');   
    } catch (error) {
        req.flash('error', 'Error removed book');
    }
    res.redirect('/books');
});

route.get('/edit/:id', async (req,res)=>{
    const {id} = req.params;

    try {
        const books = await db.query('SELECT * FROM books WHERE id = ?',[id]);
        res.render('books/edit', {book:books[0]});
    } catch (error) {
        res.redirect('/books');
    }
});

route.post('/edit/:id', async (req,res)=>{
    const {id} = req.params;
    const { title, url, description } = req.body;
    const newBook = {
        title,
        url,
        description
    };

    try {
        await db.query('UPDATE books SET ? WHERE id = ?',[newBook,id]);
        req.flash('success', 'Book edited successfully');
    } catch (error) {
        req.flash('error', 'Error edit');
    }
    res.redirect('/books');
});

module.exports = route;