const express = require('express'),
    router = express.Router(),
    ebookCtrl = require('../EbookCtrl'),
    fileCtrl = require('../FileCtrl');;

router.get(['/','/home'], (req, res) => {
    ebookCtrl.getBooksFromFilesList().then(booksFromFiles => {

    });
    ebookCtrl.getBooksFromDb().then(dbBooks => {
        res.render('index', {
          title: 'eBook Library - Home page',
          ebooks: dbBooks
        });
    }).catch(err => {
        res.json(err);
    });
});

router.get('/details/:isbn', (req, res) => {
    ebookCtrl.getBookFromDb(req.params.isbn).then(book => {
        res.render('details', {
          title: 'eBook Library - Book details',
          book: book
        });
    }).catch(err => {
       res.json(err);
    });
});

router.get('/files', (req, res) => {
    const files = fileCtrl.getFolderContent();
    res.render('filelist', {
      title: 'eBook Library - List of files',
      files: files 
    });
});

router.get('/upload', (req, res) => {
    res.render('upload', {
      title: 'eBook Library - Upload'
    });
});

module.exports = router;
