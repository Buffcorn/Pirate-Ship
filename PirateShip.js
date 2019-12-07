//************************************************************
// textureCube.js
//   Author:   David Mendoza
//   Date:     November 13, 2019
//   Class:    CSCI343, Professor Royden
//
//   Purpose:  pirate moves around ocean
//************************************************************
var canvas;
var gl;
var program;

var mvMatrix; 
var pMatrix;

var NumVertices = 0;
var LandVertices = 0;
var xTranl = 0; 
var yTransl = 0; 
var zTransl = 0;


var projection;

var pointsland = [];
var points = [];
var colors_Tex = []; 
var colors = [];

var numCannon = 0;
//variables needed for texture mapping
var numTex = 2; // texture coordinates
var texCoordsArray = []; //texel points 
var texture = [ ]; 
var image = [ ]; 

//*****Boat and Cannon Variables to Keep Track of*****//
var xPos = -60; 
var yPos = 120;
var zPosBoat = -580;
var zPosCannon = -465;
var angle = 45;
var PerspectiveCheck = 0;
var CannonRotateY = 0;
var CannonRotateZ = 0;
var depthOcean = 0;
var BoatRotatex = 0;
var BoatRotatey = 0;
var BoatDepth = -125;
var CannonDepth = -125;
var CannonDepthZ = 0;
var CannonRotateX = 90;
//***************************************************//

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];


var thetaLoc;
var texCoord = [
        vec2(0, 0), 
        vec2(0, 1), 
        vec2(1, 1),
        vec2(1, 0)
];


//***** Sand Variables *****//
var sandDepthY = 0;

//*************************//

//***** Lazer Variables *****//
var LazerX = -143; 
var LazerY = -5;
var LazerZ = -467;
var LazerRotateX = 0;
var LazerPosition = 0;
var temp = 0;

//***************************//

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

//**************************BUTTONS ON HTML**************************//
    var Perspective1Check = 0;
    document.getElementById("Perspective1").onclick = function () {
	if (Perspective1Check == 0) {
		PerspectiveCheck = 0; //Change for the wasd control. 
		angle = 45;
		depthOcean = 0;
		theta = [ 0, 0, 0 ];
		BoatRotatex = 0;
		BoatRotatey = 0;
		BoatDepth = -125;
		xPos = -60; 	
		yPos = 120;
		zPosBoat = -580;
		zPosCannon = -465;
		Perspective1Check = 1; //Making sure you can only click Perspective 1 once. 
		Perspective2Check = 0;
		CannonRotateZ = 0;
		CannonRotateY = 0;
		CannonRotateX = 90;
		CannonDepth = -125;
		CannonDepthZ = 0;
		LazerRotateX = 0;
		LazerX = -143; 
		LazerY = -5;
		LazerZ = -467;
	}
    };
    
    var Perspective2Check = 0;
    document.getElementById("Perspective2").onclick = function () {
	if (Perspective2Check == 0){
		theta[0] += 90.0;
		depthOcean = -150;
		BoatRotatex = 90;
		BoatRotatey = 180;
		BoatDepth = -230;
		xPos = 0; 
        	yPos = 0;
		PerspectiveCheck = 1; //Change for the wasd control.
		Perspective2Check = 1; //Making sure you can only click Perspective 2 once.
		Perspective1Check = 0; 
		CannonRotateZ = 180;
		CannonRotateX = 90;
		CannonRotateY = 0;
		CannonDepth = -25;
		CannonDepthZ = -110;
		sandDepthY = -145;
		LazerRotateX = 0;
		LazerX = -90; 
		LazerY = -25;
		LazerZ = -575;
	}
    };
//*******************************************************************//
    
    textureScene();
    drawBox();
    tetrahedron(0, 1, 2, 3, 4, 5, 6, 7, 2);
    
     
    //creating texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors_Tex), gl.STATIC_DRAW );
    
    // var cBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer );
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 ); 
    gl.enableVertexAttribArray( vTexCoord );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );    

    var landBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, landBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

        //creating color buffer 
    


    thetaLoc = gl.getUniformLocation(program, "theta");
    modelView = gl.getUniformLocation( program, "modelView" ); 
    projection = gl.getUniformLocation( program, "projection" );
    //event listeners for buttons
    
    window.onkeydown = keyResponse;
    window.onkeypress = Shoot;

    //initialize textures
    initializeTexture(image, "ocean.jpg", 0);
    initializeTexture(image, "planks.jpg", 1);
    initializeTexture(image, "black.png", 2);
    initializeTexture(image, "Sand.png", 3);
    initializeTexture(image, "red.png", 4);

    render();
    
}

function Shoot(event) {
    var key = String.fromCharCode(event.keyCode);
        switch(key) {
	  case 'p':
	  case 'P':
		pewpew();
	    break;
        }
}

function pewpew() {
	if (LazerX < 200) {
		if (PerspectiveCheck == 0) {
			LazerX += 10;
                	setTimeout(pewpew, 20);
		} else if (PerspectiveCheck == 1) {
			LazerX += 10;	
			LazerPosition += 10;		
			LazerY = LazerPosition * Math.tan(LazerRotateX*Math.PI/180)-25;
                	setTimeout(pewpew, 20);
		}
	} else {
		if (PerspectiveCheck == 0) {
			LazerX = xPos - 100; 
	    	} else if (PerspectiveCheck == 1) {
			LazerX = xPos - 90;
			LazerPosition = 0;
			LazerY = yPos - 25; 
	    	}
	}
}

// key responses for moving boat
  function keyResponse(event) {
    var key = String.fromCharCode(event.keyCode);
        switch(key) {
	  case 'q':
	  case 'Q':
	    if (PerspectiveCheck == 0) {
		//CannonRotateZ -= .05;
	    } else if (PerspectiveCheck == 1) {
            	if (CannonRotateY >= -200){
			LazerRotateX += 2.5;
			CannonRotateY -= 10;
	    	}
	    }
            break;	  
	  case 'e':
	  case 'E':            
	    if (PerspectiveCheck == 0) {
		//if (CannonRotateZ >= -1){
		//	CannonRotateZ -= 0.05;
	    	//}
	    } else if (PerspectiveCheck == 1) {
            	if (CannonRotateY <= -10){
			LazerRotateX -= 2.5;
			CannonRotateY += 10;
	    	}
	    }
            break;	  
	  case 'S':
	  case 's':
            if (PerspectiveCheck == 0) {
            	yPos -= 2.0;
		LazerY -= 2.0;
	    } else if (PerspectiveCheck == 1) {
            	zPosCannon += 2.0;
		zPosBoat += 2.0;
		LazerZ += 2.0;
	    }
            break;
	  case 'W':
	  case 'w':
	    if (PerspectiveCheck == 0) {
            	yPos += 2.0;
		LazerY += 2.0;
	    } else if (PerspectiveCheck == 1) {
            	zPosCannon -= 2.0;
		zPosBoat -= 2.0;
		LazerZ -= 2.0;
	    }
            break;
	  case 'a':
	  case 'A':
            xPos -= 2.0;
	    LazerX -= 2.0;
	    temp = xPos
            break;	  
	  case 'd':
	  case 'D':  
	    if (PerspectiveCheck == 0) {
            	xPos += 2.0;
	    	LazerX += 2.0;
	    	temp = xPos;
	    } else if (PerspectiveCheck == 1) {
            	xPos += 2.0;
	    	LazerX += 2.0;
	    	temp = xPos;
	    }
            break;
        }
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mvMatrix = mat4( );
    mvMatrix = mult(mvMatrix, rotate(theta[0], 1.0, 0.0, 0.0));
    mvMatrix = mult(mvMatrix, rotate(theta[1], 0.0, 1.0, 0.0));
    mvMatrix = mult(mvMatrix, rotate(theta[2], 0.0, 0.0, 1.0));

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    
    //for ocean
    render_Background(thetaLoc, theta, texture, NumVertices, projection);

     //boat stuff
     render_boat();

     //Laser
     shoot_laser();

     //Land
     render_Land();

     //cannon stuff 
     render_Cannon();



    requestAnimFrame( render );
}



