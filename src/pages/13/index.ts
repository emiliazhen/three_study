import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import baseVertexShader from '@/assets/shader/base/fragment.glsl'
// import baseFragmentShader from '@/assets/shader/base/vertex.glsl'

document.title = '13 着色器'

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 10)

scene.add(camera)

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32)
// ! 原始着色器材质
const planeRawShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    void main(){
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
    }
  `,
  // 投影矩阵 * 视图矩阵 * 模型矩阵 * 4分量坐标
  fragmentShader: `
  void main(){
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
  }
  `,
})
// 根据集合体和材质创建物体
const plane = new THREE.Mesh(planeGeometry, planeRawShaderMaterial)
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
