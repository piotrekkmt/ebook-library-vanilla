/**
 * eBook Library Vanilla with jQuery Mobile
 * Details Page
 * Author: Peter Poliwoda <contact@peterpoliwoda.me>
 * Date: 14/04/2018
*/
var DetailsPage = (function() {
    'use strict';

    return {
        setRating: function() {
            var ratingNumber = $('#bookrating').html();
            var ratingEl = Rating.get(ratingNumber); // eslint-disable-line
            $('#bookrating').html(ratingEl);
        },
        init: function() {
            DetailsPage.setRating();
        }
    };
})();
