# 【翻译】TypeScript：停止使用 any 类型，一种特定场景下使用的类型

> 原文地址：https://thoughtbot.com/blog/typescript-stop-using-any-there-s-a-type-for-that

当我们处理任何（😬）数量规模的 TypeScript 代码时，都有可能遇到 `any` 关键字。我们看到的大多数用法都表明，我们正在处理 TypeScript 中的基础类型。Ruby 的 `Object` 与 C# 相同，在 [文档](https://www.typescriptlang.org/docs/handbook/basic-types.html#any) 中我们可以找到：

> 如果代码中的值是在没有使用 TypeScript 或第三方库的情况下编写的，则可能会出现这种情况。在这种情况下，我们可能希望退出类型检查。为此，我们在这些值上标注 `any` 类型：

## `any` 类型是什么

因此，`any` 不是 `通配符`，也不是基本类型。它明确用于与第三方库交互。那么，为什么它经常出现呢？它对我们的系统有害吗？我们是应该逃避它还是拥抱它？

> `any` 类型是处理现有 JavaScript 的一种强大手段，可以让你在编译过程中逐步选择**加入**或**退出**类型检查。

让我们沉浸其中。TypeScript 文档清楚地表明，当我们使用 `any` 类型时，我们是在告诉编译器：

当 500 多名语言（TypeScript）贡献者提供帮助时，我们却说 "不，谢谢"。听起来，选择退出类型检查器，并因此失去对我们类型系统的所有安全性和信心，不应是一个轻率的决定。我们应该在与非类型化的第三方（或第一方）Javascript 代码交互时，或者在我们只知道部分类型的情况下使用它。

## 等等，我有许多其他原因

### TypeScript 不是可以转译为 Javascript 吗？Javascript 不是动态的吗？那我为什么要关心我的类型呢？

是的！但我们是用 TypeScript 编写代码的，它是一种静态类型语言。可以说，静态类型语言并不会比动态语言产生 [更少的 bug](https://martinfowler.com/bliki/DynamicTyping.html)。不过，在静态类型语言中，我们使用的是类似 `any` 的东西，这是两个世界中最糟糕的情况。

### 有些东西很难正确标注类型，而 `any` 却可以很容易

我们很容易放纵懒惰的开发者。如果我们不能正确地标注类型，我们就会写出 bug，比用动态语言写出的 bug 更多，因为我们迫使 TypeScript 这种静态类型的语言不去检查不正确的类型。

### 我真的不知道它是什么

没关系！我们可以使用 `unknown`，它允许我们分配任何类型的值。但在确定具体类型之前，我们不能对数值进行操作。

```ts
type ParsedType = {
  id: number
}

const parseApiResponse(
  response: Record<string, unknown>
): ParsedType => {
  const convertedResponse = (response as ParsedType)

  // without doing the type cast we would
  // get a type error here
  if(convertedResponse.id >= 0) {
    return convertedResponse
  } else {
    throw Error.new("Invalid response")
  }
}
```

### 添加类型时，我必须编写大量代码，而 `any` 类型却能减少工作量

可能不是这样；如果我们编写的代码没有类型，我们很可能会添加防御代码，以确保参数和变量具有正确的形状，从而使程序按预期执行。`any` 甚至不能保护我们的逻辑不受 `null` 或 `undefined` 检查的影响。

```typescript
// version 1 with `any`
const fullName = (user: any) => {
  if (user?.firstName && user?.lastName) {
    return `${user.lastName}, ${user.firstName}`
  }

  return user?.firstName || ""
}

// version 2 without `any`

interface User {
  firstName: string
  lastName?: string
}

const fullName = ({ firstName, lastName }: User) => {
  if (lastName === undefined) {
    return firstName
  }

  return `${lastName}, ${firstName}`;
}
```

### 类型增加了很多复杂性， 而有时 `any` 类型会更简单

使用 `any` 数据流可能会让我们取得进展，而无需过多考虑数据如何流入我们的逻辑。但是，这却将这一负担转移给了我们代码的未来读者。他们将不得不在没有我们的上下文和编译器帮助的情况下理解正在发生的事情。

### 有了文档，我可以提供所有的上下文信息

当我们添加类型时，我们会得到编译器的帮助，我们会得到不会随时间而衰减的“文档”，因为如果文档过时，我们的代码将无法编译。

```ts 
const intersection = (a: any, b: any): any => {
...
}
const intersection = (
  a: Set<number>, b: Set<number>
): Set<number> => {
...
}
```

上述两个函数是等价的，但读者会更清楚最后一个函数的作用，而不是第一个函数。

### 但我在编写代码时采取了防御方式，并进行了必要的运行时检查，以确保不会出错

现在可能不会出错，但除非你有出色的测试覆盖率，否则以后有人来修改代码时，就无法确信他们没有重构出错误。这几乎就像是编译器不会帮助你，因为我们说过它不会帮助你。如果我们明确设置了类型并更改了系统中消耗的 `API`，编译器就会提供 [指导](https://thoughtbot.com/blog/going-through-changes-with-typescript)。

### 如果我后来改变了对类型的看法怎么办？如果全部标注明确，我就得花几个小时重构

我们可以随时修改并容纳新的类型定义。为此，TypeScript 提供了一系列实用 [工具](https://www.typescriptlang.org/docs/handbook/utility-types.html)。我们可以使用 `Pick` 去从先前定义的类型中选取我们需要的属性。`Omit` 可以获得除少量属性之外的所有属性。`Partial` 可以让所有属性都是可选的，或者来个 180 度大转弯，让所有属性都是 `Required`。

```ts
type User = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

type UserParams =
  Pick<User, "id"> & Partial<Omit<User, "id">>

const updateUser = (
  { id, ...newUserParams }: UserParams
) => {
  {...}
}
```

### 好吧，从 TypeScript 中删除 `any`，现在就提交 PR

让我们深吸一口气，在适当的情况下，`any` 是非常强大和有用的。

- 与使用它的库进行交互，确保我们在通过系统移动数据之前，尽快将其转化为正确的类型。

- 绕过 TypeScript 的类型错误。如果我们发现自己处于无法标注类型的情况，那么 `any` 可能是必要的。但只有在尝试了所有其他方法后，我们才会采用这种方法。如果我们使用了它，就应该尽快将其变回可预测的类型。

- 如果我们的函数真的可以处理任何类型，这也是很少见的情况（比如调试或日志记录函数？）。在这种情况下，我们需要 100% 确定没有任何类型会导致函数失败。我们应该检查函数的主体，从输入中确定最基本的形状并加以限制。例如，如果我们想打印某些内容，我们至少应该验证参数是否响应 `toString` 。这是小步骤。



## 做个总结

为什么我们不应该再使用 `any`？

- 这会导致编译器不生效：
  - 我们在告诉编译器 "不需要帮助"。
- 我们放弃了在编写代码时记录代码的机会。
- 我们的第一道防线崩溃了。
- 在动态语言中，我们假设事物可以有任何类型，我们使用的模式也遵循这一假设。如果我们开始将静态类型语言当作动态语言使用，那么我们就在与这种模式作斗争。
- 当我们继续修改代码时，没有任何东西可以指导/帮助我们。
- 过大的自由会带来过大的责任（编译器）。不要变成编译器，而要使用编译器。


