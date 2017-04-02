
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
//-------------------------------------------------------------------------------------------
//  NOISE
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


//-------------------------------------------------------------------------------------------
//  CLOUD
//-------------------------------------------------------------------------------------------


proto.cloud = function(scale,col,alpha,mode,col2) {

    // create canvas //
    var canvas = this.newCanvas();
    var ctx = canvas.ctx;


    // generate texture //
    var simplex = new SimplexNoise();
    var cells = Math.ceil( this.size );
    scale *= 200;
    var r, g, b, a;
    r = g = b = a = 1;
    ctx.globalAlpha = alpha;

    for (var i=0; i<cells; i++) {  // columns //

        for (var j = 0; j < cells; j++) { // rows //

            var n = (simplex.noise(j / scale, i / scale) + 1) / 2;

            a = 0;
            if (mode) {
                switch (mode) {
                    case 'red':
                        r = 0;
                        a = 1;
                        break;
                    case 'green':
                        g = 0;
                        a = 1;
                        break;
                    case 'blue':
                        b = 0;
                        a = 1;
                        break;
                    case 'alpha':
                        a = 0;
                        break;
                }
            }

            if (!col2) {
                col2 = new RGBA(col.R * r, col.G * g, col.B * b, col.A * a);
            }


            var fillCol = color.blend(col2, col, n * 100);

            color.fill(ctx, fillCol );
            ctx.fillRect(i, j, 1, 1);
        }

    }


    // return texture //
    return canvas.canvas;
};


//-------------------------------------------------------------------------------------------
//  FLECKS
//-------------------------------------------------------------------------------------------


proto.flecks = function(scale,density,col,alpha) {

    // create canvas //
    var canvas = this.newCanvas();
    var ctx = canvas.ctx;


    // generate texture //
    density = Math.ceil((this.size * 10) * density);
    ctx.globalAlpha = alpha;


    color.stroke(ctx, col);

    for (var i=0; i<density; i++) {  // flecks //

        var x = Math.random() * this.size;
        var y = Math.random() * this.size;
        var fleck = scale * tombola.rangeFloat(1,2.5);

        ctx.lineWidth = tombola.rangeFloat(scale/10,scale);
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x + tombola.range(-fleck,fleck), y + tombola.range(-fleck,fleck));
        ctx.stroke();
    }


    // return texture //
    return canvas.canvas;
};


//-------------------------------------------------------------------------------------------
//  DUST
//-------------------------------------------------------------------------------------------


proto.dust = function(scale,density,col,alpha) {

    // create canvas //
    var canvas = this.newCanvas();
    var ctx = canvas.ctx;


    // generate texture //
    density = Math.ceil((this.size * 10) * density);
    color.fill(ctx, col );
    color.stroke(ctx, col );
    var simplex = new SimplexNoise();


    for (var i=0; i<density; i++) {  // particles //

        ctx.globalAlpha = alpha;
        var x = Math.random() * this.size;
        var y = Math.random() * this.size;
        var fleck = scale * tombola.rangeFloat(1,2.5);
        var r = fleck * tombola.rangeFloat(0.2,0.6);

        // hairs //
        if (tombola.percent(0.2)) {
            var l = tombola.range(5,32);
            var xs = tombola.range(-fleck,fleck);
            var ys = tombola.range(-fleck,fleck);

            ctx.lineWidth = tombola.rangeFloat(scale * 0.3,scale * 1.2);
            ctx.beginPath();
            ctx.moveTo(x,y);
            for (var j=0; j<l; j++) {
                xs += tombola.rangeFloat(-r,r);
                ys += tombola.rangeFloat(-r,r);
                x += xs;
                y += ys;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // flecks //
        else if (tombola.percent(6)) {
            fleck = scale * tombola.rangeFloat(1.5,3);
            ctx.lineWidth = tombola.rangeFloat(scale * 0.75,scale * 2);
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x + tombola.range(-fleck,fleck), y + tombola.range(-fleck,fleck));
            ctx.stroke();
        }


        // grains //
        else if (tombola.percent(0.3)) {
            fleck = scale * tombola.rangeFloat(1.2,2);
            ctx.globalAlpha = tombola.rangeFloat(alpha/2,alpha);
            ctx.beginPath();
            ctx.arc(x,y,fleck,0,TAU);
            ctx.closePath();
            ctx.fill();
        }


        // specks //
        else {
            fleck = scale * tombola.rangeFloat(0.3,1.2);
            var nScale = density/20;
            var n = ((simplex.noise(x / nScale, y / nScale) + 1) / 2) + tombola.rangeFloat(-0.6,0.6);
            if (n > 1) n = 1;
            if (n < 0) n = 0;
            ctx.globalAlpha = n * alpha;
            ctx.fillRect(x, y, fleck, fleck);
        }




    }


    // return texture //
    return canvas.canvas;
};


//-------------------------------------------------------------------------------------------
//  GRAIN
//-------------------------------------------------------------------------------------------


proto.grain = function(scale,col,alpha) {

    // create canvas //
    var canvas = this.newCanvas();
    var ctx = canvas.ctx;


    // generate texture //
    var cells = Math.ceil( this.size );
    var r, g, b, a;
    r = g = b = a = 1;
    ctx.globalAlpha = alpha;

    for (var i=0; i<cells; i++) {  // columns //

        for (var j = 0; j < cells; j++) { // rows //

            color.fillRGBA(ctx, col.R * r, col.G * g, col.B * b, col.A * a );
            ctx.fillRect(i, j, 1, 1);
        }

    }


    // return texture //
    return canvas.canvas;
};