uniform float uToTopLineTime;
uniform float uToTopLineWidth;
varying vec3 vPosition;
uniform vec3 uColor;
uniform float uOpacity;
void main(){
  float toTopLineMix=-(vPosition.y-uToTopLineTime)*(vPosition.y-uToTopLineTime)+uToTopLineWidth;

  if(toTopLineMix>0.0){
    gl_FragColor=mix(gl_FragColor,vec4(uColor,1),toTopLineMix/uToTopLineWidth);
  }else{
    gl_FragColor=vec4(1,0,0,1);
  }

}