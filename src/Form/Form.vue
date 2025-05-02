<template>
  <div class="inner">
    <div :class="{ form: true, dark: isDark }" :style="{ backgroundColor }">
      <div :class="{ loader: true, light: !isDark }" v-if="loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <GoogleButton v-if="withGoogle" @start="resetError" @error="onError" @success="onSuccess" />
      <YandexButton v-if="withYandex" />
    </div>
    <span :class="{ error, visible: error !== null }">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import GoogleButton from './components/GoogleButton.vue'
import { onMounted, ref } from 'vue'
import { useConfig } from '@/config'
import YandexButton from '@/Form/components/YandexButton.vue'
import axios from 'axios'

export default {
  name: 'Form',
  components: { YandexButton, GoogleButton },
  props: {
    yandexAccessToken: {
      type: String,
      required: false
    }
  },
  setup(props: any) {
    const { basePath, theme, apiUrl, authYandex, authGoogle, colors } = useConfig()
    const loading = ref<boolean>(false)

    const error = ref<string | null>(null)

    const onError = (errorMessage: string) => {
      error.value = errorMessage
    }

    const resetError = () => (error.value = null)

    const onSuccess = (data: any) => {
      localStorage.setItem('admin_access_token', data.accessToken)

      setTimeout(() => {
        let redirectUrl =
          basePath.startsWith('https://') || basePath.startsWith('http://')
            ? basePath
            : window.location.origin + basePath
        if (redirectUrl.endsWith('/')) {
          redirectUrl = redirectUrl.slice(0, redirectUrl.length - 1)
        }

        window.location.href =
          redirectUrl.length > 0 ? redirectUrl.slice(0, redirectUrl.lastIndexOf('/')) : '/admin'
      }, 100)
    }

    const withYandex = authYandex && authYandex.enabled && authYandex.clientId
    const withGoogle = authGoogle && authGoogle.enabled && authGoogle.clientId

    onMounted(async () => {
      if (!props.yandexAccessToken || !withYandex) return

      loading.value = true
      try {
        const res = await axios.post(apiUrl + `/tager/auth/admin/yandex`, {
          accessToken: props.yandexAccessToken
        })
        if (res.data.data?.accessToken) {
          onSuccess(res.data.data)
        } else {
          loading.value = false
        }
      } catch (e: any) {
        loading.value = false
        error.value = e.response?.data?.message || 'Unknown error'
      }
    })

    return {
      backgroundColor: colors.formBackground,
      loading,
      error,
      resetError,
      onSuccess,
      onError,
      isDark: theme === 'dark',
      withYandex,
      withGoogle
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
}

.inner {
  position: relative;
  display: flex;
}

.error {
  background: #a82d2d;
  text-align: center;
  display: block;
  margin-top: 15px;
  border-radius: 4px;
  color: #fff;
  padding: 6px 10px;
  font-size: 14px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  opacity: 0;
  transition: 1s opacity ease;

  &.visible {
    opacity: 1;
  }
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loader {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 8px;
    border: 4px solid;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }

  &.light {
    background: rgba(255, 255, 255, 0.75);

    div {
      border-color: #333 transparent transparent transparent;
    }
  }
}
</style>
