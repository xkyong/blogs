# 唠唠 TypeScript 类型编程中的泛型用法与案例实践

## （一）前言

泛型（Generics）作为 TypeScript 中的一项核心特性，允许开发者编写出更加灵活、可重用的代码。泛型不仅能够提升类型安全性，还能在不牺牲性能的前提下，实现代码的复用。

下边结合自己看过和实际项目中类型编程实践后的体验，总结汇总下 TypeScript 类型编程中泛型（Generics）的一些实用技巧和案例实践。

本篇是继 [唠唠 TypeScript 分布式条件类型与 infer 及应用](https://xkyong.github.io/2023/ts-distributive-conditional-type-and-infer.html) 之后的第2篇关于 TypeScript 内容的文章，更多也是对自己阶段学习成果的整理输出，也希望文中提到的一些内容或思路能够给大家些借鉴。



## （二）泛型用法介绍

### 1. 泛型引入

你可能要问，泛型有没有严格的定义，当然有，详细可以看看这里：[Generic programming](https://en.wikipedia.org/wiki/Generic_programming)。

而简单地说，泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

下边结合🌰来理解下。

假设现在有一个函数 `echo`，作用是参数传入的是什么值，返回的就是什么值，对应于类型层面上，参数是什么类型，返回值就是什么类型，此时这个函数可能如下写：

```typescript twoslash
function echo(arg: number): number {
  return arg
}

echo(123)
// echo('123') error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

但如上函数只能接收 `number` 类型的参数，其他类型参数传入会出现类型报错，因此该函数可能会被改写为：

```typescript twoslash
function echo(arg: any): any {
  return arg
}

echo(123)
echo('123')
```

此时，因为 `any` 类型是通用的，因此函数能接受 `arg` 类型的任何和所有类型，类型上不会报错了。但实际上，当函数返回时，将丢失有关该类型的信息，参数与返回值之间的类型关系反映不出来了，即不管传入的是什么类型的值，返回值的类型都是 `any`。

为了完美地实现该 `echo` 函数，可以使用泛型，落实到编码上就是增加**泛型参数**（或者叫**类型参数**）：

```typescript twoslash
function echo<T>(arg: T): T {
  return arg
}

echo<number>(123)
echo<string>('123')
echo<boolean>(true)
```

如上，给 `echo` 函数增加了泛型参数 `T`，然后在调用 `echo` 函数时传入具体的参数类型，这样改写之后，函数的参数跟返回值的类型就保持一致了。

不过，对于在函数中使用泛型的这种场景，为了方便，函数调用时，往往省略不写泛型参数的值，让 TypeScript 自己推断：

```typescript twoslash
function echo<T>(arg: T): T {
  return arg
}

echo(123)
echo('123')
echo(true)
```

不过此时你会发现，当不传入参数类型时，`echo` 函数上的类型信息会被推断到尽可能精确的程度，如这里会推导到字面量类型而不是基础类型，比如上述🌰推断出来的泛型参数 `T` 分别是 `123`、`"123"` 和 `true`。

泛型参数的命名，可以随便取，但是必须为合法的标识符。编码习惯上，泛型参数的第1个字符往往采用大写字母。一般会使用`T`（type 的第一个字母）作为泛型参数的名字。如果有多个泛型参数，则还习惯使用的有 `U`、`V`、`P`、`K` 等字母命名，各个参数之间使用英文逗号 `,` 分隔。

这里仅做下泛型的简单引入，关于在函数上使用泛型的更多用法，以及如何在接口或类上使用泛型，阮一峰大神的 TypeScript 教程写得很好了，详细可见：[阮一峰 TypeScript 教程-TypeScript 泛型](https://wangdoc.com/typescript/generics#%E6%B3%9B%E5%9E%8B%E7%9A%84%E5%86%99%E6%B3%95)。

下边侧重唠唠类型别名中的泛型用法，这在 TypeScript 的类型编程中十分常见。

### 2. 类型别名中的泛型用法

首先来个简单🌰：

```typescript twoslash
type UnionType<T> = T | number | string

type Res1 = UnionType<123>
type Res2 = UnionType<boolean>
```

上面这个类型别名 `UnionType` 的本质上可看成是一个函数，`T` 就是它的变量，返回值则是一个包含 `T` 的联合类型，伪代码形式可以为：

```typescript
function UnionType(typeArg) {
  return [typeArg, number, string]
}
```

类型别名中的泛型，绝大多数时候是用来进行工具类型封装的，比如如下几个 TypeScript 内置的工具类型：

```typescript
type Required<T> = { [P in keyof T]-?: T[P]; }

type Readonly<T> = { readonly [P in keyof T]: T[P]; }

type Pick<T, K extends keyof T> = { [P in K]: T[P]; }
```

对应的🌰如下：

```typescript twoslash
type UserName = {
  name: string
  age: number
  male: boolean
  hobbies?: string[]
}

type RequiredUserName = Required<UserName>
type ReadonlyUserName = Readonly<UserName>
type UserName1 = Pick<UserName, 'name' | 'age'>
```

除此之外，在条件类型中使用泛型的场景也是非常多的：

```typescript twoslash
type FuncType = (...args: any[]) => any

type FuncReturnString<T extends FuncType> = T extends (...args: any[]) => string ? true : false

type Res1 = FuncReturnString<(name: string) => string> // true
type Res2 = FuncReturnString<(name: string) => boolean> // false
type Res3 = FuncReturnString<() => number> // false
```

如上例子，可以通过 `T extends (...args: any[]) => string ? true : false` 条件类型判断一个函数的返回值类型是否是 `string`，这里用到了泛型参数 `T`。

如上的🌰中用到了 `T extends U` 这种形式的泛型参数，即可以使用 `extends` 关键字**约束**泛型参数的类型，当传入的参数类型不符合约束条件时，TypeScript 编译时就会出现类型报错：

```typescript twoslash
type FuncType = (...args: any[]) => any

type FuncReturnString<T extends FuncType> = T extends (...args: any[]) => string ? true : false

type Res1 = FuncReturnString<(name: string) => string> // true

type IsFunc = 234 extends FuncType ? true : false
// type Res2 = FuncReturnString<234> error: Type 'number' does not satisfy the constraint 'FuncType'.
```

对于上述示例，因为 `IsFunc` 的类型结果为 `false`，不满足 `extends FuncType` 的类型约束条件，因此 `FuncReturnString` 会出现类型报错。

再来看个🌰：

```typescript twoslash
type UserName = {
  name: string
  age: number
  male: boolean
  hobbies?: string[]
}

type UserName1 = Pick<UserName, 'name' | 'age'>

type KeyofUserName = keyof UserName & {}
type IsKeyofObj = 'name' | 'gender' extends KeyofUserName ? true : false
// type UserName2 = Pick<UserName, 'name' | 'gender'> error: Type '"name" | "gende"' does not satisfy the constraint 'keyof UserName'.
```

对于上述示例，因为 `IsKeyofObj` 的类型结果为 `false`，不满足 `extends keyof T` （这里的 `keyof T` 即为上边的 `KeyofUserName`）的类型约束条件，因此 `Pick` 会出现类型报错。

唠完了泛型的类型约束，接下来看看泛型的**类型参数默认值**。

我们对 TypeScript 内置的 `Pick` 工具类型改造一下，如果我们使用 `Pick` 时不传入第2个泛型参数，则默认把所有的 `K` 提取出来，此时写法如下：

```typescript twoslash
type Pick2<T, K extends keyof T = keyof T> = { 
  [P in K]: T[P]; 
}

type UserName = {
  name: string
  age: number
  male: boolean
  hobbies?: string[]
}

type UserName1 = Pick2<UserName, 'name' | 'age'>
type UserName2 = Pick2<UserName>
```

如上，我们在 `Pick2` 的第2个泛型参数加入了 `=`，给参数设置了默认值 `keyof T`，如此设置，当第2个参数类型不传入时，`K` 参数默认使用 `keyof T` 类型。

再来看个🌰：

```typescript twoslash
type Hello<Str extends string = 'World'> = `Hello ${Str}`

type HelloTs = Hello<'TypeScript'>
type HelloWorld = Hello
```

当传入 `"TypeScript"` 时，结果为 `"Hello TypeScript"`，否则 `Str` 泛型参数默认使用类型 `"World"`，结果为 `"Hello World"`。

关于类型参数默认值，需要遵循一些规则，详细可见：[泛型参数默认值规则](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-parameter-defaults)。



## （三）类型编程案例实践

好了，泛型的用法，尤其是类型别名中的泛型用法介绍完了，接下来，结合实际项目或 [type-challenges](https://github.com/type-challenges/type-challenges) 上的类型编程实践，汇总罗列些实用的工具类型案例。

类型编程中，基本上，泛型是少不了，而且常常会与一些高阶的工具类型（比如联合类型、交叉类型、索引类型、映射类型和条件类型等）结合一起使用。

### 1. 泛型与联合/交叉类型的结合

泛型与联合/交叉类型的结合，绝大多数使用场景是做类型的合并。

来看一些案例：

```typescript twoslash
interface PersonItem {
  name: string
  age: number
  male: boolean
  hobbies?: string[]
}

type Combine<T> = PersonItem & T

type TeacherItem = Combine<{ 
  level: number
  course: string
}>

type StudentItem = Combine<{ 
  class: number
  grade: number
}>

type Flatten<T> = { 
	[K in keyof T]: T[K]
}

type TeacherItemDisplay = Flatten<TeacherItem>
type StudentItemDisplay = Flatten<StudentItem>
```

如上，我们通过使用 `Combine` 工具类型（配合泛型 `T` 和交叉类型），对 `PersonItem` 的类型做了扩充，创建出了 `TeacherItem` 和 `StudentItem` 类型。而为了能够看到这2个类型的具体字段，这里还使用了 `Flatten` ，扁平化传入的类型。

```typescript
type MaybeRef<T> = T | Ref<T>
type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T)
type ReadonlyRefOrGetter<T> = ComputedRef<T> | (() => T)
```

如上这 3 个是 [VueUse](https://vueuse.org/) 内部使用最多的工具类型（配合泛型 `T` 和联合类型），为了使 composable 函数能够兼容更多的参数输入情况，即考虑输入的是原始值，或 `ref` 函数或 `computed` 函数处理过后的值，可以根据使用场景，利用这 3 个给对应参数做类型声明。

除此之外，还有几个实用的工具类型封装：

```typescript
// 表示该类型的值不能为空
type NonNullable<T> = T extends null | undefined ? never : T

// 表示该类型的值可以为空
type Nullable<T> = T | null

// 类型可能为数组类型
type MaybeArray<T> = T | T[]

// 并集
type Concurrence<A, B> = A | B
```

### 2. 泛型与索引/映射类型的结合

泛型与索引/映射类型的结合，在类型编程中，还算是比较多的。

```typescript
type Required<T> = { [P in keyof T]-?: T[P]; }

type Readonly<T> = { readonly [P in keyof T]: T[P]; }

type Pick<T, K extends keyof T> = { [P in K]: T[P]; }
```

如上这几个是 TypeScript 内置的工具类型，无一例外的都使用了泛型配合索引/映射类型来实现，使用示例如下：

```typescript twoslash
type UserName = {
  name: string
  age: number
  male: boolean
  hobbies?: string[]
}

type RequiredUserName = Required<UserName>
type ReadonlyUserName = Readonly<UserName>
type UserName1 = Pick<UserName, 'name' | 'age'>
```

然后来看几个实用的工具类型封装：

```typescript twoslash
type AddProperty<T, K extends string, V> = T & { 
  [P in K]: V 
}

interface Product {
  id: number
  name: string
  price: number
}

type ProductWithDiscount = AddProperty<Product, 'discount', number>

const product: ProductWithDiscount = {
  id: 1,
  name: 'Laptop',
  price: 999,
  discount: 0.1
}
```

如上的 `AddProperty` 工具类型允许将一个新属性添加到现有的类型中，而不影响其他属性。

```typescript twoslash
type MapProps<T, U> = {
  [K in keyof T]: U
}

interface Person {
  name: string
  age: number
}

type PersonWithBoolean = MapProps<Person, boolean>

const personWithBoolean: PersonWithBoolean = {
  name: false,
  age: true
}
```

如上的 `MapProps` 工具类型会创建一个类型，将原始类型的每个属性映射到一个新的类型。

### 3. 泛型与条件类型的结合

泛型与条件类型的使用，使用频率是最高的，案例也是最多的。

```typescript twoslash
type IsNever<T> = [T] extends [never] ? true : false
type Res3 = IsNever<never> // true
type Res4 = IsNever<any> // false
type Res5 = IsNever<boolean> // false

type IsAny<T> = 1 extends T & 2 ? true : false
type Res6 = IsAny<any> // true
type Res7 = IsAny<never> // false
type Res8 = IsAny<boolean> // false

type IsUnknown<T> = unknown extends T
? IsAny<T> extends true
  ? false
  : true
: false
type Res9 = IsUnknown<unknown> // true
type Res10 = IsUnknown<any> // false
type Res11 = IsUnknown<number> // false
```

上述利用泛型跟条件类型的结合，封装了3个分别用来判断 `never`、`any` 和 `unknown` 类型的工具类型，而关于这3个工具类型的分析，可以看看我的另外1篇文章：[唠唠 TypeScript 分布式条件类型与 infer 及应用-分布式条件类型](http://localhost:5173/2023/ts-distributive-conditional-type-and-infer.html#_2-%E5%88%86%E5%B8%83%E5%BC%8F%E6%9D%A1%E4%BB%B6%E7%B1%BB%E5%9E%8B)。

```typescript twoslash
// 交集
type Intersection<A, B> = A extends B ? A : never
// 差集
type Difference<A, B> = A extends B ? never : A
// 补集
type Complement<A, B extends A> = Difference<A, B>


type A = 1 | 2 | 3 | 4
type B = 1 | 2 | 4

type IntersectionRes = Intersection<A, B> // 1 | 2 | 4
type DifferenceRes = Difference<A, B> // 3
type ComplementRes = Complement<A, B> // 3
```

由于条件类型分布式特性的存在，如上的 `Intersection<A, B>` 交集类型操作其实可以看成：

```typescript twoslash
type IntersectionRes = 
| (1 extends 1 | 2 | 4 ? 1 : never)
| (2 extends 1 | 2 | 4 ? 2 : never)
| (3 extends 1 | 2 | 4 ? 3 : never)
| (4 extends 1 | 2 | 4 ? 4 : never)
```

类似地，`Difference<A, B>` 差集类型操作可以看成：

```typescript twoslash
type DifferenceRes = 
| (1 extends 1 | 2 | 4 ? never : 1)
| (2 extends 1 | 2 | 4 ? never : 2)
| (3 extends 1 | 2 | 4 ? never : 3)
| (4 extends 1 | 2 | 4 ? never : 4)
```

剩下的 `Complement<A, B>` 补集类型操作只是在 `Difference<A, B>` 的基础上，对传入的泛型参数做了类型约束而已。

最后，再来罗列几个 TypeScript 内置工具类型的实现：

```ts
type FunctionType = (...args: any) => any
type ClassType = abstract new (...args: any) => any

type Parameters<T extends FunctionType> = T extends (...args: infer P) => any ? P : never

type ReturnType<T extends FunctionType> = T extends (...args: any) => infer R ? R : never

type ConstructorParameters<T extends ClassType> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never

type InstanceType<T extends ClassType> = T extends abstract new (
  ...args: any
) => infer R
  ? R
  : any
```

如上代码配合使用了泛型、条件类型和 `infer` 关键字，来完成类型的封装。关于 `infer` 关键字的介绍，可以看看我的另外1篇文章：[唠唠 TypeScript 分布式条件类型与 infer 及应用-infer 介绍](http://localhost:5173/2023/ts-distributive-conditional-type-and-infer.html#_1-infer%E4%BB%8B%E7%BB%8D)。

如上几个内置工具类型对应的使用示例如下：

```typescript twoslash
function combine(a: string, b: number) {
  return a + b
}

type FuncParams = Parameters<typeof combine> // [a: string, b: number]
type FuncReturnType = ReturnType<typeof combine> // string

class Person {
  constructor(name: string, age: number, male: boolean) {}
}

type PersonConstructorParams = ConstructorParameters<typeof Person> // [name: string, age: number, male: boolean]
type PersonInstance = InstanceType<typeof Person> // Person
```

案例会持续更新！



## （四）总结

本文结合一些示例介绍了泛型用法，尤其侧重介绍了类型别名中泛型的用法，然后结合自己的类型编程实践给出了一些实用的工具类型实现，希望对大家有点帮助！

最后，想给大家推荐2个 Github 仓库，罗列如下：

- [type-challenges](https://github.com/type-challenges/type-challenges)：[antfu](https://github.com/antfu) 大佬搞的 TypeScript 类型编程练习仓库；
- [type-fest](https://github.com/sindresorhus/type-fest)：[sindresorhus](https://github.com/sindresorhus) 大佬的搞的 TypeScript 实用工具类型库。

以上，欢迎各位大佬勘误～

Happy Coding!



## （五）参考资料

- [TypeScript Handbook-Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

- [TypeScript 入门教程-泛型](https://ts.xcatliu.com/advanced/generics.html)

- [TypeScript 教程-TypeScript 泛型](https://wangdoc.com/typescript/generics)

