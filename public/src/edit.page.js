/**
 * eBook Library Vanilla with jQuery Mobile
 * Upload Page
 * Author: Peter Poliwoda <contact@peterpoliwoda.me>
 * Date: 28/03/2018
*/

var EditPage = (function() {
    'use strict';

    return {
        getBookDataFromGoogle: function(isbn, callback) {
            $.get('/api/getbookdatabyisbn/' + isbn, function(data) {
                callback(data);
            });
        },
        saveToDb: function(bookData, callback) {
            $.ajax({
                type: 'PUT',
                url: '/api/editebook/',
                data: JSON.stringify(bookData),
                contentType: 'application/json',
                dataType: 'json',
                success: function(data) { callback(null, data); },
                error: function(xhr, errMsg) {
                    console.error('Error saving book data to db.', errMsg);
                    callback(errMsg);
                }
            });
        },
        processReceivedBookData: function(bookToProcess) {
            if (bookToProcess && bookToProcess.items && bookToProcess.items.length
                && bookToProcess.items[0].volumeInfo) {
                var volumeInfo = bookToProcess.items[0].volumeInfo;
                var bTitle = volumeInfo.title,
                    bAuthors = (volumeInfo.authors && volumeInfo.authors.length) ? volumeInfo.authors[0] : '',
                    bDesc = volumeInfo.description,
                    bPages = volumeInfo.pageCount,
                    bLanguage = volumeInfo.language,
                    bRating = volumeInfo.averageRating
                        ? volumeInfo.averageRating : 0,
                    bYear = volumeInfo.publishedDate
                        ? new Date(volumeInfo.publishedDate).getFullYear() : '',
                    thumbnail = (volumeInfo.imageLinks &&
                        volumeInfo.imageLinks.smallThumbnail)
                        ? volumeInfo.imageLinks.smallThumbnail : '';

                $('#title').val(bTitle);
                $('#author').val(bAuthors);
                $('#description').val(bDesc);
                $('#pages').val(bPages);
                $('#language').val(bLanguage);
                $('#rating').val(bRating);
                $('#year').val(bYear);

                $('#thumbnail').val(thumbnail);
                $('#thumbnail').change();
            }
        },
        getFromGoogleBooks: function() {
            var isbnToUpload = $('#uploadIsbn').val();
            if (isbnToUpload && isbnToUpload.length) {
                EditPage.getBookDataFromGoogle(isbnToUpload, function(bookDetails) {
                    EditPage.processReceivedBookData(bookDetails);
                });
            }
        },
        getBookObjFromForm: function() {
            var bookObj = {};
            bookObj._id = $('#bookId').val();
            bookObj.isbn = $('#uploadIsbn').val();
            bookObj.title = $('#title').val();
            bookObj.author = $('#author').val();
            bookObj.description = $('#description').val();
            bookObj.pages = $('#pages').val();
            bookObj.year = $('#year').val();
            bookObj.language = $('#language').val() === 'en' ? 'gb' : $('#language').val();
            bookObj.rating = $('#rating').val();
            bookObj.thumbnail = $('#thumbnail').val();
            return bookObj;
        },
        saveEbookDataToDb: function() {
            return new Promise(function(resolve, reject) {
                var bookObj = EditPage.getBookObjFromForm();
                EditPage.saveToDb(bookObj, function(err) {
                    if (err) {
                        console.error(err);
                        reject('Saving data to db failed.');
                    } else {
                        // Hide jQuery Mobile loader
                        $.mobile.loading('hide');
                        window.location.href = '/home';
                        resolve('Upload successful.');
                    }
                });
            });
        },
        validateForm: function() {
            var bookObj = EditPage.getBookObjFromForm();
            if (!(bookObj.isbn) || bookObj.isbn.length < 8 || bookObj.isbn.length > 13) {
                return 'ISBN error.';
            }
            if (!bookObj.title || bookObj.title.length < 2) {
                return 'Book needs a title longer than 1 character.';
            }
            if (!bookObj.author || bookObj.author.length < 2) {
                return 'Book needs an author longer than 2 characters.';
            }
            if (!bookObj.description || bookObj.description.length < 2) {
                return 'Book needs a description!';
            }
            if (bookObj.pages < 0) {
                return 'Pages can\'t be a negative number!';
            }
            if (bookObj.year < 0) {
                return 'Year can\'t be a negative number!';
            }
            if (bookObj.rating < 0) {
                return 'Rating can\'t be a negative number!';
            }
            if (!bookObj.language || bookObj.language.length !== 2) {
                return 'Book needs a 2 character country code!';
            }
            return false;
        },
        bindButtons: function() {
            $('#btnGetFromGoogle').bind('click', function() {
                EditPage.getFromGoogleBooks();
            });
            $('#btnSaveBook').bind('click', function(event) {
                event.preventDefault();
                var validationErr = EditPage.validateForm();
                if (!validationErr) {
                    // If valid form, show jQuery Mobile loader
                    $.mobile.loading('show', {
                        text: 'Uploading book',
                        textVisible: true,
                        theme: 'a',
                        textonly: false
                    });

                    EditPage.saveEbookDataToDb().catch(function(err) {
                        EditPage.showErrorToUser('Error while saving data to DB.', err);
                    });
                } else {
                    console.error('Show invalid form error to user.');
                    EditPage.showErrorToUser('Form validation error.', validationErr);
                }
            });
            $('#thumbnail').bind('change', function() {
                var thumbUrl = $(this).val();
                if (thumbUrl) {
                    $('.thumbnail-placeholder').html('<img class="book-thumbnail" src="' + thumbUrl + '" />');
                } else {
                    $('.thumbnail-placeholder')
                        .html('<img class="book-thumbnail" src="/images/covers/no-cover.png" />');
                }
            });
        },
        showErrorToUser: function(text, errorObj) {
            // Hide jQuery Mobile loader
            $.mobile.loading('hide');
            $('.error-field').html(text + ' ' + errorObj);
            $('.error-field').css('display', 'block');
        },
        refreshFormData: function() {
            $('#uploadIsbn').change();
            $('#title').change();
            $('#author').change();
            $('#description').change();
            $('#pages').change();
            $('#year').change();
            $('#language').change();
            $('#rating').change();
            $('#thumbnail').change();
        },
        init: function() {
            EditPage.bindButtons();
            EditPage.refreshFormData();
        }
    };

})();
