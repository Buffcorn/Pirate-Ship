//*******************************************************************
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
//             where to move the ship W or w moves further away 
//             from the edge of the ocean, S or s moves
//             closer to the edge of the ocean, A or a moves further
//             away from the beach, D or d moves closer to the beach   
//
//             The boat has a limit in all direction so that it does 
//             not go off screen or on the sand.
//*******************************************************************
var directHits = 0;
var highScore = 0;
var numPlayer = 1;
var highPlayer = 1;

var canvas;
var gl;
var program;

var mvMatrix; 
var pMatrix;


var numVerticiesCount = 0; 
var startVerticesCount = []; 
var countVertices = []; 

var xTranl = 0; 
var yTransl = 0; 
var zTransl = 0;

var projection;
var points = []; // contains all the vertices 

//*****Texture Coordinates*****//
var Tex_coord = []; // contains all texture vertices for all the objects used
var texCoord = [
        vec2(0, 1), 
        vec2(0, 0), 
        vec2(1, 0),
        vec2(1, 1)
];
var image = [ ]; // array of images used for texture
var texture = [ ]; // texture vertices 
//*****************************//

//variables needed for texture mapping



//*****Boat and Cannon Variables to Keep Track of*****//
var xPosBoat = -290; // translate in the x direction for boat
var yPosBoat = -10; // translate in the y direction for boat
var xPosCannon = -50; // translate in the x direction for the cannon 
var yPosCannon = 120; //// translate in the y direction for cannon
var zPosBoat = -481; // translate in the z direction for boat
var zPosCannon = -449; // translate in the z direction for the cannon 
var boatAngle = 90; // changed needed for a given perspective 
var scaleBoat = .65; // scaling the boat 
var angle = 45; // angle used for the perspective
var PerspectiveCheck = 0; // keeps track which perspective it is currently on 
var CannonRotateY = 0; // to move the cannon in perspective 2 so the q and e buttons
var CannonRotateZ = 0; // to move the cannon in perspective 2 so the q and e buttons
var depthOcean = 0; // translating the object in y direction 
var BoatRotatex = 120; // rotate in the x direction for boat
var BoatRotatey = 1; // rotate in the y direction for boat
var BoatRotatez = 1; // rotate in the z direction for boat
var CannonDepth = -125; // amount to translate in the y direction for the cannon
var CannonDepthZ = 0; // amount to translate in the z direction for the cannon
var CannonRotateX = 90; // rotate in the z direction for cannon
var OceanX = 0; // amount to translate the ocean background in the x direction
//***************************************************//

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];


var thetaLoc;


//***** Lazer Variables *****//
var LazerX = -140; //amount to translate the lazer in the x direction
var LazerY = -5; //amount to translate the lazer in the y direction
var LazerZ = -450; //amount to translate the lazer in the z direction
var LazerRotateX = 0; // amount to rotate the laser when firing to adjust when the cannon is adjusted 
var LazerPosition = 0; // the distance of the laser from the starting (in the cannon)

//***********Land*************//
var landx = 320; // amount to translate the land which is the sand/beach in the x direction
var landy = depthOcean; // amount to translate the land which is the sand/beach in the y direction
var landz = -599; // amount to translate the land which is the sand/beach in the z direction
//***************************//
var enemyX = 120; // amount to translate the enemy in the area in sand/beach in the x direction
var enemyY = 0; // amount to translate the enemy in the area in sand/beach in the y direction
var enemyZ = -450; // amount to translate the enemy in the area in sand/beach in the z direction
//**********Sound****************//
//the sound affects for the pew pew 
var pewpewSound = new Audio(); // telling that this is an audio element 
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
    var Perspective1Check = 0; // //Making sure you can only click Perspective 1 once. 
    document.getElementById("Perspective1").onclick = function () {
    // setting the appropriate variables for Perspective 1 
	if (Perspective1Check == 0) {
		PerspectiveCheck = 0; //Change for the wasd control. 
		angle = 45;
		boatAngle = 90;
		depthOcean = 0;
		theta = [ 0, 0, 0 ];
		xPosCannon = -50; 
		yPosCannon = 120;
		xPosBoat = -290; 
	    yPosBoat = -10;
		zPosBoat = -481;
        zPosCannon = -449;
		BoatRotatex = 120.0;
        BoatRotatey = 1.0;
        scaleBoat = .65;
		Perspective1Check = 1; 
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
        landz = -599;
        
	}
    };
    
    var Perspective2Check = 0; //Making sure you can only click Perspective 2 once. 
    document.getElementById("Perspective2").onclick = function () {
    	// setting the appropriate variables for Perspective 1
	if (Perspective2Check == 0){
		theta[0] += 90.0;
		depthOcean = -150;
		BoatRotatex = 121;
		BoatRotatey = -1;
		BoatRotatez = 1;
		xPosCannon = -10; 
        yPosCannon = 8;

		xPosBoat = -118; 
		yPosBoat = -55;
		zPosBoat = -700; 

		//BoatRotatex = 0; 
		//BoatRotatey = -2;
		//BoatRotatez = 0;
        boatAngle = 45;
        scaleBoat = .60;

		PerspectiveCheck = 1; //Change for the wasd control.
		Perspective2Check = 1; //Making sure you can only click Perspective 2 once.
		Perspective1Check = 0; 
		CannonRotateZ = 180;
		CannonRotateX = 90;
		CannonRotateY = 0;
		CannonDepth = -25;
		CannonDepthZ = -50;
		LazerRotateX = 0;
		LazerX = -105; 
		LazerY = -15;
		LazerZ = -517;
		OceanX = -100;

		landx = 300; 
        landy = -149;
        landz = -599; 
        if (enemyY < 0) {enemyY = -enemyY;}
        
		}
    };
    document.getElementById("Reset_Enemy").onclick = function () {
    	//resets the enemies location on the sand given a range 
    	// for perspective 1 in the y direction is from -145 to 142
    	// 
    		enemyX = 120;
    		if (PerspectiveCheck == 0) {
    			enemyY = Math.floor((Math.random() * 290) + -145);
    		} else {
    			enemyY = Math.floor(Math.random() * 163) + -18;
    		}
    }
document.getElementById("New_Player").onclick = function () {
	// resets score for new player
	alert("Player " + numPlayer + ", your score is " + directHits);
	enemyY = 0;
	directHits = 0;
	numPlayer += 1;
    }
    
    document.getElementById("End_Game").onclick = function () {
	// ends game and displays high score
	alert("The high score is " + highScore + ". Congratulations player " + highPlayer + "!");
	highScore = 0;
	directHits = 0;
	enemyY= 0;
	numPlayer = 1;
    }
//*******************************************************************//
    startVerticesCount[0] = points.length; // will contain zero for starting 
  

    textureScene();
    countVertices[0] = numVerticiesCount; // will contain 36 so the amount to draw background
    startVerticesCount[1] = points.length; // where to start for pushing the next object for drawArray 
    numVerticiesCount = 0; // reseting to call next function 
    
    drawBoat(); //  
    countVertices[1] = numVerticiesCount; // will contain 39 so the amount to draw the ship
    startVerticesCount[2] = points.length;  
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
    initializeTexture(image, "yell.jpg", 5);
    initializeTexture(image, "slime.png", 6);

    render();
    
}

function Shoot(event) {
	pewpewSound.src = "Common/pewpew.mp3"; //re establish the connection after 
	// playing the audio 
    var key = String.fromCharCode(event.keyCode);
        switch(key) {
	  case 'p':
	  case 'P':
	  	pewpewSound.play(); // play the sound
		pewpew();
	    break;
        }  
    pewpewSound = new Audio(); // re establishing the audio element
}

function pewpew() {
	// For shooting lasers and check if the laser 
	// has hit the enemy 
		
	if (enemyX <= LazerX && enemyX+10 >= LazerX && LazerY >= enemyY-10 && LazerY <= enemyY+10 ) {
		// checking if the laser has hit the enemy
		// if it hits will disappear by pushing it out of screen
		// resets the laser to be back in the cannon 
		if (PerspectiveCheck == 0) {
			LazerX = xPosCannon-90; 
			LazerY = yPosCannon-125; // added
	    	} else if (PerspectiveCheck == 1 && LazerY >= enemyY-10 && LazerY <= enemyY+10) {
			LazerX = xPosCannon - 90;
			LazerPosition = 0;
			LazerY = yPosCannon - 25; 
	    }
	    	enemyX = 300;  
	    	directHits ++;
			if (directHits >= highScore) {
					highScore = directHits;
					highPlayer = numPlayer;
				}
			
	    	
         	setTimeout(document.getElementById("Reset_Enemy").onclick, 1000);
         	
	} else if (LazerX < 200) {
		// if true means that the laser 
		// will keep moving across until it 
		// leaves the screen which is around 
		// 200 
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
		// means that the laser has left the screen  
		// will reset it to be in the cannon 
		if (PerspectiveCheck == 0) {
			LazerX = xPosCannon-90; 
			LazerY = yPosCannon-125; // added
	    	} else if (PerspectiveCheck == 1) {
			LazerX = xPosCannon - 90;
			LazerPosition = 0;
			LazerY = yPosCannon - 25; 
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
			if(yPosCannon >= -30) {
            	yPosCannon -= (2.0*2);
            	yPosBoat -= (4.85*2);
				LazerY -= (2.0*2);
			}
	    } else if (PerspectiveCheck == 1) {
	    	// move the ship closer to the 
	    	// edge of the ocean
			if(zPosBoat <= -450) {
	            zPosCannon += (1.79*3);
			    zPosBoat += (2.5*3);
				LazerZ += (1.79*3);
			}
	    }
            break;
	  case 'W':
	  case 'w':
	    if (PerspectiveCheck == 0) {
	    // move the ship w/ the cannon 
        // up
			if(yPosCannon <= 280) {
            	yPosCannon += (2.0*2);
            	yPosBoat += (4.85*2);
				LazerY += (2.0*2);
			}
	    } else if (PerspectiveCheck == 1) {
	    	// move the ship further away 
	    	// the edge of the ocean
            if (zPosBoat >= -700) {
				zPosCannon -= (1.79*3);
				zPosBoat -= (2.5*3);
				LazerZ -= (1.79*3);
			} 
	    }
            break;
        case 'a':
	    case 'A':
	    	if (PerspectiveCheck == 0) {
	    	// move the ship w/ the cannon 
        	// to the left
            	if ( xPosCannon >= -60) {	
			        xPosBoat -= (4.85*2);
            		xPosCannon -= (2.0*2);
	    		    LazerX -= (2.0*2);

	    		    
            	}
	    } else if (PerspectiveCheck == 1) {
	    	// move the ship further from 
	    	// the sand 
			if ( xPosCannon >= -50) {	
				xPosBoat -= (2.5*3);
				xPosCannon -= (1.79*3);
	    		LazerX -= (1.79*3);
	    	
            }
	    }
            break;	  
	  case 'd':
	  case 'D':  
	    if (PerspectiveCheck == 0) {
	    // move the ship w/ the cannon 
        // to the right
			if(xPosCannon <= 130) {
				xPosCannon += (2.0*2);
            	xPosBoat += (4.85*2);
	    		LazerX += (2.0*2);

	    		
			}	    		
	    } else if (PerspectiveCheck == 1) {
	    	// move the ship closer to 
	    	// the sand 
			if (xPosCannon < 80) {            	
				xPosBoat += (2.5*3);
				xPosCannon += (1.79*3);
	    		LazerX += (1.79*3);

			}	    
	    }
            break;
    }
    console.log()
}
/****************/
function makeSides(a, b, c, d) {
	//used to create: rectangular prism of the ocean and 
	// sand background and the enemy. Also used to make the 
	// sides of the ship and the cylinder which is why it is 
	// in the main
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

    //draw the ocean
    render_Background();

     //draw the boat
     render_boat();

     // draw the cannon 
     render_Cannon();
     
     //draw the Laser
     shoot_laser();

     //draw the Land
     render_Land();

     //draw the enemy 
     render_Enemy();
     if (PerspectiveCheck == 1) {
     	background_perspective_2();
     }

    requestAnimFrame( render );
}



