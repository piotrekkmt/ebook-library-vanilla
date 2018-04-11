/**
 * eBook Library Vanilla with jQuery Mobile
 * Upload Page
 * Author: Peter Poliwoda <contact@peterpoliwoda.me>
 * Date: 28/03/2018
*/

var UploadPage = (function() {
    'use strict';

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
                failure: function(errMsg) {
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
                    thumbnail = bookToProcess.items[0].volumeInfo.imageLinks.smallThumbnail;

                $('#title').val(bTitle);
                $('#author').val(bAuthors);
                $('#description').val(bDesc);
                $('#pages').val(bPages);
                $('#language').val(bLanguage);
                $('#rating').val(bRating);
                $('#year').val(bYear);

                $('.thumbnail-placeholder').html('<img class="book-thumbnail" src="' + thumbnail + '" />');

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
            bookObj.lang = $('#language').val() === 'en' ? 'gb' : $('#language').val();
            bookObj.rating = $('#rating').val();
            bookObj.filename = $('#ebookfiletoupload').get(0).files[0].name;
            bookObj.thumbnail = $('img.book-thumbnail').attr('src') || '';
            return bookObj;
        },
        saveEbookDataToDb: function() {
            var bookObj = UploadPage.getBookObjFromForm();
            UploadPage.saveToDb(bookObj, function(err) {
                if (err) {
                    alert('Saving ebook to db failed.');
                    console.error(err);
                }
                window.location.href = '/home';
            });
        },
        saveEbookFile: function() {
            return new Promise(function(resolve, reject) {
                var formData = new FormData();
                var bookFileGet = $('#ebookfiletoupload').get(0);
                formData.append('ebookfiletoupload', bookFileGet.files[0], bookFileGet.files[0].name);

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
                        alert('An error occurred!');
                        reject(xhr.statusText);
                    }
                };
                // Send the Data.
                xhr.send(formData);
            });
        },
        validateForm: function() {
            // TODO: Form validation
            return true;
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
                if (UploadPage.validateForm()) {
                    UploadPage.saveEbookFile().then(function() {
                        UploadPage.saveEbookDataToDb();
                    });
                } else {
                    // TODO: Show invalid form to user
                    console.error('Show invalid form error to user.');
                }
            });
        },
        init: function() {
            UploadPage.bindButtons();
        }
    };

})();
