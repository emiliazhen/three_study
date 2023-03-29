import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

document.title = `${window.location.pathname.slice(1)} 交互`

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 20)
scene.add(camera)

// 创建物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeBaseMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
})
const cubeRedMaterial = new THREE.MeshBasicMaterial({
  color: 'red',
})
const cubeArr: Array<THREE.Mesh> = []
for (let x = -5; x < 5; x++) {
  for (let y = -5; y < 5; y++) {
    for (let z = -5; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, cubeBaseMaterial)
      cube.position.set(x, y, z)
      scene.add(cube)
      cubeArr.push(cube)
    }
  }
}
// 创建投射光线对象
const raycaster = new THREE.Raycaster()
// 鼠标的位置对象
const mouse = new THREE.Vector2()
// 监听鼠标的位置
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
  raycaster.setFromCamera(mouse, camera)
  const result = raycaster.intersectObjects(cubeArr) as { object: THREE.Mesh }[]
  //   console.log(result);
  //   result[0].object.material = redMaterial;
  result.forEach((item) => {
    item.object.material = cubeRedMaterial
  })
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
