(function () {
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
})()