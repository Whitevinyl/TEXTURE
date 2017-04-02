

// INIT //
var canvas = [];
var ctx = [];
var TWEEN;
var fonts;


// METRICS //
var halfX = 0;
var halfY = 0;
var fullX = 0;
var fullY = 0;
var units = 0;
var dx = halfX;
var dy = halfY;
var headerType = 0;
var midType = 0;
var dataType = 0;
var bodyType = 0;
var subType = 0;
var device = "desktop";

var TAU = 2 * Math.PI;


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var touchTakeover = false;
var touch;
var mouseIsDown = false;




// COLORS //
var bgCols = [new RGBA(5,5,5,1),new RGBA(255,236,88,1)];
var textCol = new RGBA(255,255,255,1);

// TEXTURE //
var texture;
var textureCol = [new RGBA(155,155,255,1),new RGBA(255,88,236,1)];
var noiseTexture;

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------


function init() {

    // SETUP CANVAS //
    var cnvs = document.getElementById("main");
    var cntx = cnvs.getContext("2d");
    cntx.mozImageSmoothingEnabled = false;
    cntx.imageSmoothingEnabled = false;

    canvas.push(cnvs);
    ctx.push(cntx);


    /*StartAudioContext(Tone.context, '#main').then(function(){
        //started
    });*/

    // SET CANVAS & DRAWING POSITIONS //
    metrics();

    // INITIALISE THINGS //
    setupInteraction(canvas[0]);
    //setupAudio();

    texture = new Texture(256,false);
    //noiseTexture = texture.noise(1, textureCol[1], 0.75, 0.8, 0.5);
    noiseTexture = texture.cloud(0.8, textureCol[0], 1, 'green');

    // DONE //
    /*fonts = new Fonts(['Bodoni:n4,o4'],2,function(){
        setupDrawing();
        draw();
    });
    fonts.setup();*/

    setupDrawing();
    draw();
}




//-------------------------------------------------------------------------------------------
//  MAIN LOOP
//-------------------------------------------------------------------------------------------


function draw() {
    update();
    drawBG();
    drawScene();

    requestAnimationFrame(draw);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------


function update() {
    if (TWEEN) {
        TWEEN.update();
    }
}









