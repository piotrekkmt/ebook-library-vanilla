const express = require('express'),
    router = express.Router(),
    ebookCtrl = require('../EbookCtrl'),
    fileCtrl = require('../FileCtrl');

router.get(['/', '/home'], (req, res) => {
    res.render('index', {});
});

router.get('/details/:isbn', (req, res) => {
    ebookCtrl.getBookFromDb(req.params.isbn).then(book => {
        book.THUMBNAIL = (book.THUMBNAIL) ? book.THUMBNAIL : '/images/covers/no-cover.png';
        res.render('details', {
            book: book
        });
    }).catch(err => {
        res.json(err);
    });
});

router.get('/files', async(req, res) => {
    const files = await fileCtrl.getFolderContent();
    res.render('filelist', {
        files: files
    });
});

router.get('/upload', (req, res) => {
    res.render('upload', {});
});

module.exports = router;
