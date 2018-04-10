/*
 * eBook Library route controllers. Core app functionality.
 * Ugly hack to solve the page reload issue
 */
$(document).bind('pageshow', function(event, data) {
    var pageId = data.toPage.attr('id');
    console.log('loaded page', pageId);
    switch (pageId) {
    case 'HomePage':
        /* eslint-disable no-undef */
        HomePage.init();
        /* eslint-enable */
        break;
    case 'UploadPage':
        /* eslint-disable no-undef */
        UploadPage.init();
        /* eslint-enable no-undef */
        break;
    }

});
