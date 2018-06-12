'use strict';
const request = require('request'),
    fileCtrl = require('./FileCtrl'),
    dbMapper = require('./DbMapperPg'),
    ServerError = require('./errors/ServerError');

const getAllBooksQuery = 'SELECT * FROM ebooks';
const getBookByISBNQuery = 'SELECT * FROM ebooks WHERE "ISBN"=\'_ISBN_\'';
const insertQuery = `INSERT INTO ebooks 
    ("ISBN", "TITLE", "AUTHOR", "DESCRIPTION", "LANGUAGE", "RATING", "PAGES",
    "YEAR", "THUMBNAIL", "FILENAME", "READ", "MODIFIED") 
    VALUES (__ISBN__, __TITLE__, __AUTHOR__, __DESCRIPTION__, __LANGUAGE__,
         __RATING__, __PAGES__, __YEAR__, __THUMBNAIL__, __FILENAME__, __READ__, __MODIFIED__)`;

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
                    reject(new ServerError('Not found', 404));
                }
            }).catch(err => {
                reject(new ServerError('Error reading from DB. ' + err.message, 500));
            });
        });
    }

    prepareInsertBookQueryToSave(bookData) {
        // TODO: Find a better way to escape INSERT string for Postgres
        bookData.description = bookData.description.replace(/"/gi, '');
        bookData.description = bookData.description.replace(/'/gi, '');
        bookData.description = bookData.description.replace(/\\/gi, '');

        let query = insertQuery
            .replace('__ISBN__', '\'' + bookData.isbn + '\'')
            .replace('__TITLE__', '\'' + bookData.title + '\'')
            .replace('__AUTHOR__', '\'' + bookData.author + '\'')
            .replace('__DESCRIPTION__', '\'' + bookData.description + '\'')
            .replace('__LANGUAGE__', '\'' + bookData.lang + '\'')
            .replace('__RATING__', bookData.rating)
            .replace('__PAGES__', bookData.pages)
            .replace('__YEAR__', bookData.year)
            .replace('__THUMBNAIL__', '\'' + bookData.thumbnail + '\'')
            .replace('__FILENAME__', '\'' + bookData.filename + '\'')
            .replace('__READ__', bookData.read)
            .replace('__MODIFIED__', '\'' + new Date().toISOString() + '\'');
        return query;
    }

    saveEbooktoDb(bookData) {
        return new Promise((resolve, reject) => {
            bookData.rating = (bookData.rating == 'No rating') ? 0 : bookData.rating,
            bookData.pages = bookData.pages || 0;
            bookData.read = bookData.read || 0;

            const bookQuery = this.prepareInsertBookQueryToSave(bookData);
            dbMapper.insertQuery(bookQuery).then(() => {
                resolve('Book successfully saved.');
            }).catch(err => {
                reject(err);
            });
        });
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

    getBookInfoFromGoogleBooks(isbnArrStr) {
        let isbnString = '';
        if (Array.isArray(isbnArrStr)) {
            isbnArrStr.forEach(nr => {
                isbnString += 'isbn:' + nr + '+OR+';
            });
        } else if (typeof isbnArrStr === 'string') {
            isbnString = isbnArrStr;
        }
        return new Promise((resolve, reject) => {
            request('https://www.googleapis.com/books/v1/volumes?country=PL&q=isbn:' + isbnString,
                (err, response, body) => {
                    if (err) {
                        reject(new ServerError('Google Books API error. ' + err, 400));
                    } else {
                        resolve(body);
                    }
                });
        });
    }

    getBooksFromFilesList() {
        return new Promise((resolve, reject) => {
            let filesList = fileCtrl.getFolderContent();
            filesList = filesList.filter(f => {
                if (f.name.includes('_') && f.name.substr(0, 1) !== ('.')) {
                    const isbn = f.name.split('_')[1] || false;
                    return !isNaN(+isbn) ? isbn : false;
                } else {
                    return;
                }
            });

            this.getBookInfoFromGoogleBooks(filesList).then(resp => {
                resolve(resp);
            }).catch(err => {
                reject(err);
            });
        });
    }

    // TODO: Upload ebook file to server
    // Add another comment
    // TODO: Save ebook thumbnail to covers

}

module.exports = new EbookCtrl();
