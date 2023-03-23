import '@/assets/styles/index.scss'
import './index.scss'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
document.title = '11 物理引擎'
import hitMetalVoice from '@/assets/audio/hit-metal.mp3'
import hitSwordVoice from '@/assets/audio/hit-sword.mp3'
// 创建击打声音
const hitMetalAudio = new Audio(hitMetalVoice)
const hitSwordAudio = new Audio(hitSwordVoice)
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 40)
scene.add(camera)
// 创建物体
const ballGeometry = new THREE.SphereGeometry(1, 32, 32)
const ballMaterial = new THREE.MeshStandardMaterial({
  color: '#fff',
})
const ball = new THREE.Mesh(ballGeometry, ballMaterial)
ball.castShadow = true
scene.add(ball)
// 物理世界
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
})
// 创建物理小球形状
const ballShape = new CANNON.Sphere(1)
// 设置物体材质
const ballWorldMaterial = new CANNON.Material('ball')
// 创建物理世界的物体
const ballBody = new CANNON.Body({
  mass: 1, // kg
  position: new CANNON.Vec3(0, 0, 0), // m
  shape: ballShape,
  //   物体材质
  material: ballWorldMaterial,
})
// 将物体添加至物理世界
world.addBody(ballBody)

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(20, 20, 32)
const planeMaterial = new THREE.MeshStandardMaterial()
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
plane.position.set(0, -8, 0)
plane.receiveShadow = true
scene.add(plane)
const groundShape = new CANNON.Plane()
const groundMaterial = new CANNON.Material()
const groundBody = new CANNON.Body({
  // 静止物体，或者写mass为0
  type: CANNON.Body.STATIC,
  shape: groundShape,
  material: groundMaterial,
})
groundBody.position.set(0, -8, 0)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
world.addBody(groundBody)

// 鼠标点击生成物体
const boxMaterial = new THREE.MeshStandardMaterial()
const boxWorldMaterial = new CANNON.Material()
const boxList: { mesh: THREE.Mesh; body: CANNON.Body }[] = []
window.addEventListener('click', () => {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
  const box = new THREE.Mesh(boxGeometry, boxMaterial)
  box.position.set(0, 8, 0)
  box.receiveShadow = true
  scene.add(box)
  // 长宽高要写一半
  const boxWorldShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  const boxWorldBody = new CANNON.Body({
    mass: 1,
    shape: boxWorldShape,
    material: boxWorldMaterial,
  })
  boxWorldBody.applyLocalForce(
    // 添加的力的大小和方向
    new CANNON.Vec3(100 - 200 * Math.random(), 0, 100 - 200 * Math.random()),
    // 施加的力所在的位置
    new CANNON.Vec3(0, 0, 0)
  )
  boxWorldBody.position.set(0, 8, 0)
  world.addBody(boxWorldBody)
  // 监听撞击事件
  boxWorldBody.addEventListener('collide', (e: any) => {
    // 碰撞强度
    const impactStrength = e.contact.getImpactVelocityAlongNormal()
    if (impactStrength > 5) {
      //   重新从零开始播放
      hitSwordAudio.currentTime = 0
      hitSwordAudio.volume = impactStrength / 25
      hitSwordAudio.play()
    }
  })
  boxList.push({
    mesh: box,
    body: boxWorldBody,
  })
})

// 设置2种材质碰撞的参数
const defaultContactMaterial = new CANNON.ContactMaterial(ballWorldMaterial, groundMaterial, {
  //   摩擦力
  friction: 0.1,
  // 弹性
  restitution: 0.7,
})
// 将材料的关联设置添加的物理世界
world.addContactMaterial(defaultContactMaterial)

// 创建一个灰色的环境光
const light = new THREE.AmbientLight(0x404040)
scene.add(light)
const spotLight = new THREE.SpotLight(0xffffff, 2.0, 100, Math.PI / 4, 0.5, 2.0)
spotLight.castShadow = true
spotLight.position.set(10, 20, 10)
spotLight.shadow.camera.near = 5
spotLight.shadow.camera.far = 10
spotLight.shadow.camera.fov = 30
scene.add(spotLight)

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

const renderFunction = () => {
  world.fixedStep()
  ball.position.copy((ballBody as any).position)
  ball.quaternion.copy((ballBody as any).quaternion)
  boxList.forEach((item) => {
    item.mesh.position.copy((item.body as any).position)
    item.mesh.quaternion.copy((item.body as any).quaternion)
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
// 监听撞击事件
ballBody.addEventListener('collide', (e: any) => {
  // 碰撞强度
  const impactStrength = e.contact.getImpactVelocityAlongNormal()
  if (impactStrength > 5) {
    //   重新从零开始播放
    hitMetalAudio.currentTime = 0
    hitMetalAudio.volume = impactStrength / 25
    hitMetalAudio.play()
  }
})
