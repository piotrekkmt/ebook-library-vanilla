/*
 * eBook Library route controllers. Core app functionality.
 * Author: Peter Poliwoda <contact@peterpoliwoda.me>
 * Date: 28/03/2018
 * Ugly hack to solve the page reload issue
 */
$(document).bind('pageshow', function(event, data) {
    var pageId = data.toPage.attr('id');
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
    case 'EditPage':
        /* eslint-disable no-undef */
        EditPage.init();
        /* eslint-enable no-undef */
        break;
    case 'DetailsPage':
        /* eslint-disable no-undef */
        DetailsPage.init();
        /* eslint-enable no-undef */
        break;
    }
});
