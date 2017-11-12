const express = require('express');
    app = express(),
    path = require('path'),
    hbs = require('express-hbs'),
    ebookCtrl = require('./server/EbookCtrl');

app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + ('/views/layout/default.hbs')
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get(['/','/home'], function(req, res) {
  res.render('index', {
    host: 'http://' + req.get('host'),
    title: 'eBook Library - Home page',
    ebooks: ebookCtrl.getBooks()
  });
});

app.get('/details/:isbn', function(req, res) {
  res.render('details', {
    host: 'http://' + req.get('host'),
    title: 'eBook Library - Book details',
    book: ebookCtrl.getBook(req.params.isbn)
  });
});

app.get('/api/getBooks', function(req, res) {
  res.send(ebookCtrl.getBooksFromDb());
});

app.use('/', express.static(path.join(__dirname, 'public')));


app.listen(3000, function () {
  console.log('eBook Library App listening on port 3000!')
});
