# 【翻译】浏览器不想让你知道的67个怪异调试技巧

> 原文地址：https://alan.norbauer.com/articles/browser-debugging-tricks

一系列实用而不显眼的小技巧，让你充分利用浏览器的调试器。文章预设你对浏览器的开发者工具有中级或以上的了解。

## 进阶的条件断点

通过在你意想不到的地方使用具有副作用的表达式，我们可以从条件断点等基本功能中获取更多的功能。

### 日志点和追踪点

例如，我们可以在断点中使用 `console.log`。日志点 `logpoints` 是在不暂停执行的情况下将日志记录到控制台的断点。Microsoft Edge 内置日志点已有一段时间，而 Chrome 浏览器也在 `v73` 中添加了日志点，但 Firefox 浏览器没有。不过，我们可以在任何浏览器中使用条件断点来模拟日志点。

![](img/67-weird-debugging-tricks-your-browser-does-not-want-you-to-know/conditional-breakpoint-console-log.gif)

如果你还想计算该行的执行次数，请使用 `console.count` 而不是 `console.log`。

更新（2020 年 5 月）：现在所有主流浏览器都直接支持日志点/跟踪点（[Chrome 浏览器日志点](https://developers.google.com/web/updates/2019/01/devtools#logpoints)、[Edge 浏览器跟踪点](https://learn.microsoft.com/en-us/archive/microsoft-edge/legacy/developer/#breakpoints)、[Firefox 浏览器日志点](https://firefox-source-docs.mozilla.org/devtools-user/debugger/set_a_logpoint/index.html)）。

### 观察窗格

你还可以在观察窗格中使用 `console.log`。例如，要在调试器中每次暂停应用程序时转储 `localStorage` 的快照，可以创建一个 `console.table(localStorage)` 观察器：

![](img/67-weird-debugging-tricks-your-browser-does-not-want-you-to-know/截图_20231120215331.png)

或者，要在 DOM 修改后执行表达式，可以设置 DOM 修改断点（在元素检查器 `Element Inspector` 中）：

![](img/67-weird-debugging-tricks-your-browser-does-not-want-you-to-know/截图_20231120215658.png)

然后添加观察表达式，例如记录 DOM 的快照：`(window.doms = window.doms || []).push(document.documentElement.outerHTML)` 。现在，在修改任何 DOM 子树后，调试器将暂停执行，然后新的 DOM 快照会出现在 `window.doms` 数组的末尾。(没有办法创建不暂停执行的 DOM 修改断点）。

### 追踪调用堆栈

比方说，你有一个显示加载旋转器的函数和一个隐藏它的函数，但在代码的某个地方，你调用 show 方法时没有调用匹配的 hide 方法。如何找到未配对 show 调用的源代码？在 show 方法的条件断点中使用 `console.trace`，运行代码，找到 show 方法的最后一次堆栈追踪，然后点击调用者 `caller` 进入代码：

![](img/67-weird-debugging-tricks-your-browser-does-not-want-you-to-know/console-trace-find-stack.gif)

## 改变程序行为







## 快速、粗略的性能分析









## 使用函数的形参







## 使用时间







## 使用 CSS







## 只在偶数次调用





## 使用 `copy()`

::: warning 

只适用于 Chrome/Firefox 浏览器

:::

使用 `copy()` 控制台 API，你可以将浏览器中的有趣信息直接复制到剪贴板，而无需截断任何字符串。你可能想复制一些有趣的内容：

- 当前 DOM 的快照：`copy(document.documentElement.outerHTML)`
- 资源（如图片）的元数据：`copy(performance.getEntriesByType("resource"))`
- 格式化后的大型 JSON blob：`copy(JSON.parse(blob))`
- 本地存储的转储： `copy(localStorage)`
- 等等。





## 调试 HTML/CSS

JS 控制台有助于诊断 HTML/CSS 的问题。

### 禁用 JS 检查 DOM

在 DOM 检查器中，按下 `ctrl+\` （Chrome/Windows）键可随时暂停 JS 的执行。这样，你就可以检查 DOM 的快照，而不必担心 JS 会改变 DOM 或事件（如 `mouseover`）会导致 DOM 在你眼皮底下发生变化。

### 检查难以捉摸的元素

假设你要检查一个 DOM 元素，而该元素只在有条件的情况下才会出现。检查该元素需要将鼠标移动到该元素上，但当你尝试移动时，该元素却消失了：

![](img/67-weird-debugging-tricks-your-browser-does-not-want-you-to-know/elusive-element.gif)

要检查元素，可以将以下内容粘贴到控制台：`setTimeout(function() { debugger; }, 5000);`。这样就有 5 秒钟的时间来触发 UI，而一旦 5 秒钟的计时器到了，JS 的执行就会暂停，元素也不会消失。你就可以随意地将鼠标移到开发者工具上，而不会丢失元素：

![](img/67-weird-debugging-tricks-your-browser-does-not-want-you-to-know/elusive-element-inspected.gif)

在暂停执行 JS 时，你可以检查元素、编辑 CSS、在 JS 控制台中执行命令等。

在检查依赖于特定光标位置、焦点等的 DOM 时非常有用。

### 记录 DOM 快照

抓取当前状态下的 DOM 副本：

```js
copy(document.documentElement.outerHTML);
```

每秒记录一次 DOM 的快照：

```js
doms = [];
setInterval(() => {
  const domStr = document.documentElement.outerHTML;
  doms.push(domStr);
}, 1000);
```

或者直接输出到控制台：

```js
setInterval(() => {
  const domStr = document.documentElement.outerHTML;
  console.log("snapshotting DOM: ", domStr);
}, 1000);
```

### 监控聚焦元素

```js
(function () {
  let last = document.activeElement;
  setInterval(() => {
    if (document.activeElement !== last) {
      last = document.activeElement;
      console.log("Focus changed to: ", last);
    }
  }, 100);
})();
```

![](img/67-weird-debugging-tricks-your-browser-does-not-want-you-to-know/monitor-focus.gif)

### 找到加粗元素

```js
const isBold = (e) => {
  let w = window.getComputedStyle(e).fontWeight;
  return w === "bold" || w === "700";
};
Array.from(document.querySelectorAll("*")).filter(isBold);
```

#### 只找后代

或者只是检查器中当前所选元素的后代：

```js
Array.from($0.querySelectorAll("*")).filter(isBold);
```

### 引用当前选择元素

控制台中的 `$0` 是对元素检查器中当前选定元素的自动引用。

#### 先前检查过的元素

::: warning 

只适用于 Chrome/Edge 浏览器

:::

在 Chrome 浏览器和 Edge 中，你可以用 `$1` 访问上次检查过的元素，用 `$2` 访问之前的元素，等等。

#### 获取事件监听器

::: warning 

只适用于 Chrome 浏览器

:::

在 Chrome 浏览器中，你可以通过 `getEventListeners($0)` 查看当前选中元素的事件监听器，例如：

![](img/67-weird-debugging-tricks-your-browser-does-not-want-you-to-know/截图_20231120223025.png)

### 监控元素的事件

::: warning 

只适用于 Chrome 浏览器

:::

调试选定元素的所有事件： `monitorEvents($0)`

调试选定元素的特定事件：`monitorEvents($0, ["control", "key"])`

![](img/67-weird-debugging-tricks-your-browser-does-not-want-you-to-know/monitorEvents.gif)