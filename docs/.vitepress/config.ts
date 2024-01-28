import { defineConfig } from 'vitepress'
import { transformerTwoslash } from 'vitepress-plugin-twoslash' 

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '壹小楷的博客',
  description: 'a personal blog for marking something deserve marking.',
  appearance: false,
  themeConfig: {
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '用过的第三方库', link: '/package-list' },
      { text: '前端视野', link: '/horizon' }
    ],
    sidebar: [
      {
        text: '2024年',
        items: [
          // { text: '唠唠 TypeScript 中内置工具类型衍生的进阶用法', link: '/2024/advanced-usage-of-typescript-tool-types' },
          // { text: '分享几个好用的 Node.js cli 工具库', link: '/2024/my-own-useful-cli-tools' },
          { text: '分享一些自用的工作效率 Boosting 的 Vscode 插件', link: '/2024/my-own-work-boosting-vscode-plugins' }
          // { text: '唠唠 Chrome Devtools 中一些实用的小技巧', link: '/2024/chrome-devtools-useful-tips' },
          // { text: '唠唠我从 VueUse 源码中学到的 TypeScript 编写技巧', link: '/2024/tips-of-writing-typescript-from-reading-vueuse'}
        ]
      },
      {
        text: '2023年',
        items: [
          { text: '【翻译】像高手一样编写代码：编写代码的 5 个必知技巧', link: '/2023/write-code-like-a-senior'},
          { text: '唠唠我从 VueUse 源码中学到的 Composable 函数编写技巧', link: '/2023/tips-of-writing-composables-from-reading-vueuse'},
          { text: '【翻译】浏览器不想让你知道的67个怪异调试技巧', link: '/2023/67-weird-debugging-tricks-your-browser-does-not-want-you-to-know'},
          { text: '【翻译】让开发人员生活更美好的 8 条建议', link: '/2023/my-8-tips-for-a-better-life-as-a-developer' },
          { text: '【翻译】TypeScript：停止使用 any 类型，一种特定场景下使用的类型', link: '/2023/typescript-stop-using-any' },
          { text: '【翻译】TypeScript 中的 Array 类型', link: '/2023/array-types-in-typescript' },
          { text: '【翻译】一篇理解 Node.js 事件循环的完整可视化指南', link: '/2023/visual-guide-to-nodejs-event-loop' },
          { text: '【翻译】CommonJS 正在破坏 JavaScript', link: '/2023/commonjs-is-hurting-javascript' },
          { text: '记一次 Electron-vue 项目开发踩坑与问题解决', link: '/2023/electron-vue-trouble-and-resolution' },
          { text: '记一次浏览器跨域隔离探究实践', link: '/2023/browser-cross-origin-isolate-exploration' },
          { text: '唠唠 TypeScript 分布式条件类型与 infer 及应用', link: '/2023/ts-distributive-conditional-type-and-infer' },
          { text: '浅析跨域浏览器生效原理', link: '/2023/cross-origin-browser-analysis' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/XKyong/xkyong.github.io' }
    ]
  },
  markdown: {
    codeTransformers: [
      transformerTwoslash()
    ]
  }
})
