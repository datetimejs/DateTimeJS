===========================
        DateTimeJS
===========================

 A JavaScript DateTime class which reproduces and extends functionality of the native JavaScript Date object. 


===========================
        CHANGELOG
===========================

2012-05-16 (geoffreymcgill)
    Reorganized prototype structure to ensure function creation was only
    being called once. 

    Added new highly optimized .format() function. 
        See performance test at http://jsperf.com/date-formatting/6/

    Added new .min build. Can be direct linked from the following location:
        https://raw.github.com/geoffreymcgill/datetimejs/master/src/datetime.min.js


2012-02-24 (geoffreymcgill)
    Initial commit of DateTime class proof of concept. 
    Some basic methods stubbed out for testing.

    Simple test page available at /examples/index.html