const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');
const express = require('express');
const route = express.Router();

const connexion = mysql.createPool(database);

connexion.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION LOST');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if (connection) connection.release();
    console.log('DB is Connected');

    return;
});

// Promises connexion querys
connexion.query = promisify(connexion.query);

module.exports = connexion;