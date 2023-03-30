import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import textureHDR from '@/assets/texture/bathtub.hdr'
import { Water } from 'three/examples/jsm/objects/Water2.js'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
document.title = `${window.location.pathname.slice(1)} 浴缸`

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
// 设置相机位置
camera.position.set(0, 0, 5)
scene.add(camera)

// 加载HDR
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync(textureHDR).then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(1, 1, 512, 512)
const water = new Water(planeGeometry, {
  color: '#ffffff',
  scale: 1,
  flowDirection: new THREE.Vector2(1, 1),
  textureWidth: 1024,
  textureHeight: 1024,
})
water.rotation.x = -Math.PI / 2
// 添加到场景中
scene.add(water)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.5
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

// 动画
const renderFunction = () => {
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
