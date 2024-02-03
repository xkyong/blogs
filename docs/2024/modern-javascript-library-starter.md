# 【翻译】如何使用 TypeScript、测试、GitHub Actions 和自动部署到 NPM 操作来发布 NPM 包

> 原文地址：https://advancedweb.hu/modern-javascript-library-starter
>
> 译者注：目前来讲，如果想直接套用一个模板来开发 JavaScript 库，antfu 提供了一个不错的开发模板：[starter-ts](https://github.com/antfu/starter-ts)

## 发布一个 JavaScript 库

彼时，当我想编写并发布一个 JavaScript 库时，我所要做的就是创建一个新的 GitHub 项目，编写一个包含一些基本细节的 `package.json`，添加一个 `index.js`，然后通过 CLI 发布到 NPM。但是，这种简单的设置忽略了许多被视为必要的新东西：没有类型、没有 CI/CD、没有测试，等等。

因此，上次我需要启动一个新的 JavaScript 库时，我花了一些时间进行基础设置，然后发现这些步骤大多是通用的，可以在不同的项目中重复使用。本文记录了开发和发布一个现代库所需的不同方面。

更具体地说，我想要这些功能：

- 使用 TypeScript 编写库，并在包中发布类型
- 有同样用 TypeScript 编写的测试
- 为构建和运行测试的提交运行 CI 管道
- 为发布到 NPM 仓库的每个新版本运行 CD 管道

## 启动代码

重要的文件是一些配置文件、包源代码和测试文件：

```bash
src/index.ts
src/index.test.ts
package.json
tsconfig.json
```

由于存在编译步骤，源文件和编译文件位于不同的目录中。`.ts` 文件存在 `src/` 目录中，而编译目标文件存在 `dist/` 目录中。

`package.json` 文件：

```json
{
	// name, version, description, other data
	"main": "dist/index.js",
	"type": "module",
	"files": [
		"dist"
	],
	"devDependencies": {
		"ts-node": "^10.9.2",
		"typescript": "^5.3.3"
	}
}
```

`files` 字段定义了 `dist`，指明只有编译后的文件才会打包并推送到 NPM 仓库中。然后 `main: "dist/index.js"` 定义了入口。

`tsconfig.json` 文件配置了 `TypeScript` 编译器：

```json
{
	"compilerOptions": {
		"noEmitOnError": true,
		"strict": true,
		"sourceMap": true,
		"target": "es6",
		"module": "nodenext",
		"moduleResolution": "nodenext",
		"declaration": true,
		"outDir": "dist"
	},
	"include": [
		"src/**/*.*"
	],
	"exclude": [
		"**/*.test.ts"
	]
}
```

根据项目的不同，可以有很多不同的配置，但重要的部分是 `src/` 文件夹中排除测试文件之外的文件，并且 `outDir` 是 `dist`。

`index.ts` 和 `index.test.ts` 文件很简单，只是为了演示库的工作：

```typescript
// src/index.ts

export const test = (value: string) => {
	return "Hello " + value;
}
```

```typescript
// src/index.test.ts

import test from "node:test";
import { strict as assert } from "node:assert";
import {test as lib} from "./index.js";

test('synchronous passing test', (t) => {
	const result = lib("World");
  assert.strictEqual(result, "Hello World");
});
```

这里需要注意下 `import ... from "./index.js"` 这行代码。虽然文件的扩展名为 `.ts`，但导入时使用的是 `.js`。

### NPM 脚本

接下来，在 `package.json` 中配置 `scripts`。

首先是 `build` 和 `clean`：

```json
{
	"scripts": {
		"build": "tsc --build",
		"clean": "tsc --build --clean"
	}
}
```

这2个脚本仅仅是调用 `tsc` 将 `TypeScript` 代码编译成 `JavaScript` 代码：

```bash
$ npm run build

> website-validator@0.0.8 build
> tsc --build

$ ls dist
index.d.ts  index.js  index.js.map
```

接下来，`prepare` 脚本会在软件包发布时运行构建。这是一个特殊的名称，因为 `npm` 会在 [生命周期的不同阶段](https://docs.npmjs.com/cli/v10/using-npm/scripts#prepare-and-prepublish) 调用它：

```json
{
	"scripts": {
		"prepare": "npm run clean && npm run build"
	}
}
```

### 测试

接下来，配置自动测试。为此，我发现不编译测试代码，而是使用一个能在需要时自动兼容 TS 文件的库会更简单。这就是 `ts-node` 依赖发挥作用的地方。

正因为如此，`test` 脚本不需要运行 `build`：

```json
{
	"scripts": {
		"test": "node --test --loader ts-node/esm src/**/*.test.ts"
	}
}
```

`--loader ts-node/esm` 将 `ts-node` 挂载到 node 模块解析进程中，并在导入 `.ts` 文件时对其进行编译。这使得测试设置变得超级简单：无需编译，只需运行。

```bash
$ npm test

> website-validator@0.0.8 test
> node --test --loader ts-node/esm src/**/*.test.ts

(node:245543) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-node/esm", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
✔ synchronous passing test (1.01411ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2650.590767
```



## 持续集成



### In action













## 自动部署到 NPM 上





### 起源







### 密钥





### 发布一个新版本







