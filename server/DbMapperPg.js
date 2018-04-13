'use strict';
const pg = require('pg'),
    ServerError = require('./errors/ServerError'),
    connectionString = process.env.DATABASE_URL
        || 'postgres://postgres@localhost:32768/ebooklibrary';

const dbClient = new pg.Client(connectionString);

class DBMapperPg {

    constructor() {
        dbClient.connect((err) => {
            if (err) {
                console.error(err);
                throw new ServerError('Error establishing db connection.', 500);
            }
            const createTableQuery = `CREATE TABLE IF NOT EXISTS "ebooks" ("ID" SERIAL NOT NULL PRIMARY KEY,
                "ISBN" TEXT, "TITLE" TEXT, "AUTHOR" TEXT, "DESCRIPTION" TEXT, 
                "LANGUAGE" TEXT, "RATING" NUMERIC DEFAULT 0, "PAGES" INTEGER, "YEAR" INTEGER,
                "THUMBNAIL" TEXT, "FILENAME" TEXT, "READ" INTEGER DEFAULT 0, "MODIFIED" TEXT)`;
            dbClient.query(createTableQuery, (err) => {
                if (err) {
                    console.error(err);
                    throw new ServerError('Error establishing db connection.', 500);
                }
                dbClient.end();
            });
        });
    }

    readAllQuery(queryStr) {
        return new Promise((resolve, reject) => {
            const dbClient = new pg.Client(connectionString);
            dbClient.connect((err) => {
                // Handle connection errors
                if (err) {
                    console.error(err);
                    reject(new ServerError('Error establishing db connection.', 500));
                }
                // SQL Query > Select Data
                dbClient.query(queryStr, (err, result) => {
                    if (err) {
                        console.error(err);
                        throw new ServerError('Error establishing db connection.', 500);
                    }
                    // Stream results back one row at a time
                    resolve(result.rows);
                    dbClient.end();
                });
            });
        });
    }

    insertQuery(insertQuery) {
        return new Promise((resolve, reject) => {

            const dbClient = new pg.Client(connectionString);
            dbClient.connect((err) => {
                // Handle connection errors
                if (err) {
                    console.error(err);
                    reject(new ServerError('Error establishing db connection.', 500));
                }
                // SQL Query > Select Data
                dbClient.query(insertQuery, (err, result) => {
                    if (err) {
                        console.error(err);
                        throw new ServerError('Error establishing db connection.', 500);
                    }
                    // Stream results back one row at a time
                    resolve(result.rows);
                    dbClient.end();
                });
            });
        });
    }
}

module.exports = new DBMapperPg();
