describe('Calling the DateTime constructor', function() {
    
    xit('should be equivalent to calling DateTime.create()', function() {
        var dt1 = new DateTime('2001-05-30');
        var dt2 = DateTime.create('2001-05-30');
        
        expect(dt1.toString()).toEqual(dt2.toString());
    });
    
    describe('with no arguments', function() {
        it('should equal "new Date()"', function() {
            var datetime = new DateTime();
            var date = new Date();
            
            expect(datetime.toString()).toEqual(date.toString());
        });
    });
    
    xdescribe('with "2001-01-25"', function() {
        it('should equal "new Date("2001-01-25")"', function() {
            var datetime = new DateTime('2001-01-25');
            var date = new Date('2001-01-25');
            
            expect(datetime.toString()).toEqual(date.toString());
        });
    });
    
    xdescribe('with "01/25/2001"', function() {
        it('should equal "new Date("01/25/2001")"', function() {
            var datetime = new DateTime('01/25/2001');
            var date = new Date('01/25/2001');
            
            expect(datetime.toString()).toEqual(date.toString());
        });
    });
});
