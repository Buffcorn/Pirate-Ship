
function render_Background(thetaLoc, theta, texture, NumVertices, projection) {
    var pMatrix = mat4();
    pMatrix = perspective(angle, 1.0, 1.0, 800); // right
    pMatrix = mult(pMatrix, translate(0, depthOcean, -582));
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );        
    gl.uniform3fv(thetaLoc, theta); // differ    

     // texture mapping for ocean
    gl.bindTexture( gl.TEXTURE_2D, texture[0]);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
}

function render_boat() {     
     pMatrix = perspective(angle, 1.0, 1.0, 800); // right
     pMatrix = mult(pMatrix, translate(xPos, yPos, zPosBoat));
     pMatrix = mult(pMatrix, translate(-105, BoatDepth, 0));
     pMatrix = mult(pMatrix, rotate(BoatRotatex, BoatRotatey, 0.0, 1.0));
     pMatrix = mult(pMatrix, scalem(.08, .08, 1.0));
     gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );  
     gl.bindTexture( gl.TEXTURE_2D, texture[1]);
     gl.drawArrays( gl.TRIANGLES, 0*NumVertices/numTex, NumVertices);
}
function render_Cannon() {  
    cMatrix = mat4();
    cMatrix = perspective(angle, 1.0, 1.0, 800); // right
    cMatrix = mult(cMatrix, translate(xPos, yPos, zPosCannon));
    cMatrix = mult(cMatrix, translate(-90, CannonDepth, CannonDepthZ));
    cMatrix = mult(cMatrix, rotate(90, 0.0, CanonRotateZ, 1.0));
    cMatrix = mult(cMatrix, scalem(.4, .4, .3));
    gl.bindTexture( gl.TEXTURE_2D, texture[2]);
    gl.uniformMatrix4fv( projection, false, flatten(cMatrix) ); 
    gl.drawArrays(gl.TRIANGLES, 72, 96);

}
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mvMatrix = mat4( );
    /*mvMatrix = mult(mvMatrix, rotate(theta[0], 1.0, 0.0, 0.0));
    mvMatrix = mult(mvMatrix, rotate(theta[1], 0.0, 1.0, 0.0));
    mvMatrix = mult(mvMatrix, rotate(theta[2], 0.0, 0.0, 1.0));
    */gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    
    
    requestAnimFrame( render );
}
