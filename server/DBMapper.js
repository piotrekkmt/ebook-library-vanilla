'use strict';
const config = require('../config.json'),
    dbPath = config.dbFile,
    sqlite3 = require('sqlite3').verbose(),
    ServerError = require('./errors/ServerError');

let db;

class DBMapper {

    constructor() {
        db = new sqlite3.Database(dbPath, this.createTableIfNotExist);
        db.close();
    }

    createTableIfNotExist() {
        const createTable = `CREATE TABLE IF NOT EXISTS "ebooks" ( "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "ISBN" NUMERIC, "TITLE" TEXT, "AUTHOR" TEXT, "DESCRIPTION" TEXT, 
        "LANGUAGE" TEXT, "RATING" NUMERIC DEFAULT 0, "PAGES" INTEGER, "YEAR" INTEGER,
        "THUMBNAIL" TEXT, "FILENAME" TEXT, "READ" INTEGER DEFAULT 0, "MODIFIED" TEXT )`;
        db.run(createTable);
    }

    readAllQuery(query) {
        return new Promise((resolve, reject) => {
            let records = [];
            // open the database
            let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    console.error(err.message);
                    reject(new ServerError('Error establishing db connection.', 500));
                }

                db.serialize(() => {
                    db.each(query, (err, row) => {
                        if (err) {
                            console.error(err.message);
                            reject(new ServerError('Error on read query.', 500));
                        }
                        records.push(row);
                    });
                });
            });

            db.close((err) => {
                if (err) {
                    console.error(err.message);
                    reject(new ServerError('Error closing db connection.', 500));
                }
                resolve(records);
            });
        });
    }


    insertQuery(insertQuery, bookData) {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                console.log('Connected to the ebooks database.');
            });

            db.serialize(() => {
                let stmt = db.prepare(insertQuery);

                stmt.run(bookData.isbn,
                    bookData.title,
                    bookData.author,
                    bookData.description,
                    bookData.lang,
                    bookData.rating,
                    bookData.pages,
                    bookData.year,
                    bookData.thumbnail,
                    bookData.filename,
                    0);
                stmt.finalize();
            });

            db.close((err) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                resolve();
                console.log('Close the database connection.');
            });
        });
    }
}

module.exports = new DBMapper();
