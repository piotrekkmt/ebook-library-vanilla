const express = require('express'),
    router = express.Router(),
    ebookCtrl = require('../EbookCtrl'),
    fileCtrl = require('../FileCtrl');

router.get('/login', (req, res) => {
    res.render('login', {});
});

router.get(['/', '/home'], (req, res) => {
    res.render('index', {});
});

router.get('/details/:isbn', (req, res) => {
    const searchParams = {isbn: req.params.isbn};
    ebookCtrl.getBookFromDb(searchParams).then(book => {
        book.thumbnail = (book.thumbnail) ? book.thumbnail : '/images/covers/no-cover.png';
        res.render('details', {
            book: book
        });
    }).catch(err => {
        res.json(err);
    });
});

router.get('/edit/:isbn', (req, res) => {
    const searchParams = {isbn: req.params.isbn};
    ebookCtrl.getBookFromDb(searchParams).then(book => {
        book.thumbnail = (book.thumbnail) ? book.thumbnail : '/images/covers/no-cover.png';
        res.render('edit', {
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
