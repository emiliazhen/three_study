import '@/assets/styles/index.scss'
import * as THREE from 'three'
import particlesSnow from '@/assets/texture/particles_snow.png'
import particlesPoint from '@/assets/texture/particles_point.png'
import particlesStar from '@/assets/texture/particles_star.png'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragmentShader from '@/assets/shader/points/fragment.glsl'
import vertexShader from '@/assets/shader/points/vertex.glsl'

document.title = `${window.location.pathname.slice(1)} 着色器设置点材质`

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(0, 0, 10)

scene.add(camera)
// 加载HDR

// // 创建点
// const geometry = new THREE.BufferGeometry()
// const positions = new Float32Array([0, 0, 0])
// geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
// 导入纹理
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load(particlesStar)
const texture1 = textureLoader.load(particlesSnow)
const texture2 = textureLoader.load(particlesPoint)
// const material = new THREE.ShaderMaterial({
//   uniforms: {
//     UTexture: {
//       value: texture,
//     },
//   },
//   vertexShader: vertexShader,
//   fragmentShader: fragmentShader,
//   transparent: true,
// })
// // 顶点颜色
// const points = new THREE.Points(geometry, material)
// 添加到场景中
// scene.add(points)

let geometry: THREE.BufferGeometry | null = null
let points: THREE.Object3D<THREE.Event> | null = null
// 设置星系的参数
const params = {
  count: 800,
  size: 0.1,
  radius: 5,
  branches: 4,
  spin: 0.5,
  color: '#ff6030',
  outColor: '#1b3984',
}
// GalaxyColor
const galaxyColor = new THREE.Color(params.color)
const outGalaxyColor = new THREE.Color(params.outColor)
let material: THREE.ShaderMaterial
const generateGalaxy = () => {
  // 如果已经存在这些顶点，那么先释放内存，在删除顶点数据
  if (points !== null) {
    geometry?.dispose()
    material?.dispose()
    scene.remove(points)
  }
  // 生成顶点几何
  geometry = new THREE.BufferGeometry()
  //   随机生成位置
  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)

  const scales = new Float32Array(params.count)

  // 图案属性
  const imgIndex = new Float32Array(params.count)

  //   循环生成点
  for (let i = 0; i < params.count; i++) {
    const current = i * 3

    // 计算分支的角度 = (计算当前的点在第几个分支)*(2*Math.PI/多少个分支)
    const branchAngel = (i % params.branches) * ((2 * Math.PI) / params.branches)

    const radius = Math.random() * params.radius
    // 距离圆心越远，旋转的度数就越大
    // const spinAngle = radius * params.spin;

    // 随机设置x/y/z偏移值
    const randomX = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3
    const randomY = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3
    const randomZ = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3

    // 设置当前点x值坐标
    positions[current] = Math.cos(branchAngel) * radius + randomX
    // 设置当前点y值坐标
    positions[current + 1] = randomY
    // 设置当前点z值坐标
    positions[current + 2] = Math.sin(branchAngel) * radius + randomZ

    const mixColor = galaxyColor.clone()
    mixColor.lerp(outGalaxyColor, radius / params.radius)

    //   设置颜色
    colors[current] = mixColor.r
    colors[current + 1] = mixColor.g
    colors[current + 2] = mixColor.b

    // 顶点的大小
    scales[current] = Math.random()

    // 根据索引值设置不同的图案；
    imgIndex[current] = i % 3
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('imgIndex', new THREE.BufferAttribute(imgIndex, 1))

  //   设置点材质
  //   material = new THREE.PointsMaterial({
  //     color: new THREE.Color(0xffffff),
  //     size: params.size,
  //     sizeAttenuation: true,
  //     depthWrite: false,
  //     blending: THREE.AdditiveBlending,
  //     map: particlesTexture,
  //     alphaMap: particlesTexture,
  //     transparent: true,
  //     vertexColors: true,
  //   });

  //   设置点的着色器材质
  material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,

    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTexture: {
        value: texture,
      },
      uTexture1: {
        value: texture1,
      },
      uTexture2: {
        value: texture2,
      },
      uColor: {
        value: galaxyColor,
      },
      uTime: {
        value: 0,
      },
    },
  })

  //   生成点
  points = new THREE.Points(geometry, material)
  scene.add(points)
  console.log(points)
  //   console.log(123);
}

generateGalaxy()

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// 动画
const clock = new THREE.Clock()
const renderFunction = () => {
  controls.update()
  const elapsedTime = clock.getElapsedTime()
  material.uniforms.uTime.value = elapsedTime
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
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio)
})
