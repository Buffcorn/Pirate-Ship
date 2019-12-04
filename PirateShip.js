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
var xTranl = 0; 
var yTransl = 0; 
var zTransl = 0;


var projection;

var points = [];
var colors_Tex = []; 
var colors = [];

var numCannon = 0;
//variables needed for texture mapping
var numTex = 2; // texture coordinates
var texCoordsArray = []; //texel points 
var texture = [ ]; 
var image = [ ]; 
//boat coordinates
var xPosBoat = -150; 
var yPosBoat = -150;
var zPosBoat = -581;
var xPos = 0; 
var yPos = 0;
var zPos = 0;
var xPosCannon = -105; 
var yPosCannon = -125;
var zPosCannon = -581;

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
var CanonVertices = [
    vec4( -10, -50,  10, 1.0 ), //0 
        vec4( -10,  50,  10, 1.0 ), // 1
        vec4(  10,  50,  10, 1.0 ), // 2
        vec4(  10, -50,  10, 1.0 ), // 3
        vec4( -10, -50, -10, 1.0 ), // 4
        vec4( -10,  50, -10, 1.0 ), // 5
        vec4(  10,  50, -10, 1.0 ), // 6
        vec4(  10, -50, -10, 1.0 )
];

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

    document.getElementById("Reset").onclick = function () {
        xPosBoat = -145; 
        yPosBoat = -145;
    };
    
    textureScene();
    drawBox();
    console.log(points.length);
    tetrahedron(0, 1, 2, 3, 4, 5, 6, 7, 2);
    console.log(points.length);
    
     
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

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

        //creating color buffer 
    


    thetaLoc = gl.getUniformLocation(program, "theta");
    modelView = gl.getUniformLocation( program, "modelView" ); 
    projection = gl.getUniformLocation( program, "projection" );
    //event listeners for buttons
    
    window.onkeydown = keyResponse;

    //initialize textures
    initializeTexture(image, "ocean.jpg", 0);
    initializeTexture(image, "planks.jpg", 1);
    initializeTexture(image, "black.png", 2);

    render();
    
}
// key responses for moving boat
  function keyResponse(event) {
    var key = String.fromCharCode(event.keyCode);
        switch(key) {
          case 'f': // spin on the x axis
          case 'F':
            axis = xAxis;
            theta[axis] += 2.0;
            break;
          case 'j': // the y axis 
          case 'J':
            axis = yAxis;
            theta[axis] += 2.0;
            break;
          case 'h': // spin on the y axis
          case 'H':
            axis = yAxis;
            theta[axis] -= 2.0;
            break;
          case 'k': // the z axis 
          case 'K':
            axis = zAxis;
            theta[axis] += 2.0;
            break;          
	  case 'S':
	  case 's':
            yPos -= 2.0;
            break;
	  case 'W':
	  case 'w':
            yPos += 2.0;
            break;
	  case 'a':
	  case 'A':
            xPos -= 2.0;
            break;	  
	  case 'd':
	  case 'D':
            xPos += 2.0;
            break;
          case 'z':
          case 'Z':
          	zTransl+=5.0;
        }
}

function drawBox()
{
    quad( CanonVertices[1], CanonVertices[0], CanonVertices[3], CanonVertices[2], CanonVertices[0] );
    quad( CanonVertices[2], CanonVertices[3], CanonVertices[7], CanonVertices[6], CanonVertices[1] );
    quad( CanonVertices[4], CanonVertices[5], CanonVertices[6], CanonVertices[7], CanonVertices[2] );
    quad( CanonVertices[5], CanonVertices[4], CanonVertices[0], CanonVertices[1], CanonVertices[3] );
    quad( CanonVertices[1], CanonVertices[2], CanonVertices[6], CanonVertices[5], CanonVertices[4] );
    quad( CanonVertices[0], CanonVertices[4], CanonVertices[7], CanonVertices[3], CanonVertices[5] );


}
function configureTexture(image, id) {
    texture[id] = gl.createTexture(); 
    gl.bindTexture( gl.TEXTURE_2D, texture[id] );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image ); 
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);

    
    //gl.texParameteri(gl.TEXTURE_2D. gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}
function textureScene()
{  
    
    var verticesScene = [
        vec4( -200.0, -200.0,  100.0 , 1.0 ), // 0
        vec4( -200.0,  200.0,  100.0 , 1.0 ), // 1
        vec4(  200.0,  200.0,  100.0 , 1.0 ), // 2
        vec4(  200.0, -200.0,  100.0 , 1.0 ),  // 3

        vec4( -200.0, -200.0, -100.0 , 1.0 ), // 4  front view but bottom view
        vec4( -200.0,  200.0, -100.0 , 1.0 ), // 5
        vec4(  200.0,  200.0, -100.0 , 1.0 ), // 6
        vec4(  200.0, -200.0, -100.0 , 1.0 ) // 7
]
    
    scene( verticesScene[1], verticesScene[0], verticesScene[3], verticesScene[2] ); // 
    scene( verticesScene[2], verticesScene[3], verticesScene[7], verticesScene[6] ); // 
    scene( verticesScene[3], verticesScene[0], verticesScene[4], verticesScene[7] ); // 
    scene( verticesScene[6], verticesScene[5], verticesScene[1], verticesScene[2] ); // 
    scene( verticesScene[4], verticesScene[5], verticesScene[6], verticesScene[7] ); // 
    scene( verticesScene[5], verticesScene[4], verticesScene[0], verticesScene[1] );


}
function scene(a, b, c, d) 
{
    points.push( a ); // 4
    // colors.push(vec4(0, 0, 0, 0));
    // texCoordsArray.push( texCoord[0] );  
    colors_Tex.push(texCoord[0]);   
    
    points.push( b);
    // colors.push(vec4(0, 0, 0, 0));
    // texCoordsArray.push( texCoord[1] );  // 5  
    colors_Tex.push(texCoord[1]);   

    points.push( c );
    // colors.push(vec4(0, 0, 0, 0));
    // texCoordsArray.push( texCoord[2] );  // 6   
    colors_Tex.push(texCoord[2]);   

    points.push( a );
    // colors.push(vec4(0, 0, 0, 0));
    // texCoordsArray.push( texCoord[0] ); // 4    
    colors_Tex.push(texCoord[0]);   

    points.push( c ); // 6 
    // colors.push(vec4(0, 0, 0, 0));
    // texCoordsArray.push( texCoord[2] ); 
    colors_Tex.push(texCoord[2]);      

    points.push( d ); // 7
    // colors.push(vec4(0, 0, 0, 0));
    // texCoordsArray.push( texCoord[3] ); 
    colors_Tex.push(texCoord[3]);   
    NumVertices += 6;
}

function initializeTexture( myImage, fileName, id) {
    myImage[id] = new Image();
    myImage[id].onload = function() {
        configureTexture(myImage[id], id);
    }
    myImage[id].src = fileName;
}
 function tetrahedron(a, b, c, d, e, f, g, h, count) {
    divide_quad(CanonVertices[a], CanonVertices[b], CanonVertices[c], CanonVertices[d], count);
    divide_quad(CanonVertices[d], CanonVertices[c], CanonVertices[g], CanonVertices[h], count);
    divide_quad(CanonVertices[h], CanonVertices[g], CanonVertices[f], CanonVertices[e], count);
    divide_quad(CanonVertices[e], CanonVertices[f], CanonVertices[b], CanonVertices[a], count);
} 

 function divide_quad(a, b, c, d, count) {

  // grab all the x and z points
  var xa = a[0];
  var za = a[2];
  var xb = b[0];
  var zb = b[2];
  var xc = c[0];
  var zc = c[2];
  var xd = d[0];
  var zd = d[2];

  var y1 = b[1]; // top y coordinate
  var y2 = a[1]; // bottom y coordinate

  var distance = Math.sqrt(200);
  var normal = distance/Math.sqrt((xa*xa) + (za*za));
  var ad = vec4((xa+xd)/2.0, y2, (za+zd)/2.0, 1.0); // Bottom mid point
  var bc = vec4((xb+xc)/2.0, y1, (zb+zc)/2.0, 1.0); // Top mid point

  var normalizedBot = distance / (Math.sqrt(ad[0] * ad[0] + ad[2] * ad[2]));
  var normalizedTop = distance / (Math.sqrt(bc[0] * bc[0] + bc[2] * bc[2]));


    if ( count > 0 ) {

        ad = vec4(ad[0] * normalizedBot, y2, ad[2] * normalizedBot, 1.0);
        bc = vec4(bc[0] * normalizedTop, y1, bc[2] * normalizedTop, 1.0);

        divide_quad(a, b, bc, ad, count - 1);
        divide_quad(ad, bc, c, d, count - 1);
      }
      else {
        quad( a, b, c, d );
      }
} 

function quad(a, b, c, d)
{

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( indices[i] );

        //colors.push(vec4( 0.0, 0.0,  0.0, 1.0 ));
        colors_Tex.push(vec4(1.0, 0.0, 0.0, 1.0));   
        
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

     //cannon stuff 
     render_Cannon();

    requestAnimFrame( render );
}



