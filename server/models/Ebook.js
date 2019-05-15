const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Make this lower case, upper sucks balls in JSON, we're not savages...
var ebookSchema = new Schema({
    ISBN: String,
    TITLE: String,
    AUTHOR: String,
    DESCRIPTION: String,
    LANGUAGE: String,
    RATING: String,
    PAGES: Number,
    YEAR: Number,
    THUMBNAIL: String,
    FILENAME: String,
    READ: Boolean,
    MODIFIED: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Ebook', ebookSchema);
