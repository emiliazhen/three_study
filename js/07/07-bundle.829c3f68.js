(self.webpackChunkthree_study=self.webpackChunkthree_study||[]).push([[746],{1193:function(n,e,t){"use strict";var i=t(9477),r=t(2606),o=t.n(r);document.title="".concat(window.location.pathname.slice(1)," 下雪");var a=new i.xsS,d=new i.cPb(75,window.innerWidth/window.innerHeight,.1,30);d.position.set(0,0,60),a.add(d);for(var w=new i.dpR,s=new i.u9r,u=new Float32Array(12e3),c=0;c<12e3;c++)u[c]=50-100*Math.random();var p=w.load(o()),h=new i.UY4({size:.5,sizeAttenuation:!0,map:p,transparent:!0,opacity:.8,depthWrite:!1,blending:i.WMw});s.setAttribute("position",new i.TlE(u,3));var l=new i.woe(s,h);a.add(l);var m=new i.CP7;m.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(m.domElement);var f=new i.y8_;a.add(f);var v=new i.SUY,g=function(){l.rotation.x=.4*v.getElapsedTime(),l.rotation.y=.1*v.getElapsedTime(),m.render(a,d),requestAnimationFrame(g)};g(),window.addEventListener("resize",(function(){d.aspect=window.innerWidth/window.innerHeight,d.updateProjectionMatrix(),m.setSize(window.innerWidth,window.innerHeight)}))},2606:function(n,e,t){n.exports=t.p+"images/particles_snow.b5a0a83d62.png"}},function(n){var e=function(e){return n(n.s=e)};n.O(0,[736,592],(function(){return e(3662),e(8188),e(7633),e(1193)}));n.O()}]);