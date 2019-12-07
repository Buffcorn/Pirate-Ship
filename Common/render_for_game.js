
function render_Background(thetaLoc, theta, texture, NumVertices, projection) {
    var pMatrix = mat4();
    pMatrix = perspective(angle, 1.0, 1.0, 800); // right
    pMatrix = mult(pMatrix, translate(OceanX, depthOcean, -582));
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );        
    gl.uniform3fv(thetaLoc, theta); // differ    

     // texture mapping for ocean
    gl.bindTexture( gl.TEXTURE_2D, texture[0]);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
}

function render_boat(NumVertices, StartingVertices) {     
     pMatrix = perspective(boatAngle, 1.0, 1.0, 800); // right

     pMatrix = mult(pMatrix, translate(xPosBoat, yPosBoat, zPosBoat));
     pMatrix = mult(pMatrix, rotate(BoatRotatex, BoatRotatey, BoatRotatez, 1.0));
     pMatrix = mult(pMatrix, scalem(scaleBoat, scaleBoat, scaleBoat));
     
     gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );  
     gl.bindTexture( gl.TEXTURE_2D, texture[1]);
     gl.drawArrays( gl.TRIANGLES, StartingVertices, NumVertices);
}
function render_Cannon(NumVertices, StartingVertices) {  
    cMatrix = mat4();
    cMatrix = perspective(angle, 1.0, 1.0, 800); // right
    cMatrix = mult(cMatrix, translate(xPos, yPos, zPosCannon));
    cMatrix = mult(cMatrix, translate(-90, CannonDepth, CannonDepthZ));
    cMatrix = mult(cMatrix, rotate(CannonRotateX, CannonRotateY, CannonRotateZ, 1.0));
    cMatrix = mult(cMatrix, scalem(.4, .4, .3));
    gl.uniformMatrix4fv( projection, false, flatten(cMatrix) ); 
    gl.bindTexture( gl.TEXTURE_2D, texture[2]);
    gl.drawArrays(gl.TRIANGLES, StartingVertices, NumVertices);
    

}

function render_Land(NumVertices) {
    var pMatrix = mat4();
    pMatrix = perspective(angle, 1.0, 1.0, 800); // right
    pMatrix = mult(pMatrix, translate(landx, landy, landz));
 
    // translate for ocean => y = depthOcean and z =>  -581 for projection 0
    // translate for ocean=>   z=> 
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );        
    gl.uniform3fv(thetaLoc, theta); // differ    

    // texture mapping for ocean
    gl.bindTexture( gl.TEXTURE_2D, texture[3]);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
}

function shoot_laser(NumVertices) {
     pMatrix = perspective(angle, 1.0, 1.0, 800); // right
     pMatrix = mult(pMatrix, translate(LazerX, LazerY, LazerZ));
     pMatrix = mult(pMatrix, rotate(LazerRotateX, 0, 0, 1.0));
     pMatrix = mult(pMatrix, scalem(.05, .02, .01));
     gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );  
     gl.bindTexture( gl.TEXTURE_2D, texture[4]);
     gl.drawArrays( gl.TRIANGLES, 0, countVertices[0]);
}

function render_Enemy(NumVertices) {
    var pMatrix = mat4();
    pMatrix = perspective(angle, 1.0, 1.0, 800); // right
    pMatrix = mult(pMatrix, translate(enemyX, enemyY, enemyZ));
    pMatrix = mult(pMatrix, scalem(.02, .04, .04));
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );        
    gl.uniform3fv(thetaLoc, theta); // differ    

     // texture mapping for ocean
    gl.bindTexture( gl.TEXTURE_2D, texture[2]);
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices);
}