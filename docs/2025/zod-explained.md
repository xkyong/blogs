# [译] Zod 完全指南

>  原文地址：https://betterstack.com/community/guides/scaling-nodejs/zod-explained/
>
> Zod 中文文档详见：https://zod.nodejs.cn/
>
> 以下内容编写基于 `zod@4.0.10` 和 `typescript@5.8.3` ！

[Zod](https://zod.dev/) 是 TypeScript 优先的模式验证库，为定义、验证和转换数据结构提供了一种简单而强大的方法。

Zod 广泛应用于各种应用程序，包括 API 验证、表单验证和运行时类型检查。凭借声明式模式定义和内置的 TypeScript 支持，Zod 可简化确保数据完整性和防止运行时错误。

本文将指导你在 TypeScript 应用程序中创建 Zod 验证系统。你将学习如何利用其功能来定义模式、验证数据、优雅地处理错误并将其集成到实际应用中。

让我们开始吧！

## 学习前提

在继续本文的其余部分之前，请确保你的计算机上安装了最新版本的 [Node.js](https://nodejs.org/en/download/) 和 `npm`。此外，你还应熟悉  [TypeScript 的基本概念](https://betterstack.com/community/guides/scaling-nodejs/nodejs-typescript/)，因为 Zod 主要是为 TypeScript 应用程序设计的。

## 初始化项目目录

在本节中，你将使用 TSX 设置 TypeScript 开发环境，以直接运行 TypeScript 文件。通过这种设置，你可以高效地编写和执行 TypeScript 代码，而无需单独的编译步骤。

首先创建一个新目录并导航进入：

```bash
$ mkdir zod-validation && cd zod-validation
```

初始化项目：

```bash
$ npm init -y
```

按照如下命令设置项目使用 ES Modules：

```bash
$ npm pkg set type=module
```

安装 Zod 和其他 TypeScript 依赖：

```bash
$ npm install zod
```

```bash
$ npm install --save-dev typescript tsx
```

TypeScript 的依赖包含：

- `typescript`： TypeScript 编译器和语言服务
- `tsx`： 一个 CLI 命令，允许直接运行 TypeScript 文件，类似于 node 运行 JavaScript 文件的方式

接下来，生成 TypeScript 配置文件：

```bash
$ npx tsc --init
```

在创建 TypeScript 主文件之前，请更新 `package.json` 文件，以包含运行项目的快捷脚本：

:::code-group

```json[package.json]
{
  ...
  "scripts": {
    "dev": "tsx index.ts"
  }
}
```

:::

现在，一旦主文件创建，你可以使用如下命令启动项目：

```bash
$ npm run dev
```

初始化工作完成后，你的 TypeScript 环境就准备就绪了，可以使用 TSX 运行 TypeScript 文件了。

## 开始使用 Zod

在本节中，你将学习如何创建和使用 Zod 模式来验证 TypeScript 应用程序中的数据类型。Zod 提供了一种类型安全的方法，可在运行时验证数据，同时保持强大的 TypeScript 集成。

在项目目录中创建一个新文件 `validation.ts`，并添加以下代码：

:::code-group

```ts[validation.ts]
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

export default UserSchema;
```

:::

该代码段定义了用户对象的模式，以确保：

- `name` 是一个 string 类型
- `age` 是一个 number 类型
- `email` 是一个有效的电子邮件 string 类型
- 现在，让我们使用该模式验证一些示例数据。创建一个新文件 `index.ts`，并添加以下代码：

:::code-group

```ts[index.ts]
import UserSchema from './validation';

const userData = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
};

const result = UserSchema.safeParse(userData);

if (result.success) {
  console.log('Valid user data:', result.data);
} else {
  console.error('Validation errors:', result.error.format());
}
```

:::

在这个脚本中，你从 `validation.ts` 文件导入 `UserSchema`，它定义了预期的用户数据结构。`safeParse` 方法根据此模式验证 `userData`。

- 如果 `userData` 与模式匹配，`safeParse` 会返回一个包含 `success: true`  的对象，验证后的数据会记录到控制台。

- 如果验证失败，`safeParse` 会返回一个包含 `success: false` 的对象，`format()` 方法会提供一条结构化错误信息，显示哪些字段无效以及无效原因。

这种方法可确保输入数据在应用中使用前得到正确验证，有助于防止意外或不合理数据导致的潜在问题。

运行脚本：

```bash
$ npm run dev
```

如果输入的数据是有效的，脚本会打印验证后的数据：

```text
Valid user data: { name: 'Alice', age: 25, email: 'alice@example.com' }
```

现在你已经知道如何开始使用 Zod 了，接下来你将学习如何在 Zod 中自定义验证。



## 自定义 Zod 验证

Zod 提供了一套丰富的内置验证工具，让你可以执行基本类型检查之外的约束。你可以通过添加条件、细化值或串连多个验证规则来定制模式。

### 添加约束

你可以使用 Zod 的内置方法对值执行特定的约束。让我们增强 `UserSchema`，使其包含更详细的验证：

:::code-group

```ts[validation.ts]{4-7}
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  age: z.number().int().positive("Age must be a positive integer"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default UserSchema;
```

:::

以下是每个约束的作用：

- `.min(3, "Message")`： 确保 `name` 至少有 3 个字符。
- `.int()`： 确保 `age` 为整数。
- `.positive("Message")`： 确保 `age` 为正数。
- `.email("Message")`： 确保 `email` 格式有效。
- `.min(8, "Message")`： 确保 `password` 长度至少为 8 个字符。

要测试这些限制条件，请修改 `index.ts` 文件以包含无效数据：

:::code-group

```ts[index.ts]{3-8,10}
import UserSchema from './validation';

const invalidUserData = {
  name: 'Al', // Too short
  age: -5, // Negative age
  email: 'not-an-email', // Invalid email format
  password: '123', // Too short
};

const result = UserSchema.safeParse(invalidUserData);

if (result.success) {
  console.log('Valid user data:', result.data);
} else {
  console.error('Validation errors:', result.error.format());
}

```

:::

输入无效数据后，运行脚本：

```bash
$ npm run dev
```

你将看到类似下面的输出：

```text
Validation errors: {
  _errors: [],
  name: { _errors: [ 'Name must be at least 3 characters long' ] },
  age: { _errors: [ 'Age must be a positive integer' ] },
  email: { _errors: [ 'Invalid email format' ] },
  password: { _errors: [ 'Password must be at least 8 characters long' ] }
}
```

输出结果是一个来自 Zod 的结构化错误对象，其中根级别的 `_errors` 为空，因为没有全局错误。

每个无效字段（`name`，`age`，`email`，`password`）都有自己的 `_errors` 数组，其中包含特定的验证信息。

通过这种格式，可以很容易地确定哪些字段验证失败及其原因。

输出结果会清楚地指出哪些字段验证失败，并提供有用的错误信息。

### 细化值

Zod 允许通过 `.refine()` 进行进一步验证，从而实现自定义验证逻辑。

在 `validation.ts` 文件中，增强 `UserSchema` 中的密码验证：

:::code-group

```ts[validation.ts]{4-8}
const UserSchema = z.object({
  ...
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .refine(password => /\d/.test(password), {
      message: "Password must contain at least one number"
    }),
});
```

:::

这就增加了一项要求，即在使用无效数据进行测试时，密码必须至少包含一个数字。

接下来，更新密码，使其只包含字母：

:::code-group

```ts[index.ts]{5}
const invalidUserData = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  password: 'password', // Missing a number
};
```

:::

当你运行程序时，验证将以如下方式失败：

```text
Validation errors: {
  ...
  password: { _errors: [ 'Password must contain at least one number' ] }
}
```



### 串连多个验证

你还可以将多个验证串连起来。这样，你就可以将多个限制条件按顺序组合起来，创建更复杂的验证规则。每个验证都将按顺序进行检查，所有验证都必须通过，数据才能被视为有效。

首先，更新 `validation.ts` 中的 `name` 字段如下：

:::code-group

```ts[validation.ts]{2-5}
const UserSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  age: z.number().int().positive("Age must be a positive integer"),
  ...
});
```

:::

现在，`name` 字段必须符合多项要求。长度必须在 3 到 50 个字符之间，确保名称既不会太短，也不会过长。

此外，它只能包含字母和空格，不能使用数字、特殊字符或符号。

接下来，更新 `invalidUserData` 对象，使其包含带有数字的名称：

:::code-group

```ts[index.ts]{3}
...
const invalidUserData = {
  name: "Alex123", // Too short
  age: -5, // Negative age
  email: "not-an-email", // Invalid email format
  password: "password", // Missing a number
};
...
```

:::

运行主文件：

```bash
$ npm run dev
```

```text
Validation errors: {
  _errors: [],
  name: { _errors: [ 'Name can only contain letters and spaces' ] },
  ...
}
```

如你所见，验证错误信息现在显示名称字段包含无效字符。



## 优雅处理 Zod 错误

Zod 提供了一种处理验证错误的结构化方法，可轻松向用户显示有意义的错误信息，并有效地调试问题。本节将重点讨论如何有效地管理和显示错误。

你已经在前面的章节中见过 `safeParse()`。它不会抛出错误，而是返回一个包含有效数据或验证错误的对象：

```text
{
  "name": { "_errors": ["Name can only contain letters and spaces"] },
  ...
}
```

另一种方法是 `parse()`，如果验证失败，它会抛出一个错误。请修改代码，改用 `parse()`：

:::code-group

```ts[index.ts]{2,10-20}
import UserSchema from "./validation";
import { z } from "zod";

const invalidUserData = {
  name: "Alex123", // Too short
  age: -5, // Negative age
  email: "not-an-email", // Invalid email format
  password: "password", // Missing a number
};

try {
  const validUser = UserSchema.parse(invalidUserData);
  console.log("Valid user:", validUser);
} catch (error) {
  if (error instanceof z.ZodError) {
    // 原文是 `error.errors`，这里改成 `error.issues`
    console.log("Validation errors:", error.issues);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

:::

如果数据符合所有验证规则，则解析成功，并记录有效的用户对象。但是，如果数据未能通过验证，就会抛出  `ZodError`。

然后，`catch` 块会检查错误类型——如果是 `ZodError`，就会记录特定的验证错误。如果错误类型不同，则将其视为意外错误并记录在案。

现在运行这段代码，你会看到：

```text
Validation errors: [
  {
    origin: 'string',
    code: 'invalid_format',
    format: 'regex',
    pattern: '/^[a-zA-Z\\s]+$/',
    path: [ 'name' ],
    message: 'Name can only contain letters and spaces'
  },
  {
    origin: 'number',
    code: 'too_small',
    minimum: 0,
    inclusive: false,
    path: [ 'age' ],
    message: 'Age must be a positive integer'    
  },
  {
    origin: 'string',
    code: 'invalid_format',
    format: 'email',
    pattern: "/^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$/",      
    path: [ 'email' ],
    message: 'Invalid email format'
  },
  {
    code: 'custom',
    path: [ 'password' ],
    message: 'Password must contain at least one number'
  }
]
```

`error.issues` 数组包含详细的验证问题，每个问题都有：

- `code`：错误类型（如：`too_small`、`invalid_string`）
- `message`：错误信息
- `path`：发生错误的字段
- 附加的特定上下文属性，如长度验证的 `minmum`



## 映射验证错误

在上一节中，你看到了 Zod 的原始错误格式，这种格式在处理验证错误时可能既冗长又复杂。原始格式包括一个错误对象数组，其中包含错误代码、消息、路径和其他特定于验证的属性。

虽然这种详细格式有助于调试，但通常过于复杂，无法显示给用户或在应用程序逻辑中处理。

让我们创建一个辅助函数，将这些详细的错误对象映射为简单的字段消息结构：

:::code-group

```ts[index.ts]{2-8,14-15}
...
function formatZodErrors(error: z.ZodError) {
  // 原文是 `error.issues`，这里改成 `error.issues`
  return error.issues.reduce((acc, err) => {
    const field = err.path.join(".");
    acc[field] = err.message;
    return acc;
  }, {} as Record<string, string>);
}
try {
  const validUser = UserSchema.parse(invalidUserData);
  console.log("Valid user:", validUser);
} catch (error) {
  if (error instanceof z.ZodError) {
    const formattedErrors = formatZodErrors(error);
    console.log("Formatted validation errors:", formattedErrors);
  }
}
```

:::

`formatZodErrors` 函数使用 `reduce` 转换错误数组。对于每个错误，它会使用 `join(".")` 从错误的路径数组中提取字段名称，从而在字段名称和相应的错误信息之间创建一个简单的映射。

运行文件时，你将看到格式更简洁的错误信息：

```text
Formatted validation errors: {
  name: 'Name can only contain letters and spaces',
  age: 'Age must be a positive integer',
  email: 'Invalid email format',
  password: 'Password must contain at least one number'
}
```

这种映射格式有助于：

- 在表单中显示错误
- 发送清晰的 API 验证响应
- 快速检索特定字段的错误
- 高效处理嵌套对象验证

字段到消息映射的简洁性使其比原始错误格式更易于操作，同时保留了所有重要信息，便于用户反馈。



## 类型推断与 TypeScript 集成

在本节中，你将了解 Zod 如何与 TypeScript 集成，从模式中提供自动类型推断。这可以确保你的验证规则和 TypeScript 类型保持同步，从而无需单独的类型定义。

通常在 TypeScript 项目中，你需要维护单独的类型定义和验证逻辑：

```ts
interface User {
  name: string;
  age: number;
  email: string;
}

function validateUser(data: User) {
  ...
}

```

使用 Zod 的 TypeScript 时，你无需手动定义接口或类型。相反，Zod 可以从你的模式定义中自动推断出正确的 TypeScript 类型。

让我们从这个基本模式开始：

:::code-group

```ts[validation.ts]
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  age: z.number().positive("Age must be positive"),
  email: z.string().email("Invalid email format"),
});

type User = z.infer<typeof UserSchema>;

export { UserSchema, type User };
```

:::

`z.infer` 工具从我们的 Zod 模式中提取 TypeScript 类型。Typescript 推断为：

```ts
// TypeScript infers this type:
type User = {
    name: string;
    age: number;
    email: string;
}
```

TypeScript 只捕捉基本类型，而 Zod 则维护完整的验证规则，例如最小长度和电子邮件格式。

现在，更新你的代码，使用推断出的 `User` 类型和 Zod 的验证：

:::code-group

```ts[index.ts]
import { UserSchema, type User } from "./validation";

// TypeScript knows exactly what fields are required
const userData: User = {
  name: "Alice",
  age: 25,
  email: "alice@example.com"
};

const result = UserSchema.safeParse(userData);
if (result.success) {
  console.log("Valid user:", result.data);
} else {
  console.error("Validation errors:", result.error.format());
}
```

:::

由于 TypeScript 已经执行了正确的类型，这就确保了运行时的任何错误都来自 Zod 的附加验证规则。运行脚本时：

```text
Valid user: { name: 'Alice', age: 25, email: 'alice@example.com' }
```

你还可以扩展现有模式以包含可选字段，同时确保 TypeScript 在类型定义中正确地将它们推断为可选字段。

创建一个基于 `UserSchema` 的新文件 `extended.ts`：

:::code-group

```ts
import { z } from "zod";
import { UserSchema } from "./validation";

const ExtendedSchema = UserSchema.extend({
  phoneNumber: z.string().optional()
});

type ExtendedUser = z.infer<typeof ExtendedSchema>;
// TypeScript infers this as:
// type ExtendedUser = {
//   name: string;
//   age: number;
//   email: string;
//   phoneNumber?: string | undefined;
// }

const userData: ExtendedUser = {
  name: "Alice",
  age: 25,
  email: "alice@example.com"
  // phoneNumber can be omitted since it's optional
};

console.log("Valid:", ExtendedSchema.safeParse(userData).success);
```

:::

这段代码在现有 `UserSchema` 的基础上增加了一个可选的 `phoneNumber` 字段。使用 `UserSchema.extend()`，在保留原有结构的同时扩展了模式。TypeScript 会自动推导更新后的类型，将 `phoneNumber` 识别为可选类型。

运行 `ExtendedSchema.safeParse(userData)` 时，Zod 会验证数据，而 TypeScript 会在编译时确保类型安全。如果省略了 `phoneNumber`，验证仍会通过，这说明了 Zod 是如何在保持 TypeScript 类型同步的同时，实现灵活而严格的数据验证的。

运行脚本：

```bash
$ npx tsx extended.ts
```

```text
Valid: true
```

如你所见，TypeScript 的编译时检查和 Zod 的运行时验证相结合，可确保你的数据始终有效且类型正确。



## 集成 Zod 与 web 框架

Zod 可以验证 Express 请求的不同部分，确保数据在到达路由处理程序之前的完整性。HTTP 请求的每个部分都可以根据其具体要求进行不同的验证。

### 验证请求体

请求体通常包含最复杂的数据结构，需要彻底验证。当客户端发送 POST 或 PUT 请求时，你需要确保数据符合预期格式：

```ts
const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email()
});

app.post("/users", (req, res) => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.format() });
  }
  // result.data is now typed and validated
});
```

这将验证所有必填字段是否存在，格式是否正确。如果验证失败，客户会收到结构化的错误信息，解释到底哪里出了问题。

### 验证查询参数
查询参数具有独特的挑战性，因为它们总是以字符串形式出现，而且经常需要进行类型转换。它们还经常是带有默认值的可选参数：

```ts
const QuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number),
  sort: z.enum(["asc", "desc"]).default("asc")
});

app.get("/users", (req, res) => {
  const result = QuerySchema.safeParse(req.query);
  // Converts page to number and ensures sort is valid
});
```

`transform` 方法在此非常有用，因为它会自动将字符串值转换为适当的类型，同时保持类型安全。

### 验证路由参数
路由参数通常需要严格验证，因为它们标识了特定的资源。应及早发现无效参数，以避免不必要的数据库查询：

```ts
const ParamsSchema = z.object({
  userId: z.string().uuid()
});

app.get("/users/:userId", (req, res) => {
  const result = ParamsSchema.safeParse(req.params);
  // Only proceeds if userId is a valid UUID
});
```

这可确保不合理 ID 的请求快速失败，从而保护你的数据库查询免受无效输入的影响。

### 验证 API 响应
响应验证可确保你以正确的格式发送数据，从而帮助捕捉自己代码中的错误：

```ts
const ResponseSchema = z.object({
  id: z.string(),
  data: z.array(z.string())
});

const response = ResponseSchema.parse(data);
res.json(response); // Guaranteed to match schema
```

当你的应用程序接口合同需要一致性时，例如向多个客户端应用程序提供数据时，这一点尤为重要。

使用 Zod 的错误格式化，你可以在验证失败时提供清晰、可操作的反馈，帮助 API 消费者快速识别并修复请求中的问题。



## 总结

本文探讨了 Zod，这是一个 TypeScript 优先验证库，通过声明式模式定义、错误处理和 TypeScript 集成简化了数据验证。

有了这些知识，你现在应该能够自信地在你的项目中使用 Zod 来确保数据完整性并简化验证工作流了。







