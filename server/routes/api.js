const express = require('express'),
    router = express.Router(),
    ebookCtrl = require('../EbookCtrl');

router.get('/getBooks', (req, res) => {
    ebookCtrl.getBooksFromDb().then(dbBooks => {
        res.json(dbBooks);
    }).catch(err => {
        res.status(err.httpCode).json(err.toJSON());
    });
});

router.get('/getBookDataByIsbn/:isbn', (req, res) => {
    if (req.params.isbn && req.params.isbn.length) {
        ebookCtrl.getBookInfoFromGoogleBooks(req.params.isbn).then(bookFromGoogle => {
            res.setHeader('Content-Type', 'application/json');
            res.send(bookFromGoogle);
        }).catch(err => {
            res.status(err.httpCode).json(err.toJSON());
        });
    } else {
        res.status(400).json({error: 400, message: 'Missing required parameter: ISBN No'});
    }
});

module.exports = router;
