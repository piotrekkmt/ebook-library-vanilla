'use strict';
const request = require('request-promise'),
    fileCtrl = require('./FileCtrl'),
    EbookModel = require('./models/Ebook'),
    ServerError = require('./errors/ServerError');

class EbookCtrl {
    constructor() {}

    getBooksFromDb() {
        return EbookModel.find().exec();
    }

    async getBookFromDb(isbn) {
        try {
            const bookData = await EbookModel.findOne({isbn: isbn}).exec();
            if (bookData) {
                return bookData;
            } else {
                console.warn('404 - Book not found');
                throw new ServerError('Not found', 404);
            }
        } catch (err) {
            console.error(err);
            throw new ServerError('Error getting book', 500);
        }
    }

    async getAllBooks() {
        try {
            let databaseBooks = await this.getBooksFromDb();
            return databaseBooks;
        } catch (err) {
            console.error(err);
            throw new ServerError('Error getting books', 500);
        }
    }

    async saveEbooktoDb(bookData) {
        try {
            bookData.rating = (bookData.rating === 'No rating') ? 0 : bookData.rating,
            bookData.pages = bookData.pages || 0;
            bookData.read = bookData.read || 0;

            const ebookEntry = new EbookModel(bookData);
            const bookSaved = await ebookEntry.save();
            console.log('Book saved', bookSaved);
            return 'Book successfully saved.';
        } catch (err) {
            console.error('Error saving book to db', err);
            throw new ServerError('Error saving book to db', 500);
        }
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
            request('https://www.googleapis.com/books/v1/volumes?country=PL&q=isbn:' + isbnString).then(body => {
                resolve(body);
            }, err => {
                reject(new ServerError('Google Books API error. ' + err, 400));
            });
        });
    }

    getBooksFromFilesList() {
        let filesList = fileCtrl.getFolderContent();
        filesList = filesList.filter(f => {
            if (f.name.includes('_') && f.name.substr(0, 1) !== ('.')) {
                const isbn = f.name.split('_')[1] || false;
                return !isNaN(+isbn) ? isbn : false;
            } else {
                return;
            }
        });

        return this.getBookInfoFromGoogleBooks(filesList);
    }

    // TODO: Save ebook thumbnail to thumbnails folder on Dropbox

}

module.exports = new EbookCtrl();
