自己平常业务开发和浏览技术网站接触过的第三方库，在此做个列举。

## 通用

- 用来识别项目的依赖是否存在恶意的npm脚本：[npm-viewscripts](https://www.npmjs.com/package/npm-viewscripts)
  - 与该库相关的一篇文章：[Understanding and protecting against malicious npm package lifecycle scripts](https://medium.com/@kyle_martin/understanding-and-protecting-against-malicious-npm-package-lifecycle-scripts-8b6129619d7c)
- 通过补丁的方式直接修改node_modules文件夹中依赖的bug：[patch-package](https://www.npmjs.com/package/patch-package)
- 快速搭建 fake REST API 服务器：[json-server](https://www.npmjs.com/package/json-server)
- px转rem：[postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem)
- px转viewport：[postcss-px-to-viewport](https://www.npmjs.com/package/postcss-px-to-viewport)
- 类`rm -rf`命令的依赖：[rimraf](https://www.npmjs.com/package/rimraf)
- 用来生成qrcode：[qrcode](https://www.npmjs.com/package/qrcode)
- 时间库：
  - [dayjs](https://www.npmjs.com/package/dayjs)
  - [date-fns](https://www.npmjs.com/package/date-fns)
- 一个用来做PPT的好用的库：[slidev](https://sli.dev/)
- 用来分析构建包的情况的webpack插件：[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
- [CountUp.js](https://inorganik.github.io/countUp.js/)：CountUp.js is a dependency-free, lightweight JavaScript class that can be used to quickly create animations that display numerical data in a more interesting way.
- [uuid](https://www.npmjs.com/package/uuid)：创建唯一id
- [immer](https://www.npmjs.com/package/immer)：Create the next immutable state tree by simply modifying the current tree
- [cloc](https://www.npmjs.com/package/cloc)：cloc counts blank lines, comment lines, and physical lines of source code in many programming languages.
- [ngrok-node版本](https://www.npmjs.com/package/ngrok)：内网穿透工具
- [npm-run-all](https://www.npmjs.com/package/npm-run-all)：A CLI tool to run multiple npm-scripts in parallel or sequential.
- [concurrently](https://www.npmjs.com/package/concurrently)：Run multiple commands concurrently. Like npm run watch-js & npm run watch-less but better.
- [wait-on](https://www.npmjs.com/package/wait-on)：wait-on is a cross-platform command line utility which will wait for files, ports, sockets, and http(s) resources to become available (or not available using reverse mode)
- [cross-env](https://www.npmjs.com/package/cross-env)：Run scripts that set and use environment variables across platforms
- [chalk](https://www.npmjs.com/package/chalk)：Terminal string styling done right
- [consola](https://www.npmjs.com/package/consola)：Elegant Console Logger for Node.js and Browser
- [fs-extra](https://www.npmjs.com/package/fs-extra)：一个比fs模块更好用的库
- [lowdb](https://github.com/typicode/lowdb)：数据持久化存储解决方案，适合桌面应用开发（比如Electron），用JSON为基本存储结构基于lodash开发的
- [skeletonreact](https://skeletonreact.com/)：骨架屏解决方案（支持vue/react/angular）
- [faker](https://fakerjs.dev/)：Generate massive amounts of fake (but realistic) data for testing and development.
  - 目前能下载的是经过调整的，关于origin faker的一些说明，详细看：[An update from the Faker team](https://fakerjs.dev/about/announcements/2022-01-14.html) 和 [Dev corrupts NPM libs 'colors' and 'faker' breaking thousands of apps](https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/)。
- [deepmerge](https://www.npmjs.com/package/deepmerge)：Merges the enumerable properties of two or more objects deeply.
  - 与之类似的，是`lodash.merge`方法，不过该`lodash.merge`方法是`shallowly`的（详细比较见小记）！
- 快速初始化一个ts项目基础工程：
  - [tsdx](https://github.com/jaredpalmer/tsdx)
  - [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter)
- [np](https://github.com/sindresorhus/np)：A better `npm publish`
- [iconv-lite](https://www.npmjs.com/package/iconv-lite)：Pure JS character encoding conversion，可作为中英文乱码修正的解决方案
- [Vitesse](https://github.com/antfu/vitesse)：Mocking up web app with Vitesse（Vite+Vue3+Typescript）
- node程序日志相关：
  - [winston](https://www.npmjs.com/package/winston)
  - [log4js](https://www.npmjs.com/package/log4js)
- [qnm](https://www.npmjs.com/package/qnm)：A simple cli utility for querying the node_modules directory
- [node-emoji](https://github.com/omnidan/node-emoji)：Friendly emoji lookups and parsing utilities for Node.js ✨
- [medium-zoom](https://www.npmjs.com/package/medium-zoom)：A JavaScript library for zooming images like Medium
- [validator](https://www.npmjs.com/package/validator)：A library of string validators and sanitizers.
- node邮件操作相关：
   - 发邮件：[nodemailer](https://www.npmjs.com/package/nodemailer)
    - 收邮件：[imap](https://www.npmjs.com/package/imap) + [mailparser](https://www.npmjs.com/package/mailparser)
- markdown转pdf/png等：
  - [md-to-pdf](https://www.npmjs.com/package/md-to-pdf)：A simple and hackable CLI tool for converting markdown to pdf.
  - [markdown-pdf(vscode 插件)](https://marketplace.visualstudio.com/items?itemName=yzane.markdown-pdf)
- [sharp](https://github.com/lovell/sharp)：图片压缩高性能库，配套的官网链接为：https://sharp.pixelplumbing.com/
- ...


## Vue相关

- Vue生态相关的库集合：[awesome-vue](https://github.com/vuejs/awesome-vue)
- Vue中使用jsx用到的库：[jsx-vue](https://github.com/vuejs/jsx-vue2)
- Vue hooks库：[vueuse](https://www.npmjs.com/package/@vueuse/core)
- [vue-lazyload](https://www.npmjs.com/package/vue-lazyload)：vue中使用图片懒加载的方案
- [vue-content-placeholders](https://www.npmjs.com/package/vue-content-placeholders)：react中使用骨架屏的方案
- [vue-styled-components](https://www.npmjs.com/package/vue-styled-components)：css-in-js方案
- ...


## React相关

- 新版本react官网：[reactjs](https://react.dev/)
- React生态相关的库集合：[awesome-react](https://github.com/enaqx/awesome-react)
- React hooks库：[ahooks](https://www.npmjs.com/package/ahooks)
- [react-lazy-load-image-component](https://www.npmjs.com/package/react-lazy-load-image-component)：react中使用图片懒加载的方案
- [react-placeholder](https://www.npmjs.com/package/react-placeholder)：react中使用骨架屏的方案
- [styled-components](https://www.npmjs.com/package/styled-components)：css-in-js方案，详情可参看文档：https://styled-components.com/
- ...
