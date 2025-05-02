import { createApp } from 'vue'
import App from './App.vue'
import { useConfig } from '@/config'

const accessToken = localStorage.getItem('admin_access_token')

if (accessToken) {
  const { basePath } = useConfig()

  let basePathFormatted =
    basePath.startsWith('https://') || basePath.startsWith('http://')
      ? basePath
      : window.location.origin + basePath
  if (basePathFormatted.endsWith('/')) {
    basePathFormatted = basePathFormatted.slice(0, basePathFormatted.length - 1)
  }

  window.location.href =
    basePathFormatted.length > 0
      ? basePathFormatted.slice(0, basePathFormatted.lastIndexOf('/'))
      : '/admin'
}

createApp(App).mount('#app')
