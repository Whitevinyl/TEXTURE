
// generates a selection of canvas/bitmap textures

//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

function Texture(size,repeat) {
    this.size = size || 256;
    this.repeat = repeat || false;
}
var proto = Texture.prototype;

proto.setSize = function(size) {
    this.size = size || 256;
};

proto.setRepeat = function(repeat) {
    this.repeat = repeat || false;
};


//-------------------------------------------------------------------------------------------
//  CREATE CANVAS
//-------------------------------------------------------------------------------------------


proto.newCanvas = function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = this.size;
    canvas.height = this.size;

    return {
        canvas: canvas,
        ctx: ctx
    }
};


//-------------------------------------------------------------------------------------------
//  GENERATE
//-------------------------------------------------------------------------------------------


proto.noise = function(scale,col,alpha,colorShift,erode) {

    // create canvas //
    var canvas = this.newCanvas();
    var ctx = canvas.ctx;


    // generate texture //
    var cells = Math.ceil( this.size / scale );
    var r, g, b, a;
    r = g = b = a = 1; // uniformity scale
    colorShift = 1 - colorShift;

    for (var i=0; i<cells; i++) {  // columns //

        for (var j=0; j<cells; j++) { // rows //

            if (colorShift<1) {
                r = tombola.rangeFloat(colorShift,1);
                g = tombola.rangeFloat(colorShift,1);
                b = tombola.rangeFloat(colorShift,1);
            }
            a = 1;
            if (tombola.percent(erode * 100)) {
                a = tombola.rangeFloat(0,1);
            }

            color.fillRGBA(ctx, col.R * r, col.G * g, col.B * b, col.A * a );
            ctx.globalAlpha = tombola.rangeFloat(0,alpha);
            ctx.fillRect(i * scale, j * scale, scale, scale);

        }
    }


    // return texture //
    return canvas.canvas;
};


proto.cloud = function(scale,col,alpha) {

    // create canvas //
    var canvas = this.newCanvas();
    var ctx = canvas.ctx;


    // generate texture //
    var simplex = new SimplexNoise();
    var cells = Math.ceil( this.size );
    scale /= 200;
    var r, g, b, a;
    r = g = b = a = 1;
    ctx.globalAlpha = alpha;

    for (var i=0; i<cells; i++) {  // columns //

        for (var j = 0; j < cells; j++) { // rows //

            var n = simplex.noise(j / scale, i / scale);
            a = (n + 1) / 2;

            color.fillRGBA(ctx, col.R * r, col.G * g, col.B * b, col.A * a );
            ctx.fillRect(i, j, 1, 1);
        }

    }


    // return texture //
    return canvas.canvas;
};