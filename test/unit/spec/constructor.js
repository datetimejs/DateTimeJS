describe('DateTime Constructor', function() {
    var now = new Date();

    describe('DateTime.today()', function () {

        it('should be euivalent to "today"', function() {
            var d1 = DateTime.today();
            var d2 = new Date();
            
            d2.setHours(0);
            d2.setMinutes(0);
            d2.setSeconds(0);
            d2.setMilliseconds(0);

            expect(DateTime.equals(d1, d2)).toEqual(true);
        });

        it('.year() should be ' + now.getFullYear(), function() {
            var d1 = DateTime.today();

            expect(d1.year()).toEqual(now.getFullYear());
        });

        it('.month() should be ' + now.getMonth(), function() {
            var d1 = DateTime.today();

            expect(d1.month()).toEqual(now.getMonth());
        });

        it('.day() should be ' + now.getDate(), function() {
            var d1 = DateTime.today();

            expect(d1.day()).toEqual(now.getDate());
        });



        it('.hours() should be 0', function() {
            var d1 = DateTime.today();

            expect(d1.hours()).toEqual(0);
        });

        it('.minutes() should be 0', function() {
            var d1 = DateTime.today();

            expect(d1.minutes()).toEqual(0);
        });

        it('.seconds() should be 0', function() {
            var d1 = DateTime.today();

            expect(d1.seconds()).toEqual(0);
        });

        it('.milliseconds() should be 0', function() {
            var d1 = DateTime.today();

            expect(d1.milliseconds()).toEqual(0);
        });
    });

    describe('.toDate', function () {
        it('.toDate() should equal new Date()', function() {
            var d1 = new DateTime().toDate();
            var d2 = new Date();

            expect(d1.setMilliseconds(0) === d2.setMilliseconds(0)).toEqual(true);
        });

        it('.date should equal new Date()', function() {
            var d1 = new DateTime().date;
            var d2 = new Date();

            expect(d1.setMilliseconds(0) === d2.setMilliseconds(0)).toEqual(true);
        });
    });

    describe('DateTime.create()', function () {
        it('should be equivalent to calling DateTime.create()', function() {
            var dt1 = new DateTime('2001-05-30');
            var dt2 = DateTime.create('2001-05-30');
            
            expect(dt1.toString()).toEqual(dt2.toString());
        })
    });
    
    describe('with no arguments', function() {
        it('should equal "new Date()"', function() {
            var datetime = new DateTime();
            var date = new Date();
            
            expect(datetime.toString()).toEqual(date.toString());
        });
    });
    
    describe('with "2001-01-25"', function() {
        it('should equal "new Date("2001-01-25")"', function() {
            var datetime = new DateTime('2001-01-25');
            var date = new Date(2001, 0, 25);
            
            expect(datetime.toString()).toEqual(date.toString());
        });
    });
    
    describe('with "01/25/2001"', function() {
        it('should equal "new Date("01/25/2001")"', function() {
            var datetime = new DateTime('01/25/2001');
            var date = new Date('01/25/2001');
            
            expect(datetime.toString()).toEqual(date.toString());
        });
    });
});
