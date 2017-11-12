const sqlite3 = require('sqlite3').verbose();
const dbPath = './ebooks.db';

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
    console.log(row.id + "\t" + row.title);
    });
});

db.close((err) => {
    if (err) {
    console.error(err.message);
    }
    console.log('Close the database connection.');
});