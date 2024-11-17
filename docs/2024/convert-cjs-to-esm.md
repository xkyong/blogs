# [译] CommonJS 转换为 ESM

> 原文地址：https://deno.com/blog/convert-cjs-to-esm

ECMAScript 模块（"ESM"）是编写和共享 JavaScript 的官方现代方式——它在许多环境（如浏览器、边缘计算和 Deno 等现代运行时）中都受支持，并提供更好的开发体验（如异步加载和无需全局即可导出）。 虽然 CommonJS 曾是多年的标准，但 [如今支持 CommonJS 会损害 JavaScript 社区的利益](https://xkyong.github.io/blogs/2023/commonjs-is-hurting-javascript.html)。 

所有新的 JavaScript 都应使用 ESM 编写，以面向未来。 但是，在很多情况下，出于与新软件包兼容的考虑，需要对遗留代码库进行现代化。 在这篇文章中，我们将向你展示如何将遗留的 CommonJS 项目的语法迁移到支持 ESM 的项目中，并提供一些工具来帮助你顺利完成这一过程。

- [模块导入和导出](#模块导入和导出)
- [更新 package.json](#更新-package-json)
- [其他变更](#其他变更)
- [迁移工具](#迁移工具)
- [下一步](#下一步)



## 模块导入和导出

以下是将 CommonJS 的导入和导出语法更新为 ESM 的方法。

导出侧：

```js
function addNumbers(num1, num2) { // [!code --]
export function addNumbers(num1, num2) { // [!code ++]
  return num1 + num2;
};
    
module.exports = { // [!code --]
  addNumbers, // [!code --]
} // [!code --]
```

导入侧：

```js
const { addNumbers } = require("./add_numbers"); // [!code --]
import { addNumbers } from "./add_numbers.js"); // [!code ++]

console.log(addNumbers(2, 2));
```

请注意，在 ESM 中，模块路径中必须包含文件扩展名。 完全指定的导入可以确保模块解析过程始终导入正确的文件，从而减少歧义。 此外，它与浏览器处理模块导入的方式一致，使编写可预测和可维护的同构代码变得更容易。 

那么条件导入呢？ 如果你使用的是 Node.js v14.8 或更高版本（或 Deno），那么你就可以访问顶层 await，使用它来实现同步 `import`：

```js
const module = boolean ? require("module1") : require("module2"); // [!code --]
const module = await (boolean ? import("module1") : import("module2")); // [!code ++]
```



## 更新 package.json

如果使用 `package.json`，则需要进行一些调整以支持 ESM：

```json
{
  "name": "my-project",
  "type": "module", // [!code ++]
  "main": "index.js", // [!code --]
  "exports": "./index.js", // [!code ++]
  // ...
}
```

请注意，ESM 中的前导 `"./"` 是必要的，因为每次引用都必须使用完整的路径名，包括目录和文件扩展名。 

此外，`"main"` 和 `"exports"` 都定义了项目的入口点。 不过，`"exports"` 是 `"main"` 的现代替代品，因为它允许多个入口点，支持环境间有条件的入口解析，并防止 `"exports"` 定义之外的其他入口点，从而使作者能够明确定义其软件包的公共接口。

```json
{
  "name": "my-project",
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./other": "./other.js"
  }
}
```

最后，告诉 Node 在 ESM 中运行文件的另一种方法是使用 `.mjs` 文件扩展名。 如果你想将单个文件更新为 ESM，这种方法就很不错。 但如果你的目标是转换整个代码库，更新 `package.json` 中的 `type` 会更容易。



## 其他变更

由于 ESM 中的 JavaScript 会自动以 [严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) 运行，因此你可以从代码库中删除所有 `"use strict;"` 实例：

```js
"use strict"; // [!code --]
```

CommonJS 还支持一些在 ESM 中不存在的内置全局项，如 `__dirname` 和 `__filename` 等。 解决这个问题的一个简单方法是使用快速 shim 来填充这些值：

```js
// Node 20.11.0+, Deno 1.40.0+
const __dirname = import.meta.dirname;
const __filename = import.meta.filename;

// Previously
const __dirname = new URL(".", import.meta.url).pathname;

import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
```



## 迁移工具

虽然上述内容涉及将 CommonJS 代码库转换为 ESM 代码库所需的更改，但有一些工具可以帮助完成转换。 

**使用 [VSCode](https://code.visualstudio.com/)，你可以快速将 CommonJS 的所有导入和导出语句转换为 ESM。** 只需将鼠标悬停在 `require` 关键字上，点击 "快速修复"，该文件中的所有语句都将更新为 ESM：

<video src="./video/vscode-cjs-to-esm.mp4" style="width: 100%; object-fit: contain" controls muted loop></video>

你会注意到，VSCode 可以为导入和导出交换适当的关键字，但指定符缺少文件名扩展名。 **你可以通过运行 `deno lint --fix` 快速添加它们。** Deno 的 linter 自带了 `no-sloppy-import` 规则，当导入路径不包含文件扩展名时，它会显示 linting 错误。 

要想以更端到端的方式将 CommonJS 转换为 ESM，有几种转译选项可供选择。 有一种 CLI 工具 [ts2esm](https://github.com/bennycode/ts2esm) 可以将 CJS 转换为 ESM，其中包括 [分步说明](https://github.com/bennycode/ts2esm?tab=readme-ov-file#step-by-step-guide)，甚至还有 [一段有趣的视频演示](https://www.youtube.com/watch?v=bgGQgSQSpI8&feature=youtu.be)。 

还有一些工具，如 [cjs2esm](https://www.npmjs.com/package/cjs2esm) 和 [cjstoesm](https://www.npmjs.com/package/cjstoesm)，以及 Babel 插件 [babel-plugin-transform-commonjs](https://github.com/tbranyen/babel-plugin-transform-commonjs)，不过这些工具并没有得到积极维护，因此在评估它们时要注意这一点。



## 下一步

ESM 是共享代码的标准 JavaScript 方式，所有新 JavaScript 都应支持它。 如今选择支持 CommonJS 可能会让模块作者和开发人员感到非常痛苦，因为他们不想再为遗留兼容性问题排忧解难。 事实上，我们的开源现代 JavaScript 注册表 JSR 明确禁止模块使用 CommonJS。 我们呼吁大家为提升 JavaScript 生态系统的水平尽一份力。
