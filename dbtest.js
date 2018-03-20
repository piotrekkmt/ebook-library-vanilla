const sqlite3 = require('sqlite3').verbose();
const dbPath = './ebooks.db';
const books = require('./server/books.json');

console.log('now is', new Date().toISOString() );

// let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log('Connected to the ebooks database.');
// });

// db.serialize(() => {
//     let stmt = db.prepare('INSERT INTO ebooks (ISBN, TITLE, AUTHOR, DESCRIPTION, LANGUAGE, RATING, PAGES, YEAR, THUMBNAIL, FILENAME, READ)'
//     + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

//     for (let b in books) {
//         stmt.run(books[b].isbn,
//             books[b].title,
//             books[b].author,
//             books[b].description,
//             books[b].lang,
//             books[b].rating == 'No rating' ? 0 : books[b].rating,
//             books[b].pages || 0,
//             books[b].year || 0,
//             books[b].thumbnail,
//             books[b].filename,
//             0);
//     }
//     stmt.finalize();

// });

// db.close((err) => {
//     if (err) {
//     console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });