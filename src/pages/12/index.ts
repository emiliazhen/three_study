import '@/assets/styles/index.scss'
import './index.scss'

document.title = '12 WebGL绘制三角形'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
// canvas 宽高
canvas.width = window.innerWidth
canvas.height = window.innerHeight
// webgl上下文
const glContext = canvas.getContext('webgl') as WebGLRenderingContext
// 第一次创建webgl上下文需要设置视口大小
glContext.viewport(0, 0, canvas.width, canvas.height)

// 创建顶点着色器
const vertexShader = glContext.createShader(glContext.VERTEX_SHADER) as WebGLShader
// 创建顶点着色器的源码，需要glsl代码
glContext.shaderSource(
  vertexShader,
  `
    attribute vec4 a_Position;
    uniform mat4 u_Mat;
    varying vec4 v_Color;
    void main() {
      gl_Position = u_Mat * a_Position;
      v_Color = gl_Position;
    }
  `
)
// 编译顶点着色器
glContext.compileShader(vertexShader)

// 创建片元着色器
const fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER) as WebGLShader
// 创建片元着色器的源码，需要glsl代码
glContext.shaderSource(
  fragmentShader,
  `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
      gl_FragColor = v_Color;
    }
  `
  // 有数据传递需告诉GPU去估算一下精度如何，准备计算量；varying将顶点着色器定义的值传递到片元着色器上来使用
  // gl_FragColor = vec4(0.5, 0.0, 0.0, 1.0);
)
// 编译片元着色器
glContext.compileShader(fragmentShader)

// 创建程序，连接顶点着色器和片元着色器
const program = glContext.createProgram() as WebGLProgram
// 连接顶点着色器和片元着色器
glContext.attachShader(program, vertexShader)
glContext.attachShader(program, fragmentShader)
// 链接程序
glContext.linkProgram(program)
// use程序进行渲染
glContext.useProgram(program)

// 创建顶点缓冲区对象
const vertexBuffer = glContext.createBuffer()
// 绑定顶点缓冲对象
glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer)
// 向顶点缓冲区对象中写入数据
const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0, 5])
// STATIC_DRAW表示数据不会改变， DYNAMIC_DRAW表示数据会改变
glContext.bufferData(glContext.ARRAY_BUFFER, vertices, glContext.STATIC_DRAW)
// 获取顶点着色器中a_Position变量的位置
const a_Position = glContext.getAttribLocation(program, 'a_Position')
// 告诉openGL如何解析顶点数 - 将顶点缓冲对象分配给a_Position变量  2个一组，浮点类型，是否归一化，step跳跃读取数，偏移
glContext.vertexAttribPointer(a_Position, 2, glContext.FLOAT, false, 0, 0)
// 启用顶点着色器中的a_Position变量
glContext.enableVertexAttribArray(a_Position)

let scaleValue = 0
let isAddScale = true
const animate = () => {
  if (isAddScale) {
    scaleValue = scaleValue + 0.01
    if (scaleValue > 2) {
      scaleValue = 2
      isAddScale = false
    }
  } else {
    scaleValue = scaleValue - 0.01
    if (scaleValue < -2) {
      scaleValue = -2
      isAddScale = true
    }
  }
  const mat = new Float32Array([scaleValue, 0.0, 0.0, 0.0, 0.0, scaleValue, 0.0, 0.0, 0.0, 0.0, scaleValue, 0.0, 0.0, 0.0, 0.0, 1.0])
  const u_Mat = glContext.getUniformLocation(program, 'u_Mat')
  glContext.uniformMatrix4fv(u_Mat, false, mat)
  // 清除canvas
  glContext.clearColor(0.0, 0.0, 0.0, 0.0)
  glContext.clear(glContext.COLOR_BUFFER_BIT)
  // 绘制
  glContext.drawArrays(glContext.TRIANGLES, 0, 3)
  requestAnimationFrame(animate)
}
animate()
