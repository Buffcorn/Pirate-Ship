//************************************************************
// textureCube.js
//   Author:   David Mendoza
//   Date:     November 13, 2019
//   Class:    CSCI343, Professor Royden
//
//   Purpose:  apply a texture to all sides of a cube
//************************************************************
var canvas;
var gl;
var program;
var mvMatrix; 
var pMatrix;
var NumVertices  = 0; 
var projection;

var points = [];

//variables needed for texture mapping
var numTex = 1; // texture coordinates
var texCoordsArray = []; //texel points 
var texture = [ ]; 
var image = [ ]; 
//====================================
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var xTranl = 0; 
var yTransl = 0;
var zTransl = 0;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;
var texCoord = [
        vec2(0, 0), 
        vec2(0, 1), 
        vec2(1, 1),
        vec2(1, 0)
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

    textureScene();
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 ); 
    gl.enableVertexAttribArray( vTexCoord );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");
    modelView = gl.getUniformLocation( program, "modelView" ); 
    projection = gl.getUniformLocation( program, "projection" );
    //event listeners for buttons
    
    window.onkeydown = keyResponse;

    //initialize textures
    initializeTexture(image, "ocean.jpg", 0);
    //initializeTexture(image, "beach.jpg", 1);
    

    render();
}
function keyResponse(event) {
    var key = String.fromCharCode(event.keyCode);
   switch (key) {
        case '1':
            axis = xAxis;
            theta[axis] += 2.0;
            break;
        case '2':
            
            axis = xAxis;
            theta[axis] -= 2.0;
            break;
        case '3':
            
            axis = yAxis;
            theta[axis] += 2.0;
            break;
        case '4':
            
            axis = yAxis;
            theta[axis] -= 2.0;
            break;
        case '5':
            
            axis = zAxis;
            theta[axis] += 2.0;
            break;
        case '6':
            
            axis = zAxis;
            theta[axis] -= 2.0;
        case 'f':
        case 'F': 
            // increment z 
            zTransl += 2.0;
            break;
        case 'b':
        case 'B': 
            // decrement z 
            zTransl -= 2.0; 
            
            break; 
        case 'u':
        case 'U':
            // increment y 
            yTransl += 2.0;
           
            break;
        case 'd': 
        case 'D':
            // decrement y 
            yTransl -= 2.0;
            break;
        case 'r': 
        case 'R':
            // increment x 
            xTranl += 2.0; 
            break; 
        case 'l':
        case 'L': 
            // decrement x 
            xTranl -= 2.0;
    }
}
function configureTexture(image, id) {
    texture[id] = gl.createTexture(); 
    gl.bindTexture( gl.TEXTURE_2D, texture[id] );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image ); 
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);

    
    //gl.texParameteri(gl.TEXTURE_2D. gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}
function textureScene()
{  
    
    var verticesScene = [
        vec4( -200.0, -200.0,  100 , 1.0 ), // 0
        vec4( -200.0,  200.0,  100 , 1.0 ), // 1
        vec4(  200.0,  200.0,  100.0 , 1.0 ), // 2
        vec4(  200.0, -200.0,  100 , 1.0 ),  // 3

        vec4( -200.0, -200.0, -100, 1.0 ), // 4  front view but bottom view
        vec4( -200,  200, -100, 1.0 ), // 5
        vec4(  200,  100, -50 , 1.0 ), // 6
        vec4(  200, -200, -100, 1.0 ) // 7
];
    
    scene( verticesScene[1], verticesScene[0], verticesScene[3], verticesScene[2] ); // red
    scene( verticesScene[2], verticesScene[3], verticesScene[7], verticesScene[6] ); // 
    scene( verticesScene[3], verticesScene[0], verticesScene[4], verticesScene[7] ); // green 
    scene( verticesScene[6], verticesScene[5], verticesScene[1], verticesScene[2] ); // cyan
    scene( verticesScene[4], verticesScene[5], verticesScene[6], verticesScene[7] ); // blue front
    scene( verticesScene[5], verticesScene[4], verticesScene[0], verticesScene[1] );


}
function scene(a, b, c, d) 
{
    points.push( a ); // 4
    texCoordsArray.push( texCoord[0] );    
    
    points.push( b);
    texCoordsArray.push( texCoord[1] );  // 5  

    points.push( c );
    texCoordsArray.push( texCoord[2] );  // 6   

    points.push( a );
    texCoordsArray.push( texCoord[0] ); // 4    

    points.push( c ); // 6 
    texCoordsArray.push( texCoord[2] );    

    points.push( d ); // 7
    texCoordsArray.push( texCoord[3] ); 
    NumVertices += 6;
}

function initializeTexture( myImage, fileName, id) {
    myImage[id] = new Image();
    myImage[id].onload = function() {
        configureTexture(myImage[id], id);
    }
    myImage[id].src = fileName;
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mvMatrix = mat4( );
    mvMatrix = mult(mvMatrix, rotate(theta[0], 1.0, 0.0, 0.0));
    mvMatrix = mult(mvMatrix, rotate(theta[1], 0.0, 1.0, 0.0));
    mvMatrix = mult(mvMatrix, rotate(theta[2], 0.0, 0.0, 1.0));

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    
    
    pMatrix = perspective(45.0, 1.0, 1.0, 800); // right
    pMatrix = mult(pMatrix, translate(0, 0, -582));
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );        
    //theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta); // differ    

     for (var i = 0; i < numTex; i++) {
         gl.bindTexture( gl.TEXTURE_2D, texture[i]);
         gl.drawArrays( gl.TRIANGLES, i*NumVertices/numTex, NumVertices/numTex );
     }
    //gl.drawArrays (gl.TRIANGLES, 0, points.length);

    requestAnimFrame( render );
}


