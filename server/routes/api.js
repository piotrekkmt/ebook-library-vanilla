const express = require('express'),
    router = express.Router(),
    ebookCtrl = require('../EbookCtrl'),
    fileCtrl = require('../FileCtrl');

router.get('/getbooks', async(req, res) => {
    try {
        const dbBooks = await ebookCtrl.getAllBooks();
        res.json(dbBooks);
    } catch (err) {
        res.status(err.httpCode).json(err.toJSON());
    }
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

router.put('/editebook', async(req, res) => {
    if (req.body) {
        try {
            const message = await ebookCtrl.editBookInDb(req.body);
            res.status(200).json({status: 'OK', message: message});
        } catch (err) {
            res.status(err.httpCode).json(err);
        }
    } else {
        res.status(400).json('Missing parameters');
    }
});

router.post('/saveebook', async(req, res) => {
    if (req.body) {
        try {
            const message = await ebookCtrl.saveEbookToDb(req.body);
            res.status(200).json({status: 'OK', message: message});
        } catch (err) {
            res.status(err.httpCode).json(err);
        }
    } else {
        res.status(400).json('Missing parameters');
    }
});

router.get('/file/:filename', (req, res) => {
    if (req.params.filename) {
        fileCtrl.getEbookFileFromDropbox(req.params.filename).then(bookFile => {
            res.writeHead(200, {'Content-Type': 'application/x-mobipocket-ebook'});
            res.end(bookFile.fileBinary, 'binary');
        }).catch(err => {
            res.status(400).json(err);
        });
    } else {
        res.status(400).json('Missing parameters');
    }
});

router.get('/thumbnail/:thumbFilename', async(req, res) => {
    if (req.params.thumbFilename) {
        try {
            const thumbnail = await fileCtrl.getThumbnailFileFromDropbox(req.params.thumbFilename);
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(thumbnail.fileBinary, 'binary');
        } catch (err) {
            console.error('Thumbnail error', err);
            res.status(404).json({error: 404, message: 'Image not found'});
        }
    } else {
        res.status(400).json('Missing ISBN parameter');
    }
});

router.post('/upload/', async(req, res) => {
    try {
        const result = await fileCtrl.saveFileToDropbox(req);
        res.status(200).json({status: 'OK', message: result});
    } catch (err) {
        res.status(err.httpCode).json(err);
    }
});

module.exports = router;
