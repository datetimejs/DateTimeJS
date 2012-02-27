/*  Static DateTime
    -----------------------------------------------------------------------------------------------*/

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
            date1 = date1.toDate();
        }

        if (date2 instanceof $) {
            date2 = date2.toDate();
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

    /**
     * Returns the ealiest DateTime or Date object from an Array of DateTime or Date objects. 
     * The Array can contain a mix of DateTime and Date object. 
     * @param  {Array}         An Array of DateTime or Date objects
     * @return {DateTime|Date} The ealiest DateTime or Date object from the Array. 
     */ 
    $.min = function (dates) {
        return isArray(dates) ? dates.sort($.compare)[0] : null;
    };

    /**
     * Returns the latest DateTime or Date object from an Array of DateTime or Date objects. 
     * The Array can contain a mix of DateTime and Date object. 
     * @param  {Array}         An Array of DateTime or Date objects
     * @return {DateTime|Date} The latest DateTime or Date object from the Array. 
     */ 
    $.max = function (dates) {
        return isArray(dates) ? dates.sort($.compare)[dates.length -1] : null;
    };

    /**
     * Determines if a DateTime or Date object is between the given start and end DateTime or Date objects. 
     * Can contain a mix of DateTime and Date objects. 
     * @param  {DateTime|Date} The DateTime or Date to compare against the start and end values.
     * @param  {DateTime|Date} The start DateTime or Date to compare. 
     * @param  {DateTime|Date} The end DateTime or Date to compare.
     * @return {boolean}       Return true is the date is between the start and end dates, otherwise false. 
     */ 
    $.inRange = function (date, start, end) {
        return $.compare(date, start) > -1 && $.compare(date, end) < 1;
    };

    /**
     * Determins is two date ranges overlap.
     * Two Arrays of DateTime or Date objects can be passed as the first and second arguments. 
     * Can contain a mix of DateTime and Date objects. 
     * @param  {DateTime|Date|Array} The start DateTime or Date of the first range. Can also be an Array of DateTime or Date objects. 
     * @param  {DateTime|Date|Array} The end DateTime or Date of the first range. Can also be an Array of DateTime or Date objects. 
     * @param  {DateTime|Date}       The start DateTime or Date of the second range.
     * @param  {DateTime|Date}       The end DateTime or Date of the second range.
     * @return {boolean}             Return true if either date ranges overlap, otherwise returns false if they do not overlap. 
     */
    $.overlapping = function (start1, end1, start2, end2) {
        if (arguments.length === 2 && isArray(start1) && isArray(end1)) {
            return $.overlapping($.min(start1), $.max(start1), $.min(end1), $.max(end1));
        }

        return ($.inRange(start2, start1, end1) || $.inRange(end1, start2, end2));
    };

    // Courtesy of 
    // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
    var isArray = function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };
})()