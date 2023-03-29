precision lowp float;

uniform vec3 uLowColor;
uniform vec3 uHighColor;
varying float vElevation;

void main(){
  float colorValue = (vElevation + 1.0)/2.0;
  vec3 color = mix(uLowColor,uHighColor,colorValue);
  gl_FragColor = vec4(color, 1.0);
}