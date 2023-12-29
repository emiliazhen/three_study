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
import startPointFragment from '@/assets/shader/fireworks/fragment_first.glsl'
import startPointVertex from '@/assets/shader/fireworks/vertex_first.glsl'
import boomFragment from '@/assets/shader/fireworks/fragment_boom.glsl'
import boomVertex from '@/assets/shader/fireworks/vertex_boom.glsl'

document.title = `${window.location.pathname.slice(1)} 烟花`

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 20)
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
renderer.toneMappingExposure = 0.05
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 自动旋转
// controls.autoRotate = true
// controls.autoRotateSpeed = 0.1
controls.maxPolarAngle = (Math.PI / 4) * 3
controls.minPolarAngle = (Math.PI / 4) * 1
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

const fireworksList: Array<Fireworks> = []
// 动画
const renderFunction = () => {
  controls.update()
  fireworksList.forEach((item) => {
    item.update()
  })
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

// 烟花类
class Fireworks {
  private color
  private endPosition
  // 计时
  private clock
  // 物体
  private startGeometry
  // 材质
  private startMaterial
  private startPoint
  // 爆炸
  private boomGeometry
  private boomMaterial
  private boomPoint
  constructor(color: string, endPosition: { x: number; y: number; z: number }) {
    this.color = color
    this.endPosition = endPosition
    const firstPositionArray = new Float32Array(3)
    firstPositionArray[0] = 0
    firstPositionArray[1] = 0
    firstPositionArray[2] = 0
    this.startGeometry = new THREE.BufferGeometry()
    this.startMaterial = new THREE.ShaderMaterial({
      vertexShader: startPointVertex,
      fragmentShader: startPointFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: true,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 0,
        },
      },
    })
    this.startGeometry.setAttribute('position', new THREE.BufferAttribute(firstPositionArray, 3))
    // 传入向量
    const vectorArray = new Float32Array(3)
    vectorArray[0] = endPosition.x
    vectorArray[1] = endPosition.y
    vectorArray[2] = endPosition.z
    this.startGeometry.setAttribute('aStep', new THREE.BufferAttribute(vectorArray, 3))
    this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial)
    scene.add(this.startPoint)
    this.clock = new THREE.Clock()
    // 爆炸
    this.boomGeometry = new THREE.BufferGeometry()
    this.boomMaterial = new THREE.ShaderMaterial({
      vertexShader: boomVertex,
      fragmentShader: boomFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 0,
        },
      },
    })
    // 爆炸粒子数量
    const boomCount = 180 + Math.floor(Math.random() * 180)
    // 爆炸位置
    const boomPositionArray = new Float32Array(boomCount * 3)
    // 爆炸粒子大小
    const boomScaleArray = new Float32Array(boomCount)
    // 爆炸方向
    const boomDirectionArray = new Float32Array(boomCount * 3)
    for (let i = 0; i < boomCount; i++) {
      boomPositionArray[i * 3 + 0] = endPosition.x
      boomPositionArray[i * 3 + 1] = endPosition.y
      boomPositionArray[i * 3 + 2] = endPosition.z
      // 随机弧度
      const theta = Math.random() * 2 * Math.PI
      const theta2 = Math.random() * 2 * Math.PI
      // 随机半径
      const r = Math.random()
      boomDirectionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(theta2)
      boomDirectionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(theta2)
      boomDirectionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(theta2)
    }
    this.boomGeometry.setAttribute('position', new THREE.BufferAttribute(boomPositionArray, 3))
    this.boomGeometry.setAttribute('aScale', new THREE.BufferAttribute(boomScaleArray, 3))
    this.boomGeometry.setAttribute('aDirection', new THREE.BufferAttribute(boomDirectionArray, 3))
    this.boomPoint = new THREE.Points(this.boomGeometry, this.boomMaterial)
    scene.add(this.boomPoint)
  }
  update() {
    const time = this.clock.getElapsedTime()
    if (time < 1) {
      this.startMaterial.uniforms.uTime.value = time
      this.startMaterial.uniforms.uSize.value = 20.0
    } else {
      if (time > 5) {
        this.boomMaterial.uniforms.uSize.value = 0
        this.boomPoint.clear()
        this.boomMaterial.dispose()
        this.boomGeometry.dispose()
        scene.remove(this.boomPoint)
        return
      }
      this.startMaterial.uniforms.uSize.value = 0
      this.startPoint.clear()
      this.startMaterial.dispose()
      this.startGeometry.dispose()
      scene.remove(this.startPoint)
      this.boomMaterial.uniforms.uTime.value = time - 1
      this.boomMaterial.uniforms.uSize.value = 20.0
    }
  }
}
// 创建烟花
const createFirework = () => {
  const color = `hsl(${Math.floor(Math.random() * 360)},100%,80%)`
  const position = {
    x: (Math.random() - 0.5) * 40,
    y: 3 + Math.random() * 15,
    z: -(Math.random() - 0.5) * 40,
  }
  const fireworks = new Fireworks(color, position)
  fireworksList.push(fireworks)
}

window.addEventListener('click', createFirework)
