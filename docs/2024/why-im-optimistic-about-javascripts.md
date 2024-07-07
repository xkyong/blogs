# [译] 为什么说，我对 Javascript 的未来保持乐观态度

> 原文地址：https://leerob.substack.com/p/why-im-optimistic-about-javascripts

我对 JavaScript 的未来保持乐观态度。 

开发者希望编写 JavaScript，而且他们希望 JavaScript 可以在浏览器、服务器或边缘等任何地方运行。

 JavaScript 虽然千奇百怪、不尽完美，但由于其内置的增长 hack（在浏览器中）、庞大的工具和库生态系统以及 TypeScript 的持续增长和使用，其使用率仍在不断上升。 越来越多的开发者能够学习 API（如 `Request` 或 `Response`），并在任何地方重复使用相同的知识。

有了一套约定俗成通用的 API（即标准）和支持相同接口的平台（如跨浏览器支持），意味着网络开发者现在可以**一次学习，随处编写**。 

本篇文章将概述网络平台最近在浏览器、服务器和边缘等方面取得的改进。



## 浏览器端的 JavaScript

如今，网络开发者花在编写浏览器厂商特有的 JavaScript 或 CSS 选择器上的时间比以往任何时候都要少。

```js
function isIE11() {
  return !!window.MSInputMethodContext && !!document.documentMode;
}
```

我们已经摆脱了为保持元素 [宽高比](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) 而使用填充 hack 的场景：

```css
@supports not (aspect-ratio: 16/9) {
  .aspectRatio {
    overflow: hidden;
    padding-bottom: 56.25%;
    height: 0;
  }
}
```

有两个趋势使这成为可能：

- **Internet Explorer 之死**： 现在，IE 11 [已经正式退出历史舞台](https://www.bleepingcomputer.com/news/microsoft/microsoft-edge-update-will-disable-internet-explorer-in-february/)，网络开发者可以编写更少的浏览器厂商特有的 CSS，从而实现更小的样式表和更少的 hacks。 
- **浏览器引擎的一致性**： 现在，三大浏览器引擎（Chromium/Chrome、Gecko/Firefox 和 Webkit/Safari）对 JavaScript、CSS 和 Web API 的跨浏览器支持达到了我们所见过的最佳水平，这要归功于 [Interop 项目](https://web.dev/interop-2022/)。

当然，跨浏览器引擎支持并不完美，以后也不可能完美。 但这已经是最好的了，我对此很乐观。 不用再花一周的时间去研究深奥的 IE Bug，累计起来将为开发者节省数千（或数百万）个小时。 

下面是一个例子，说明这种一致性如何能让所有网络开发者受益。 想象一下，你是一位框架作者，正试图编写一个可重复使用的图像组件，以帮助成千上万的开发者在使用图像时获得出色的性能。 在 2020 年，也就是几年前，你需要围绕所有的网络平台开展工作。

在加载图片时不会导致 [布局偏移](https://web.dev/cls/)、正确保持纵横比，以及不会因图片大小/重量而降低初始页面加载性能，这些都很难在所有主流浏览器上实现。 这导致开发者要么忽略这些问题，要么在框架中编写组件抽象，从而产生类似以下的代码：

```html
<span> <-- needed to maintain aspect ratio
  <span> <-- needed to maintain aspect ratio, CSS padding hacks
    <img src="" style="" /> <-- inline styles to prevent layout shift
    <noscript>...</noscript> <-- JS needed for IntersectionObserver
  </span>
</span>
```

在 2022 年，情况就不同了。 跨浏览器支持：`aspect-ratio`、防止布局偏移的 [宽度/高度属性](https://web.dev/optimize-cls/)、原生的 [图片懒加载](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading) 以及基于纯 CSS/SVG 的模糊图片占位符。 上述代码可以去掉包装元素，无需运行时 JavaScript 即可运行：

```html
<img
  alt="A kitten"
  decoding="async"
  height="200"
  loading="lazy"
  src="https://placekitten.com/200/200"
  style="aspect-ratio: auto 1 / 1"
  width="200"
/>
```



## 服务器端的 JavaScript

同构 JavaScript，即可以在客户端和服务器上运行的代码，一直是许多网络开发者的理想状态。 一次学习，随处编写，不是吗？ 直到最近，Node.js 和网络平台还不一致。

> 译者注：这里说的“最近”，具体是 Node.js 18 版本未发布之前

考虑一下通过 HTTP 获取数据。 在浏览器中，我们有 [Web Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。 在 Node.js 18 之前，没有内置的数据获取解决方案。 进行数据 `fetch` 需要使用 `node-fetch` 或 `undici` 等软件包，它们的 API 虽然相似，但略有不同，而且经常以不明显的方式存在。

平台之间缺乏一致性意味着编写同构 JavaScript 的工具（如 Next.js）需要添加 polyfills，以便开发者可以在客户端和服务器上使用 `fetch`。 有了 Node.js 18，这些工具现在可以移除 polyfill 平台差异所需的额外 JavaScript，最终减少所需的 JavaScript 代码。 

我对服务器上的 JavaScript（和 TypeScript）保持乐观态度。 不仅仅是 `fetch`。 现在，浏览器和 Node.js 中还都可以使用 `Request`、`Response` 和**其他 100 多个 API**。 浏览器厂商和构建服务器基础架构的公司现在 [比以往任何时候都能更紧密地合作](https://wintercg.org/)，以提供一套可在任何地方（包括边缘计算平台）运行的标准 API。



## 边缘计算端的 JavaScript

> 译者注：原文作者评论区提到的一篇关于边缘计算的文章，这里也列一下链接：[What is Edge Compute? It’s kind of like knitting dog hats](https://austingil.com/edge-compute-knitted-dog-hats/)。

边缘计算经常被误解，也是运行 JavaScript 的最新目标，是三者（浏览器、服务器、边缘计算）中标准化程度最低的。 

将边缘计算视为最高级别的抽象，将所有时间都花在业务逻辑上，是很有帮助的。

![](img/why-im-optimistic-about-javascripts/edge-compute.jpg)

边缘计算并不是什么全新的东西，而是对现有 Node.js 世界的一种深思熟虑后和有意的权衡。 

你想编写 JavaScript，但边缘计算基础架构需要一个较小的 Node.js API 子集（相当大）。 通过对同样在浏览器中运行的 Node.js API 子集进行这种权衡，你就可以获得持续快速的冷启动和更具成本效益的计算工作负载。 听起来不错。

我们来看一个例子。 在本例中，我将使用 [Vercel 边缘功能](https://vercel.com/blog/edge-functions-generally-available)。 但也可以使用 Cloudflare 或 Deno 等其他边缘计算平台。 对我来说，这段代码最精彩的部分其实是它相当无聊。 它看起来就像 Node.js：

```js
export const config = {
  runtime: 'edge'
}

// Web standard Request API
export default function handler(req: Request) {
  // Web standard URL API
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')

  // Web standard Fetch API
  const req = await fetch('https://...', { body: { name } })
  const data = await req.json()

  // Web standard Response (.json is new)
  // https://github.com/whatwg/fetch/issues/1389
  return Response.json(data);
}
```

关键在于：这不仅仅是基础设施的问题。 它还与框架有关，这些框架正在拥抱这些相同的 Web API，并帮助成千上万的新开发者一次学习，随处编写。 

这些代码可以使用 Next.js，SvelteKit，Remix 或 Refresh。或者下一个基于同一套标准 API 的新网络框架。

**对于网络开发者来说，这是一个多么不可思议的时代。**



