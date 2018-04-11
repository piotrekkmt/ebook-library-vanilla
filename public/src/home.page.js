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
            book.THUMBNAIL = (book.THUMBNAIL) ? book.THUMBNAIL : 'images/covers/no-cover.png';
            return '<div class="ui-block-b">' +
            '<div class="ui-bar ui-bar-a" style=" height: 280px; background: url('
                + book.THUMBNAIL + '); background-size: cover;">' +
              '<div class="list-filler">&nbsp;</div>' +
              '<div class="book-details">' +
                '<div class="list-title"><a href="/details/' + book.ISBN + '">' + book.TITLE + '</a></div>' +
                '<div class="list-author">' + book.AUTHOR + '</div>' +
                '<div class="list-rating">' + (book.RATING ? book.RATING : 'No rating') + '</div>' +
                '<div>' +
                  '<img src="images/blank.gif" class="flag flag-' + book.LANGUAGE + '" alt="' + book.LANGUAGE + '" />' +
                  '<a href="/details/' + book.ISBN + '">View</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        },
        sortBooksByKey: function(key) {
            $('#allBooksGrid').html('');
            allBooks.sort(function(a, b) {
                switch (key) {
                case 'MODIFIED':
                    return (a[key] < b[key]) ? 1 : ((a[key] > b[key]) ? -1 : 0);
                case 'AUTHOR':
                    var aa =  a[key].split(' ')[a[key].split(' ').length - 1];
                    var bb =  b[key].split(' ')[b[key].split(' ').length - 1];
                    return (aa > bb) ? 1 : ((aa < bb) ? -1 : 0);
                case 'RATING':
                    a['RATING'] = (a['RATING'] === 'No rating') ? 0 : a['RATING'];
                    b['RATING'] = (b['RATING'] === 'No rating') ? 0 : b['RATING'];
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
                HomePage.sortBooksByKey('TITLE');
            });
            $('#sortByRating').bind('click', function() {
                HomePage.sortBooksByKey('RATING');
            });
            $('#sortByAuthor').bind('click', function() {
                HomePage.sortBooksByKey('AUTHOR');
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
