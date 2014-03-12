/* Notes:
 * - History management is currently done using window.location.hash.  This could easily be changed to use Push State instead.
 * - jQuery dependency for now. This could also be easily removed.
 */

var $ = require('jquery');
var _ = require('underscore');

module.exports = function PageSlider(container, nav) {
    var currentPage,
        stateHistory = [];

    // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
    this.slidePage = function(page, opts) {
        opts = _.defaults(opts || {}, { navBar : true });

        if (!opts.navBar) {
            $('#main-view-container, .burger-menu-container').removeClass('menu-open');
            nav.hide();
        } else {
            nav.show();
        }

        var l = stateHistory.length,
            state = window.location.hash;

        if (l === 0) {
            stateHistory.push(state);
            this.slidePageFrom(page);
            return;
        }
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            this.slidePageFrom(page, 'left');
        } else {
            stateHistory.push(state);
            this.slidePageFrom(page, 'right');
        }

    };

    // Use this function directly if you want to control the sliding direction outside PageSlider
    this.slidePageFrom = function(page, from, c) {
        c = c || container;

        c.append(page);

        if (!currentPage || !from) {
            page.attr("class", "page center");
            currentPage = page;
            return;
        }

        // Position the page at the starting position of the animation
        page.attr("class", "page " + from);

        currentPage.one('webkitTransitionEnd', function(e) {
            $(e.target).remove();
        });

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        c[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        page.attr("class", "page transition center");
        currentPage.attr("class", "page transition " + (from === "left" ? "right" : "left"));
        currentPage = page;
    };

    this.slideModal = function (modal) {
        var $body = $('body');
        modal.on('close', function () {
            modal.$el.one('webkitTransitionEnd', function (e) {
                $(e.target).remove();
                $body.css('overflow', '');
            });
            modal.$el.attr('class', 'modal transition right');
        });
        // this.slidePageFrom(modal.$el, 'right', $body);
        $body.append(modal.$el);
        modal.$el.attr('class', 'modal right');
        $body[0].offsetWidth;
        modal.$el.attr('class', 'modal transition center');
        $body.css('overflow', 'hidden');
    };
};