/**
 * A JavaScript DateTime class which reproduces and extends functionality of the native JavaScript Date object. 
 */

var DateTime = function (val) { 
    // To store backing Date object. 
    // Initialize immediately so we have the exact Date instance this DateTime object was instantiated.
    this.date = new Date();

    var d = null;

    if (val) {
        var type = typeof val;  

        if (type === 'string') {
            d = Date.parse(val);
        } else if (type === 'number') {
            d = new Date(val);
        } else if (val instanceof Date) {
            d = val;
        } else if (val instanceof DateTime) {
            d = val.date;
        }
        // Need another 'val' option to pass in a 'config' object literal. 
        // year, month, day, hour, minute, second, millisecond, locale, etc. 
    }

    if (d !== null) {
        this.date = d;
    }

    delete d;
};
       

(function () {
    // create a simple alias for the DateTime class. 
    var $ = DateTime;

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
        return new $(val);
    };    

    /** 
     * Creates a DateTime that is set to the current date. The time is set to the start of the day (00:00 or 12:00 AM).
     * @return {DateTime}    The current date.
     */
    $.today = function () {
        return new $().clearTime();
    };

    /** 
     * Creates a DateTime that is set to the current date and time. The time is set to now.
     * @return {DateTime}    The current date and time.
     */
    $.now = function () {
        return new $();
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
        if (arguments.length < 2) {
            if (arguments.length === 1) {
                if (typeof(year) === 'number') {
                    year = new $().year(year);
                }
                
                return $.daysInMonth(year.getFullYear(), year.getMonth());
            }

            return $.daysInMonth(new Date());
        }
        
        return [31, ($.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };

    var f = [],
        w = function (val) {
            return "'+" + val + "+'";
        },
        p = function (s, l) {
            // Simple string padding function.
            if (!l) {
                l = 2;
            }
            
            return ("000" + s).slice(l * -1);
        },
        ord = function (n) {
            switch (n * 1) {
                case 1: 
                case 21: 
                case 31: 
                    return "st";
                case 2: 
                case 22: 
                    return "nd";
                case 3: 
                case 23: 
                    return "rd";
                default: 
                    return "th";
                }
        },
        build = function (format) {
            var temp = format.replace(/(\\)?(do|dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g, function (m) {
                if (m.charAt(0) === "\\") {
                    return m.replace("\\", "");
                }

                switch (m) {
                    case "yyyy":
                        return w("p(d.year(), 4)");
                    case "yy":
                        return w("p(d.year())");


                    case "MMMM":
                        return "September";
                    case "MMM":
                        return "Sep";
                    case "MM":
                        return w("p(d.month())");
                    case "M":
                        return w("d.month()");


                    case "dddd":
                        return w("d.day()");
                    case "ddd":
                        return "Mon";
                    case "dd":
                        return w("p(d.day())");
                    case "d":
                        return w("d.day()");

                    case "do":
                        return w("d.day() + ord(d.day())");


                    case "HH":
                        return w("p(d.hours())");
                    case "H":
                        return w("d.hours()");
                    case "hh":
                        return w("(p(d.hours() < 13 ? (d.hours() === 0 ? 12 : d.hours()) : (d.hours() - 12)))");
                    case "h":
                        return w("(d.hours() < 13 ? (d.hours() === 0 ? 12 : d.hours()) : (d.hours() - 12))");


                    case "mm":
                        return w("p(d.minutes())");
                    case "m":
                        return w("d.minutes()");


                    case "ss":
                        return w("p(d.seconds())");
                    case "s":
                        return w("d.seconds()");


                    case "t":
                        return "am"; //d.hours() < 12 ? $C.amDesignator.substring(0, 1) : $C.pmDesignator.substring(0, 1);
                    case "tt":
                        return "AM"; //d.hours() < 12 ? $C.amDesignator : $C.pmDesignator;


                    case "S":
                        return w("ord(d.day())");
                    default: 
                        return m;
                }
            });

        eval('fn = function (d) { return \'' + temp + '\';}');

        return fn;
    };

    $.formatFn = function (format, fn) {
        if (arguments.length === 2) {
            for (var i = 0; i < f.length; i++) {
                if (f[i] === format) {
                    f[i + 1] = fn;
                    return fn;
                }

                i++;
            }

            f[f.length] = format;
            f[f.length] = fn;

            return fn;     
        } else {
            for (var i = 0; i < f.length; i++) {
                if (f[i] === format) {
                    return f[i + 1];
                }

                i++;
            }

            var fn = build(format);

            return $.formatFn(format, fn);
        }
    };  
})();