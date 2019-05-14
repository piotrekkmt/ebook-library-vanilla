/**
 * eBook Library Vanilla with jQuery Mobile
 * Rating component
 * Author: Peter Poliwoda <contact@peterpoliwoda.me>
 * Date: 14/04/2018
*/
var Rating = (function() {
    'use strict';

    return {
        get: function(bookRating) {
            var starsObj = Rating.getStars(bookRating);
            return this.getHtmlComponent(starsObj);
        },
        getStars: function(bookRating) {
            var stars = {};

            if (bookRating) {
                stars.full = parseInt(bookRating, 10);
                stars.half = (bookRating - stars.full === 0.5) ? 1 : 0;
                stars.empty = Math.floor(5 - bookRating);
                return stars;
            } else {
                return null;
            }
        },
        getHtmlComponent: function(stars) {
            if (!stars) {
                return '<span>No rating</span>';
            } else {
                var ratingHtml = '<span class="rating-stars">';
                for (var f = 0; f < stars.full; f++) {
                    ratingHtml = ratingHtml + '<i class="fa fa-star"></i>';
                }
                if (stars.half) {
                    ratingHtml = ratingHtml + '<i class="fa fa-star-half-o" aria-hidden="true"></i>';
                }
                for (var e = 0; e < stars.empty; e++) {
                    ratingHtml = ratingHtml + '<i class="fa fa-star-o"></i>';
                }
                ratingHtml = ratingHtml + '</span>';
                return ratingHtml;
            }
        }
    };
})();
