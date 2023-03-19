import '@/assets/styles/index.scss'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// import imgMaterialDoor from '@/assets/texture/material_door.jpg'
import imgCubeMinecraft from '@/assets/texture/img_cube_minecraft.png'

document.title = '03 材质'

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 10)

scene.add(camera)

// 创建物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const loader = new THREE.TextureLoader()
const doorTextureLoader = loader.load(imgCubeMinecraft)
// // 偏移
// doorTextureLoader.offset.set(0.5, 0.5)
// // 旋转
// doorTextureLoader.rotation = Math.PI / 4
// // 设置原点
// doorTextureLoader.center.set(0.5, 0.5)
// // 重复
// doorTextureLoader.repeat.set(2, 3)
// doorTextureLoader.wrapS = THREE.MirroredRepeatWrapping
// doorTextureLoader.wrapT = THREE.RepeatWrapping
// 显示算法
doorTextureLoader.minFilter = THREE.LinearFilter
doorTextureLoader.magFilter = THREE.LinearFilter
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: '0xffff00',
  map: doorTextureLoader,
})
// 根据集合体和材质创建物体
const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 添加到场景中
scene.add(mesh)

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
