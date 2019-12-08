// drawing the pushed and texture points for the 
// land, ocean, cannon, laser, and ship with varaiables 
// from the PirateShip.js

function render_Background() {
    
    var pMatrix = mat4();
    pMatrix = perspective(angle, 1.0, 1.0, 800); // right
    pMatrix = mult(pMatrix, translate(OceanX, depthOcean, -582));
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );        
    gl.uniform3fv(thetaLoc, theta); // differ    

     // texture mapping for ocean
    gl.bindTexture( gl.TEXTURE_2D, texture[0]);
    gl.drawArrays( gl.TRIANGLES, 0, countVertices[0]);
}

function render_boat() {     

     pMatrix = perspective(boatAngle, 1.0, 1.0, 800); // right
     pMatrix = mult(pMatrix, translate(xPosBoat, yPosBoat, zPosBoat));
     pMatrix = mult(pMatrix, rotate(BoatRotatex, BoatRotatey, BoatRotatez, 1.0));
     pMatrix = mult(pMatrix, scalem(scaleBoat, scaleBoat, scaleBoat));
     
     gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );  

    

     gl.bindTexture( gl.TEXTURE_2D, texture[1]);
     gl.drawArrays( gl.TRIANGLES, startVerticesCount[1], 12);

     gl.bindTexture( gl.TEXTURE_2D, texture[5]);
     gl.drawArrays( gl.TRIANGLES, startVerticesCount[1] + 12, 6);
     

     gl.bindTexture( gl.TEXTURE_2D, texture[5]);
     gl.drawArrays( gl.TRIANGLES, startVerticesCount[1] + 18, 6);
     
     gl.bindTexture( gl.TEXTURE_2D, texture[5]);
     gl.drawArrays( gl.TRIANGLES, startVerticesCount[1] + 24, 6);
     
     gl.bindTexture( gl.TEXTURE_2D, texture[1]);
     gl.drawArrays( gl.TRIANGLES, startVerticesCount[1] + 30, 6);

}
function render_Cannon() {  
    cMatrix = mat4();
    cMatrix = perspective(angle, 1.0, 1.0, 800); // right
    cMatrix = mult(cMatrix, translate(xPosCannon-90, yPosCannon + CannonDepth, zPosCannon+CannonDepthZ));
    cMatrix = mult(cMatrix, rotate(CannonRotateX, CannonRotateY, CannonRotateZ, 1.0));
    cMatrix = mult(cMatrix, scalem(.4, .4, .3));
    gl.uniformMatrix4fv( projection, false, flatten(cMatrix) ); 
    gl.bindTexture( gl.TEXTURE_2D, texture[2]);
    gl.drawArrays(gl.TRIANGLES, startVerticesCount[2], countVertices[2]);
    

}

function render_Land() {
    var pMatrix = mat4();
    pMatrix = perspective(angle, 1.0, 1.0, 800); // right
    pMatrix = mult(pMatrix, translate(landx, landy, landz));
 

    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );        
    gl.uniform3fv(thetaLoc, theta); // differ    

    // texture mapping for ocean
    gl.bindTexture( gl.TEXTURE_2D, texture[3]);
    gl.drawArrays( gl.TRIANGLES, 0, countVertices[0]);
}

function shoot_laser() {
     pMatrix = perspective(angle, 1.0, 1.0, 800); // right
     pMatrix = mult(pMatrix, translate(LazerX, LazerY, LazerZ));
     pMatrix = mult(pMatrix, rotate(LazerRotateX, 0, 0, 1.0));
     pMatrix = mult(pMatrix, scalem(.05, .02, .01));
     gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );  
     gl.bindTexture( gl.TEXTURE_2D, texture[4]);
     gl.drawArrays( gl.TRIANGLES, 0, countVertices[0]);
}

function render_Enemy() {
    var pMatrix = mat4();
    pMatrix = perspective(angle, 1.0, 1.0, 800); // right
    pMatrix = mult(pMatrix, translate(enemyX, enemyY, enemyZ));
    pMatrix = mult(pMatrix, scalem(.02, .04, .04));
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );        
    gl.uniform3fv(thetaLoc, theta); // differ    

     // texture mapping for ocean
    gl.bindTexture( gl.TEXTURE_2D, texture[2]);
    gl.drawArrays( gl.TRIANGLES, 0, countVertices[0]);
}