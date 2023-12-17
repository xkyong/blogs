# 唠唠我从 VueUse 源码中学到的 composable 函数编写技巧

## （一）前言

Vue 3 版本中引入了组合式 API (Composition API) ，使我们可以使用函数的方式来组织 Vue 组件代码逻辑。相较于选项式 API (Option API)，组合式 API 的写法带来的好处是比较明显的，因此，目前自己在 Vue 项目（`Vue >= 2.7` 或者 `Vue@3`）中基本都是用组合式 API 来编写代码。

也是因为使用的比较多，在使用组合式 API 编写 composable 函数的过程中，难免会思考如何才能把函数写得更优雅，如何才能保障良好的封装性和代码可读性，因此在网上试着找了下，恰好看到社区 [antfu 大佬](https://github.com/antfu) 搞了个 [VueUse](https://vueuse.org/) 库，里边有一系列基于 Composition API 编写的工具函数，不管是仓库的文件组织，还是工具函数的源码实现，甚至于一些 TypeScript 的类型编程实现，都值得我们的学习和借鉴。

这段时间，在公司实际业务项目中用了 VueUse 一段时间后，自己花了点时间阅读了 VueUse 库底层的源码实现，学到了不少 composable 函数的编写技巧，我做了下整理，因此，就有了这篇文章。

## （二）编写技巧







## （三）其他内容

### VueUse 源码调试

为了更好地了解 VueUse 底层 composable 函数的执行细节，单单只阅读源代码应该是不太够的，必要的代码调试还是需要的。

而如何对 VueUse 源码进行调试，这里也给出操作步骤。

首先就是把仓库拉到本地，不管是直接 `git clone` ，还是先 `fork` 到自己账户然后再 `git clone`：

```bash
$ git clone https://github.com/vueuse/vueuse
```

 然后使用 pnpm 进行依赖安装，我指定 `registry` 为淘宝镜像源 `https://registry.npmmirror.com/` 进行安装时，发现有些包安装会有问题，因此建议直接用 pnpm 默认的 `registry`，即 `https://registry.npmjs.org/`，此时安装估计也会有问题，因为镜像源在国外，而如何解决，想必不用我多说：

```bash
$ pnpm install
```

之后打开项目工程，命令行终端执行如下命令启动 `vite` 这个文件夹的 playground：

```bash
$ cd playgrounds/vite
$ pnpm i
$ pnpm dev
```

浏览器访问 `http://localhost:5173/` ，可以看到：

![image-20231217101732564](img/tips-of-writing-composables-from-reading-vueuse/image-20231217101732564.png)

进入 `Sources` 面板，在如下位置打个断点，然后刷新页面：

![image-20231217101521173](img/tips-of-writing-composables-from-reading-vueuse/image-20231217101521173.png)

然后敲击 `F11` 键就可以进入 composable 函数（这里是 `useMouse`）的源代码中了：

![image-20231217101603188](img/tips-of-writing-composables-from-reading-vueuse/image-20231217101603188.png)

之后就可以进行愉快地调试了。



### 测试用例编写

vitest 编写用例

没写过测试用例，参看：[测试框架 Mocha 实例教程](https://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)









## （三）总结







## （四）参考资料

- [Vue.js官方文档-组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)
- [Coding Better Composables (Series)](https://michaelnthiessen.com/coding-better-composables/)
- [可组合的 Vue - Anthony Fu](https://antfu.me/posts/composable-vue-vueconf-china-2021)
- [VueUse-Best Practice](https://vueuse.org/guide/best-practice.html)
- [VueUse-Guidelines](https://vueuse.org/guidelines.html)
