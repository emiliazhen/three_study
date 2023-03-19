import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'
import particlesStar from '@/assets/texture/particles_star.png'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import textureHDR from '@/assets/texture/orbital.hdr'
document.title = '08 星系'

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 10)

scene.add(camera)
// 加载HDR
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync(textureHDR).then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})
const textureLoader = new THREE.TextureLoader()
const particlesPointLoader = textureLoader.load(particlesStar)
// 创建点
const pointCount = 8000
const lineCount = 12
const radius = 4
// 中心点颜色
const centerColor = new THREE.Color('#ff6030')
// 边缘颜色
const endColor = new THREE.Color('#1b3984')
// 随机位置点
const pointsArray = new Float32Array(pointCount * 3)
// 顶点颜色
const colorArray = new Float32Array(pointCount * 3)
for (let i = 0; i < pointCount; i++) {
  // 当前角度
  const currentAngle = (i % lineCount) * ((Math.PI * 2) / lineCount)
  const currentIndex = i * 3
  const currentRadius = Math.random() * radius * Math.pow(Math.random(), 3)
  const rotateRandomX = 0.1 * Math.pow(1 - 2 * Math.random(), 3) * (radius - currentRadius)
  const rotateRandomY = 0.1 * Math.pow(1 - 2 * Math.random(), 3) * (radius - currentRadius)
  const rotateRandomZ = 0.1 * Math.pow(1 - 2 * Math.random(), 3) * (radius - currentRadius)
  pointsArray[currentIndex] = Math.cos(currentAngle + currentRadius * 0.3) * currentRadius + rotateRandomX
  pointsArray[currentIndex + 1] = rotateRandomY
  pointsArray[currentIndex + 2] = Math.sin(currentAngle + currentRadius * 0.3) * currentRadius + rotateRandomZ
  const mixColor = centerColor.clone()
  mixColor.lerp(endColor, currentRadius / radius)
  colorArray[currentIndex] = mixColor.r
  colorArray[currentIndex + 1] = mixColor.g
  colorArray[currentIndex + 2] = mixColor.b
}
const galaxyGeometry = new THREE.BufferGeometry()
const pointsMaterial = new THREE.PointsMaterial({
  size: 0.1,
  // 相机深度而衰减
  sizeAttenuation: true,
  map: particlesPointLoader,
  transparent: true,
  opacity: 0.5,
  alphaMap: particlesPointLoader,
  // 关闭相机对深度缓冲区影响
  depthWrite: false,
  // 叠加算法
  blending: THREE.AdditiveBlending,
  vertexColors: true,
})
galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(pointsArray, 3))
galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
const points = new THREE.Points(galaxyGeometry, pointsMaterial)
// 添加到场景中
scene.add(points)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

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
