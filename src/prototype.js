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

/* DateTime prototype 
    ----------------------------------------------------------------------------------------------- */

(function () {
    "use strict";

    var $ = DateTime,
        $$ = $.fn,

        // Do NOT modify the following string tokens. These tokens are used to build dynamic functions.
        // All Locale specific strings can be found in the Locale files. See /trunk/src/locale/.
        DATETIME_PROPERTIES = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'],
        DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        DATE_METHODS = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds', 'Milliseconds'],
        NTH = ['final', 'first', 'second', 'third', 'fourth', 'fifth'],

        _locale = null,
        _orient = null,
        _isSecond = false,
        _is = false,
        _same = false,
        _nth,
        _ss = function () {
            //ef("Second"),
        },
        temp,
        i = 0;

    // Make all the DateTime property functions. 
    for (; i < DATETIME_PROPERTIES.length; i += 1) {
        temp = function (prop, method) {
            this[prop + 's'] = this[prop] = function (val) {
                var config,
                    o1,
                    o2,
                    v,
                    k,
                    j = 0;

                if (arguments.length === 1 && typeof val === 'number') {
                    this.date['set' + method](val);

                    return this;
                }

                if (typeof _orient === 'number') {
                    config = {};
                    config[prop] = _orient;

                    _orient = null;

                    return this.add(config);
                }

                // if the .second() function was called earlier, the _orient 
                // has alread been added. Just return this and reset _isSecond.
                if (_isSecond === true) {
                    _isSecond = false;

                    return this;
                }

                if (_same === true) {
                    _same = _is = false;

                    o1 = this.toConfig();
                    o2 = (val || new DateTime()).toConfig();
                    v = '';
                    k = prop;

                    for (j; j < DATETIME_PROPERTIES.length; j += 1) {
                        v = DATETIME_PROPERTIES[j].toLowerCase();

                        if (o1[v] !== o2[v]) {
                            return false;
                        }

                        if (k === v) {
                            break;
                        }
                    }

                    return true;
                }


                return this.date['get' + method]();
            };

            // Replicate native JavaScript Date 'getter' & 'setter' methods
            this['get' + method] = function () {
                return this[prop]();
            };

            this['set' + method] = function (val) {
                return this[prop](val);
            };

        }.apply($$, [DATETIME_PROPERTIES[i], DATE_METHODS[i]]);
    }

    
    for (i = 0; i < NTH.length; i += 1) {
        temp = function (name, index) {
            this[name] = function (val) {
                var dayOfWeek,
                    _nth;

                if (_same) {
                    return _ss(val);
                }

                if (dayOfWeek || dayOfWeek === 0) {
                    return this.moveToNthOccurrence(dayOfWeek, index);
                }

                _nth = index;

                // if the operator is 'second' add the _orient, then deal with it later...
                if (index === 2 && (dayOfWeek === undefined || dayOfWeek === null)) {
                    _isSecond = true;

                    return this.add(_orient).seconds();
                }

                return this;
            };
        }.apply($$, [NTH[i], i]);
    }
    
    for (i = 0; i < DAY_NAMES.length; i += 1) {
        temp = function (name, index) {
            this[name] = this[name.substring(0, 3)] = function () {
                var t = $.today(),
                    shift = index - t.dow();

                if (t.locale().firstDayOfWeek === 1 && t.dow() !== 0) {
                    shift = shift + 7;
                }

                return t.add(shift).days();
            };

            this.fn[name] = this.fn[name.substring(0, 3)] = function () {
                var ntemp,
                    temp;

                if (_is === true) {
                    _is = false;

                    return this.dow() === index;
                }

                if (_nth !== null) {
                    // If the .second() function was called earlier, remove the _orient 
                    // from the date, and then continue.
                    // This is required because 'second' can be used in two different context.
                    // 
                    // Example
                    //
                    //   DateTime.today().add(1).second();
                    //   DateTime.march().second().monday();
                    // 
                    // Things get crazy with the following...
                    //   DateTime.march().add(1).second().second().monday(); // but it works!!
                    //  
                    if (_isSecond) {
                        this.add(_orient * -1).seconds();
                    }

                    // make sure we reset _isSecond
                    _isSecond = false;

                    ntemp = _nth;
                    _nth = null;

                    temp = this.clone().moveToLastDayOfMonth();

                    this.moveToNthOccurrence(index, ntemp);

                    if (this > temp) {
                        throw new RangeError($.getDayName(index) + " does not occur " + ntemp + " times in the month of " + $.getMonthName(temp.month()) + " " + temp.year() + ".");
                    }

                    return this;
                }

                return this.moveToDayOfWeek(index, _orient);
            };


        }.apply($, [DAY_NAMES[i], i]);
    }

    for (i = 0; i < MONTH_NAMES.length; i += 1) {
        temp = function (name, index) {
            this[name] = this[name.substring(0, 3)] = function () {
                return this.today().set({ month : index, day : 1 });
            };
        }.apply($, [MONTH_NAMES[i], i]);

        temp = function (name, index) {
            this.fn[name] = this.fn[name.substring(0, 3)] = function () {
                if (_is) {
                    _is = false;

                    return this.month(index);
                }

                return this.moveToMonth(index, _orient);
            };

        }.apply($, [MONTH_NAMES[i], i]);
    }

    /**
     * Returns the backing Date object as a Plain Old Date Object.
     * @return {DateTime} The Date object
     */
    $$.toDate = function () {
        return this.date;
    };

    /**
     * Returns the day of week number. Sunday = 0, Saturday = 6.
     * @return {number} The day of week.
     */
    $$.dow = function () {
        return this.date.getDay();
    };

    /**
     * Get the Ordinal day (numeric day number) of the year, adjusted for leap year.
     * @return {Number} 1 through 365 (366 in leap years)
     */
    $$.doy = function () {
        return Math.ceil((this.clone().clearTime() - new DateTime(this.year(), 0, 1)) / 86400000) + 1;
    };

    /** 
     * Returns an object literal of all the datetime properties.
     * Example
    <pre><code>
        var o = new DateTime().toConfig();
        
        // { year: 2008, month: 4, week: 20, day: 13, hour: 18, minute: 9, second: 32, millisecond: 812 }
        
        // The object properties can be referenced directly from the object.
        
        alert(o.day);  // alerts '13'
        alert(o.year); // alerts '2008'
    </code></pre>
     *  
     * @return {DateTime} An object literal representing the original DateTime object.
     */
    $$.toConfig = function () {
        var obj = {},
            i = 0;

        for (; i < DATETIME_PROPERTIES.length; i += 1) {
            obj[DATETIME_PROPERTIES[i].toLowerCase()] = this[DATETIME_PROPERTIES[i]]();
        }

        return obj;
    };

    /** 
     * Moves the DateTime to the next instance of a date as specified by the subsequent date element function 
     * (eg. .day(), .month()), month name function (eg. .january(), .jan()) or day name function (eg. .friday(), fri()).
     * Example
    <pre><code>
    DateTime.today().next().friday();
    DateTime.today().next().fri();
    DateTime.today().next().march();
    DateTime.today().next().mar();
    DateTime.today().next().week();
    </code></pre>
     * 
     * @return {DateTime} The DateTime instance
     */
    $$.next = function () {
        _orient = +1;

        return this;
    };


    /** 
     * Moves the DateTime instance to the previous instance as specified by the subsequent 
     * date element function (eg. .day(), .month()), month name function 
     * (eg. .january(), .jan()) or day name function (eg. .friday(), fri()).
     * Example
    <pre><code>
    DateTime.today().last().friday();
    DateTime.today().last().fri();
    DateTime.today().last().march();
    DateTime.today().last().mar();
    DateTime.today().last().week();
    </code></pre>
     *  
     * @return {DateTime}    date
     */
    $$.last = $$.prev = $$.previous = function () {
        _orient = -1;

        return this;
    };

    /** 
     * Performs a equality check when followed by either a month name, day name or .weekday() function.
     * Example
    <pre><code>
    DateTime.today().is().friday(); // true|false
    DateTime.today().is().fri();
    DateTime.today().is().march();
    DateTime.today().is().mar();
    </code></pre>
     *  
     * @return {Boolean}    true|false
     */
    $$.is = function () {
        _is = true;

        return this;
    };

    /** 
     * Determines if two DateTime objects occur on/in exactly the same instance of the subsequent date part function.
     * The function .same() must be followed by a date part function (example: .day(), .month(), .year(), etc).
     *
     * An optional DateTime can be passed in the date part function. If now date is passed as a parameter, 'now' is used. 
     *
     * The following example demonstrates how to determine if two dates fall on the exact same day.
     *
     * Example
    <pre><code>
    var d1 = DateTime.today(); // today at 00:00
    var d2 = new Date();   // exactly now.

    // Do they occur on the same day?
    d1.same().day(d2); // true
    
     // Do they occur on the same hour?
    d1.same().hour(d2); // false, unless d2 hour is '00' (midnight).
    
    // What if it's the same day, but one year apart?
    var nextYear = todayTime.Date().add(1).year();

    d1.same().day(nextYear); // false, because the dates must occur on the exact same day. 
    </code></pre>
     *
     * Scenario: Determine if a given date occurs during some week period 2 months from now. 
     *
     * Example
    <pre><code>
    var future = DateTime.today().add(2).months();
    return someDateTime.same().week(future); // true|false;
    </code></pre>
     *  
     * @return {Boolean}    true|false
     */
    $$.same = function () {
        _same = true;
        _isSecond = false;

        return this;
    };

    /** 
     * Determines if the current DateTime instance occurs during Today. 
     * Must be preceded by the .is() function.
     * Example
    <pre><code>
    x.is().today();    // true|false
    new DateTime().is().today();  // true
    DateTime.today().is().today();// true
    DateTime.today().add(-1).day().is().today(); // false
    </code></pre>
     *  
     * @return {Boolean}    true|false
     */
    $$.today = function () {
        if (_is === true) {
            _is = false;

            return $.equals(this.clone().clearTime(), DateTime.today());
        }

        return DateTime.today();
    };

    /** 
     * Sets the Time of the current DateTime instance. 
     * A string '6:15 pm' or config object { hour : 18, minute : 15 } are accepted.
     * Example
    <pre><code>
    // Set time to 6:15pm with a String
    DateTime.today().at('6:15pm');

    // Set time to 6:15pm with a config object
    DateTime.today().at({ hour : 18, minute : 15 });
    </code></pre>
     *  
     * @return {DateTime} datetime
     */
    $$.at = function (time) {
        return (typeof time === 'string') ? $.parse(this.format('yyyy-MM-dd ') + time) : this.set(time);
    };


    /** 
     * Determines if the current date is a weekday. This function must be preceded by the .is() function.
     * Example
    <pre><code>
    DateTime.today().is().weekday(); // true|false
    </code></pre>
     *  
     * @return {Boolean} true|false
     */
    $$.weekday = function () {
        if (_is) {
            _is = false;

            var dow = this.dow();

            return (dow !== 0 && dow !== 6);
        }

        return false;
    };

    /**
     * Returns a new DateTime object that is an exact date and time copy of the original instance.
     * @return {DateTime} A new DateTime instance
     */
    $$.clone = function () {
        return new DateTime(this.date.getTime());
    };

    /**
     * Resets the time of this DateTime object to 12:00 AM (00:00), which is the start of the day.
     * @param {Boolean} .clone() this DateTime instance before clearing Time
     * @return {DateTime}   this
     */
    $$.clearTime = function () {
        return this.hours(0).minutes(0).seconds(0).milliseconds(0);
    };

    /**
     * Resets the time of this DateTime object to the current time ('now').
     * @return {DateTime} this
     */
    $$.resetTime = function () {
        var n = new Date();
        return this.hours(n.getHours()).minutes(n.getMinutes()).seconds(n.getSeconds()).milliseconds(n.getMilliseconds());
    };

    /**
     * Compares this instance to another DateTime or Date object and returns an number indication of their relative values.  
     * @param  {DateTime|Date} The DateTime or Date object to compare [Required]
     * @return {Number}        -1 = this is lessthan date. 0 = values are equal. 1 = this is greaterthan date.
     */
    $$.compareTo = function (date) {
        return DateTime.compare(this, date);
    };

    /**
     * Compares this instance to another DateTime or Date object and returns true if they are equal.  
     * @param  {DateTime|Date} The DateTime or Date object to compare. If no date to compare, new Date() [now] is used.
     * @return {Boolean}       Retruns true if dates are equal, otherwise returns false.
     */
    $$.equals = function (date) {
        return DateTime.equals(this, date || new Date());
    };

    /**
     * Determines if this instance is between a range of two dates or equal to either the start or end dates.
     * @param {DateTime|Date} Start of range [Required]
     * @param {DateTime|Date} End of range [Required]
     * @return {Boolean}      Returns true is this date is between or equal to the start and end dates, else false.
     */
    $$.between = function (start, end) {
        return DateTime.inRange(this, start, end);
    };

    /**
     * Determines if this DateTime instance occurs after the DateTime to compare to.
     * @param {Date}     Date object to compare. If no DateTime to compare, new DateTime() ("now") is used.
     * @return {Boolean} true if this DateTime instance is greater than the DateTime to compare to (or "now"), otherwise false.
     */
    $$.isAfter = function (val) {
        return this.compareTo(val || new DateTime()) === 1;
    };

    /**
     * Determines if this DateTime instance occurs before the DateTime to compare to.
     * @param  {DateTime} Date object to compare. If no DateTime to compare, new DateTime() ("now") is used.
     * @return {Boolean}  true if this DateTime instance is less than the DateTime to compare to (or "now").
     */
    $$.isBefore = function (val) {
        return (this.compareTo(val || new DateTime()) === -1);
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
    $$.set = function (config) {
        var prop;

        for (prop in config) {
            if (this[prop] && prop.substring(prop.length - 1) !== 's' && typeof config[prop] === 'number') {
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

    $$.add = function (config) {
        var prop;

        if (typeof config === 'number') {
            _orient = config;

            return this;
        }

        for (prop in config) {
            if (this[prop] && typeof config[prop] === 'number') {
                this[prop](this[prop]() + config[prop]);
            }
        }

        return this;
    };

    /**
     * Get the week number. Week one (1) is the week which contains the first Thursday of the year. Monday is considered the first day of the week.
     * This algorithm is a JavaScript port of the work presented by Claus Tøndering at http://www.tondering.dk/claus/cal/node8.html#SECTION00880000000000000000
     * .getWeek() Algorithm Copyright (c) 2008 Claus Tondering.
     * The .getWeek() function does NOT convert the date to UTC. The local datetime is used. Please use .getISOWeek() to get the week of the UTC converted date.
     * @return {Number}  1 to 53
     */
    $$.weeks = $$.week = function (val) {
        if (arguments.length === 1 && typeof val === 'number') {
            return this.add(val * 7).days();
        }

        if (typeof _orient === 'number') {
            var config = {  week : _orient * 1 };

            _orient = null;

            return this.add(config);
        }
        
        var a, b, c, d, e, f, g, n, s, w, $y, $m, $d;

        $y = (!$y) ? this.year() : $y;
        $m = (!$m) ? this.month() + 1 : $m;
        $d = (!$d) ? this.day() : $d;

        if ($m <= 2) {
            a = $y - 1;
            b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
            c = ((a - 1) / 4 | 0) - ((a - 1) / 100 | 0) + ((a - 1) / 400 | 0);
            s = b - c;
            e = 0;
            f = $d - 1 + (31 * ($m - 1));
        } else {
            a = $y;
            b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
            c = ((a - 1) / 4 | 0) - ((a - 1) / 100 | 0) + ((a - 1) / 400 | 0);
            s = b - c;
            e = s + 1;
            f = $d + ((153 * ($m - 3) + 2) / 5) + 58 + s;
        }

        g = (a + b) % 7;
        d = (f + g - e) % 7;
        n = (f + 3 - d) | 0;

        if (n < 0) {
            w = 53 - ((g - s) / 5 | 0);
        } else if (n > 364 + s) {
            w = 1;
        } else {
            w = (n / 7 | 0) + 1;
        }

        $y = $m = $d = null;

        return w;
    };

    /**
     * Moves the DateTime to the next n'th occurrence of the dayOfWeek starting from the beginning of the month. 
     * The number (-1) is a magic number and will return the last occurrence of the dayOfWeek in the month.
     * @param {Number}   The dayOfWeek to move to
     * @param {Number}   The n'th occurrence to move to. Use (-1) to return the last occurrence in the month
     * @return {DateTime} this
     */
    $$.moveToNthOccurrence = function (dayOfWeek, occurrence) {
        var shift = 0;

        if (occurrence > 0) {
            shift = occurrence - 1;
        } else if (occurrence === -1) {
            this.moveToLastDayOfMonth();

            if (this.dow() !== dayOfWeek) {
                this.moveToDayOfWeek(dayOfWeek, -1);
            }

            return this;
        }

        return this.moveToFirstDayOfMonth().add(-1).days().moveToDayOfWeek(dayOfWeek, +1).add(shift).weeks();
    };

    /**
     * Moves the DateTime to the first day of the month.
     * @return {Date}    this
     */
    $$.moveToFirstDayOfMonth = function () {
        return this.set({ day : 1 });
    };

    /**
     * Moves the DateTime to the last day of the month.
     * @return {DateTime}    this
     */
    $$.moveToLastDayOfMonth = function () {
        return this.set({ day : $.daysInMonth(this.year(), this.month())});
    };

    /**
     * Move to the next or last dayOfWeek based on the orient value.
     * @param {Number}    The dayOfWeek to move to
     * @param {Number}    Forward (+1) or Back (-1). Defaults to +1. [Optional]
     * @return {DateTime} this
     */
    $$.moveToDayOfWeek = function (dayOfWeek, orient) {
        var diff = (dayOfWeek - this.dow() + 7 * (orient || +1)) % 7;

        return this.add((diff === 0) ? diff += 7 * (orient || +1) : diff).days();
    };

    /**
     * Move to the next or last month based on the orient value.
     * @param {Number}   The month to move to. 0 = January, 11 = December
     * @param {Number}   Forward (+1) or Back (-1). Defaults to +1. [Optional]
     * @return {Date}    this
     */
    $$.moveToMonth = function (month, orient) {
        var diff = (month - this.month() + 12 * (orient || +1)) % 12;

        return this.add((diff === 0) ? diff += 12 * (orient || +1) : diff).months();
    };

    /**
     * Indicates whether Daylight Saving Time is observed in the current time zone.
     * @return {Boolean} true|false
     */
    $$.hasDaylightSavingTime = function () {
        return (DateTime.today().set({month : 0, day : 1}).getTimezoneOffset() !== DateTime.today().set({month : 6, day : 1}).getTimezoneOffset());
    };

    /**
     * Indicates whether this Date instance is within the Daylight Saving Time range for the current time zone.
     * @return {Boolean} true|false
     */
    $$.isDaylightSavingTime = function () {
        return DateTime.today().set({month : 0, day : 1}).getTimezoneOffset() !== this.getTimezoneOffset();
    };

    /**
     * Get the time zone abbreviation of the current date.
     * @return {String} The abbreviated time zone name (e.g. "EST")
     */
    $$.getTimezone = function () {
        return $.getTimezoneAbbreviation(this.getUTCOffset());
    };

    $$.setTimezoneOffset = function (offset) {
        var here = this.getTimezoneOffset(),
            there = Number(offset) * -6 / 10;

        return this.addMinutes(there - here);
    };

    $$.setTimezone = function (offset) {
        return this.setTimezoneOffset($.getTimezoneOffset(offset));
    };

    /**
     * Get the offset from UTC of the current DateTime.
     * @return {String} The 4-character offset string prefixed with + or - (e.g. "-0500")
     */
    $$.getUTCOffset = function () {
        var n = this.getTimezoneOffset() * -10 / 6,
            r;

        if (n < 0) {
            r = (n - 10000).toString();

            r = r.charAt(0) + r.substr(2);
        } else {
            r = (n + 10000).toString();

            r = '+' + r.substr(1);
        }

        return r;
    };

    /**
     * Returns the number of milliseconds between this date and date.
     * @param {DateTime} Defaults to now
     * @return {Number} The diff in milliseconds
     */
    $$.getElapsed = function (datetime) {
        return (datetime || new DateTime()) - this;
    };

    /**
     * Converts the current date instance into a string with an ISO 8601 format. The date is converted to it's UTC value.
     * @return {String}  ISO 8601 string of date
     */
    $$.toISOString = function () {
        // From http://www.json.org/json.js. Public Domain. 
        function f(n) {
            return n < 10 ? '0' + n : n;
        }

        var d = this.date;

        return '"' + d.getUTCFullYear()   + '-' +
            f(d.getUTCMonth() + 1) + '-' +
            f(d.getUTCDate())      + 'T' +
            f(d.getUTCHours())     + ':' +
            f(d.getUTCMinutes())   + ':' +
            f(d.getUTCSeconds())   + 'Z"';
    };

    /**
     * Converts the value of the current DateTime object to its equivalent string representation.
     */
    $$.format = function (format, locale) {
        if (!format) {
            return this.date.toString();
        }

        return DateTime.formatFn(format)(this);
    };

    /**
     * Alias for .format() function. Either .format() or .toString() can be called. 
     */
    $$.toString = $$.format;

    /**
     * Getter and Setter for the Locale object used within this DateTime instance. 
     * @param {key} Optional The ISO name of the Locale, such as 'en-US',
     * @return {Locale} The Locale object
     */
    $$.locale = function (locale) {
        if (arguments.length < 1) {
            if (_locale === null) {
                _locale = DateTime.locales.get();
            }

            return _locale;
        }

        _locale = DateTime.locales.add(locale);

        return _locale;
    };
}());