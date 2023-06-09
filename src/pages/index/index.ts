import '@/assets/styles/index.scss'
import './index.scss'
const ulElement = document.getElementById('routerList')
const routerNameList = [
  '简单几何体',
  '随机三角',
  '材质',
  '贴图',
  '光照',
  '点',
  '下雪',
  '星系',
  '交互',
  '展示页',
  '物理引擎',
  'webGL绘制三角形',
  '着色器绘制旗帜',
  '着色器绘制图案',
  '着色器绘制孔明灯',
  '水波纹',
  '浴缸',
]
routerNameList.forEach((routerName, index) => {
  const liElement = document.createElement('li')
  liElement.innerText = routerName
  let path = (index + 1).toString()
  if (path.length === 1) {
    path = `0${path}`
  }
  liElement.addEventListener('click', () => {
    window.location.href = `/${path}`
  })
  ulElement?.appendChild(liElement)
})
const saveSvgElement = document.getElementById('saveSvg')
saveSvgElement?.addEventListener('click', () => (window.location.href = '/404'))
document.title = 'Three-Demo 主页'
