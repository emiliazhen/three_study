precision lowp float;

attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// 传递给片元着色器
varying vec4 vModelPosition;
varying vec4 vCurrentPosition;

void main(){
  vec4 modelPosition =  modelMatrix * vec4( position, 1.0 );
  vModelPosition = modelPosition;
  vCurrentPosition = vec4( position, 1.0 );
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}