// the file is exclusively only used to create the cannon
// which is a cylinder. Adjusted the distance of the dividequad 
// to create the cylinder used in the project while using 
// our preexisting code of when creating a cylinder 
// most of variables other than from the 
 // the parameter from PirateShip.js
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
        makeSides( a, b, c, d );
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
