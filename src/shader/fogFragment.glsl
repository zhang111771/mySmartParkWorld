varying vec2 vUv;
uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

// Made by Darko Supe (omegasbk)
float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    
    vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
    vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
    return mix( rg.x, rg.y, f.z );
}

float fbm(vec3 v)
{
    float frequency = 1.0;
    float gain = 1.0;
    float damp = 0.5;
    float lacunarity = 1.81;
	float sum = 0.0;
    for (int i = 0; i < 6; i++)
    {
        sum += (1.0 - pow(abs(noise(v * frequency)), 2.0) )* (gain);
        frequency *= lacunarity;
        gain *= damp;
    }
    return sum * 0.75;
}

void main ()
{
	vec3 rd = normalize(vec3((vUv.xy-0.5*iResolution.xy)/iResolution.y, 1.));
	vec3 ro = vec3(0., 0., -2.);
    vec3 pos = vec3(ro.xy, ro.z += (iTime * 8.0));
    // pos.xz += iMouse.xy;
    float sum = 0.0;
    float t = 0.0;
	for (int i = 0; i < 150; i++)
    {
        pos += (rd * t);
        float n = fbm(pos / 32.0);
        sum += n;
        t = n;
    }
    sum /= 500.0;
    float blend = smoothstep(0.25, 0.5, sum * 1.1);
    float fog = mix(0.0, 1.0, blend);
    vec3 color = mix(vec3(sum * 3.2) * ((exp( sum * -0.45 )) * 1.25), vec3(0.0, 0.2, 0.5), fog);
    //fragColor = vec4(fog + vec3(0.0, 0.2, 0.5), 1.0);
    gl_FragColor = vec4(color, 1.0);
}