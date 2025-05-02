<template>
  <div class="page-inner" :style="{ backgroundColor }">
    <main class="page-main">
      <div class="wrapper">
        <div class="logo" v-if="logo">
          <img :src="logo" alt="TAGER" />
        </div>
        <Form :yandex-access-token="yandexAccessToken" />
      </div>
    </main>
    <Footer v-if="copyrightVisible" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Form from './Form/Form.vue'
import Footer from './Footer/Footer.vue'
import { useConfig } from './config'

const getYandexAccessToken = (): string | undefined => {
  if (!window.location.hash.startsWith('#access_token=')) return undefined
  return window.location.hash.substring('#access_token='.length, window.location.hash.indexOf('&'))
}

export default defineComponent({
  name: 'App',
  components: {
    Form,
    Footer
  },
  setup() {
    const { copyright, logo, pageTitle, basePath, colors } = useConfig()
    const loading = ref<boolean>(false)

    onMounted(() => {
      document.title = pageTitle
    })

    return {
      backgroundColor: colors.bodyBackground,
      yandexAccessToken: getYandexAccessToken(),
      loading,
      copyrightVisible: copyright.visible,
      logo: logo ? basePath + (basePath.endsWith('/') ? '' : '/') + logo : null
    }
  }
})
</script>

<style>
body {
  min-width: 320px;
  margin: 0;
  font-family: Montserrat, Arial, sans-serif;
}
</style>

<style scoped lang="scss">
.page-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}

.page-main {
  flex: 1 0 auto;
  min-height: 1px;
  position: relative;
  padding-bottom: 78px;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper {
  margin: 20px auto;
  max-width: 90%;
  width: 310px;
}

.logo {
  display: flex;
  justify-content: center;

  margin-bottom: 30px;
  align-items: flex-end;

  @media (max-width: 767px) {
    max-width: 150px;
    margin: 0 auto 20px;
  }

  @media (min-width: 1200px) and (max-height: 670px) {
    max-height: 100px;
    margin-bottom: 20px;
  }

  img {
    max-width: 250px;
    max-height: 150px;
    height: auto;

    @media (min-width: 1200px) and (max-height: 670px) {
      max-height: 100px;
    }

    @media (max-width: 767px) {
      max-height: 100px;
      max-width: 200px;
    }
  }
}
</style>
