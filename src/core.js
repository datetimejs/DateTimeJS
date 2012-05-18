/*
 *  Copyright (c) 2012, Geoffrey McGill, Inc. (http://www.datetimejs.com/). All rights reserved.
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *  
 *  See also:
 *      http://www.datetimejs.com/
 *      https://github.com/datetimejs/DateTimeJS
 */

/**
 * A JavaScript DateTime class which reproduces and extends functionality of the native JavaScript Date object. 
 */

var DateTime;

(function () {
    "use strict";

    // Contructor
    DateTime = function (val) {
        // To store backing Date object. 
        // Initialize immediately so we have the exact Date instance this DateTime object was instantiated.
        this.date = new Date();

        var d = null,
            type = typeof val,
            DATETIME_PROPERTIES,
            i = 0;

        if (arguments.length === 1) {
            if (type === 'string') {
                d = DateTime.parse(val);

                if (d !== null) {
                    d = d.date;
                }
            } else if (type === 'number') {
                d = new Date(val);
            } else if (type === 'object') {
                d = new DateTime().set(val);
            } else if (val instanceof Date) {
                d = val;
            } else if (val instanceof DateTime) {
                d = val.date;
            }
        } else if (arguments.length > 1) {
            d = DateTime.today();

            // Need to combine core.js and prototype together so
            // we can get this DATETIME_PROPERTIES from one common location. 
            // For now we're reproducing the array. 
            DATETIME_PROPERTIES = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];

            for (i; i < arguments.length; i += 1) {
                d[DATETIME_PROPERTIES[i]](arguments[i]);
            }

            d = d.date;
        }

        if (d !== null) {
            this.date = d;
        }
    };

    // create a simple alias for the DateTime class. 
    var $ = DateTime,
        isArray = function (obj) {
            // Courtesy of 
            // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        f = [],
        wrap,
        p,
        build;

    /** 
     * The release version of this DateTimeJS library. 
     */
    $.version = "2.0.0";

    /** 
     * The DateTime prototype
     */
    $.fn = DateTime.prototype;

    /** 
     * Creates a new DateTime object instance. 
     * @param  {Stirng|Number|Object|DateTime|Date} Accepts any value permitted by new DateTime constructor. 
     * @return {DateTime} The new DateTime instance.
     */
    $.create = function (val) {
        return new DateTime(val);
    };

    /** 
     * Creates a DateTime that is set to the current date. The time is set to the start of the day (00:00 or 12:00 AM).
     * @return {DateTime}    The current date.
     */
    $.today = function () {
        return new DateTime().clearTime();
    };

    /** 
     * Creates a DateTime that is set to the current date and time. The time is set to now.
     * @return {DateTime}    The current date and time.
     */
    $.now = function () {
        return new DateTime();
    };

    /** 
     * Creates a new DateTime (DateTime.today()) and moves the DateTime instance to the next 
     * instance of the DateTime as specified by the subsequent date element function 
     * (eg. .day(), .month()), month name function (eg. .january(), .jan()) or day name function (eg. .friday(), fri()).
     * Example
    <pre><code>
    DateTime.next().friday();
    DateTime.next().fri();
    DateTime.next().march();
    DateTime.next().mar();
    DateTime.next().week();
    </code></pre>
     * 
     * @return {DateTime}    date
     */
    $.next = function () {
        return $.today().next();
    };

    /** 
     * Creates a new DateTime instance (DateTime.today()) and moves the date to the previous 
     * instance of the date as specified by the subsequent date element function 
     * (eg. .day(), .month()), month name function (eg. .january(), .jan()) or day name function (eg. .friday(), fri()).
     * Example
    <pre><code>
    DateTime.last().friday();
    DateTime.last().fri();
    DateTime.previous().march();
    DateTime.prev().mar();
    DateTime.last().week();
    </code></pre>
     *  
     * @return {DateTime}    date
     */
    $.last = $.prev = $.previous = function () {
        return $.today().last();
    };

    /** 
     * Compares the first DateTime to the second DateTime and returns an number indication of their relative values.  
     * @param  {DateTime|Date}     First DateTime object to compare [Required].
     * @param  {DateTime|Date}     Second DateTime object to compare to [Required].
     * @return {Number}           -1 = date1 is lessthan date2. 0 = values are equal. 1 = date1 is greaterthan date2.
     */
    $.compare = function (date1, date2) {
        if (date1 instanceof $) {
            date1 = date1.date;
        }

        if (date2 instanceof $) {
            date2 = date2.date;
        }

        return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
    };

    /** 
     * Compares the first DateTime object to the second DateTime object and returns true if they are equal.  
     * @param  {DateTime|Date}     First DateTime object to compare [Required]
     * @param  {DateTime|Date}     Second DateTime object to compare to [Required]
     * @return {Boolean} true if dates are equal. false if they are not equal.
     */
    $.equals = function (date1, date2) {
        return $.compare(date1, date2) === 0;
    };

    /** 
     * Determines if the year provided is a LeapYear.
     * @param  {Number}  The year.
     * @return {Boolean} true if year is a LeapYear, otherwise false.
     */
    $.isLeapYear = function (year) {
        return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    };

    /**
     * Gets the number of days in the month, given a year and month value. Automatically corrects for LeapYear.
     * @param  {Number}  The year.
     * @param  {Number}  The month (0-11).
     * @return {Number}  The number of days in the month.
     */
    $.daysInMonth = function (year, month) {
        var temp = year;

        if (arguments.length < 2) {
            if (arguments.length === 1) {
                if (typeof year === 'number') {
                    temp = new DateTime().year(year);
                }

                return $.daysInMonth(year.getFullYear(), year.getMonth());
            }

            return $.daysInMonth(new Date());
        }

        return [31, ($.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };

    /**
     * Gets the day number (0-6) if given a Locale specific string which is a valid dayName, abbreviatedDayName or shortestDayName (two char).
     * @param  {String}  The name of the day (eg. "Monday, "Mon", "tuesday", "tue", "We", "we").
     * @return {Number}  The day number
     */
    $.dayNumberFromName = function (name) {
        var loc = $.locales.get(),
            n = loc.dayNames,
            m = loc.abbreviatedDayNames,
            o = loc.shortDayNames,
            s = name.toLowerCase(),
            i = 0;

        for (i; i < n.length; i += 1) {
            if (n[i].toLowerCase() === s || m[i].toLowerCase() === s || o[i].toLowerCase() === s) {
                return i;
            }
        }

        return -1;
    };

    /**
     * Gets the month number (0-11) if given a Locale specific string which is a valid monthName or abbreviatedMonthName.
     * @param  {String} The name of the month (eg. "February, "Feb", "october", "oct").
     * @return {Number} The day number
     */
    $.monthNumberFromName = function (name) {
        var loc = $.locales.get(),
            n = loc.monthNames,
            m = loc.abbreviatedMonthNames,
            s = name.toLowerCase(),
            i = 0;

        for (i; i < n.length; i += 1) {
            if (n[i].toLowerCase() === s || m[i].toLowerCase() === s) {
                return i;
            }
        }

        return -1;
    };

    f = [];
    wrap = function (val) {
        return "'+" + val + "+'";
    };
    p = function (s, l) {
        // Simple string padding function.
        if (!l) {
            l = 2;
        }

        return ("000" + s).slice(l * -1);
    };

    build = function (format) {
        var fn,
            temp = format.replace(/(\\)?(do|dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g, function (m) {
                if (m.charAt(0) === "\\") {
                    return m.replace("\\", "");
                }

                switch (m) {
                case "yyyy":
                    return wrap("p(d.year(), 4)");
                case "yy":
                    return wrap("p(d.year())");


                case "MMMM":
                    return wrap("d.locale().monthNames[d.month()]");
                case "MMM":
                    return wrap("d.locale().shortMonthNames[d.month()]");
                case "MM":
                    return wrap("p(d.month())");
                case "M":
                    return wrap("d.month()");


                case "dddd":
                    return wrap("d.locale().dayNames[d.date.getDay()]");
                case "ddd":
                    return wrap("d.locale().shortDayNames[d.date.getDay()]");
                case "dd":
                    return wrap("p(d.day())");
                case "d":
                    return wrap("d.day()");
                case "do":
                    return wrap("d.day() + d.locale().ord(d.day())");


                case "HH":
                    return wrap("p(d.hours())");
                case "H":
                    return wrap("d.hours()");
                case "hh":
                    return wrap("(p(d.hours() < 13 ? (d.hours() === 0 ? 12 : d.hours()) : (d.hours() - 12)))");
                case "h":
                    return wrap("(d.hours() < 13 ? (d.hours() === 0 ? 12 : d.hours()) : (d.hours() - 12))");


                case "mm":
                    return wrap("p(d.minutes())");
                case "m":
                    return wrap("d.minutes()");


                case "ss":
                    return wrap("p(d.seconds())");
                case "s":
                    return wrap("d.seconds()");


                case "t":
                    return wrap("(d.hours() < 12 ? d.locale().amDesignator.substring(0, 1) : d.locale().pmDesignator.substring(0, 1))");
                case "tt":
                    return wrap("(d.hours() < 12 ? d.locale().amDesignator : d.locale().pmDesignator)");


                case "S":
                    return wrap("d.locale().ord(d.day())");
                default:
                    return m;
                }
            });

        eval('fn = function (d) { return \'' + temp + '\';}');

        return fn;
    };

    $.formatFn = function (format, fn) {
        var i = 0;

        if (arguments.length === 2) {
            for (i; i < f.length; i += 1) {
                if (f[i] === format) {
                    f[i + 1] = fn;

                    return fn;
                }

                i += 1;
            }

            f.push(format);
            f.push(fn);
        } else {
            for (i; i < f.length; i += 1) {
                if (f[i] === format) {
                    return f[i + 1];
                }

                i += 1;
            }

            return $.formatFn(format, build(format));
        }

        return fn;
    };
}());