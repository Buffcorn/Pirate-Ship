function front_boat(a, b, c) 
{
    points.push( a ); // 4
    // colors.push(vec4(0, 0, 0, 0));
    // texCoordsArray.push( texCoord[0] );  
    Tex_coord.push(texCoord[0]);   
    
    points.push( b);
    // colors.push(vec4(0, 0, 0, 0));
    // texCoordsArray.push( texCoord[1] );  // 5  
    Tex_coord.push(texCoord[1]);   

    points.push( c );
     
    Tex_coord.push(texCoord[2]);   

    numVerticiesCount += 3;
}

function drawBoat() 
{
	// creates the boat by calling front_boat that pushses in the vertices 
	// for the front of the boat which is a pyramid and calles makeSides for 
	// the sides of the boat instead fo repetively calling scene using makeSides 
	// used for the background. 
    var verticesBoat = [
        vec4(0, 30, -5, 1), vec4(-50, 50, -100, 1), vec4(-50, 0, -100, 1), 
        vec4(50, 0, -100, 1), vec4(50, 50, -100, 1), vec4(50, 0, -200, 1),
        vec4(50, 50, -200, 1), vec4(-50, 50, -200, 1), vec4(-50, 0, -200, 1) 
    ];
    //front 
      front_boat(verticesBoat[0], verticesBoat[1], verticesBoat[2]); // red
      front_boat(verticesBoat[0], verticesBoat[2], verticesBoat[3]);
      front_boat(verticesBoat[0], verticesBoat[3], verticesBoat[4]);
      front_boat(verticesBoat[0], verticesBoat[4], verticesBoat[1]);

	  // right side 
	  makeSides(verticesBoat[1], verticesBoat[2], verticesBoat[8], verticesBoat[7]); 
	  //back side
	  makeSides(verticesBoat[7], verticesBoat[8], verticesBoat[5], verticesBoat[6]);
	  //left side 
	  makeSides(verticesBoat[6], verticesBoat[5], verticesBoat[3] , verticesBoat[4]);
	  //bottom
	  makeSides(verticesBoat[3], verticesBoat[2], verticesBoat[8], verticesBoat[5]);


}
