(function() {
    var root = this;
    function create(htmlStr) {
        var frag = document.createDocumentFragment();
        var temp = document.createElement('div');
        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        return frag;
    }

    function defaults(obj) {
        var source;
        obj = obj || {};
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = args.length - 1; i >= 0; i--) {
            source = args[i];
            if (source) {
                for (var prop in source) {
                    // If the object does not have the property
                    if (obj[prop] === void 0) {
                        obj[prop] = source[prop];
                    }
                }
            }
        }
        return obj;
    }

    if (typeof HTMLDivElement.prototype.absoluteOffsetTop === 'undefined') {
        HTMLDivElement.prototype.absoluteOffsetTop = function () {
            var top = 0;
            var currentElement = this;

            if (typeof currentElement.getBoundingClientRect !== 'undefined') {
                top += currentElement.getBoundingClientRect().top;
            }

            top += window.pageYOffset;
            top -= document.documentElement.clientTop;

            return top;
        };
    }

    var PullToRefreshList = function PullToRefreshList(selector, opts) {
        opts = defaults(opts, {
            maxHeight: 30,
            triggerHeight: 25,
            retina: window.devicePixelRatio > 1,
            messageContent: 'Refreshing.',
            onTrigger: function() {}
        });
        this.element = undefined;
        this.currentHeight = 0;
        var htmlForReveal = create('<div class="p2r" style="height:0px;margin:0;text-align:center;overflow:hidden">' + opts.messageContent + '</div>');
        if (selector[0] === '.') {
            this.element = document.getElementsByClassName(selector.substring(1, selector.length))[0];
        } else if (selector[0] === '#') {
            this.element = document.getElementById(selector.substring(1, selector.length));
        }
        this.element.insertBefore(htmlForReveal, this.element.childNodes[0]);
        // htmlForReveal = this.element.childNodes[0];



        var offsetAtTop = this.element.absoluteOffsetTop();

        this.element.addEventListener('touchstart', function(ev) {
            ystart = Math.abs(ev.touches[0].clientY);
            if (opts.retina) {
                ystart = Math.floor(ystart / 2);
            }
            if (navigator.userAgent.match(/Android/i) && this.element.absoluteOffsetTop() === offsetAtTop) {
                return false;
            }
        }.bind(this));

        this.element.addEventListener('touchmove', function(ev) {
            var currently = Math.abs(ev.touches[0].clientY);
            if (opts.retina) {
                currently = Math.floor(currently / 2);
            }
            dy = currently - ystart;
            if (dy > 0 && this.element.absoluteOffsetTop() === offsetAtTop) {
                if (dy < opts.maxHeight) {
                    this.currentHeight = dy;
                    this.element.childNodes[0].style.height = this.currentHeight + 'px';
                }
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            } else {
                return true;
            }
        }.bind(this));

        // document.body.addEventListener('touchmove', function(ev) { return false; });

        this.element.addEventListener('touchend', function(ev) {
            document.activeElement = null;
            if (this.currentHeight >= opts.triggerHeight) {
                this.element.childNodes[0].style.height = opts.maxHeight + 'px';
                opts.onTrigger();
            } else {
                this.close();
            }
        }.bind(this));

        return this;
    };

    PullToRefreshList.prototype.close = function() {
        this.element.childNodes[0].style.height = '0px';
        this.currentHeight = 0;
    };

    // Export the PullToRefreshList object for **Node.js** or other
    // commonjs systems. Otherwise, add it as a global object to the root
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PullToRefreshList;
        }
        exports.PullToRefreshList = PullToRefreshList;
    } else {
        root.PullToRefreshList = PullToRefreshList;
    }
}).call(this);