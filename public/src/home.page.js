/**
 * eBook Library Vanilla with jQuery Mobile
 * Home Page
 * Author: Peter Poliwoda <contact@peterpoliwoda.me>
 * Date: 21/10/2017
*/
var HomePage = (function() {
    'use strict';

    var allBooks = [];
    return {
        getAllBooks: function(callback) {
            $.get('/api/getbooks/', function(books) {
                return callback(books);
            });
        },
        getBookTemplate: function(book) {
            book.thumbnail = (book.thumbnail) ? book.thumbnail : 'images/covers/no-cover.png';
            return '<div class="ui-block-b">' +
            '<div class="ui-bar ui-bar-a" style=" height: 280px; background: url('
                + book.thumbnail + '); background-size: cover;">' +
              '<div class="list-filler">&nbsp;</div>' +
              '<div class="book-details">' +
                '<div class="list-title"><a href="/details/' + book.isbn + '">' + book.title + '</a></div>' +
                '<div class="list-author">' + book.author + '</div>' +
                 /* eslint-disable no-undef */
                 '<div class="list-rating">' + Rating.get(book.rating) + '</div>' +
                /* eslint-enable no-undef */
                '<div>' +
                  '<img src="images/blank.gif" class="flag flag-' + (book.language ? book.language : 'pl')
                      + '" alt="' + book.language + '" />' +
                  '<a href="/details/' + book.isbn + '">View</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        },
        sortBooksByKey: function(key) {
            $('#allBooksGrid').html('');
            allBooks.sort(function(a, b) {
                switch (key) {
                case 'modified':
                    return (a[key] < b[key]) ? 1 : ((a[key] > b[key]) ? -1 : 0);
                case 'author':
                    var aa =  a[key].split(' ')[a[key].split(' ').length - 1];
                    var bb =  b[key].split(' ')[b[key].split(' ').length - 1];
                    return (aa > bb) ? 1 : ((aa < bb) ? -1 : 0);
                case 'rating':
                    a['rating'] = (a['rating'] === 'No rating') ? 0 : a['rating'];
                    b['rating'] = (b['rating'] === 'No rating') ? 0 : b['rating'];
                    return (a[key] < b[key]) ? 1 : ((a[key] > b[key]) ? -1 : 0);
                default:
                    return (a[key] > b[key]) ? 1 : ((a[key] < b[key]) ? -1 : 0);
                }
            });
            HomePage.loadBooksIntoView(allBooks);
        },
        loadBooksIntoView: function(allBooks) {
            for (var b in allBooks) {
                var bookEntryTemplate = HomePage.getBookTemplate(allBooks[b]);
                $('#allBooksGrid').append(bookEntryTemplate);
            }
        },
        bindButtons: function() {
            $('#sortByTitle').bind('click', function() {
                HomePage.sortBooksByKey('title');
            });
            $('#sortByRating').bind('click', function() {
                HomePage.sortBooksByKey('rating');
            });
            $('#sortByAuthor').bind('click', function() {
                HomePage.sortBooksByKey('author');
            });
            $('#refreshHomePage').bind('click', function() {
                $('#showHere').html('<strong>WIELKA DUPA</strong>');
            });
        },
        init: function() {
            HomePage.getAllBooks(function(booksReceived) {
                allBooks = booksReceived;
                HomePage.sortBooksByKey('MODIFIED');
            });
            HomePage.bindButtons();
        }
    };
})();
