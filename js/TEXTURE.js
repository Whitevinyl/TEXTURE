
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
    canvas.width = this.size;
    canvas.height = this.size;

    return this.canvasObj(canvas);
};

proto.canvasObj = function(canvas) {
    return {
        canvas: canvas,
        ctx: canvas.getContext('2d')
    }
};


//-------------------------------------------------------------------------------------------
//  GENERATE
//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------
//  NOISE
//-------------------------------------------------------------------------------------------


proto.noise = function(scale,col,alpha,colorShift,erode) {
    var canvas = this.newCanvas();
    return this.drawNoise(canvas,scale,col,alpha,colorShift,erode);
};


proto.drawNoise = function(canvas,scale,col,alpha,colorShift,erode) {

    // set context //
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


proto.cloud = function(scale,col,alpha,dither,mode,col2) {
    var canvas = this.newCanvas();
    return this.drawCloud(canvas,scale,col,alpha,dither,mode,col2);
};


proto.drawCloud = function(canvas,scale,col,alpha,dither,mode,col2) {

    // set context //
    var ctx = canvas.ctx;


    // generate texture //
    var simplex = new SimplexNoise();
    var cells = Math.ceil( this.size );
    scale *= 200;
    dither = dither || 0;
    dither *= 100;
    var r, g, b, a;
    r = g = b = a = 1;
    ctx.globalAlpha = alpha;

    for (var i=0; i<cells; i++) {  // columns //

        for (var j = 0; j < cells; j++) { // rows //

            var d = dither;
            if (tombola.percent(10)) {
                d *= 2;
            }

            var xOff = tombola.rangeFloat(-d,d);
            var yOff = tombola.rangeFloat(-d,d);
            var n = (simplex.noise((j + xOff) / scale, (i + yOff) / scale) + 1) / 2;

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
    var canvas = this.newCanvas();
    return this.drawFlecks(canvas,scale,density,col,alpha);
};


proto.drawFlecks = function(canvas,scale,density,col,alpha) {

    // set context //
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
    var canvas = this.newCanvas();
    return this.drawDust(canvas,scale,density,col,alpha);
};


proto.drawDust = function(canvas,scale,density,col,alpha) {

    // set context //
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
        var r = fleck * tombola.rangeFloat(0.2,0.8);
        //r = fleck * tombola.rangeFloat(6,10);


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
    var canvas = this.newCanvas();
    return this.drawGrain(canvas,scale,col,alpha);
};


proto.drawGrain = function(canvas,scale,col,alpha) {

    // set context //
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


//-------------------------------------------------------------------------------------------
//  PAINT
//-------------------------------------------------------------------------------------------


proto.dirt = function(scale,col,alpha) {
    var canvas = this.newCanvas();
    return this.drawDirt(canvas,scale,col,alpha);
};


proto.drawDirt = function(canvas,scale,col,alpha) {

    // set context //
    var ctx = canvas.ctx;


    // generate texture //
    var simplex = new SimplexNoise();
    ctx.globalAlpha = alpha;
    color.fill(ctx, col );


    var n = 500;
    var t = 1000;
    var r = 0.1 * scale;
    var s = 10 * scale;

    for (var i=0; i<n; i++) {  // particles //
        var p = new PaintParticle(tombola.range(0,this.size), tombola.range(0,this.size));


        for (var j=0; j<t; j++) {  // time //

            // draw //
            ctx.globalAlpha = 0.25;
            ctx.fillRect(p.x, p.y, p.size, p.size);

            // move //
            var xOff = simplex.noise(p.x / r, p.y / r) * s;
            var yOff = simplex.noise(p.x / r, -p.y / r) * s;
            p.move(xOff,yOff);

        }

    }


    // return texture //
    return canvas.canvas;
};


//-------------------------------------------------------------------------------------------
//  PAINT
//-------------------------------------------------------------------------------------------


proto.paint = function(scale,col1,col2,alpha,col3) {
    var canvas = this.newCanvas();
    return this.drawPaint(canvas,scale,col1,col2,alpha,col3);
};


/*proto.drawPaint = function(canvas,scale,col1,col2,alpha) {

    // set context //
    var ctx = canvas.ctx;


    // generate texture //
    var simplex = new SimplexNoise();
    scale *= 200;
    var cells = Math.ceil( this.size );
    ctx.globalAlpha = alpha;
    color.fill(ctx, col1 );
    ctx.fillRect(0, 0, this.size, this.size);
    color.fill(ctx, col2 );
    color.stroke(ctx, col2 );
    ctx.lineWidth = 1;


    var n = tombola.range(1000,2000);
    var t = tombola.range(500,1000);
    n = 1500;
    t = 400;
    var acc = 0.5;

    for (var i=0; i<n; i++) {  // particles //
        var p = new PaintParticle(tombola.range(0,this.size), tombola.range(0,this.size));


        for (var j=0; j<t; j++) {  // time //

            // draw //
            ctx.globalAlpha = 0.25;
            /!*ctx.fillRect(p.x, p.y, p.size, p.size);*!/
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.lx, p.ly);
            ctx.stroke();

            // move //
            var r = 500;
            var s = 1.5;
            var xOff = simplex.noise(p.x / r, p.y / r) * s;
            var yOff = simplex.noise(p.x / r, -p.y / r) * s;
            var px = p.xs + (xOff * acc);
            var py = p.ys + (yOff * acc);
            /!*if (px < -s) (px = -s);
            if (px > s) (px = s);
            if (py < -s) (py = -s);
            if (py > s) (py = s);*!/

            p.accelerate(px,py);
            p.move(p.xs, p.ys);

        }


    }


    // return texture //
    return canvas.canvas;
};*/


proto.drawPaint = function(canvas,scale,col1,col2,alpha,col3) {

    // set context //
    var ctx = canvas.ctx;


    // generate texture //
    var simplex = new SimplexNoise();
    var height = 180 * scale;
    scale *= 400;
    var cells = Math.ceil( this.size );
    ctx.globalAlpha = alpha;
    var streakIndex = 0;
    var contrast = 10;
    var rowOffset = 0;

    var rows = cells + (height * 2);
    for (var i=0; i<rows; i++) {  // rows //

        rowOffset += tombola.rangeFloat(-10,10);

        // progress vertical index for perlin //
        streakIndex += tombola.rangeFloat(-0.05,0.05);
        if (tombola.percent(3)) {
            streakIndex += tombola.rangeFloat(0.2,0.3);
        }

        else if (tombola.percent(1)) {
            streakIndex += tombola.rangeFloat(1,2);
        }

        for (var j = 0; j < cells; j++) { // columns //

            var y = simplex.noise(j / (scale * 1.5), i / (scale * 2.5)) * height;


            // color value & contrast //
            var n = simplex.noise(streakIndex, (j + rowOffset) / (scale*2));
            if (n > 0) { n += (1/100) * contrast; }
            if (n < 0) { n += (-1/100) * contrast; }
            n = (n + 1) / 2;


            // set blended fill color //
            var fillCol;
            if (n > 0.5) {
                n = (n - 0.5) * 2;
                fillCol = color.blend(col2, col3, n * 100);
            } else {
                n *= 2;
                fillCol = color.blend(col1, col2, n * 100);
            }

            // draw //
            color.fill(ctx, fillCol );
            ctx.fillRect(j,i + y - height, 1, 3);
        }

    }


    // return texture //
    return canvas.canvas;
};



function PaintParticle(x,y) {
    this.x = x;
    this.y = y;
    this.xs = 0;
    this.ys = 0;
    this.lx = x;
    this.ly = y;
    this.size = tombola.rangeFloat(0.3,1);
}
proto = PaintParticle.prototype;

proto.move = function(xs,ys) {
    this.lx = this.x;
    this.ly = this.y;
    this.x += xs;
    this.y += ys;
};

proto.accelerate = function(xs,ys) {
    this.xs = xs;
    this.ys = ys;
};