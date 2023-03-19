import '@/assets/styles/index.scss'
import './index.scss'
import * as dat from 'dat.gui'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

document.title = '01 简单几何体'

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 10)

scene.add(camera)

// 创建物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 'red',
})
// 根据集合体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 添加到场景中
scene.add(cube)
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
// 设置gui
const gui = new dat.GUI()
const guiObject = {
  color: '#ffff00',
  fullScreenClick: () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.body.requestFullscreen()
    }
  },
}
gui.add(guiObject, 'fullScreenClick').name('全屏切换')
const folder = gui.addFolder('设置立方体')
folder.add(cube.position, 'x').min(0).max(5).step(0.01).name('x轴')
folder
  .addColor(guiObject, 'color')
  .onChange((value) => {
    cube.material.color.set(value)
  })
  .name('颜色')
folder.add(cube.material, 'wireframe').name('网格')
folder.add(cube, 'visible').name('是否显示')
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
