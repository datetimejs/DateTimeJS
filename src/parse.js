(function () {
    var $ = DateTime;

    /**
     * Converts the specified string value into its DateTime equivalent using Locale specific format information.
     * @param  {String}   The string value to convert into a DateTime object [Required]
     * @return {DateTime} A DateTime object or null if the string cannot be converted into a DateTime.
     */ 
    $.parse = function (text) {
        return new $(text);
    };

    /**
     * Converts the specified string value into its DateTime equivalent using the specified format {String} or formats {Array} and the Locale specific format information.
     * The format of the string value must match one of the supplied formats exactly.
     * @param  {String}   The string value to convert into a DateTime object [Required].
     * @param  {Object}   The expected format {String} or an array of expected formats {Array} of the string value to convert [Required].
     * @return {DateTime} A DateTime object or null if the string cannot be converted into a DateTime.
     */
    $.parseExact = function (text, format) {
        return new $(Date.parseExact(text, format));
    };
})()