const express = require('express'),
    router = express.Router(),
    ebookCtrl = require('../EbookCtrl');

router.get('/getbooks', (req, res) => {
    ebookCtrl.getBooksFromDb().then(dbBooks => {
        res.json(dbBooks);
    }).catch(err => {
        res.status(err.httpCode).json(err.toJSON());
    });
});

router.get('/getbookdatabyisbn/:isbn', (req, res) => {
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

router.post('/saveebook', (req, res) => {
    if (req.body) {
        ebookCtrl.saveEbooktoDb(req.body).then(message => {
            res.status(200).json({status: 'OK', message: message});
        }).catch(err => {
            res.status(err.httpCode).json(err);
        });
    } else {
        res.status(400).json('Missing parameters');
    }
});

module.exports = router;
