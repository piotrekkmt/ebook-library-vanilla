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
                // THE object headings need to be in the same case.. upper or lower, make everything lower
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

    makeDropboxFilesIntoMongooseModels(dropboxContents) {
        let modelledEbooks = [];
        dropboxContents.forEach(dbxFile => {
            const bookData = {
                'filename': dbxFile.name
            };

            const regexTitleWithLangAndIsbn = /^.._[a-zA-Z0-9]{1,13}_/;

            if (dbxFile.name && dbxFile.name.match(regexTitleWithLangAndIsbn)) {
                bookData['language'] = dbxFile.name.substr(0, 2).toLowerCase();
                bookData['isbn'] = dbxFile.name.split('_')[1];
                bookData['title'] = dbxFile.name.split('_')[2];
                bookData['author'] = '**file**';
            } else {
                bookData['title'] = dbxFile.name;
                bookData['author'] = '**file**';
            }
            const fileEntry = new EbookModel(bookData);
            modelledEbooks.push(fileEntry);
        });

        return modelledEbooks;
    }

    getUnique(arr, comp) {
        const unique = arr.map(e => e[comp])
            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)
            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);
        return unique;
    }

    removeFilesAlreadyInDb(data) {
        const filenames = data.map(book => {
            return book.filename;
        });

        let duplicatedFilenames = [];
        filenames.forEach(str => {
            if (filenames.indexOf(str) !== filenames.lastIndexOf(str)) {
                duplicatedFilenames.push(str);
            }
        });

        const dups = [... new Set(duplicatedFilenames)];

        return data.filter(ebook => {
            if (dups.includes(ebook.filename) && ebook.author === '**file**') {
                return false;
            } else {
                return true;
            }
        });
    }

    mergeDropboxWithDatabase(dbx, db) {
        dbx = dbx || [];
        db = db || [];
        let merged = dbx.concat(db);
        return this.removeFilesAlreadyInDb(merged);
    }

    async getAllBooks() {
        try {
            let [dropboxBooks, databaseBooks] = await Promise.all([fileCtrl.getDropboxContents(),
                this.getBooksFromDb()]);
            const dbxModelled = this.makeDropboxFilesIntoMongooseModels(dropboxBooks);
            let fullBookList = this.mergeDropboxWithDatabase(dbxModelled, databaseBooks);
            return fullBookList;
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

    // TODO: Upload ebook file to server

    // TODO: Save ebook thumbnail to thumbnails folder on Dropbox

}

module.exports = new EbookCtrl();
