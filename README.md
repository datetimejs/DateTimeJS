# DateTimeJS

A JavaScript DateTime class which reproduces and extends functionality of the native JavaScript Date object. 

[http://www.datetimejs.com/](http://www.datetimejs.com/)

## Changelog

**2012-05-04 (geoffreymcgill)**

- Moved project to http://github.com/datetimejs/.
- Updated copyright statement.

**2012-05-03 (geoffreymcgill)**

- Import of DateJS Parser. 
- Script formatting and passing through JSLint (http://www.jslint.com)

**2012-04-16 (geoffreymcgill)**

- Reorganized prototype structure to ensure function creation was only being called once. 
- Added new highly optimized .format() function. See [performance test](http://jsperf.com/date-formatting/6/).
- Added new .min build. Can be direct linked from the following location: [https://raw.github.com/geoffreymcgill/datetimejs/master/src/datetime.min.js](https://raw.github.com/geoffreymcgill/datetimejs/master/src/datetime.min.js)
- Added Copyright statement.

**2012-02-24 (geoffreymcgill)**

- Initial commit of DateTime class proof of concept. 
- Some basic methods stubbed out for testing.
- Simple test page available at /examples/index.html