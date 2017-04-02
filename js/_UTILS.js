
//-------------------------------------------------------------------------------------------
//  FUNCTIONS
//-------------------------------------------------------------------------------------------



// IS CURSOR WITHIN GIVEN BOUNDARIES //
function hudCheck(x,y,w,h) {
    var mx = mouseX;
    var my = mouseY;
    return (mx>x && mx<(x+w) && my>y && my<(y+h));
}



// LOCK A VALUE WITHIN GIVEN RANGE //
function valueInRange(value,floor,ceiling) {
    if (value < floor) {
        value = floor;
    }
    if (value> ceiling) {
        value = ceiling;
    }
    return value;
}



// LERP TWEEN / EASE //
function lerp(current,destination,speed) {
    return current + (((destination-current)/100) * speed);
}



// IS VAL A NEAR TO VAL B //
function near(a,b,factor) {
    return Math.round(a/factor) == Math.round(b/factor);
}


function decimaRound(n,places) {
    var p = Math.pow(10,places);
    return Math.round(n * p) / p;
}


function degToRad(deg) {
    return deg * (Math.PI/180);
}

function radToDeg(rad) {
    return (rad/TAU) * 180;
}

function getRadius(a,b) {
    return Math.sqrt((a*a)+(b*b));
}

function angleFromVector(vector) {
    return Math.atan2(vector.y,vector.a);
}

function vectorFromAngle(angle) {
    return new Vector(Math.cos(angle),Math.sin(angle));
}



//-------------------------------------------------------------------------------------------
//  OBJECTS
//-------------------------------------------------------------------------------------------


function Point( x, y ) {
    this.x = x || 0;
    this.y = y || 0;
}
Point.prototype.clone = function() {
    return new Point(this.x,this.y);
};

function Point3D( x, y, z ) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

function Vector( x, y ) {
    this.x = x || 0;
    this.y = y || 0;
}
Vector.prototype.clone = function() {
    return new Vector(this.x,this.y);
};
Vector.prototype.magnitude = function() {
    return Math.sqrt((this.x*this.x) + (this.y*this.y));
};

Vector.prototype.normalise = function() {
    var m = this.magnitude();
    if (m>0) {
        this.x /= m;
        this.y /= m;
    }
};

function Size( w, h ) {
    this.w = w || 0;
    this.h = h || 0;
}


function Alpha(a) {
    this.a = a || 0;
}