

function Fonts(families,number,callback) {
    this.loaded = 0;
    this.families = families;
    this.total = number;
    this.callback = callback;
}
var proto = Fonts.prototype;


proto.setup = function() {

    var that = this;
    WebFont.load({
        // families should be an array formatted like:
        // ['Bodoni:n4,o4','Another Font:i4']
        custom: { families: that.families},
        fontactive: function(font, fvd) { that.check(font, fvd) },
        timeout: 3500 // 3.5 seconds
    });

    setTimeout(function() {
        that.fail();
    },3600);
};



proto.check = function(font,fvd) {
    console.log('loaded: '+font+' '+fvd);
    this.loaded += 1;
    // All fonts are present - we're done
    if (this.loaded === this.total) {
        this.done();
    }
};



proto.fail = function() {
    if (this.loaded !== this.total) {
        console.log("FONTS ARE MISSING");
        // proceed anyway for now
        this.loaded = this.total;
        this.done();
    }
};



proto.done = function() {
    console.log('fonts loaded');
    this.callback();
};






