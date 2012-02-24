// Initial DateTimeJS proof of concept class. 

/**
 * A JavaScript DateTime class which reproduces and extends all functionality the native JavaScript Date object. 
 */
(function () {
    this.DateTime = function (val) {
            // To store backing Date object. 
            // Initialize immediately so we have the exact Date instance this DateTime object was instantiated.
        var _ = new Date(), 

            // A temp variable to hold our intial checks of 'val'.
            d = null,
            
            // Alias of 'this'
            $ = this,
            DATETIME_PROPERTIES = "year month day hours minutes seconds milliseconds".split(' '),
            DATE_METHODS = "FullYear Month Date Hours Minutes Seconds Milliseconds".split(' '),
            temp;

        if (val) {
            var type = typeof val;  

            if (type === 'string') {
                d = Date.parse(val);
            } else if (type === 'number') {
                d = new Date(val);
            } else if (val instanceof Date) {
                d = val;
            } else if (val instanceof DateTime) {
                d = val.toDate();
            }
            // Need another 'val' option to pass in a 'config' object literal. 
            // year, month, day, hour, minute, second, millisecond, locale, etc. 
        }

        if (d !== null) {
            _ = d;
        }

        delete d;

        // Make and fill all the DateTime properties. 
        for (var i = 0; i < DATETIME_PROPERTIES.length; i++) {
            temp = function (date, prop, method) {
                this[prop] = function () {
                    if (arguments.length === 1 && typeof arguments[0] === 'number') {
                        this.toDate()['set' + method](arguments[0]);
                        return this;
                    }

                    return date['get' + method]();
                }
            }.apply($, [_, DATETIME_PROPERTIES[i], DATE_METHODS[i]]);
        }


        /**
         * Set the value of year, month, day, hour, minute, second, millisecond of this DateTime instance using given configuration object.
         * Example
        <pre><code>
        DateTime.today().set( { day : 20, month : 1 } )

        new DateTime().set( { millisecond : 0 } )
        </code></pre>
         * 
         * @param {Object}   Configuration object containing attributes (month, day, etc.)
         * @return {DateTime}    this
         */
        $.set = function (config) {
            _.set(config);
            return $;
        }

        /**
         * Converts the value of the current DateTime object to its equivalent string representation.
         */
        $.toString = function (format, locale) {
            if (format && typeof format === 'string') {
                // TODO:    Need to enable using the locale, or
                //          just use the this.locale. 
                return _.toString(format);
            }

            return _.toString();    
        }

        /**
         * Returns the backing Date object as a Plain Old Date Object.
         * @return {Date} The Date object
         */
        $.toDate = function () {
            return _;
        }

        /**
         * Resets the time of this DateTime object to 12:00 AM (00:00), which is the start of the day.
         * @param {Boolean} .clone() this DateTime instance before clearing Time
         * @return {DateTime}   this
         */
        $.clearTime = function () {
            return $.hours(0).minutes(0).seconds(0).milliseconds(0);
        };

         /**
         * Returns a new DateTime object that is an exact date and time copy of the original instance.
         * @return {DateTime} A new DateTime instance
         */
        $.clone = function () {
            return new DateTime(this.toDate().getTime()); 
        };

        /**
         * Getter and Setter for the Locale object used within this DateTime instance. 
         * @param {key} Optional The ISO name of the Locale, such as "en-US", 
         * @return {Locale} The Locale object
         */
        $.locale = function () {
            if (arguments.length === 1) {
                _.locale = arguments[0];
                return $;
            }

            return _.locale;
        }

        /**
         * Resets the time of this DateTime object to the current time ('now').
         * @return {DateTime} this
         */
        $.setTimeToNow = function () {
            var n = new Date();
            return $.hours(n.getHours()).minutes(n.getMinutes()).seconds(n.getSeconds()).milliseconds(n.getMilliseconds());
        };
    };

    /**
     * Converts the specified string value into its DateTime equivalent using Locale specific format information.
     * @param {String}    The string value to convert into a DateTime object [Required]
     * @return {DateTime} A DateTime object or null if the string cannot be converted into a DateTime.
     */ 
    DateTime.parse = function (text) {
        return new DateTime(text);
    };

    /**
     * Converts the specified string value into its DateTime equivalent using the specified format {String} or formats {Array} and the Locale specific format information.
     * The format of the string value must match one of the supplied formats exactly.
     * @param {String}    The string value to convert into a DateTime object [Required].
     * @param {Object}    The expected format {String} or an array of expected formats {Array} of the string value to convert [Required].
     * @return {DateTime} A DateTime object or null if the string cannot be converted into a DateTime.
     */
    DateTime.parseExact = function (text, format) {
        return new DateTime(Date.parseExact(text, format));
    };

    /** 
     * Creates a DateTime that is set to the current date. The time is set to the start of the day (00:00 or 12:00 AM).
     * @return {DateTime}    The current date.
     */
    DateTime.today = function () {
        return new DateTime().clearTime();
    };

    /** 
     * Creates a DateTime that is set to the current date and time. The time is set to now.
     * @return {DateTime}    The current date and time.
     */
    DateTime.now = function () {
        return new DateTime();
    }

    /** 
     * The Locale configs
     */   
    DateTime.locales = { 'en-US' : {    
            monthNames      : "January February March April May June July August September October November December".split(' '),
            shortMonthNames : "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(' '),
            dayNames        : "Monday Tuesday Wednesday Thursday Friday Saturday Sunday".split(' '),
            shortDayNames   : "Mon Tue Wed Thu Fri Sat Sun".split(' ')
        },
        add : function (key, values) {
            this[key] = values;
        },
        remove : function (key) {
            delete this[key];
        },
        get : function (key) {
            return this[key];
        }
    };

})();