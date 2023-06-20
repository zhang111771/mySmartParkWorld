varying vec2 vUv;
uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

uniform vec2 iMouse;

void main( )
{
	vec2 u = -1.0 + 2.0 *vUv,
         n = texture(iChannel1, u * .1).rg;  // Displacement
     vec4 f = textureLod(iChannel0, u, 2.5);
    
    // Loop through the different inverse sizes of drops
    for (float r = 4. ; r > 0. ; r--) {
        vec2 x = iResolution.xy * r * .015,  // Number of potential drops (in a grid)
             p = 6.28 * u * x + (n - .5) * 2.,
             s = sin(p);
        
        // Current drop properties. Coordinates are rounded to ensure a
        // consistent value among the fragment of a given drop.
        vec4 d = texture(iChannel1, round(u * x - 0.25) / x);
        
        // Drop shape and fading
        float t = (s.x+s.y) * max(0., 1. - fract(iTime * (d.b + .1) + d.g) * 2.);;
        
        // d.r -> only x% of drops are kept on, with x depending on the size of drops
        if (d.r < (5.-r)*.08 && t > .5) {
            // Drop normal
            vec3 v = normalize(-vec3(cos(p), mix(.2, 2., t-.5)));
            // fragColor = vec4(v * 0.5 + 0.5, 1.0);  // show normals
            
            // Poor man's refraction (no visual need to do more)
            f = texture(iChannel0, u - v.xy * .3);
        }
    }
    gl_FragColor=f;
}
