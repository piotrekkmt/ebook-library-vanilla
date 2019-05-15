require('dotenv').config();

const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    hbs = require('express-hbs'),
    mongoose = require('mongoose'),
    mongoUri = process.env.MONGO_URI,
    port = process.env.PORT || 3000;

mongoose.connect(mongoUri, {useNewUrlParser: true})
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    defaultLayout: __dirname + ('/views/layout/default.hbs')
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());

app.use('/api', require('./server/routes/api.js'));
app.use('/', require('./server/routes/ui.js'));
app.use('/ebooks', express.static(path.join(__dirname, 'ebooks')));
app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log('eBook Library App listening on port 3000!');
});
