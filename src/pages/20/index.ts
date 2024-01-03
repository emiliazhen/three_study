import '@/assets/styles/index.scss'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import imgNX from '@/assets/texture/street_nx.jpg'
import imgNY from '@/assets/texture/street_ny.jpg'
import imgNZ from '@/assets/texture/street_nz.jpg'
import imgPX from '@/assets/texture/street_px.jpg'
import imgPY from '@/assets/texture/street_py.jpg'
import imgPZ from '@/assets/texture/street_pz.jpg'
import LeePerrySmithModel from '@/assets/model/LeePerrySmith.glb'
import LeePerrySmithColor from '@/assets/model/LeePerrySmith_color.jpg'
import LeePerrySmithNormal from '@/assets/model/LeePerrySmith_normal.jpg'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

document.title = `${window.location.pathname.slice(1)} 着色器加工材质`

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 50)
// 设置相机位置
camera.position.set(0, 0, 10)

scene.add(camera)
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([imgPX, imgNX, imgPY, imgNY, imgPZ, imgNZ])
// 给场景添加环境贴图
scene.background = envMapTexture
// 给场景里的所有物体都添加默认的环境贴图
scene.environment = envMapTexture

const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.castShadow = true
directionLight.position.set(0, 0, 200)
scene.add(directionLight)

const baseUniforms = {
  uTime: {
    value: 0,
  },
}

// ! 创建物体 平面更改封装好的shader
// const cubeGeometry = new THREE.PlaneGeometry(1, 1)
// const cubeMaterial = new THREE.MeshBasicMaterial({
//   color: 'red',
// })

// cubeMaterial.onBeforeCompile = (shader, render) => {
//   shader.uniforms.uTime = baseUniforms.uTime
//   shader.vertexShader = shader.vertexShader.replace(
//     '#include <common>',
//     `
//     #include <common>
//     uniform float uTime;
//     `
//   )
//   shader.vertexShader = shader.vertexShader.replace(
//     '#include <begin_vertex>',
//     `
//     #include <begin_vertex>
//     transformed.x += sin(uTime) * 2.0;
//     transformed.z += cos(uTime) * 2.0;
//     `
//   )
//   console.log(render)
// }
// // 根据集合体和材质创建物体
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// // 添加到场景中
// scene.add(cube)

// ! 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader()
// ! 加载模型纹理
const modelTexture = textureLoader.load(LeePerrySmithColor)
// ! 加载模型的法向纹理
const normalTexture = textureLoader.load(LeePerrySmithNormal)

const material = new THREE.MeshStandardMaterial({
  map: modelTexture,
  normalMap: normalTexture,
})

material.onBeforeCompile = (shader) => {
  // 传递时间
  shader.uniforms.uTime = baseUniforms.uTime
  // 旋转矩阵
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
    }
    uniform float uTime;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
    #include <beginnormal_vertex>
    float angle = sin(position.y+uTime) *0.5;
    mat2 rotateMatrix = rotate2d(angle);
    objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    // float angle = sin(position.y+uTime) *0.5;
    // mat2 rotateMatrix = rotate2d(angle);
    transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}

// 深度材质
const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
})

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = baseUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
    }
    uniform float uTime;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    float angle = sin(position.y+uTime) *0.5;
    mat2 rotateMatrix = rotate2d(angle);
    transformed.xz = rotateMatrix * transformed.xz;
    `
  )
}

// ! 模型加载
const gltfLoader = new GLTFLoader()
gltfLoader.load(LeePerrySmithModel, (gltf) => {
  const mesh = gltf.scene.children[0] as THREE.Mesh
  mesh.material = material
  mesh.castShadow = true
  // 设定自定义的深度材质
  mesh.customDepthMaterial = depthMaterial
  scene.add(mesh)
})
// ! 平面
const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial())
plane.position.set(0, 0, -6)
plane.receiveShadow = true
scene.add(plane)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
const clock = new THREE.Clock()
// 动画
const renderFunction = () => {
  controls.update()
  renderer.render(scene, camera)
  baseUniforms.uTime.value = clock.getElapsedTime()
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
