precision lowp float;

varying vec4 vModelPosition;
varying vec4 vCurrentPosition;

void main(){
  vec4 redColor = vec4(1.0, 0.0, 0.0, 1.0);
  vec4 yellowColor = vec4(1.0, 1.0, 0.0, 1.0);
  vec4 mixColor = mix(yellowColor,redColor, vCurrentPosition.y / 3.0);
  gl_FragColor = vec4(mixColor.rgb,1.0);
  // 是否是正面
  if(gl_FrontFacing){
    gl_FragColor = vec4(mixColor.rgb - (vModelPosition.y-25.0)/85.0 - 0.1, 1.0);
  } else {
    gl_FragColor = vec4(mixColor.rgb, 1.0);
  }
}