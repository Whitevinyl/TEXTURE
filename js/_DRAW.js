



var DT;
var logger = [0,0];
function setupDrawing() {
    DT = tombola.range(100000,9999999);
}



//-------------------------------------------------------------------------------------------
//  BG
//-------------------------------------------------------------------------------------------


function drawBG() {
    ctx[0].globalAlpha = 1;
    color.fill(ctx[0],bgCols[3]);
    ctx[0].fillRect(0,0,fullX,fullY);
}


//-------------------------------------------------------------------------------------------
//  FOREGROUND
//-------------------------------------------------------------------------------------------


function drawScene() {
    var u = units;
    var font = "Open Sans";
    font = "Georgia";
    var ct = ctx[0];

/*
    color.fill(ct,textCol);
    ct.fillRect(dx - (15*u),dy - (15*u),30*u,30*u);

    ct.textAlign = 'center';
    ct.font = '400 ' + bodyType + 'px ' + font;
    ct.fillText('Default',dx,dy + (60*u));*/

    var ts = texture.size / 2;
    ct.drawImage(noiseTexture,dx - ts,dy - ts);

    /*color.fill(ct,textCol);
    ct.fillRect(dx - (25*u),dy - (2*u),50*u,4*u);
    ct.textAlign = 'center';
    ct.font = '400 ' + bodyType + 'px ' + font;
    ct.fillText('FLOW',dx,dy - (10*u));
    ct.font = '400 ' + dataType + 'px ' + font;
    ct.fillText(DT,dx,dy + (16*u));*/
}



//-------------------------------------------------------------------------------------------
//  DRAW FUNCTIONS
//-------------------------------------------------------------------------------------------



function spacedText(ctx,string,x,y,spacing) {

    var chars = string.length;
    var fullWidth = (chars-1) * spacing;
    var charList = [];
    var charWidths = [];
    for (var i=0; i<chars; i++) {
        var c = string.substr(i, 1);
        var w = ctx.measureText(c).width;
        charList.push (c);
        charWidths.push(w);
        fullWidth += w;
    }

    x -= fullWidth/2;

    for (i=0; i<chars; i++) {
        ctx.fillText(charList[i], x, y);
        x += (spacing + charWidths[i]);
    }
}


function drawPlay(ct,x,y,w,h) {
    ct.beginPath();
    ct.moveTo(x - (w/2), y - (h/2));
    ct.lineTo(x - (w/2), y + (h/2));
    ct.lineTo(x + (w/2), y);
    ct.closePath();
    ct.fill();
}

function drawPause(ct,x,y,w,h) {
    ct.fillRect(x - (w*0.45), y - (h/2), w*0.25, h);
    ct.fillRect(x + (w*0.2), y - (h/2), w*0.25, h);
}

function drawHamburger(ct,x,y,w,h,t) {
    ct.fillRect(x - (w/2), y - (h/2), w, t);
    ct.fillRect(x - (w/2), y - (t/2), w, t);
    ct.fillRect(x - (w/2), y + (h/2) - t, w, t);
}




//-------------------------------------------------------------------------------------------
//  EFFECTS
//-------------------------------------------------------------------------------------------


