# 唠唠我从 VueUse 源码中学到的 composable 函数编写技巧

## （一）前言

Vue 3 版本中引入了组合式 API (Composition API) ，使我们可以使用函数的方式来书写 Vue 组件。相较于选项式 API (Option API)，组合式 API 的写法带来的好处是比较明显的，因此，目前自己在 Vue 项目（`Vue >= 2.7` 或者 `Vue@3`）中基本都是用组合式 API 来书写代码逻辑。

也是因为使用的比较多，在使用组合式 API 编写 composable 函数的过程中，难免会思考如何才能把函数写得优雅，如何保障良好的封装性和扩展性，因此在网上找了下，恰好看到社区 antfu 大佬搞了个 [VueUse](https://vueuse.org/) 库，里边有一系列基于 Composition API 编写的工具函数，不管是仓库的文件组织，还是工具函数的源码实现，甚至于一些 TypeScript 的类型编程实现，都值得我们学习和借鉴。

这段时间，在公司实际业务项目中用了 VueUse 一段时间后，自己花了点时间阅读了 VueUse 库底层的源码实现，学到了不少 composable 函数编写技巧，我做了下整理，因此，就有了这篇文章。

## （二）编写技巧

## （三）其他内容

## （三）总结

## （四）参考资料

- [Vue.js官方文档-组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)
- [Coding Better Composables (Series)](https://michaelnthiessen.com/coding-better-composables/)
- [可组合的 Vue - Anthony Fu](https://antfu.me/posts/composable-vue-vueconf-china-2021)
- [VueUse-Best Practice](https://vueuse.org/guide/best-practice.html)
- [VueUse-Guidelines](https://vueuse.org/guidelines.html)
