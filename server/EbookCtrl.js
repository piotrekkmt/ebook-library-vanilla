'use strict';
const request = require('request'),
    sqlite3 = require('sqlite3').verbose(),
    fileCtrl = require('./FileCtrl'),
    dbPath = './ebooks.db';

class EbookCtrl {
    constructor() {}
    
    getBooksFromDb() {
        return new Promise((resolve, reject) => {
            let booksArray = [];
            // open the database
            let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
    
                db.serialize(() => {
                    db.each(`SELECT * FROM ebooks`, (err, row) => {
                        if (err) {
                            console.error(err.message);
                            reject(err);
                        }
                        booksArray.push(row);
                    });
                });
            });
            
            db.close((err) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                console.log('Close the database connection.');
                resolve(booksArray);
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

    getBookFromDb(isbn) {
        return new Promise((resolve, reject) => {
            // open the database
            let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                console.log('Connected to the ebooks database.');
            });
            
            db.serialize(() => {
                db.each(`SELECT * FROM ebooks WHERE ISBN = '` + isbn + `'`, (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                resolve(row);
                });
            });
            
            db.close((err) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                console.log('Close the database connection.');
            });
        });
    }

    saveEbooktoDb(bookData) {
        let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the ebooks database.');
        });

        db.serialize(() => {
            let stmt = db.prepare('INSERT INTO ebooks (ISBN, TITLE, AUTHOR, DESCRIPTION, LANGUAGE, RATING, PAGES, YEAR, THUMBNAIL, FILENAME, READ)'
            + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

            stmt.run(bookData.isbn,
                bookData.title,
                bookData.author,
                bookData.description,
                bookData.lang,
                bookData.rating == 'No rating' ? 0 : bookData.rating,
                bookData.pages || 0,
                bookData.year || 0,
                bookData.thumbnail,
                bookData.filename,
                0);
            stmt.finalize();
        });

        db.close((err) => {
            if (err) {
            console.error(err.message);
            }
            console.log('Close the database connection.');
        });
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
            let filesList = fileCtrl.getFolderContent();
            filesList = filesList.filter(f => {
                if (f.name.includes('_')) {
                    let isbn = f.name.split('_')[1] || false;
                    console.log('typeof isbn', +isbn);
                    return !isNaN(+isbn) ? isbn : false;
                } else {
                    return;
                }
            });
            console.log('filesList', filesList);
            this.getBookInfoFromGoogleBooks(filesList).then(resp => {
                resolve(resp);
            }).catch(err => {
                reject(err);
            });
        });
    }

    //TODO: Get single eBook from local storage

    //TODO: Upload ebook file to server

    //TODO: Save ebook thumbnail to covers

    //TODO: If db / table doesnt exist - create one

}

module.exports = new EbookCtrl();
