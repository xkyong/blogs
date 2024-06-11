// https://vitepress.dev/guide/custom-theme
import { h, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'
import Theme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'

import TwoSlashFloatingVue from 'vitepress-plugin-twoslash/client'
import 'vitepress-plugin-twoslash/style.css'

import Giscus from '@giscus/vue'

import './style.css'

import Analysis from './components/Analysis.vue'
import VPSwitchAppearance from './components/VPSwitchAppearance.vue'

import type { EnhanceAppContext } from 'vitepress'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'nav-bar-content-before': () => h(Analysis),
      'nav-bar-content-after': () => h(VPSwitchAppearance)
    })
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoSlashFloatingVue)
    app.component('Giscus', Giscus)
  },
  setup () {
    const route = useRoute()

    const initZoom = () => {
      // 文章所有图片均支持 zoomin 和 zoomout
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    }

    const insertGoogleSiteVerification = () => {
      const head = document.head
      const meta = document.createElement('meta')
      meta.name = 'google-site-verification'
      meta.content = 'cwzDQ0eceE4PEDQ3SD6XkroG5FA-eZeHa_zmBB_U-Lc'
      head.appendChild(meta)
    }

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )

    onMounted(() => {
      initZoom()
      insertGoogleSiteVerification()
    })
  }
}
