# 浅析跨域浏览器生效原理

## （一）前言

关于网上如何设置跨域浏览器的教程，好家伙，那些教程文章，相互”借鉴“不说，有的还停留在旧版本的浏览器，新版本的浏览器根本找不到那些设置项，这让人咋搞，当时差点点把头找秃了 🧑🏻‍🦲。

有一说一，国内网上那些关于如何设置 chrome 浏览器为跨域浏览器的文章，大部分写的真的不咋滴！

不过，最后还是找到了正确设置跨域浏览器的文章，前前后后花了不少时间。

为了不让这些时间白白浪费掉，又花了些时间，对跨域浏览器生效的原理进行了探究，于是乎有了这篇文章。

## （二）2 种设置跨域浏览器的方案及原理

下边以 chrome 浏览器为例演示下边的这 2 种方案。

### 方案 1：chrome 浏览器快捷方式属性设置相关参数

**配置流程**

**首先**，创建一个 chrome 浏览器的快捷方式到桌面：

![image-20220709112151459](.\img\cross-origin-browser-analysis\image-20220709112151459.png)

**其次**，找到 chrome 浏览器的快捷方式图标，修改个名字，然后鼠标右键，点击属性：

![image-20220709112349126](.\img\cross-origin-browser-analysis\image-20220709112349126.png)

在打开属性弹出框的**目标**项的输入框中添加上`--args --disable-web-security --user-data-dir=D:\XKYChromeUserData`，然后确定就可以了：

![image-20220709112516143](.\img\cross-origin-browser-analysis\image-20220709112516143.png)

最终形成的内容是：

```text
"C:\Program Files\Google\Chrome\Application\chrome.exe" --args --disable-web-security --user-data-dir=D:\XKYChromeUserData
```

其中，双引号内容的路径是该快捷方式链接到的 chrome 浏览器在我这台电脑上的实际启动地址，`D:\XKYChromeUserData`是我自己随便找了个文件夹，可以自己随便配置，不这么写的话，新版本浏览器会出现设置不生效的问题（下边会解释）。

这个方式的设置，是用户在自己电脑创建了一套 chrome 的私有化浏览器，里边的设置配置等均为私有化设置，与 chrome 安装的源目录的chrome.exe（也就是双引号中的路径）不共享配置，包括账号信息，书签，设置等等。

**最后**，双击该配置好的跨域版本的浏览器图标，即可打开该浏览器，首次打开时会看到：

![image-20220709112629986](.\img\cross-origin-browser-analysis\image-20220709112629986.png)

**因此，除非必要，否则一般不要使用跨域版本的浏览器！**

另外，打开后，之前设置的 `XKYChromeUserData` 文件夹会自动被创建，然后会写入相关的文件：

![image-20220709112701207](.\img\cross-origin-browser-analysis\image-20220709112701207.png)

至此，操作流程结束！

> 最后还有一点需要说明，此种设置，不排除未来 chrome 新版本安全策略进一步升级，导致失效的可能性，因此，且用且珍惜！

**原理分析**

接下来，我们来讨究下，为啥在启动 chrome 浏览器时添加如上设置的 2 个参数后，即可将浏览器设置成跨域的浏览器了？

对于这个问题，我在 [chromium 相关源码](https://source.chromium.org/chromium/chromium/src/+/main:content/public/common/content_switches.cc?q=user-data-dir_disable-web-security&ss=chromium) 中找到了答案：

![image-20220709112848331](.\img\cross-origin-browser-analysis\image-20220709112848331.png)

那为啥设置`--disable-web-security `能生效呢，我也在 chromium 相关源码文件中找到了解释：

![image-20220709112950243](.\img\cross-origin-browser-analysis\image-20220709112950243.png)

总结来讲就是，设置上述的 2 个参数后，会关闭浏览器默认的同源策略限制，进而实现跨域的效果。

关于浏览器同源策略更进一步的解释，详看 MDN 文档：[浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)。

另外，对 Chromium 源码感兴趣的，网站也贴在这里了：https://source.chromium.org/ 。

### 方案 2：使用 CORS 插件

**配置流程**

除了创建一个快捷方式来创建 chrome 浏览器的跨域版本外，我们还可以在非跨域的 chrome 浏览器中直接使用 CORS 插件来实现同样的资源跨域请求需求。

下边以[` Allow CORS: Access-Control-Allow-Origin `](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?utm_source=ext_sidebar&hl=zh-CN)插件为例，这个插件可以直接在 Chrome 的扩展商店中搜索到。

启用该插件，我们的浏览器就变成了”跨域“的浏览器了，不用另外配置。

使用该插件也非常简单，装到 chrome 浏览器中后，启用就行了，**启用**时图标处于激活状态：

![image-20220709113541000](.\img\cross-origin-browser-analysis\image-20220709113541000.png)

**未启用**时图标颜色如下：

![image-20220709113605303](.\img\cross-origin-browser-analysis\image-20220709113605303.png)

关于该插件的其他内容介绍和更多用法，详看：[TEST CORS](https://webbrowsertools.com/test-cors/)（绕过 gfw）。

**原理分析**

同样地，接下来从插件源码层面，解释插件生效的原理。

一句话解释就是，该插件会拦截**接口的响应，然后在响应头加上** [CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS) **相关的字段，进而绕过浏览器同源策略的限制**。

该插件的源码，根据插件 ID，然后可以在本地如下路径（小伙伴电脑的存放路径位置类似）找到：

![image-20220709113907272](.\img\cross-origin-browser-analysis\image-20220709113907272.png)

然后找到该插件的核心代码：

![image-20220709113944340](.\img\cross-origin-browser-analysis\image-20220709113944340.png)

对插件更多源码感兴趣的，可以自己装到浏览器中然后自行去查看哈。

另外，如果对 chrome 浏览器插件开发感兴趣的，可以自行前往 [chrome 插件官方开发文档](https://developer.chrome.com/docs/extensions/mv3/)（绕不过 gfw） 学习哈。

## （三）总结

好了，至此，文章就写完了。

本文从源码层面分析设置浏览器跨域生效的原理，希望对你有帮助～

我个人优先使用的是方式 2，简单快捷，又不降低浏览器的稳定性（之前通过方式 1 开发蜂眼项目时感觉浏览器的性能确实是有下降的），同时由于浏览器的同源策略限制并没有被放开，保证了浏览器的安全性。

不过，有些时候，通过CORS插件是行不通，此时，使用快捷方式设置而成的浏览器就是替代方案了。

## （四）参考资料

- [新版 chrome 浏览器设置允许跨域](https://www.haorooms.com/post/chrome_cros_yx)

<Giscus
  repo="xkyong/blogs"
  repo-id="R_kgDOMk5dyA"
  category="Announcements"
  category-id="DIC_kwDOMk5dyM4ChwJe"
  mapping="title"
  reactions-enabled="1"
  emit-metadata="0"
  input-position="top"
  theme="preferred_color_scheme"
  lang="zh-CN"
  loading="lazy"
/>





