attribute float aScale;
attribute vec3 aDirection;

uniform float uSize;
uniform float uTime;

void main(){
  vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
  modelPosition.xyz += aDirection*uTime*10.0;
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  gl_PointSize = uSize * aScale - (uTime * 20.0);
}