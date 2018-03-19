const express = require('express'),
    router = express.Router(),
    ebookCtrl = require('../EbookCtrl');

router.get('/api/getBooks', function(req, res) {
    ebookCtrl.getBooksFromDb().then(dbBooks => {
      res.json(dbBooks);
    }).catch(err => {
      res.json(err);
    });
});

module.exports = router;
