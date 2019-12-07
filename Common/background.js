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
    
    scene( verticesScene[1], verticesScene[0], verticesScene[3], verticesScene[2] ); // 
    scene( verticesScene[2], verticesScene[3], verticesScene[7], verticesScene[6] ); // 
    scene( verticesScene[3], verticesScene[0], verticesScene[4], verticesScene[7] ); // 
    scene( verticesScene[6], verticesScene[5], verticesScene[1], verticesScene[2] ); // 
    scene( verticesScene[4], verticesScene[5], verticesScene[6], verticesScene[7] ); // 
    scene( verticesScene[5], verticesScene[4], verticesScene[0], verticesScene[1] );
}

function scene(a, b, c, d) {
    points.push( a ); // 4
    colors_Tex.push(texCoord[0]);   
    
    points.push( b);
    colors_Tex.push(texCoord[1]);  

    points.push( c );
    colors_Tex.push(texCoord[2]);   

    points.push( a );
    colors_Tex.push(texCoord[0]);   

    points.push( c ); // 6 
    colors_Tex.push(texCoord[2]);      

    points.push( d ); // 7
    colors_Tex.push(texCoord[3]);   

    numVerticiesCount += 6;
}

function initializeTexture( myImage, fileName, id) {
    myImage[id] = new Image();
    myImage[id].onload = function() {
        configureTexture(myImage[id], id);
    }
    myImage[id].src = fileName;
}
