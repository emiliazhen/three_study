precision lowp float;

uniform vec3 uLowColor;
uniform vec3 uHighColor;
uniform float uOpacity;

// 接收顶点着色器传递过来的波动值
varying float vElevation;

void main(){
  // 根据当前波动值[-1,1]来转换成[0,1]的值
  float colorValue = (vElevation + 1.0)/2.0;
  // 颜色混合
  vec3 color = mix(uLowColor,uHighColor,colorValue);
  gl_FragColor = vec4(color, uOpacity);
}