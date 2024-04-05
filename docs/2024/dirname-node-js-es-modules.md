# __dirname 以 ES modules 方式回归 Node.js

> 原文地址：https://www.sonarsource.com/blog/dirname-node-js-es-modules/

ECMAScript 模块（或 ES modules）是打包 JavaScript 代码以复用的新标准格式。在 Node.js 世界中，从 CommonJS 向 ES modules 的转变是一个巨大而持续的过程，但在这一过程中也出现了一些摩擦。

最近，其中一个摩擦被消除了：现在访问当前模块的目录又变得容易了！

## 摘要

在一个 ES 模块中，你可以如下使用来替换 `__dirname` 或者 `__filename` ：

```js
import.meta.dirname  // The current module's directory name (__dirname)
import.meta.filename // The current module's file name (__filename)
```

如果你感兴趣，还有更多关于 `__dirname` 或者 `__filename` 的内容，请继续往下看。

## 访问当前目录

通过访问当前模块的目录路径，你可以遍历与代码所在位置相对应的文件系统，在项目中读取或写入文件，或动态导入代码。多年来，从 CommonJS 的实现到 ES Modules 的最新更新，访问这些信息的方式都发生了变化。让我们来看看它是如何演变的。

## 过去 CommonJS 的方式

Node.js 最初使用的是 CommonJS 模块系统。CommonJS 提供了两个变量，用于返回当前模块的目录名和文件名。这两个变量是 `__dirname` 和 `__filename` 。

```js
__dirname  // The current module's directory name
__filename // The current module's file name
```

## 过去 ES module 的方式

`__dirname` 和 `__filename` 在 ES 模块中不可用。相反，你过去需要以下代码来重现它们：

```js
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);
```

我总是记不住这些模板代码，总是发现自己在找 [Sam Thorogood 关于如何取回 __dirname 的解释](https://blog.logrocket.com/alternatives-dirname-node-js-es-modules)。一定有更简单的方法。

## 最新 ES module 的方式

经过反复讨论，现在终于有了更好的办法。自 [Node.js 20.11.0 版](https://nodejs.org/en/blog/release/v20.11.0)、[Deno 1.40.0 版](https://deno.com/blog/v1.40#importmetafilename-and-importmetadirname) 和 [Bun 1.0.23 版](https://bun.sh/blog/bun-v1.0.23#import-meta-dirname-and-import-meta-filename-support) 起，你可以调用 [import.meta 对象](https://nodejs.org/docs/latest/api/esm.html#importmeta) 的 `dirname` 和 `filename` 属性。

```js
import.meta.dirname  // The current module's directory name
import.meta.filename // The current module's file name
```

## 过去我们如何获取？

正如我在文章开头所写，ES modules 是 JavaScript 的一项标准。然而，JavaScript 一开始是在网络浏览器中运行的编程语言。Node.js 推广了在服务器上运行 JavaScript，但不得不使用或发明一些约定。Node.js 项目早期做出的一个选择就是采用 [CommonJS 模块系统及其附带的所有功能](https://nodejs.org/docs/latest/api/modules.html#modules-commonjs-modules) 。

而 ES modules 的设计之初就同时考虑了浏览器和服务器环境。浏览器通常没有文件系统访问权限，因此提供对当前目录或文件名的访问是不合理的。然而，浏览器使用的是 URL，可以使用 [file:// 方案](https://en.wikipedia.org/wiki/File_URI_scheme) 以 URL 格式提供文件路径。因此，ES modules 可以引用模块的 URL。你在上面已经看到了，即 [import.meta.url](https://nodejs.org/docs/latest/api/esm.html#importmetaurl)。让我们看看在 Node.js 中可以如何使用 URL。

## 无处不在的 URL

考虑一个名为 `module.js` 的 ES 模块，其代码如下：

```js
console.log(import.meta.url);
```

如果在使用 Node.js 的服务器上运行此文件，将得到以下结果：

```bash
$ node module.js
file:///path/to/module.js
```

如果在网络浏览器中加载 `module.js`，会看到：

```js
https://example.com/module.js
```

这两个结果都是 URL，但根据上下文采用了不同的方案。

让人更困惑的是，`import.meta.url` 是一个描述 `URL` 的字符串，而不是真正的 `URL` 对象。通过将字符串传递给 `URL` 构造函数，可以将其转换为真正的 `URL` 对象：

```js
const fileUrl = new URL(import.meta.url);
console.log(url.protocol);

// Node.js: "file:"
// Browser: "https:"
```

这也是 Node.js 最初取代 `__dirname` 和 `__filename` 的来源。有了 `URL` 对象，就可以使用 [Node.js 的 URL 模块](https://nodejs.org/docs/latest/api/url.html#urlfileurltopathurl) 将模块的 URL 对象变成文件路径，从而重新创建 `__filename`。

```js
import * as url from "url";

const fileUrl = new URL(import.meta.url);
const filePath = url.fileURLToPath(fileUrl);
console.log(filePath);

// /path/to/module.js
```

你还可以通过操作 URL 来获取目录名，并重新创建 `__dirname`。

```js
import * as url from "url";

const directoryUrl = new URL(".", import.meta.url);
const directoryPath = url.fileURLToPath(directoryUrl);
console.log(directoryPath);

// /path/to
```

## 你可以使用 URL 代替字符串

你可能认为需要使用路径字符串才能在 Node.js 中执行常见的文件操作。事实证明，许多针对字符串路径的 Node.js API 也可用于 `URL` 对象。

`__dirname` 最常见的用途是遍历一个目录以找到要加载的数据文件。例如，如果你的 `module.js` 文件与名为 `data.json` 的文件位于同一目录，而你想将数据加载到脚本中，那么你以前会这样使用 `__dirname`：

```js
const { join } = require("node:path");
const { readFile } = require("node:fs/promises");

function readData() {
  const filePath = join(__dirname, "data.json");
  return readFile(filePath, { encoding: "utf8" });
} 
```

现在，你可以在 ES 模块中使用 `import.meta.dirname` 重现这一功能。

```js
import { join } from "node:path";
import { readFile } from "node:fs/promises";

function readData() {
  const filePath = join(import.meta.dirname, "data.json");
  return readFile(filePath, { encoding: "utf8" });
} 
```

但你可以使用类似这样的 `URL` 对象：

```js
import { readFile } from "node:fs/promises";

function readData() {
  const fileUrl = new URL("data.json", import.meta.url);
  return readFile(fileUrl, { encoding: "utf8" });
}
```

由于 ES modules 为客户端和服务器端编写的 JavaScript 带来了一致性，因此使用 `URL` 对象而不是路径字符串也能达到同样的效果。如果你想了解 URL 而不是路径的更多用例，请查看 [__dirname 替代方案](https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/#what-is-your-goal) 这篇文章。

## 哪里可以找到 import.meta.dirname？

`import.meta.dirname` 和 `import.meta.filename` 可在最新版本的 Node.js、Deno 和 Bun 中使用。

Bun 已经实现了 `import.meta.dir` 和 `import.meta.path`，它们是等价的。`dirname` 和 `filename` 现在是 `dir` 和 `path` 的别名。

由于这些属性只指向底层文件系统，因此只有在 `import.meta.url` 方案为 **"file: "** 时才可用。也就是说，它们在浏览器环境中不可用；在浏览器中尝试使用 `import.meta.dirname` 将直接返回 `undefined`。

## 简易性与互操作性的融合

很高兴 Node.js 社区、Deno 和 Bun 都决定实现这些属性。随着代码库的迁移和新项目的启动使用 ES modules，减少变更的摩擦对整个生态系统都是有益的。

同样重要的是要注意，在所有 JavaScript 环境中使用 `import.meta.url` 可以实现什么，并考虑使用 `URL` 对象是否可以使你的代码在前端和后端代码中更加一致。

至少，我们现在可以删除一些模板代码，转而使用 `import.meta.dirname`。

 