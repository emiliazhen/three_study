import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'
import { gsap } from 'gsap'
document.title = `${window.location.pathname.slice(1)} 展示页`
let currentPage = 0
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 20)
scene.add(camera)
// 创建物体
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
const cubeBaseMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
})
const cubeRedMaterial = new THREE.MeshBasicMaterial({
  color: 'red',
})
const cubeGroup = new THREE.Group()
const cubeArr: Array<THREE.Mesh> = []
for (let x = -2; x < 3; x++) {
  for (let y = -2; y < 3; y++) {
    for (let z = -2; z < 3; z++) {
      const cube = new THREE.Mesh(cubeGeometry, cubeBaseMaterial)
      cube.position.set(x * 2, y * 2, z * 2)
      cubeGroup.add(cube)
      cubeArr.push(cube)
    }
  }
}
scene.add(cubeGroup)
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

// 创建物体
const triangleGroup = new THREE.Group()
for (let i = 0; i < 50; i++) {
  const geometry = new THREE.BufferGeometry()
  const positionList = new Float32Array(9)
  for (let j = 0; j < 9; j++) {
    positionList[j] = Math.random() * 10 - 5
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positionList, 3))
  const color = new THREE.Color(Math.random() * 1, Math.random() * 1, Math.random() * 1)
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  })
  // 根据集合体和材质创建物体
  const mesh = new THREE.Mesh(geometry, material)
  // 添加到场景中
  triangleGroup.add(mesh)
}
triangleGroup.position.set(0, -30, 0)
scene.add(triangleGroup)

const ballGroup = new THREE.Group()
// 创建环境光
const light = new THREE.AmbientLight(0x404040, 0.8)
ballGroup.add(light)
// 创建平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
directionalLight.position.set(10, 10, 10)
const directionalLightTarget = new THREE.Object3D()
directionalLightTarget.position.set(0, 0, 0)
ballGroup.add(directionalLightTarget)
// ! 设置光照投射阴影
directionalLight.castShadow = true
directionalLight.target = directionalLightTarget
// 设置平行光属性
directionalLight.shadow.radius = 30
directionalLight.shadow.mapSize.set(4096, 4096)
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 500
directionalLight.shadow.camera.left = -3
directionalLight.shadow.camera.right = 3
directionalLight.shadow.camera.top = 3
directionalLight.shadow.camera.bottom = -3
ballGroup.add(directionalLight)

// 点光源
const pointGeometry = new THREE.SphereGeometry(0.1)
const pointMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
})
const pointSphere = new THREE.Mesh(pointGeometry, pointMaterial)
const pointLight = new THREE.PointLight(0xff0000, 1, 6, 2)
pointLight.castShadow = true
pointSphere.add(pointLight)
ballGroup.add(pointSphere)

// 添加球
const ballGeometry = new THREE.SphereGeometry(3, 32, 32)
const ballMaterial = new THREE.MeshStandardMaterial()
const ballSphere = new THREE.Mesh(ballGeometry, ballMaterial)
ballSphere.position.set(0, 0, 0)
// ! 设置物体阴影投射
ballSphere.castShadow = true
ballGroup.add(ballSphere)
// 平面
const planeGeometry = new THREE.PlaneGeometry(50, 40, 32)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.set(0, -3, 0)
plane.rotation.x = -Math.PI / 2
// ! 设置接收阴影投射
plane.receiveShadow = true
ballGroup.add(plane)
ballGroup.position.set(0, -65, 0)
scene.add(ballGroup)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // ! 透明
  alpha: true,
})
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
renderer.shadowMap.enabled = true

// 鼠标的位置对象
let mouseX = 0

// 监听鼠标的位置
window.addEventListener('mousemove', (event) => {
  console.log(mouseX)
  mouseX = event.clientX / window.innerWidth - 0.5
})
const clock = new THREE.Clock()
// 动画
gsap.to(cubeGroup.rotation, {
  x: `+=${2 * Math.PI}`,
  y: `+=${2 * Math.PI}`,
  duration: 5,
  ease: 'power2.inOut',
  repeat: -1,
})
gsap.to(triangleGroup.rotation, {
  x: `+=${2 * Math.PI}`,
  y: `+=${2 * Math.PI}`,
  duration: 5,
  ease: 'power2.inOut',
  repeat: -1,
})
const renderFunction = () => {
  const time = clock.getElapsedTime()

  // cubeGroup.rotation.x = time * 0.5
  // cubeGroup.rotation.y = time * 0.3
  // triangleGroup.rotation.x = time * 0.5
  // triangleGroup.rotation.y = time * 0.3
  pointSphere.position.x = Math.cos(time) * 5
  pointSphere.position.y = Math.sin(1.8 * time) * 2.5
  pointSphere.position.z = Math.sin(time) * 5
  ballGroup.rotation.x = Math.sin(time) * 0.04
  ballGroup.rotation.z = Math.sin(time) * 0.04
  camera.position.y = (-window.scrollY / window.innerHeight) * 30
  camera.position.x += mouseX * 10 - camera.position.x
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

window.addEventListener('scroll', () => {
  const tmpPage = Math.round(window.scrollY / window.innerHeight)
  if (currentPage !== tmpPage) {
    currentPage = tmpPage
    document.body.scrollTop = currentPage * window.innerHeight
    switch (currentPage) {
      case 0:
        gsap.to(cubeGroup.rotation, {
          z: `+=${Math.PI}`,
          duration: 2,
        })
        break
      case 1:
        gsap.to(triangleGroup.rotation, {
          z: `+=${Math.PI}`,
          duration: 2,
        })
        break
      default:
        break
    }
    gsap.fromTo(
      `.page${currentPage} h1`,
      {
        transform: 'scale(0.1)',
      },
      {
        transform: 'scale(1)',
        duration: 1,
      }
    )
    gsap.fromTo(
      `.page${currentPage} h3`,
      {
        opacity: 0.1,
      },
      {
        opacity: 1,
        duration: 3,
      }
    )
  }
})
