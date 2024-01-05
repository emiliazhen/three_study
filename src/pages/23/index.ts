import '@/assets/styles/index.scss'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

document.title = `${window.location.pathname.slice(1)} 曲线轨迹运动`

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 6, 26)

scene.add(camera)

// 创建物体
const cubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
const cubeMaterial = new THREE.MeshNormalMaterial()
// 根据集合体和材质创建物体
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 添加到场景中
scene.add(cubeMesh)

// ! 曲线
const curve = new THREE.CatmullRomCurve3(
  [new THREE.Vector3(-10, 0, 10), new THREE.Vector3(-5, 5, 5), new THREE.Vector3(0, 0, 5), new THREE.Vector3(5, -5, 5), new THREE.Vector3(10, 0, 10)],
  true // 是否闭合
)
// getPoints 分割后获取51个点
const points = curve.getPoints(50)
const curveGeometry = new THREE.BufferGeometry().setFromPoints(points)
const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 })
const curveObject = new THREE.Line(curveGeometry, curveMaterial)
scene.add(curveObject)
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

const clock = new THREE.Clock()
// 动画
const renderFunction = () => {
  controls.update()
  const elapsed = clock.getElapsedTime()
  const time = (elapsed / 10) % 1
  // ! getPoint获取曲线上的位置，必须在0-1范围内
  const point = curve.getPoint(time)
  cubeMesh.position.copy(point)

  renderer.render(scene, camera)
  cubeMesh.rotation.x += 0.01
  cubeMesh.rotation.z += 0.03
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
