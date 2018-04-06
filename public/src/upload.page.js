/**
 * eBook Library Vanilla with jQuery Mobile
 * Upload Page
 * Author: Peter Poliwoda <contact@peterpoliwoda.me>
 * Date: 28/03/2018
*/

(function() {
    'use strict';

    var UploadPage = {
        getBookDataFromGoogle: function(isbn, callback) {
            $.get('/api/getBookDataByIsbn/' + isbn, function(data) {
                return callback(data);
            });
        },
        processReceivedBookData: function(bookToProcess) {
            console.log('bookToProcessFromGoogle', bookToProcess);

            if (bookToProcess && bookToProcess.items && bookToProcess.items.length
                && bookToProcess.items[0].volumeInfo) {
                var bTitle = bookToProcess.items[0].volumeInfo.title;
                var bAuthors = bookToProcess.items[0].volumeInfo.authors[0];
                var bDesc = bookToProcess.items[0].volumeInfo.description;
                var bPages = bookToProcess.items[0].volumeInfo.pageCount;
                var bLanguage = bookToProcess.items[0].volumeInfo.language;
                var bRating = bookToProcess.items[0].volumeInfo.averageRating
                    ? bookToProcess.items[0].volumeInfo.averageRating : 0;

                var bYear = bookToProcess.items[0].volumeInfo.publishedDate
                    ? new Date(bookToProcess.items[0].volumeInfo.publishedDate).getFullYear() : '';
                var thumbnail = bookToProcess.items[0].volumeInfo.imageLinks.smallThumbnail;

                $('#title').val(bTitle);
                $('#author').val(bAuthors);
                $('#description').val(bDesc);
                $('#pages').val(bPages);
                $('#language').val(bLanguage);
                $('#rating').val(bRating);
                $('#year').val(bYear);

                $('.thumbnail-placeholder').html('<img class="book-thumbnail" src="' + thumbnail + '" />');
            }
        },
        getIsbnNoFromFileName: function() {
            $('#ebookFileToUpload').bind('change', function() {
                var bookFileName = $(this).val();
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
            });
        },
        bindGetFromGoogleButton: function() {
            $('#btnGetFromGoogle').bind('click', function() {
                var isbnToUpload = $('#uploadIsbn').val();
                if (isbnToUpload && isbnToUpload.length) {
                    UploadPage.getBookDataFromGoogle(isbnToUpload, function(bookDetails) {
                        UploadPage.processReceivedBookData(bookDetails);
                    });
                }
            });
        },
        init: function() {
            UploadPage.getIsbnNoFromFileName();
            UploadPage.bindGetFromGoogleButton();
        }
    };
    UploadPage.bindButtons = function() {
        // $('#getIsbnData').bind('click', function() {
        //     var isbnNo = $('#getIsbnData').value;
        //     UploadPage.getBookDataFromGoogle(isbnNo, function(bookDetails) {
        //         UploadPage.processReceivedBookData(bookDetails);
        //     });
        // });
        // $('#saveBookToDb').bind('click', function() {
        //      UploadPage.saveBookToDb('RATING');
        // });
    };


    UploadPage.init();

})();
