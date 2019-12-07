function boat(a, b, c) 
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

    numVerticiesCount += 3;
}

function drawBoat() 
{
    var verticesBoat = [
        vec4(0, 30, -5, 1), vec4(-50, 50, -100, 1), vec4(-50, 0, -100, 1), 
        vec4(50, 0, -100, 1), vec4(50, 50, -100, 1), vec4(50, 0, -200, 1),
        vec4(50, 50, -200, 1), vec4(-50, 50, -200, 1), vec4(-50, 0, -200, 1) 
    ];

    boat(verticesBoat[0], verticesBoat[1], verticesBoat[2]); // red
    boat(verticesBoat[0], verticesBoat[2], verticesBoat[3]);
    boat(verticesBoat[0], verticesBoat[3], verticesBoat[4]);
    boat(verticesBoat[0], verticesBoat[3], verticesBoat[4]);
    boat(verticesBoat[0], verticesBoat[4], verticesBoat[1]);
    //side of the boat
    boat(verticesBoat[4], verticesBoat[3], verticesBoat[6]);
    boat(verticesBoat[3], verticesBoat[6], verticesBoat[5]);
    //right side of the boat
    boat(verticesBoat[1], verticesBoat[2], verticesBoat[8]); 
    boat(verticesBoat[1], verticesBoat[7], verticesBoat[8]);
    //bottom side of the boat 
    boat(verticesBoat[2], verticesBoat[8], verticesBoat[3]); 
    boat(verticesBoat[3], verticesBoat[5], verticesBoat[8]);

    boat(verticesBoat[7], verticesBoat[8], verticesBoat[5]);
    boat(verticesBoat[5], verticesBoat[7], verticesBoat[6]);
    //top side of boat
    boat(verticesBoat[4], verticesBoat[6], verticesBoat[1]);
    boat(verticesBoat[1], verticesBoat[7], verticesBoat[6]);

}
