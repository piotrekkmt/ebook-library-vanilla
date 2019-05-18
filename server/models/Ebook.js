const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Make this lower case, upper sucks balls in JSON, we're not savages...
var ebookSchema = new Schema({
    isbn: String,
    title: String,
    author: String,
    description: String,
    language: String,
    rating: String,
    pages: Number,
    year: Number,
    thumbnail: String,
    filename: String,
    read: Boolean,
    modified: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Ebook', ebookSchema);
