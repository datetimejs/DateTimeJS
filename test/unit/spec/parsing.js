describe('Calling DateTime.parse()', function() {
    
    describe('with no arguments', function() {
        it('should return null', function() {
            var dt = DateTime.parse();
            expect(dt).toBe(null);
        });
    });
    
    describe('with empty string', function() {
        it('should return null', function() {
            var dt = DateTime.parse('');
            expect(dt).toBe(null);
        });
    });
    
    describe('with "asdf"', function() {
        it('should return null', function() {
            var dt = DateTime.parse('asdf');
            expect(dt).toBe(null);
        });
    });
    
    describe('with null', function() {
        it('should return null', function() {
            var dt = DateTime.parse(null);
            expect(dt).toBe(null);
        });
    });
    
    describe('with undefined', function() {
        it('should return null', function() {
            var dt = DateTime.parse(undefined);
            expect(dt).toBe(null);
        });
    });
    
    xdescribe('with "2001-12-01"', function() {
        it('should equal "new Date("2001-12-01")"', function() {
            var datetime = DateTime.parse('2001-12-01');
            var date = new Date('2001-12-01');
            
            expect(datetime.toString()).toEqual(date.toString());
        });
    });
});