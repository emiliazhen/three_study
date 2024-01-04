import '@/assets/styles/index.scss'
import * as THREE from 'three'
import * as dat from 'dat.gui'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import imgNX from '@/assets/texture/street_nx.jpg'
import imgNY from '@/assets/texture/street_ny.jpg'
import imgNZ from '@/assets/texture/street_nz.jpg'
import imgPX from '@/assets/texture/street_px.jpg'
import imgPY from '@/assets/texture/street_py.jpg'
import imgPZ from '@/assets/texture/street_pz.jpg'
import damagedHelmetModel from '@/assets/model/damagedHelmet.gltf'
import damagedHelmetNormalMap from '@/assets/texture/damagedHelmetModel_normalMap.png'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// ! 导入后期效果合成器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// ! three框架本身自带效果
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

document.title = `${window.location.pathname.slice(1)} 效果合成与后期处理`

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 50)
// 设置相机位置
camera.position.set(1, 1, 2)

scene.add(camera)
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([imgPX, imgNX, imgPY, imgNY, imgPZ, imgNZ])
// 给场景添加环境贴图
scene.background = envMapTexture
// 给场景里的所有物体都添加默认的环境贴图
scene.environment = envMapTexture

const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.position.set(0, 0, 200)
scene.add(directionLight)

// ! 模型加载
const gltfLoader = new GLTFLoader()
gltfLoader.load(damagedHelmetModel, (gltf) => {
  const mesh = gltf.scene.children[0] as THREE.Mesh
  // 设定自定义的深度材质
  scene.add(mesh)
})

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

// ! 合成效果
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(window.innerWidth, window.innerHeight)
// !添加渲染通道
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// ! 点效果
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

// ! 抗锯齿
const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight)
effectComposer.addPass(smaaPass)

// ! 发光效果
const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
effectComposer.addPass(unrealBloomPass)

// ! 屏幕闪动
// const glitchPass = new GlitchPass()
// effectComposer.addPass(glitchPass)

// ! 创建gui对象
const gui = new dat.GUI()
gui.add(renderer, 'toneMappingExposure').min(0).max(2).step(0.01)
gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.01)
gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.01)
gui.add(unrealBloomPass, 'threshold').min(0).max(2).step(0.01)

// ! 着色器写渲染通道
const colorParams = {
  r: 0,
  g: 0,
  b: 0,
}
const shaderPass = new ShaderPass({
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uColor: {
      value: new THREE.Color(colorParams.r, colorParams.g, colorParams.b),
    },
  },
  vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
    `,
  // tDiffuse采样, 拿到顶点着色器传过来的uv,采到当前点的颜色，再做变更后赋值。
  fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D tDiffuse;
      uniform vec3 uColor;
      void main(){
        vec4 color = texture2D(tDiffuse,vUv);
        // gl_FragColor = vec4(vUv,0.0,1.0);
        color.xyz+=uColor;
        gl_FragColor = color;
      }
    `,
})
effectComposer.addPass(shaderPass)
gui
  .add(colorParams, 'r')
  .min(-1)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderPass.uniforms.uColor.value.r = value
  })
gui
  .add(colorParams, 'g')
  .min(-1)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderPass.uniforms.uColor.value.g = value
  })
gui
  .add(colorParams, 'b')
  .min(-1)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderPass.uniforms.uColor.value.b = value
  })
// ! 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load(damagedHelmetNormalMap)
const techPass = new ShaderPass({
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uNormalMap: {
      value: null,
    },
    uTime: {
      value: 0,
    },
  },
  vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
    `,
  fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D tDiffuse;
      uniform sampler2D uNormalMap;
      uniform float uTime;
      void main(){
        // 波浪效果 改uv
        vec2 newUv = vUv;
        newUv += sin(newUv.x*10.0+uTime*0.5)*0.01;

        vec4 color = texture2D(tDiffuse,newUv);
        vec4 normalColor = texture2D(uNormalMap,vUv);
        // 设置光线射入角度 normalize：向量value归一化,长度变为1，方向不变，即返回值单位向量；
        vec3 lightDirection = normalize(vec3(-5,5,2));
        // 亮度调节 clamp：规整输入值，限制值在某一个范围内；dot：两向量点积
        float lightness = clamp(dot(normalColor.xyz,lightDirection),0.0,1.0);
        color.xyz+=lightness;
        gl_FragColor = color;
      }
    `,
})
techPass.material.uniforms.uNormalMap.value = normalTexture
effectComposer.addPass(techPass)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
const clock = new THREE.Clock()
// 动画
const renderFunction = () => {
  controls.update()
  // renderer.render(scene, camera)
  // ! 渲染
  effectComposer.render()
  techPass.material.uniforms.uTime.value = clock.getElapsedTime()
  requestAnimationFrame(renderFunction)
}
renderFunction()
//  窗口变更
window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像头矩阵
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
