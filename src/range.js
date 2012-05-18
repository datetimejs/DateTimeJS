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

(function () {
    "use strict";

    var $ = DateTime,
        isArray = function (obj) {
            // Courtesy of 
            // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
            return Object.prototype.toString.call(obj) === '[object Array]';
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
        return isArray(dates) ? dates.sort($.compare)[dates.length - 1] : null;
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
     * Determines if two date ranges overlap.
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
}());