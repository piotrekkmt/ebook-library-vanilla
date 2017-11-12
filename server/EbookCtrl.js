'use strict';

const sqlite3 = require('sqlite3').verbose();
const dbPath = './ebooks.db';


class EbookCtrl {
    constructor() {

    }
    
    //TODO: Connect to a local sqlite db
    getBooksFromDb() {
        // open the database
        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
            console.error(err.message);
            }
            console.log('Connected to the ebooks database.');
        });
        
        db.serialize(() => {
            db.each(`SELECT * FROM ebooks`, (err, row) => {
            if (err) {
                console.error(err.message);
            }
            console.log(row.id + "\t" + row.name);
            });
        });
        
        db.close((err) => {
            if (err) {
            console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }

    //TODO: Get eBooks from local storage
    getBooks() {
        return require('./books.json');
    }

    //TODO: Get single eBook from local storage
    getBook(isbn) {
        let books = require('./books.json');
        for (let record in books) {
            if (books[record].isbn === isbn) {
                return books[record];
            }
        }
        return null;
    }

    //TODO: Save eBook data to sqlite db

    //TODO: Get eBook details from Google Books API
    
    //TODO: Upload ebook file to server

    //TODO: Save ebook thumbnail to covers

}

module.exports = new EbookCtrl();
