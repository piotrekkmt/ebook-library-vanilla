'use strict';
const request = require('request'),
    fileCtrl = require('./FileCtrl'),
    dbMapper = require('./DbMapper');

const getAllBooksQuery = `SELECT * FROM ebooks`;
const getBookByISBNQuery = `SELECT * FROM ebooks WHERE ISBN = '_ISBN_'`;
const insertQuery = `INSERT INTO ebooks 
    (ISBN, TITLE, AUTHOR, DESCRIPTION, LANGUAGE, RATING, PAGES, YEAR, THUMBNAIL, FILENAME, READ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

class EbookCtrl {
    constructor() {}
    
    getBooksFromDb() {
        return dbMapper.readAllQuery(getAllBooksQuery);
    }

    getBookFromDb(isbn) {
        return new Promise((resolve, reject) => {
            const query = getBookByISBNQuery.replace('_ISBN_', isbn);
            dbMapper.readAllQuery(query).then(rows => {
                if (rows && rows.length) {
                    resolve(rows[0] || null);
                } else {
                    reject({status: 404, message: 'Not found'});
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    saveEbooktoDb(bookData) {
        bookData.rating = (bookData.rating == 'No rating') ? 0 : bookData.rating,
        bookData.pages = bookData.pages || 0;
        bookData.year = bookData.year || 0;

        dbMapper.insertQuery(insertQuery, bookData);
    }

    getBook(isbn) {
        let books = require('./books.json');
        for (let record in books) {
            if (books[record].isbn === isbn) {
                return books[record];
            }
        }
        return null;
    }

    getBookInfoFromGoogleBooks(isbnArr) {
        let isbnString = '';
        isbnArr.forEach(nr => {
            isbnString += 'isbn:' + nr + '+OR+';
        });
        return new Promise((resolve, reject) => {
            request.get('https://www.googleapis.com/books/v1/volumes?country=US&q=isbn:' + isbnString)
                .on('response', response => {
                    resolve(response);
                }).on('error', err => {
                    reject(err);
                });
        });
    }    

    getBooksFromFilesList() {
        return new Promise((resolve, reject) => {
            const filesList = fileCtrl.getFolderContent();
            validFiles = filesList.filter(f => {
                if (f.name.includes('_') && f.name.substr(0,1) !== ('.')) {
                    const isbn = f.name.split('_')[1] || false;
                    return !isNaN(+isbn) ? isbn : false;
                } else {
                    return;
                }
            });

            this.getBookInfoFromGoogleBooks(validFiles).then(resp => {
                resolve(resp);
            }).catch(err => {
                reject(err);
            });
        });
    }
    
    // TODO: Get ebook data from file name || ISBN number and save to db
    
    // TODO: Upload ebook file to server

    // TODO: Save ebook thumbnail to covers

}

module.exports = new EbookCtrl();
