import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertexShader from '@/assets/shader/water/vertex.glsl'
import fragmentShader from '@/assets/shader/water/fragment.glsl'
import * as dat from 'dat.gui'

document.title = `${window.location.pathname.slice(1)} 水波纹`

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
// 设置相机位置
camera.position.set(0, 0, 5)
scene.add(camera)

const params = {
  waterFrequency: 10,
  deepScale: 0.065,
  noiseFrequency: 7,
  noiseScale: 1.3,
  xzScale: 1,
  lowColor: '#3077e5',
  highColor: '#63aee5',
}
// 创建平面
const planeGeometry = new THREE.PlaneGeometry(1, 1, 512, 512)
// ! 着色器材质
const planeRawShaderMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: {
    uTime: {
      value: 0,
    },
    uWaterFrequency: {
      value: params.waterFrequency,
    },
    uDeepScale: {
      value: params.deepScale,
    },
    uNoiseFrequency: {
      value: params.noiseFrequency,
    },
    uNoiseScale: {
      value: params.noiseScale,
    },
    uXzScale: {
      value: params.xzScale,
    },
    uLowColor: {
      value: new THREE.Color(params.lowColor),
    },
    uHighColor: {
      value: new THREE.Color(params.highColor),
    },
  },
})
// 根据集合体和材质创建物体
const plane = new THREE.Mesh(planeGeometry, planeRawShaderMaterial)
plane.rotation.x = -Math.PI / 2
// 添加到场景中
scene.add(plane)

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
gui
  .add(params, 'waterFrequency')
  .min(1)
  .max(40)
  .step(0.1)
  .name('水波纹频率')
  .onChange((value) => {
    planeRawShaderMaterial.uniforms.uWaterFrequency.value = value
  })
gui
  .add(params, 'deepScale')
  .min(0.001)
  .max(0.2)
  .step(0.001)
  .name('水深倍率')
  .onChange((value) => {
    planeRawShaderMaterial.uniforms.uDeepScale.value = value
  })
gui
  .add(params, 'noiseFrequency')
  .min(1)
  .max(40)
  .step(1)
  .name('噪声频率')
  .onChange((value) => {
    planeRawShaderMaterial.uniforms.uNoiseFrequency.value = value
  })
gui
  .add(params, 'noiseScale')
  .min(0.05)
  .max(2)
  .step(0.05)
  .name('噪声倍率')
  .onChange((value) => {
    planeRawShaderMaterial.uniforms.uNoiseScale.value = value
  })
gui
  .add(params, 'xzScale')
  .min(0.1)
  .max(5)
  .step(0.1)
  .name('XZ倍率')
  .onChange((value) => {
    planeRawShaderMaterial.uniforms.uXzScale.value = value
  })
gui
  .addColor(params, 'lowColor')
  .name('暗色')
  .onFinishChange((value) => {
    planeRawShaderMaterial.uniforms.uLowColor.value = new THREE.Color(value)
  })
gui
  .addColor(params, 'highColor')
  .name('亮色')
  .onFinishChange((value) => {
    planeRawShaderMaterial.uniforms.uHighColor.value = new THREE.Color(value)
  })
// 动画
const clock = new THREE.Clock()
const renderFunction = () => {
  planeRawShaderMaterial.uniforms.uTime.value = clock.getElapsedTime()
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
