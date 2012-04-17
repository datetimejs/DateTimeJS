/* DateTime prototype 
    ----------------------------------------------------------------------------------------------- */

(function () {
    var $ = DateTime.fn,
        DATETIME_PROPERTIES = "year month day hours minutes seconds milliseconds".split(' '),
        DATE_METHODS = "FullYear Month Date Hours Minutes Seconds Milliseconds".split(' ');

    // Make and fill all the DateTime properties. 
    for (var i = 0; i < DATETIME_PROPERTIES.length; i++) {
        temp = function (prop, method) {
            this[prop] = function () {
                if (arguments.length === 1 && typeof arguments[0] === 'number') {
                    this.date['set' + method](arguments[0]);
                    return this;
                }

                return this.date['get' + method]();
            }; 

            // Replicate basic Date 'getter' properties on DateTime
            this['get' + method] = function () {
                return $.fn[prop]();
            };
        }.apply($, [DATETIME_PROPERTIES[i], DATE_METHODS[i]]);
    }

    /**
     * Returns the backing Date object as a Plain Old Date Object.
     * @return {Date} The Date object
     */
    $.toDate = function () {
        return this.date;
    };

    /**
     * Returns a new DateTime object that is an exact date and time copy of the original instance.
     * @return {DateTime} A new DateTime instance
     */
    $.clone = function () {
        return new DateTime(this.date.getTime()); 
    };

    /**
     * Resets the time of this DateTime object to 12:00 AM (00:00), which is the start of the day.
     * @param {Boolean} .clone() this DateTime instance before clearing Time
     * @return {DateTime}   this
     */
    $.clearTime = function () {
        return this.hours(0).minutes(0).seconds(0).milliseconds(0);
    };

    /**
     * Resets the time of this DateTime object to the current time ('now').
     * @return {DateTime} this
     */
    $.resetTime = function () {
        var n = new Date();
        return this.hours(n.getHours()).minutes(n.getMinutes()).seconds(n.getSeconds()).milliseconds(n.getMilliseconds());
    };

    /**
     * Compares this instance to another DateTime or Date object and returns an number indication of their relative values.  
     * @param  {DateTime|Date} The DateTime or Date object to compare [Required]
     * @return {Number}        -1 = this is lessthan date. 0 = values are equal. 1 = this is greaterthan date.
     */
    $.compareTo = function (date) {
        return DateTime.compare(this, date);
    };

    /**
     * Compares this instance to another DateTime or Date object and returns true if they are equal.  
     * @param  {DateTime|Date} The DateTime or Date object to compare. If no date to compare, new Date() [now] is used.
     * @return {Boolean}       Retruns true if dates are equal, otherwise returns false.
     */
    $.equals = function (date) {
        return DateTime.equals(this, date || new Date());
    };

    /**
     * Determines if this instance is between a range of two dates or equal to either the start or end dates.
     * @param {DateTime|Date} Start of range [Required]
     * @param {DateTime|Date} End of range [Required]
     * @return {Boolean}      Returns true is this date is between or equal to the start and end dates, else false.
     */
    $.between = function (start, end) {
        return DateTime.inRange(this, start, end);
    };

    /**
     * Set the value of year, month, day, hour, minute, second, millisecond of this DateTime instance using given configuration object.
     * Example
    <pre><code>
    DateTime.today().set({ day : 20, month : 1 });

    new DateTime().set({ millisecond : 0 });
    </code></pre>
     * 
     * @param  {Object}   Configuration object containing DateTime properties (month, day, etc.)
     * @return {DateTime} this
     */
    $.set = function (config) {
        for (prop in config) {
            if (this[prop] && typeof(config[prop]) === 'number') {
                this[prop](config[prop]);
            }
        }

        // validate?
        // check if day is set to a date within the actual month.
        //     - .daysInMonth()
        // timezone
        // timezoneOffset
        // week

        return this;
    };

    /**
     * Converts the value of the current DateTime object to its equivalent string representation.
     */
    $.format = function (format, locale) {
        if (!format) {
            return this.date.toString();
        }

        return DateTime.formatFn(format)(this);
    };

    /**
     * Alias for .format() function. Either .format() or .toString() can be called. 
     */
    $.toString = $.format;

    /**
     * Getter and Setter for the Locale object used within this DateTime instance. 
     * @param {key} Optional The ISO name of the Locale, such as "en-US", 
     * @return {Locale} The Locale object
     */
    $.locale = function () {
        if (arguments.length === 1) {
            this.locale = arguments[0];
            return $;
        }

        return this.locale;
    };
})();