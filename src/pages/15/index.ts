import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'

import rawVertexShader from '@/assets/shader/lantern/vertex.glsl'
import rawFragmentShader from '@/assets/shader/lantern/fragment.glsl'
import lanternModel from '@/assets/model/lantern.glb'
import textureHDR from '@/assets/texture/sky_outside.hdr'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入RGBE加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

document.title = '15 着色器绘制孔明灯'

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, -5, 10)
scene.add(camera)

// 加载HDR
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync(textureHDR).then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: rawVertexShader,
  fragmentShader: rawFragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: {
    uTime: {
      value: 0,
    },
  },
})

const gltfLoader = new GLTFLoader()
gltfLoader.load(lanternModel, (gltf) => {
  console.log(gltf)
  ;(gltf.scene.children[0] as any).material = rawShaderMaterial
  scene.add(gltf.scene)
})
// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// ! 纹理编码
renderer.outputEncoding = THREE.sRGBEncoding
// ! 色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping
// ! 曝光度
renderer.toneMappingExposure = 0.2
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// 动画
const clock = new THREE.Clock()
const renderFunction = () => {
  // planeRawShaderMaterial.uniforms.uTime.value = clock.getElapsedTime()
  controls.update()
  renderer.render(scene, camera)
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
