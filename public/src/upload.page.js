/**
 * eBook Library Vanilla with jQuery Mobile
 * Upload Page
 * Author: Peter Poliwoda <contact@peterpoliwoda.me>
 * Date: 28/03/2018
*/

var UploadPage = (function() {
    'use strict';

    var ebookFilename = '';

    return {
        getBookDataFromGoogle: function(isbn, callback) {
            $.get('/api/getbookdatabyisbn/' + isbn, function(data) {
                callback(data);
            });
        },
        saveToDb: function(bookData, callback) {
            $.ajax({
                type: 'POST',
                url: '/api/saveebook/',
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

                var bTitle = bookToProcess.items[0].volumeInfo.title,
                    bAuthors = bookToProcess.items[0].volumeInfo.authors[0],
                    bDesc = bookToProcess.items[0].volumeInfo.description,
                    bPages = bookToProcess.items[0].volumeInfo.pageCount,
                    bLanguage = bookToProcess.items[0].volumeInfo.language,
                    bRating = bookToProcess.items[0].volumeInfo.averageRating
                        ? bookToProcess.items[0].volumeInfo.averageRating : 0,
                    bYear = bookToProcess.items[0].volumeInfo.publishedDate
                        ? new Date(bookToProcess.items[0].volumeInfo.publishedDate).getFullYear() : '',
                    thumbnail = (bookToProcess.items[0].volumeInfo.imageLinks &&
                        bookToProcess.items[0].volumeInfo.imageLinks.smallThumbnail)
                        ? bookToProcess.items[0].volumeInfo.imageLinks.smallThumbnail : '';

                $('#title').val(bTitle);
                $('#author').val(bAuthors);
                $('#description').val(bDesc);
                $('#pages').val(bPages);
                $('#language').val(bLanguage);
                $('#rating').val(bRating);
                $('#year').val(bYear);

                $('#thumbnail').val(thumbnail);
                $('#thumbnail').change();

                // TODO: Get a book thumbnail colour.

                // Fix Cross Origin Canvas crap. Should work with local images.
                // // eslint-disable-next-line
                // var colorThief = new ColorThief();
                // $('img').one('load', function() {
                //     var thumbnailImage = $('img.book-thumbnail').get(0);
                //     var thumbnailColor = colorThief.getColor(thumbnailImage);
                //     console.log('thumbnailColor from thief', thumbnailColor);
                //     $('.upload-container').css('background-color', thumbnailColor);
                // });
            }
        },
        getIsbnNoFromFileName: function() {
            var bookFileName = $('#ebookfiletoupload').val();
            var isbnRegex = RegExp('_[0-9]{10,13}_');

            if (bookFileName && isbnRegex.test(bookFileName)) {
                var isbnNumberFromFile = bookFileName.split('_')[1];
                $('#uploadIsbn').val(isbnNumberFromFile);
                UploadPage.getBookDataFromGoogle(isbnNumberFromFile, function(bookDetails) {
                    UploadPage.processReceivedBookData(bookDetails);
                });
            } else {
                $('div.thumbnail-placeholder').html('Invalid filename. Insert ISBN manually.');
            }
        },
        getFromGoogleBooks: function() {
            var isbnToUpload = $('#uploadIsbn').val();
            if (isbnToUpload && isbnToUpload.length) {
                UploadPage.getBookDataFromGoogle(isbnToUpload, function(bookDetails) {
                    UploadPage.processReceivedBookData(bookDetails);
                });
            }
        },
        getBookObjFromForm: function() {
            var bookObj = {};
            bookObj.isbn = $('#uploadIsbn').val();
            bookObj.title = $('#title').val();
            bookObj.author = $('#author').val();
            bookObj.description = $('#description').val();
            bookObj.pages = $('#pages').val();
            bookObj.year = $('#year').val();
            bookObj.language = $('#language').val() === 'en' ? 'gb' : $('#language').val();
            bookObj.rating = $('#rating').val();
            bookObj.filename = ebookFilename;
            bookObj.thumbnail = $('#thumbnail').val();
            return bookObj;
        },
        saveEbookDataToDb: function() {
            return new Promise(function(resolve, reject) {
                var bookObj = UploadPage.getBookObjFromForm();
                UploadPage.saveToDb(bookObj, function(err) {
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
        saveEbookFile: function() {
            return new Promise(function(resolve, reject) {
                var formData = new FormData();
                var bookFileGet = $('#ebookfiletoupload').get(0);
                if (bookFileGet && bookFileGet.files && bookFileGet.files[0] && bookFileGet.files[0].name) {
                    ebookFilename = bookFileGet.files[0].name;
                    formData.append('ebookfiletoupload', bookFileGet.files[0], ebookFilename);

                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/upload', true);
                    // Set up a handler for when the request finishes.
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            // File(s) uploaded successfully.
                            $('#ebookfiletoupload').remove();
                            $('.thumbnail-detail').append('<p style="color: green;"> File uploaded successfully</p>');
                            resolve('File uploaded.');
                        } else {
                            console.error('Upload error occured');
                            console.error(xhr.status, xhr.statusText);
                            reject(xhr.statusText);
                        }
                    };
                    xhr.send(formData);
                } else {
                    reject('No file selected, or filename error.');
                }
            });
        },
        validateForm: function() {
            var bookObj = UploadPage.getBookObjFromForm();
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
            if (!bookObj.language || bookObj.lang.length !== 2) {
                return 'Book needs a 2 character country code!';
            }
            if (bookObj.filename && bookObj.length < 5) {
                return 'Filename length shorter than 5 chars.';
            }
            return false;
        },
        bindButtons: function() {
            $('#ebookfiletoupload').bind('change', function() {
                UploadPage.getIsbnNoFromFileName();
            });
            $('#btnGetFromGoogle').bind('click', function() {
                UploadPage.getFromGoogleBooks();
            });
            $('#btnSaveBook').bind('click', function(event) {
                event.preventDefault();
                var validationErr = UploadPage.validateForm();
                if (!validationErr) {
                    // If valid form, show jQuery Mobile loader
                    $.mobile.loading('show', {
                        text: 'Uploading book',
                        textVisible: true,
                        theme: 'a',
                        textonly: false
                    });

                    UploadPage.saveEbookFile().then(function() {
                        UploadPage.saveEbookDataToDb().catch(function(err) {
                            UploadPage.showErrorToUser('Error while saving data to DB.', err);
                        });
                    }).catch(function(err) {
                        UploadPage.showErrorToUser('File save error.', err);
                    });
                } else {
                    console.error('Show invalid form error to user.');
                    UploadPage.showErrorToUser('Form validation error.', validationErr);
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
        init: function() {
            UploadPage.bindButtons();
        }
    };

})();
