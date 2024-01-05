(self.webpackChunkthree_study=self.webpackChunkthree_study||[]).push([[686],{3047:function(e,n,r){"use strict";var t=r(9477),o=r(2606),i=r.n(o),a=r(977),l=r.n(a),d=r(4829),u=r.n(d),s=r(9365);document.title="".concat(window.location.pathname.slice(1)," 着色器设置点材质");var v=new t.xsS,g=new t.cPb(75,window.innerWidth/window.innerHeight,.1,1e3);g.position.set(0,0,10),v.add(g);var w,m=new t.dpR,c=m.load(u()),A=m.load(i()),x=m.load(l()),f=null,h=null,p=800,C=5,P=4,T="#ff6030",I="#1b3984",M=new t.Ilk(T),b=new t.Ilk(I);!function(){null!==h&&(null==f||f.dispose(),null==w||w.dispose(),v.remove(h)),f=new t.u9r;for(var e=new Float32Array(3*p),n=new Float32Array(3*p),r=new Float32Array(p),o=new Float32Array(p),i=0;i<p;i++){var a=3*i,l=i%P*(2*Math.PI/P),d=Math.random()*C,u=.5*Math.pow(2*Math.random()-1,3)*(C-d)*.3,s=.5*Math.pow(2*Math.random()-1,3)*(C-d)*.3,g=.5*Math.pow(2*Math.random()-1,3)*(C-d)*.3;e[a]=Math.cos(l)*d+u,e[a+1]=s,e[a+2]=Math.sin(l)*d+g;var m=M.clone();m.lerp(b,d/C),n[a]=m.r,n[a+1]=m.g,n[a+2]=m.b,r[a]=Math.random(),o[a]=i%3}f.setAttribute("position",new t.TlE(e,3)),f.setAttribute("color",new t.TlE(n,3)),f.setAttribute("aScale",new t.TlE(r,1)),f.setAttribute("imgIndex",new t.TlE(o,1)),w=new t.jyz({vertexShader:"varying vec2 vUv;\r\nvarying vec3 vColor;\r\nattribute float imgIndex;\r\nattribute float aScale;\r\nvarying float vImgIndex;\r\nuniform float uTime;\r\nvoid main(){\r\n  vec4 modelPosition = modelMatrix * vec4( position, 1.0 );\r\n  // 获取定点的角度\r\n  float angle = atan(modelPosition.x,modelPosition.z);\r\n  // 获取顶点到中心的距离\r\n  float distanceToCenter = length(modelPosition.xz);\r\n  // 根据顶点到中心的距离，设置旋转偏移度数\r\n  float angleOffset = 1.0/distanceToCenter*uTime;\r\n  // 目前旋转的度数\r\n  angle+=angleOffset;\r\n\r\n  modelPosition.x = cos(angle)*distanceToCenter;\r\n  modelPosition.z = sin(angle)*distanceToCenter;\r\n\r\n  // 根据viewPosition的z坐标决定是否原理摄像机\r\n  vec4 viewPosition = viewMatrix*modelPosition;\r\n  gl_Position =  projectionMatrix * viewPosition;\r\n  gl_PointSize =200.0/-viewPosition.z*aScale;\r\n  vUv = uv;\r\n  vImgIndex=imgIndex;\r\n  vColor = color;\r\n} ",fragmentShader:"varying vec2 vUv;\r\n\r\nuniform sampler2D uTexture;\r\nuniform sampler2D uTexture1;\r\nuniform sampler2D uTexture2;\r\nvarying vec3 vColor;\r\nvarying float vImgIndex;\r\nvoid main(){\r\n  // gl_FragColor = vec4(gl_PointCoord,0.0,1.0);\r\n\r\n  // 设置渐变圆\r\n  // float strength = distance(gl_PointCoord,vec2(0.5));\r\n  // strength*=2.0;\r\n  // strength = 1.0-strength;\r\n  // gl_FragColor = vec4(strength);\r\n\r\n  // 根据纹理设置图案\r\n  vec4 textureColor;\r\n  if(vImgIndex==0.0){\r\n      textureColor = texture2D(uTexture,gl_PointCoord);\r\n  }else if(vImgIndex==1.0){\r\n      textureColor = texture2D(uTexture1,gl_PointCoord);\r\n  }else{\r\n      textureColor = texture2D(uTexture2,gl_PointCoord);\r\n  }\r\n  // gl_FragColor = vec4(textureColor.rgb,textureColor.r) ;\r\n  gl_FragColor = vec4(vColor,textureColor.r);\r\n}",transparent:!0,vertexColors:!0,blending:t.WMw,depthWrite:!1,uniforms:{uTexture:{value:c},uTexture1:{value:A},uTexture2:{value:x},uColor:{value:M},uTime:{value:0}}}),h=new t.woe(f,w),v.add(h)}();var E=new t.CP7;E.shadowMap.enabled=!0,E.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(E.domElement);var S=new s.z(g,E.domElement);S.enableDamping=!0;var y=new t.y8_;v.add(y);var F=new t.SUY,z=function(){S.update();var e=F.getElapsedTime();w.uniforms.uTime.value=e,E.render(v,g),requestAnimationFrame(z)};z(),window.addEventListener("resize",(function(){g.aspect=window.innerWidth/window.innerHeight,g.updateProjectionMatrix(),E.setSize(window.innerWidth,window.innerHeight),E.setPixelRatio(window.devicePixelRatio)}))},977:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAolBMVEUAAAC0tLSRkZGoqKh6enoICAi/v7+GhoZubm5jY2McHBzW1tbKysqdnZ0PDw9MTEwwMDArKysUFBRYWFju7u7m5ubCwsK4uLiKioo/Pz81NTUXFxfc3Nyurq6srKyenp6ZmZl1dXVXV1dERERBQUEoKCggICAkJCTw8PDr6+vS0tLFxcWkpKSgoKCEhISBgYFwcHBcXFw8PDw0NDQSEhK6urr/Mn5rAAABGklEQVRIx+3Q226CQBAG4F/bpRZbyyJnAUEEPFu1ff9X6wAtxtA4xisv9ssmO7uTPztZKIry0IQ0pGGYIKZBpRS4ia438RIoxfmGzwFp5PY8oCgAr+dGaX3J56S2tCxrER6AQ7igcqlJFGBMgG97WLFt37d/S40a7IPe6q3mhA6tpl553LAmzHit1Rx3OHSdpl7H1GAmzehjOtwoY2Y1kW3ip454kzEvfkH2t8n0vTb925NtX1LrGgGkSb8jSavWVSMYe2/3cmHn7Q1qgEsenzuOVY5PBoPPwRkdgjbHTft6oZ2TT+az8Wxco0K2OZZA8dEq6XgzAd2f+3Navt7JMUnzFJDTpJNjjXKZ5yPcQei6wF2EgKIoyn9+ANSKF/huI1tiAAAAAElFTkSuQmCC"},2606:function(e,n,r){e.exports=r.p+"images/particles_snow.b5a0a83d62.png"}},function(e){var n=function(n){return e(e.s=n)};e.O(0,[736,592],(function(){return n(3662),n(8188),n(7633),n(3047)}));e.O()}]);