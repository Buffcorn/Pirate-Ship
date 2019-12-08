function configureTexture(image, id) {
    texture[id] = gl.createTexture(); 
    gl.bindTexture( gl.TEXTURE_2D, texture[id] );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image ); 
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function textureScene() {  
    
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
    
    makeSides( verticesScene[1], verticesScene[0], verticesScene[3], verticesScene[2] ); // 
    makeSides( verticesScene[2], verticesScene[3], verticesScene[7], verticesScene[6] ); // 
    makeSides( verticesScene[3], verticesScene[0], verticesScene[4], verticesScene[7] ); // 
    makeSides( verticesScene[6], verticesScene[5], verticesScene[1], verticesScene[2] ); // 
    makeSides( verticesScene[4], verticesScene[5], verticesScene[6], verticesScene[7] ); // 
    makeSides( verticesScene[5], verticesScene[4], verticesScene[0], verticesScene[1] );
}

function initializeTexture( myImage, fileName, id) {
    myImage[id] = new Image();
    myImage[id].onload = function() {
        configureTexture(myImage[id], id);
    }
    myImage[id].src = fileName;
}
