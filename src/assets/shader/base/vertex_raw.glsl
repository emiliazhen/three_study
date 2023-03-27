precision lowp float;
// 先告诉GPU用什么精度
// {
//   highp: -2^16 ~ 2^16,
//   mediup: -2^10 ~ 2^10,
//   lowp: -2^8 ~ 2^8,
// }

attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
// 传递过来的时间
uniform float uTime;

// 传递给片元着色器
varying vec2 vUv;
varying float colorByZ;

void main(){
  vec4 modelPosition =  modelMatrix * vec4( position, 1.0 );
  modelPosition.z = sin((modelPosition.x + uTime)* 10.0) * 0.05;
  modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.05;
  colorByZ = modelPosition.z;
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  vUv = uv;
}