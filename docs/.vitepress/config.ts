import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "壹小楷的博客",
  description: "a personal blogs for marking something deserve marking.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '用过的第三方库', link: '/package-list' },
      { text: '前端视野', link: '/horizon' }
    ],
    sidebar: [
      {
        text: '2023',
        items: [
          { text: '【翻译】CommonJS正在破坏JavaScript', link: '/2023/commonjs-is-hurting-javascript' },
          { text: '记一次浏览器跨域隔离探究实践', link: '/2023/browser-cross-origin-isolation' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
