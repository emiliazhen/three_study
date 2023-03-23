import '@/assets/styles/index.scss'
import * as THREE from 'three'
import * as dat from 'dat.gui'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

document.title = '05 光照'

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 10)
scene.add(camera)

// 创建环境光
const light = new THREE.AmbientLight(0x404040, 0.8)
scene.add(light)
// 创建平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
directionalLight.position.set(10, 10, 10)
const directionalLightTarget = new THREE.Object3D()
directionalLightTarget.position.set(0, 0, 0)
scene.add(directionalLightTarget)
// ! 设置光照投射阴影
directionalLight.castShadow = true
directionalLight.target = directionalLightTarget
// 设置平行光属性
directionalLight.shadow.radius = 20
directionalLight.shadow.mapSize.set(4096, 4096)
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 500
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
scene.add(directionalLight)

// 点光源
const pointGeometry = new THREE.SphereGeometry(0.02)
const pointMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
})
const pointSphere = new THREE.Mesh(pointGeometry, pointMaterial)
pointSphere.position.set(0.6, 0.25, 0.6)
const pointLight = new THREE.PointLight(0xff0000, 0.5, 3, 2)
pointLight.castShadow = true
pointSphere.add(pointLight)
scene.add(pointSphere)

// 添加球
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const ballMaterial = new THREE.MeshStandardMaterial()
const ballSphere = new THREE.Mesh(ballGeometry, ballMaterial)
ballSphere.position.set(0, 0, 0)
// ! 设置物体阴影投射
ballSphere.castShadow = true
scene.add(ballSphere)
// 平面
const planeGeometry = new THREE.PlaneGeometry(3, 3, 32)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.set(0, -0.6, 0)
plane.rotation.x = -Math.PI / 2
// ! 设置接收阴影投射
plane.receiveShadow = true
scene.add(plane)
// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// ! 设置渲染器阴影计算
renderer.shadowMap.enabled = true

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// 设置gui
const gui = new dat.GUI()
gui
  .add(directionalLight.shadow.camera as any, 'near')
  .min(0)
  .max(20)
  .onChange(() => {
    directionalLight.shadow.camera.updateProjectionMatrix()
  })
// 动画
const clock = new THREE.Clock()
const renderFunction = () => {
  const time = clock.getElapsedTime()
  pointSphere.position.x = Math.cos(time) * 1
  pointSphere.position.z = Math.sin(time) * 1
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
