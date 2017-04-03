

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
var bgCols = [new RGBA(5,5,5,1),new RGBA(255,236,88,1),new RGBA(0,88,236,1),new RGBA(255,245,235,1),new RGBA(20,30,255,1)];
var textCol = new RGBA(255,255,255,1);

// TEXTURE //
var texture;
var textureCol = [new RGBA(20,30,255,1),new RGBA(255,88,236,1),new RGBA(10,200,200,1),new RGBA(255,245,235,1),new RGBA(5,5,5,1),new RGBA(255,160,180,1),new RGBA(255,170,170,1),new RGBA(255,140,90,1),new RGBA(255,20,30,1),new RGBA(10,10,70,1),new RGBA(255,80,100,1)];
var noiseTexture;

color.lowPass = new RGBA(50,45,25,0);

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

    texture = new Texture(512);
    //noiseTexture = texture.noise(1, textureCol[1], 0.75, 0.8, 0.5);
    //noiseTexture = texture.cloud(1.8, textureCol[1], 1, 0.1, "blue", textureCol[2]);
    //noiseTexture = texture.flecks(1.3, 0.4, textureCol[3], 1);
    //noiseTexture = texture.dust(0.6, 1, textureCol[3], 1);

    /*noiseTexture = texture.noise(0.75, textureCol[1], 0.75, 1, 0.5);
    noiseTexture = texture.drawCloud(texture.canvasObj(noiseTexture),3, textureCol[1], 0.1, 0.1,"blue", textureCol[2]);
    noiseTexture = texture.drawFlecks(texture.canvasObj(noiseTexture),1.5, 1, textureCol[3], 0.3);
    noiseTexture = texture.drawDust(texture.canvasObj(noiseTexture),0.6, 2, textureCol[3], 0.3);*/

    noiseTexture = texture.paint(0.8, textureCol[4], textureCol[0], textureCol[7], 1, 0.05, 0.7);
    //noiseTexture = texture.dirt(0.2, textureCol[2], 1);
    //noiseTexture = texture.cloud(1.8, textureCol[0], 1, 0.3, "blue", textureCol[1]);


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









