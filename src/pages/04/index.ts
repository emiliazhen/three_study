import '@/assets/styles/index.scss'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入RGBE加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import imgFactoryWall from '@/assets/texture/factory_wall_diff.jpg'
import imgFactoryWallAo from '@/assets/texture/factory_wall_ao.jpg'
import imgFactoryWallDisp from '@/assets/texture/factory_wall_disp.jpg'
import imgFactoryWallRough from '@/assets/texture/factory_wall_rough.jpg'
import imgFactoryWallSpec from '@/assets/texture/factory_wall_spec.jpg'
import imgFactoryWallNor from '@/assets/texture/factory_wall_nor_gl.jpg'
// import imgNX from '@/assets/texture/negx.jpg'
// import imgNY from '@/assets/texture/negy.jpg'
// import imgNZ from '@/assets/texture/negz.jpg'
// import imgPX from '@/assets/texture/posx.jpg'
// import imgPY from '@/assets/texture/posy.jpg'
// import imgPZ from '@/assets/texture/posz.jpg'
import textureHDR from '@/assets/texture/neon_photostudio.hdr'
document.title = '04 贴图'

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 10)

scene.add(camera)

// 创建物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100)

// 加载管理器
const loaderManager = new THREE.LoadingManager(
  () => {
    console.log('全部加载完成')
  },
  (url, loaded, total) => {
    console.log(`当前已加载 ${Math.floor((loaded / total) * 10000) / 100}%`)
  }
)
const textureLoader = new THREE.TextureLoader(loaderManager)
// 纹理贴图
const factoryTextureLoader = textureLoader.load(imgFactoryWall, () => {
  console.log('纹理贴图加载完成！')
})
// 环境遮挡贴图
const factoryAoTextureLoader = textureLoader.load(imgFactoryWallAo)
// 置换贴图
const factoryDispTextureLoader = textureLoader.load(imgFactoryWallDisp)
// 粗糙度贴图
const factoryRoughTextureLoader = textureLoader.load(imgFactoryWallRough)
// 金属度贴图
const factoryMetalTextureLoader = textureLoader.load(imgFactoryWallSpec)
// 法线贴图
const factoryNorTextureLoader = textureLoader.load(imgFactoryWallNor)

// 创建环境光
const light = new THREE.AmbientLight(0x404040, 0.8)
scene.add(light)
// 创建平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(10, 10, 10)
const directionalLightTarget = new THREE.Object3D()
directionalLightTarget.position.set(0, 0, 0)
scene.add(directionalLightTarget)
directionalLight.target = directionalLightTarget
scene.add(directionalLight)
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: '#fff',
  map: factoryTextureLoader,
  aoMap: factoryAoTextureLoader,
  aoMapIntensity: 1,
  displacementMap: factoryDispTextureLoader,
  displacementScale: 0.1,
  roughness: 0.5,
  roughnessMap: factoryRoughTextureLoader,
  metalness: 0.5,
  metalnessMap: factoryMetalTextureLoader,
  normalMap: factoryNorTextureLoader,
})
// 根据集合体和材质创建物体
const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 添加到场景中
scene.add(mesh)
// 添加球
const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32)
const ballMaterial = new THREE.MeshStandardMaterial({ metalness: 0.6, roughness: 0.1 })
const ballSphere = new THREE.Mesh(ballGeometry, ballMaterial)
ballSphere.position.set(0.5, 0.5, 0.5)
scene.add(ballSphere)
// const cubeTextureLoader = new THREE.CubeTextureLoader()
// const envMapTexture = cubeTextureLoader.load([imgPX, imgNX, imgPY, imgNY, imgPZ, imgNZ])
// // 给场景添加环境贴图
// scene.background = envMapTexture
// // 给场景里的所有物体都添加默认的环境贴图
// scene.environment = envMapTexture

// 加载HDR
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync(textureHDR).then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

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
