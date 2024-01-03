import '@/assets/styles/index.scss'
import * as THREE from 'three'
import particlesPoint from '@/assets/texture/particles_point.png'
import particlesStar from '@/assets/texture/particles_star.png'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

document.title = `${window.location.pathname.slice(1)} 点`

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 10)

scene.add(camera)

const textureLoader = new THREE.TextureLoader()
const particlesPointLoader = textureLoader.load(particlesPoint)
// 创建点
const ballGeometry = new THREE.SphereGeometry(5, 20, 20)
// const ballMaterial = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
//   wireframe: true,
// })
const pointsMaterial = new THREE.PointsMaterial({
  color: 0xff0000,
  size: 0.5,
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
})
const points = new THREE.Points(ballGeometry, pointsMaterial)
// 添加到场景中
scene.add(points)

// 创建点-星
const countStar = 1000
const starGeometry = new THREE.BufferGeometry()
// 设置缓冲区数组
const pointsStar = new Float32Array(countStar * 3)
// 设置粒子顶点颜色
const colorsStar = new Float32Array(countStar * 3)
for (let index = 0; index < countStar * 3; index++) {
  pointsStar[index] = 20 - Math.random() * 40
  colorsStar[index] = Math.random()
}
const particlesStarLoader = textureLoader.load(particlesStar)
const starMaterial = new THREE.PointsMaterial({
  // 设置启动顶点颜色
  vertexColors: true,
  size: 0.5,
  sizeAttenuation: true,
  map: particlesStarLoader,
  transparent: true,
  opacity: 0.6,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
})
starGeometry.setAttribute('position', new THREE.BufferAttribute(pointsStar, 3))
starGeometry.setAttribute('color', new THREE.BufferAttribute(colorsStar, 3))
const star = new THREE.Points(starGeometry, starMaterial)
scene.add(star)

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
