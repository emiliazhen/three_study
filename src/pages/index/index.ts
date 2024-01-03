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
  '着色器设置点材质',
  '烟花',
  '着色器加工材质',
]
routerNameList.forEach((routerName, index) => {
  const liElement = document.createElement('li')
  liElement.innerText = routerName
  const path = (index + 1).toString().padStart(2, '0')
  liElement.addEventListener('click', () => {
    window.location.href = `/three_study/${path}`
  })
  ulElement?.appendChild(liElement)
})
const saveSvgElement = document.getElementById('saveSvg')
saveSvgElement?.addEventListener('click', () => (window.location.href = '/three_study/404'))
document.title = 'Three-Demo 主页'
