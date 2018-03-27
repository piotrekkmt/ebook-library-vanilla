/**
 * eBook Library Vanilla with jQuery Mobile
 * Author: Peter Poliwoda <contact@peterpoliwoda.me>
 * Date: 21/10/2017
*/

'use strict';

var ebookLibrary = (function() {

    /**
     * Ebook class.
     * @constructor
     */
    function Ebook() {
        this.allBooks = [];
    }

    Ebook.prototype.getDataFromGoogle = function(isbn, callback) {
        $.get('/api/getBookDataByIsbn/' + isbn, function(data) {
            return callback(data);
        });
    };

    Ebook.prototype.getAllBooks = function(callback) {
        $.get('/api/getBooks/', function(books) {
            return callback(books);
        });
    };

    Ebook.prototype.getBookTemplate = function(book) {
        return ` <div class="ui-block-b">
        <div class="ui-bar ui-bar-a" style=" height: 280px; background: url(` + book.THUMBNAIL
        + `); background-size: cover;">
          <div class="list-filler">&nbsp;</div>
          <div class="book-details">
            <div class="list-title"><a href="/details/` + book.ISBN + '">' + book.TITLE + `</a></div>
            <div class="list-author">` + book.AUTHOR + `</div>
            <div class="list-rating">` + (book.RATING ? book.RATING : 'No rating') + `</div>
            <div>
              <img src="images/blank.gif" class="flag flag-` + book.LANGUAGE + '" alt="' + book.LANGUAGE + `" />
              <a href="/details/` + book.ISBN + `">View</a>
            </div>
          </div>
        </div>
      </div>`;
    };

    Ebook.prototype.sortBooksByKey = function(key) {
        $('#allBooksGrid').html('');
        Ebook.allBooks.sort(function(a, b) {
            switch (key) {
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
        Ebook.prototype.loadBooksIntoView(Ebook.allBooks);
    };

    Ebook.prototype.loadBooksIntoView = function(allBooks) {
        for (var b in Ebook.allBooks) {
            var bookEntryTemplate = Ebook.prototype.getBookTemplate(allBooks[b]);
            $('#allBooksGrid').append(bookEntryTemplate);
        }
    };

    Ebook.prototype.init = function() {
        Ebook.prototype.getAllBooks(function(allBooks) {
            Ebook.allBooks = allBooks;
            Ebook.prototype.sortBooksByKey('MODIFIED');
        });
        Ebook.prototype.bindButtons();
    };

    Ebook.prototype.bindButtons = function() {
        $('#sortByTitle').bind('click', function() {
            Ebook.prototype.sortBooksByKey('TITLE');
        });
        $('#sortByRating').bind('click', function() {
            Ebook.prototype.sortBooksByKey('RATING');
        });
        $('#sortByAuthor').bind('click', function() {
            Ebook.prototype.sortBooksByKey('AUTHOR');
        });
    };

    return new Ebook();

}());

ebookLibrary.init();
