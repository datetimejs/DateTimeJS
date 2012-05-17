describe('DateTime Static Functions', function() {
    describe('.equals()', function () {
        it('DateTime objects should be equal', function() {
            var d1 = new DateTime('2001-05-30');
            var d2 = new DateTime(2001, 4, 30);
            
            expect(DateTime.equals(d1, d2)).toEqual(true);
        });

        it('DateTime objects should be NOT equal', function() {
            var d1 = new DateTime('2001-05-30');
            var d2 = new DateTime(2002, 4, 30);
            
            expect(DateTime.equals(d1, d2)).toEqual(false);
        });



        it('Date objects should be equal', function () {
            var d1 = new Date(2001, 4, 30);
            var d2 = new Date(2001, 4, 30);
            
            expect(DateTime.equals(d1, d2)).toEqual(true); 
        });

        it('Date objects should be NOT equal', function () {
            var d1 = new Date(2001, 4, 30);
            var d2 = new Date(2001, 5, 30);
            
            expect(DateTime.equals(d1, d2)).toEqual(false); 
        });
    });
});
