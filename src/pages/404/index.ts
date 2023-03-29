import '@/assets/styles/index.scss'
import './index.scss'
document.title = 'NOT FOUND'
document.getElementById('goBackButton')?.addEventListener('click', () => {
  window.location.replace('/index')
})
