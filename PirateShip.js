//************************************************************
// PirateShip.js
//   Author:   Itaru Fujiwara, Kevin Smith, David Mendoza
//   Date:     December 9th, 2019
//   Class:    CSCI343, Professor Royden
//
//   Purpose:  When you open the PirateShip.html you will start
//             off in Perspective 1 where to move the ship you 
//             you press W or w to move up, S or s to move down 
//             , A or a to move to the left, D or d to move to 
//             move to the right, and press P to fire a laser 
//             with sound effects 
//             Press Perspective 2 to view the ship from the side 
//             where to move the ship W or w moves  
//************************************************************
var canvas;
var gl;
var program;

var mvMatrix; 
var pMatrix;

var NumVertices = 0;
var numVerticiesCount = 0; 
var startVerticesCount = []; 
var countVertices = []; 
// var LandVertices = 0;
var xTranl = 0; 
var yTransl = 0; 
var zTransl = 0;


var projection;
var is_Persp_1 = true; 
var pointsland = [];
var points = [];
var Tex_coord = []; 
var colors = [];

var numCannon = 0;
//variables needed for texture mapping
var numTex = 2; // texture coordinates
var texCoordsArray = []; //texel points 
var texture = [ ]; 
var image = [ ]; 

//*****Boat and Cannon Variables to Keep Track of*****//
var xPosBoat = -290; 
var yPosBoat = -10;
var xPos = -50; 
var yPos = 120;
var zPosBoat = -481;
var zPosCannon = -449;
var boatAngle = 90;
var scaleBoat = .65;
var angle = 45;
var PerspectiveCheck = 0;
var CannonRotateY = 0;
var CannonRotateZ = 0;
var depthOcean = 0;
var BoatRotatex = 120;
var BoatRotatey = 1;
var BoatRotatez = 1;
var BoatDepth = -125;
var CannonDepth = -125;
var CannonDepthZ = 0;
var CannonRotateX = 90;
var OceanX = 0;
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
var LazerX = -140; //
var LazerY = -5;
var LazerZ = -450;
var LazerRotateX = 0;
var LazerPosition = 0;
var temp = 0;

//***********Land*************//
var sandDepthY = 0;
var landx = 320; 
var landy = depthOcean;
var landz = -581; 
//***************************//
var enemyX = 120;
var enemyY = 0; 
var enemyZ = -450;
//**********Sound****************//
var pewpewSound = new Audio(); 
pewpewSound.src = "Common/pewpew.mp3";
// function preload() {
// 	soundFormats('mp3', 'ogg');
// 	pewpewSound = loadSound('Common/Watashi.mp3');
// }
// function setup() {
//   pewpewSound.setVolume(0.1);
//   pewpewSound.play();
// }
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
		boatAngle = 90;
		depthOcean = 0;
		theta = [ 0, 0, 0 ];
		BoatDepth = -125;
		xPos = -50; 
		yPos = 120;
		xPosBoat = -290; 
	    yPosBoat = -10;
		zPosBoat = -481;
        zPosCannon = -449;
		BoatRotatex = 120.0;
        BoatRotatey = 1.0;
        scaleBoat = .65;
		Perspective1Check = 1; //Making sure you can only click Perspective 1 once. 
		Perspective2Check = 0;
		CannonRotateZ = 0;
		CannonRotateY = 0;
		CannonRotateX = 90;
		CannonDepth = -125;
		CannonDepthZ = 0;
		LazerRotateX = 0;
		LazerX = -140;
		
		LazerY = -5;
		LazerZ = -450;
		BoatRotatez = 1;
		OceanX = 0;
		landx = 320; 
        landy = depthOcean;
        landz = -581; 
        
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
		xPos = -10; 
        yPos = 11;
		xPosBoat = -200; 
		yPosBoat = -75;
		zPosBoat = -535; 
		BoatRotatex = 90;
        BoatRotatey = 0;
		BoatRotatez = 0;
        boatAngle = 90;
        scaleBoat = .60;

		PerspectiveCheck = 1; //Change for the wasd control.
		Perspective2Check = 1; //Making sure you can only click Perspective 2 once.
		Perspective1Check = 0; 
		CannonRotateZ = 180;
		CannonRotateX = 90;
		CannonRotateY = 0;
		CannonDepth = -25;
		CannonDepthZ = -50;
		sandDepthY = -145;
		LazerRotateX = 0;
		LazerX = -105; 
		LazerY = -15;
		LazerZ = -517;
		OceanX = -100;

		landx = 300; 
        landy = -149;
        landz = -581; 
        
        
	}
    };
    document.getElementById("Reset_Enemy").onclick = function () {
    		enemyX = 120;
    		if (PerspectiveCheck == 0) {
    			enemyY = Math.floor((Math.random() * 290) + -145);
    		} else {
    			enemyY = Math.floor(Math.random() * 145);
    		}
    		//enemyY = 149;
    	
    }
//*******************************************************************//
    startVerticesCount[0] = points.length; // will contain zero for starting 
    // to push into draw array

    textureScene();
    countVertices[0] = numVerticiesCount; // will contain 36 so the amount to draw background
    startVerticesCount[1] = points.length; // where to start for pushing the next object for draw 
                                               // draw arrays 
    numVerticiesCount = 0; // reseting to call next function 
    drawBoat(); //  
    countVertices[1] = numVerticiesCount; // will contain 39 so the amount to draw the ship
    startVerticesCount[2] = points.length;
    console.log(countVertices[1]);
    console.log(points.length);
    //startVerticesCount[2]
    
    numVerticiesCount = 0;

    tetrahedron(0, 1, 2, 3, 4, 5, 6, 7, 2);
    countVertices[2] = numVerticiesCount;
    startVerticesCount[3] = points.length;
    
    
    //creating texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(Tex_coord), gl.STATIC_DRAW );
    
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
    initializeTexture(image, "sand.jpg", 3);
    initializeTexture(image, "red.png", 4);

    render();
    
}

function Shoot(event) {
	pewpewSound.src = "Common/pewpew.mp3";
    var key = String.fromCharCode(event.keyCode);
        switch(key) {
	  case 'p':
	  case 'P':
	  	pewpewSound.play();
		pewpew();
	    break;
        }  
    pewpewSound = new Audio();
}

function pewpew() {
	
		
	if (enemyX <= LazerX && enemyX+10 >= LazerX && LazerY >= enemyY-10 && LazerY <= enemyY+10 ) {
		
		if (PerspectiveCheck == 0) {
			LazerX = xPos-90; 
			LazerY = yPos-125; // added
	    	} else if (PerspectiveCheck == 1 && LazerY >= enemyY-10 && LazerY <= enemyY+10) {
			LazerX = xPos - 90;
			LazerPosition = 0;
			LazerY = yPos - 25; 
	    	}
	    	enemyX = 300;    
	    	 
         	setTimeout(document.getElementById("Reset_Enemy").onclick, 1000);
         	
	} else if (LazerX < 200) {
		if (PerspectiveCheck == 0) {
			LazerX += 10;
            setTimeout(pewpew, 20);
		} else if (PerspectiveCheck == 1) {
			LazerX += 10;	
			LazerPosition += 10;		
			LazerY = LazerPosition * Math.tan(LazerRotateX*Math.PI/180)-15;
                	setTimeout(pewpew, 20);
		}
	} else {
		if (PerspectiveCheck == 0) {
			LazerX = xPos-90; 
			LazerY = yPos-125; // added
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
		//no movement for the cannon in perspective 1
	    } else if (PerspectiveCheck == 1) {
	    	// move the cannon up in perspective 2
            	if (CannonRotateY >= -200){
			LazerRotateX += 2.5;
			CannonRotateY -= 10;
	    	}
	    }
            break;	  
	  case 'e':
	  case 'E':            
	    if (PerspectiveCheck == 0) {
		// no movement for the cannon
	    } else if (PerspectiveCheck == 1) {
	    	// move the cannon down in perspective 2
            	if (CannonRotateY <= -10){
			LazerRotateX -= 2.5;
			CannonRotateY += 10;
	    	}
	    }
            break;	  
	  case 'S':
	  case 's':
	  	
        if (PerspectiveCheck == 0) {
        	// move the ship w/ the cannon 
        	// down
			if(yPos >= -30) {
            	yPos -= 2.0;
            	yPosBoat -= 4.85;
				LazerY -= 2.0;
			}
	    } else if (PerspectiveCheck == 1) {
	    	// move the ship closer to the 
	    	// edge of the ocean
			if(zPosBoat <= -379) {
	            zPosCannon += 2.0;
			    zPosBoat += 2.0;
				LazerZ += 2.0;
			}
	    }
            break;
	  case 'W':
	  case 'w':
	    if (PerspectiveCheck == 0) {
	    // move the ship w/ the cannon 
        // up
			if(yPos <= 280) {
            	yPos += 2.0;
            	yPosBoat += 4.85;
				LazerY += 2.0;
			}
	    } else if (PerspectiveCheck == 1) {
	    	// move the ship further away 
	    	// the edge of the ocean
            if (zPosBoat >= -641) {
				zPosCannon -= 2.0;
				zPosBoat -= 2.0;
				LazerZ -= 2.0;
			}
	    }
            break;
        case 'a':
	    case 'A':
	    	if (PerspectiveCheck == 0) {
	    	// move the ship w/ the cannon 
        	// to the left
            	if ( xPos >= -60) {	
			xPosBoat -= 4.85;
            		xPos -= 2.0;
	    		LazerX -= 2.0;
	    		temp = xPos;
            	}
	    } else if (PerspectiveCheck == 1) {
	    	// move the ship further from 
	    	// the sand 
			if ( xPos >= -50) {	
				xPosBoat -= 4.85;
            	xPos -= 2.0;
	    		LazerX -= 2.0;
	    		temp = xPos;
            }
	    }
            break;	  
	  case 'd':
	  case 'D':  
	    if (PerspectiveCheck == 0) {
	    // move the ship w/ the cannon 
        // to the right
		if(xPos <= 130) {
			xPos += 2.0;
            		xPosBoat += 4.85;
	    		LazerX += 2.0;
	    		temp = xPos;
		}	    		
	    } else if (PerspectiveCheck == 1) {
	    	// move the ship closer to 
	    	// the sand 
			if (xPos < 80) {            	
				xPosBoat += 4.85;
				xPos += 2.0;
	    		LazerX += 2.0;
	    		temp = xPos;
			}	    
	    }
            break;
        }
       
}
/****************/
function makeSides(a, b, c, d) {
	//used to create: rectangular prism of the ocean and 
	// sand background and the enemy. Also used to make the 
	// sides of the ship 
    points.push( a ); // 4
    Tex_coord.push(texCoord[0]);   
    
    points.push( b);
    Tex_coord.push(texCoord[1]);  

    points.push( c );
    Tex_coord.push(texCoord[2]);   

    points.push( a );
    Tex_coord.push(texCoord[0]);   

    points.push( c ); // 6 
    Tex_coord.push(texCoord[2]);      

    points.push( d ); // 7
    Tex_coord.push(texCoord[3]);   

    numVerticiesCount += 6;
}
/****************/
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mvMatrix = mat4( );
    mvMatrix = mult(mvMatrix, rotate(theta[0], 1.0, 0.0, 0.0));
    mvMatrix = mult(mvMatrix, rotate(theta[1], 0.0, 1.0, 0.0));
    mvMatrix = mult(mvMatrix, rotate(theta[2], 0.0, 0.0, 1.0));

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    
    //for ocean
    render_Background(thetaLoc, theta, texture, countVertices[0], projection);

     //boat stuff
     render_boat(countVertices[1], startVerticesCount[1]);

     render_Cannon(countVertices[2], startVerticesCount[2]);
     
     //Laser
     shoot_laser(countVertices[0]);

     //Land
     render_Land(countVertices[0]);

     render_Enemy(countVertices[0]);
      
     



    requestAnimFrame( render );
}



