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
        text: '2023年',
        items: [
          { text: '【翻译】CommonJS正在破坏JavaScript', link: '/2023/commonjs-is-hurting-javascript' },
          { text: '记一次 Electron-vue 项目开发踩坑与问题解决', link: '/2023/electron-vue-trouble-and-resolution' },
          { text: '记一次浏览器跨域隔离探究实践', link: '/2023/browser-cross-origin-isolate-exploration' },
          { text: '唠唠 TypeScript 分布式条件类型与 infer 及应用', link: '/2023/ts-distributive-conditional-type-and-infer' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/XKyong/xkyong.github.io' }
    ]
  }
})
