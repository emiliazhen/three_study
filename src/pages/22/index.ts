import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import earthAtmos from '@/assets/texture/earth_atmos_2048.jpg'
import earthSpecular from '@/assets/texture/earth_specular_2048.jpg'
import earthNormal from '@/assets/texture/earth_normal_2048.jpg'
import moonAtmos from '@/assets/texture/moon_1024.jpg'
// ! css2d
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

document.title = `${window.location.pathname.slice(1)} HTML混合3D渲染`

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200)
// 设置相机位置
camera.position.set(0, 5, -10)
scene.add(camera)

const clock = new THREE.Clock()
const textureLoader = new THREE.TextureLoader()
// ! 创建物体
const earthGeometry = new THREE.SphereGeometry(1, 16, 16)
const earthMaterial = new THREE.MeshPhongMaterial({
  specular: 0x333333,
  shininess: 5,
  map: textureLoader.load(earthAtmos),
  specularMap: textureLoader.load(earthSpecular),
  normalMap: textureLoader.load(earthNormal),
  normalScale: new THREE.Vector2(0.85, 0.85),
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)
const moonGeometry = new THREE.SphereGeometry(0.27, 16, 16)
const moonMaterial = new THREE.MeshPhongMaterial({
  shininess: 5,
  map: textureLoader.load(moonAtmos),
})
const moon = new THREE.Mesh(moonGeometry, moonMaterial)
scene.add(moon)

// ! 添加提示标签
const earthTipEl = document.createElement('div')
earthTipEl.className = 'label'
earthTipEl.innerHTML = '地球'
const earthLabel = new CSS2DObject(earthTipEl)
earthLabel.position.set(0, 1, 0)
earth.add(earthLabel)

const chinaTipEl = document.createElement('div')
chinaTipEl.className = 'label-china'
chinaTipEl.innerHTML = '中国'
const chinaLabel = new CSS2DObject(chinaTipEl)
chinaLabel.position.set(-0.2, 0.6, -0.9)
earth.add(chinaLabel)

const moonTipEl = document.createElement('div')
moonTipEl.className = 'label'
moonTipEl.innerHTML = '月球'
const moonLabel = new CSS2DObject(moonTipEl)
moonLabel.position.set(0, 0.3, 0)
moon.add(moonLabel)
// ! 实例化2d渲染器
const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(labelRenderer.domElement)
labelRenderer.domElement.style.position = 'fixed'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.left = '0px'
labelRenderer.domElement.style.zIndex = '10'

// ! 射线检测
const raycaster = new THREE.Raycaster()

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 创建环境光
const light = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(light)
const dirLight = new THREE.DirectionalLight(0xffffff)
dirLight.position.set(0, 0, -1)
scene.add(dirLight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, labelRenderer.domElement)

// 动画
const renderFunction = () => {
  controls.update()
  const elapsed = clock.getElapsedTime()
  moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5)
  const chinaPosition = chinaLabel.position.clone()
  // 标签距离相机距离
  const labelDistance = chinaPosition.distanceTo(camera.position)
  // ! 向量（坐标）从世界空间投影到相机的标准化设备坐标（NDC）空间
  chinaPosition.project(camera)
  raycaster.setFromCamera(chinaPosition, camera)
  const intersects = raycaster.intersectObjects(scene.children, true)
  if (intersects.length === 0) {
    chinaLabel.element.classList.add('visible')
  } else {
    // 第一个是最近的
    const minDistance = intersects[0].distance
    if (minDistance < labelDistance) {
      chinaLabel.element.classList.remove('visible')
    } else {
      chinaLabel.element.classList.add('visible')
    }
  }
  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
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
  labelRenderer.setSize(window.innerWidth, window.innerHeight)
})
