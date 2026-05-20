// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    'bulma/css/bulma.css',
    '@/assets/css/main.scss'
  ],
  modules: [
    '@pinia/nuxt'
  ],
  pinia: {
    storesDirs: ['./stores/**']
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          sourceMap: true
        }
      }
    }
  }
})
