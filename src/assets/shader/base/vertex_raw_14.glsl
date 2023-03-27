precision lowp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
// 传递过来的时间
uniform float uTime;

// 传递给片元着色器
varying vec2 vUv;

void main(){
  vec4 modelPosition =  modelMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  vUv = uv;
}