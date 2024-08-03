# [译] 为什么说，你在 TypeScript 中使用枚举是错误的

> 原文地址：https://tduyng.com/blog/enum-typescript/

在 TypeScript 中使用枚举的话题已经被讨论了很多次，但许多开发人员仍然没有意识到它们的缺点。尽管枚举很流行，也很常用，但它们并不总是最佳选择。在本文中，我将与大家分享我对枚举可能成为问题的原因的看法，并向大家展示一种更好的方法。

## 摘要

- `enum` 是 TypeScript 独有的特性，在 JavaScript 中并不存在；
- `enum` 有几个问题：
  - 编译后的输出代码可能难以阅读和理解，从而导致潜在的 bug；
  - 运行时创建和初始化会影响性能；
  - 与类型声明的兼容性问题，尤其是在使用` isolatedModules` 的项目中。
- `as const` 与泛型辅助类型一起使用：`export type TypeFrom<T> = T[keyof T]`，这是一种更简单、更高效的替代方法。

如果你是 TypeScript 开发人员，你很可能熟悉 `enums` 的使用。但是，你是否考虑过 TypeScript 中的 `enums` 究竟代表什么？值得注意的是，JavaScript 中没有 `enum` 这个特性。

::: tip

重要的是要记住，TypeScript 本质上是带有类型的 JavaScript，在浏览器或后台环境中执行的代码是 JavaScript。

:::

那么，在 TypeScript 和 JavaScript 之间转换时，究竟如何使用 `enums` 呢？

如下是在 TypeScript 中使用 `enum` 的一个简单示例：

```ts twoslash
// constant.ts
export enum HttpStatusCode {
    Ok = 200,
    BadRequest = 400,
    Authorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500,
    GatewayTimeout = 503,
}
enum Color {
    Red,
    Green,
    Blue,
    Yellow = 10,
    Purple,
    Orange,
    Pink,
}
export enum E2 {
    A = 1,
    B = 20,
    C,
}
export enum FileAccess {
    // constant members
    None,
    Read = 1 << 1,
    Write = 1 << 2,
    ReadWrite = Read | Write,
    // computed member
    G = '123'.length,
}
```

编译后的 JavaScript 代码如下：

```js
// constant.js
export var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["Ok"] = 200] = "Ok";
    HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
    HttpStatusCode[HttpStatusCode["Authorized"] = 401] = "Authorized";
    HttpStatusCode[HttpStatusCode["Forbidden"] = 403] = "Forbidden";
    HttpStatusCode[HttpStatusCode["NotFound"] = 404] = "NotFound";
    HttpStatusCode[HttpStatusCode["InternalServerError"] = 500] = "InternalServerError";
    HttpStatusCode[HttpStatusCode["GatewayTimeout"] = 503] = "GatewayTimeout";
})(HttpStatusCode || (HttpStatusCode = {}));

var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
    Color[Color["Yellow"] = 10] = "Yellow";
    Color[Color["Purple"] = 11] = "Purple";
    Color[Color["Orange"] = 12] = "Orange";
    Color[Color["Pink"] = 13] = "Pink";
})(Color || (Color = {}));

export var E2;
(function (E2) {
    E2[E2["A"] = 1] = "A";
    E2[E2["B"] = 20] = "B";
    E2[E2["C"] = 21] = "C";
})(E2 || (E2 = {}));

export var FileAccess;
(function (FileAccess) {
    // constant members
    FileAccess[FileAccess["None"] = 0] = "None";
    FileAccess[FileAccess["Read"] = 2] = "Read";
    FileAccess[FileAccess["Write"] = 4] = "Write";
    FileAccess[FileAccess["ReadWrite"] = 6] = "ReadWrite";
    // computed member
    FileAccess[FileAccess["G"] = '123'.length] = "G";
})(FileAccess || (FileAccess = {}));
```

你看到 TypeScript 代码和 JavaScript 代码之间的区别了吗？这很难读懂吧？

当编译为 JavaScript 时，`enums` 被创建为和我们的 `enum` 同名的函数，键值被添加到该函数中。

## enum 有什么问题？

### 1. 编译后输出代码的理解

由于源码和编译后输出代码看起来不一样，这增加了阅读和理解代码的难度。这可能导致运行时出现意想不到的错误。

如上例所示，如果我们指定了索引基数，所有后续键的索引基数都会发生变化。有时，很难理解 `enum` 的输出是怎么回事。

例如：

```ts
console.log(Color.Purple); // ??? 
// 输出 11
// 如果我们只阅读这种情况下的 TypeScript 代码，
// 在我们不理解底层的枚举值赋值的情况下，
// 我们可能无法确定结果。
```

### 2. 类型声明兼容性问题

在构建使用 `.d.ts` 文件类型的项目或库时，使用 `enum` 类型可能会导致问题。具体来说，如果项目使用 [isolatedModules](https://www.typescriptlang.org/tsconfig/#references-to-const-enum-members)，则可能无法有效使用枚举类型。我们的项目中也遇到过这个问题。

### ~~3. 性能问题~~

~~在 JavaScript 中，`enum` 对象被编译为一个函数，每次调用 `enum` 时都需要在运行时创建和初始化该函数。这会影响性能，尤其是在大型应用程序中。~~

编译为 JavaScript 时，枚举使用了立即调用函数表达式（IIFE）。该 IIFE 只运行一次，用于初始化代表枚举的对象。初始化后，访问枚举值的效率很高，因为它只涉及简单的属性查找，不需要调用额外的函数。因此，使用枚举和常量对象在性能上没有明显区别。

> 感谢 [David Dios](https://github.com/dios-david) 的 [纠正](https://github.com/tduyng/tduyng.github.io/discussions/15)。

更多有关在 TypeScript 中使用 `enum` 缺点的详细讨论，可以参阅这些资源：

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/handbook/enums.html)
- [TypeScript 枚举非常糟糕](https://www.reddit.com/r/typescript/comments/yr4vv5/typescript_enums_are_terrible_heres_why/)
- [TypeScript 枚举：好、坏、丑](https://www.crocoder.dev/blog/typescript-enums-good-bad-and-ugly/)



## 解决方法是什么？

Typescript 团队为 enum 提供了一个简单的替代解决方案：

:::tip

在现代 TypeScript 中，当对象使用 `as const`  即可满足要求时，你可能不需要枚举。

:::

因此，你可以完全不使用枚举，而使用 `as const`。

下面是一个使用 `as const` 的 JavaScript 输出示例，看看它是如何工作的：

```ts twoslash
// constant.ts
// Alternative enums solutions
export const HttpStatusCodes = {
    Ok: 200,
    BadRequest: 400,
    Authorized: 401,
    Forbidden: 403,
    NotFound: 404,
    InternalServerError: 500,
    GatewayTimeout: 503,
} as const;
export const Colors = {
    Red: 0,
    Green: 1,
    Blue: 2,
    Yellow: 3,
    Purple: 11,
    Orange: 5,
    Pink: 6,
} as const;
// Or
export const Colors2 = {
    Red: 'Red',
    Green: 'Green',
    Blue: 'Blue',
    Yellow: 'Yellow',
    Purple: 'Purple',
    Orange: 'Orange',
    Pink: 'Pink',
} as const;
export const FileAccesses = {
    None: 0,
    Read: 1 << 1,
    Write: 1 << 2,
    ReadWrite: 3,
    G: '123'.length,
} as const;
```

当编译成 JavaScript 时，你会得到同样的代码（没有 `as const`）：

```js
// constant.js
export const HttpStatusCodes = {
    Ok: 200,
    BadRequest: 400,
    Authorized: 401,
    Forbidden: 403,
    NotFound: 404,
    InternalServerError: 500,
    GatewayTimeout: 503,
}
export const Colors = {
    Red: 0,
    Green: 1,
    Blue: 2,
    Yellow: 3,
    Purple: 11,
    Orange: 5,
    Pink: 6,
};
export const Colors2 = {
    Red: 'Red',
    Green: 'Green',
    Blue: 'Blue',
    Yellow: 'Yellow',
    Purple: 'Purple',
    Orange: 'Orange',
    Pink: 'Pink',
};
export const FileAccesses = {
    None: 0,
    Read: 1 << 1,
    Write: 1 << 2,
    ReadWrite: 3,
    G: '123'.length,
};
```

`as const` 对象将编译成与 TypeScript 代码一模一样的 JavaScript 代码。你可以像使用枚举一样使用这些对象。这种方法解决了我上面提到的枚举的所有问题。




## `as const` 类型标注

使用 `as const` 可以提供常量值，但我们如何在需要时定义枚举类型呢？幸运的是，这并不复杂。

下面是类型标注的解决方案：

```ts
// 辅助类型
export type TypeFrom<T> = T[keyof T];

// 常量类型
export type HttpStatusCode = TypeFrom<typeof HttpStatusCodes>;
export type Color = TypeFrom<typeof Colors>;
export type Color2 = TypeFrom<typeof Colors2>;
export type FileAccess = TypeFrom<typeof FileAccesses>;
```

在这种方法中：

- 辅助类型：定义泛型辅助类型 `TypeFrom`，从对象中提取类型；
- 常量类型：使用 `TypeFrom` 辅助类型为每个常量创建等价的类型。

不过，在导入常量和类型时有一个潜在的问题：

```ts
import { Color } from './constant.js';
import { Color } from './definitions.js';
```

TypeScript 不允许同一文件中的不同实体使用相同的名称。一种解决方法是使用命名空间导入：

```ts
import { Color } from './constant.js';
import * as definitions from './definitions.js';

// 当需要时使用 definitions.Color
```

但我不推荐这种方法，因为它不灵活，而且会增加在 IDE 中自动导入的难度。更好的方法是以不同的方式命名常量和类型，通常标注 `as const` 的对象使用复数形式，对应类型使用单数形式：

```ts
// constant.ts
export const HttpStatusCodes = {
    Ok: 200,
    BadRequest: 400,
} as const;

// definitions.ts
export type TypeFrom<T> = T[keyof T];
export type HttpStatusCode = TypeFrom<typeof HttpStatusCodes>;
```

这样，你就可以轻松导入和导出常量和类型，而不会发生命名冲突。此外，这种方法还具有将 TypeScript `type` 定义与 TypeScript 常量/函数明确分开的优点。

我希望这篇文章能让更多人受益，并帮助你在项目中优化 TypeScript 的使用。欢迎阅读评论或对 [我的 medium 文章](https://tduyng.medium.com/why-you-might-be-using-enums-in-typescript-wrong-6d9c5742db5a) 提供反馈。祝你编码愉快！

<Giscus
  repo="XKyong/xkyong.github.io"
  repo-id="R_kgDOJ_jjbw"
  category="Announcements"
  category-id="DIC_kwDOJ_jjb84Cf-jt"
  mapping="title"
  reactions-enabled="1"
  emit-metadata="0"
  input-position="top"
  theme="preferred_color_scheme"
  lang="zh-CN"
  loading="lazy"
/>
