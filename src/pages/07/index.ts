import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'
import particlesSnow from '@/assets/texture/particles_snow.png'

document.title = '06 下雪'

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30)
// 设置相机位置
camera.position.set(0, 0, 60)

scene.add(camera)

const textureLoader = new THREE.TextureLoader()

// 创建点-星
const countSnow = 4000
const snowGeometry = new THREE.BufferGeometry()
// 设置缓冲区数组
const pointsSnow = new Float32Array(countSnow * 3)
for (let index = 0; index < countSnow * 3; index++) {
  pointsSnow[index] = 50 - Math.random() * 100
}
const particlesSnowLoader = textureLoader.load(particlesSnow)
const snowMaterial = new THREE.PointsMaterial({
  size: 0.5,
  sizeAttenuation: true,
  map: particlesSnowLoader,
  transparent: true,
  opacity: 0.8,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
})
snowGeometry.setAttribute('position', new THREE.BufferAttribute(pointsSnow, 3))
const snow = new THREE.Points(snowGeometry, snowMaterial)
scene.add(snow)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// 动画
const clock = new THREE.Clock()
const renderFunction = () => {
  snow.rotation.x = clock.getElapsedTime() * 0.4
  snow.rotation.y = clock.getElapsedTime() * 0.1
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
