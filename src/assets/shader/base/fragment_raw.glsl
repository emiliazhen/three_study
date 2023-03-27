precision lowp float;

// 传递过来的texture
uniform sampler2D uTexture;

varying vec2 vUv;
varying float colorByZ;

void main(){
  // gl_FragColor = vec4(vUv, 0.0, 1.0);
  // gl_FragColor = vec4(1.0 * (colorByZ * 3.0 + 0.5), 0.0 , 0.0, 1.0);

  //根据uv取出对应的颜色
  vec4 textureColor = texture2D(uTexture,vUv);
  textureColor.rgb *= colorByZ * 2.0 + 0.8;
  gl_FragColor = textureColor;
}