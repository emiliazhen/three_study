import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'
import gasp from 'gsap'
import rawVertexShader from '@/assets/shader/lantern/vertex.glsl'
import rawFragmentShader from '@/assets/shader/lantern/fragment.glsl'
import lanternModel from '@/assets/model/lantern.glb'
import textureHDR from '@/assets/texture/sky_outside.hdr'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入RGBE加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

document.title = '15 着色器绘制孔明灯'

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, -5, 10)
scene.add(camera)

// 加载HDR
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync(textureHDR).then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: rawVertexShader,
  fragmentShader: rawFragmentShader,
  side: THREE.DoubleSide,
  // ! 影响正反面片元着色
  // transparent: true,
})

// ! GLTF读取
const gltfLoader = new GLTFLoader()
gltfLoader.load(lanternModel, (gltf) => {
  const lanternWrap = gltf.scene.children[0] as THREE.Mesh
  lanternWrap.material = rawShaderMaterial
  for (let index = 0; index < 150; index++) {
    const currentLantern = gltf.scene.clone(true)
    const x = (Math.random() - 0.5) * 300
    const z = (Math.random() - 0.5) * 300
    const y = Math.random() * 60 + 25
    currentLantern.position.set(x, y, z)
    gasp.to(currentLantern.rotation, {
      y: 2 * Math.PI,
      duration: 10 + Math.random() * 30,
      repeat: -1,
    })
    gasp.to(currentLantern.position, {
      x: `+=${Math.random() * 5}`,
      y: `+=${Math.random() * 10}`,
      duration: 5 + Math.random() * 10,
      repeat: -1,
      yoyo: true,
    })
    scene.add(currentLantern)
  }
})
// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// ! 纹理编码
renderer.outputEncoding = THREE.sRGBEncoding
// ! 色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping
// ! 曝光度
renderer.toneMappingExposure = 0.15
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
// 自动旋转
controls.autoRotate = true
controls.autoRotateSpeed = 0.1
controls.maxPolarAngle = (Math.PI / 4) * 3
controls.minPolarAngle = (Math.PI / 4) * 3

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
