// https://vitepress.dev/guide/custom-theme
import { h, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'
import Theme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'

import './style.css'

// import Analysis from './components/Analysis.vue'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 'nav-bar-content-before': () => h(Analysis)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  setup () {
    const route = useRoute()

    const initZoom = () => {
      // 文章所有图片均支持 zoomin 和 zoomout
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )

    onMounted(() => initZoom())
  }
}
