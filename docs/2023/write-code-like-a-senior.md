# 【翻译】像高手一样编写代码：编写代码的 5 个必知技巧

> 原文地址：https://www.mensurdurakovic.com/write-code-like-a-senior-five-must-know-tips-for-crafting-code/

在本文中，我们将讨论 5 个简单的技巧，您可以从此刻开始使用它们来提高代码质量。

无论您使用哪种编程语言，也无论您有多少年的编程经验，您都可以在日常工作中使用这些技巧。

那么，让我们开始吧。

## 嵌套和提前返回

毫无疑问，每个人都会在自己的项目中遇到一些大量的嵌套代码。

嵌套代码是指一个代码块包含另一个代码块的代码结构。这通常会导致多级缩进。虽然嵌套代码并非坏事，但过度嵌套会导致一些问题。这些问题会增加代码的维护和调试难度。

嵌套之所以会产生问题，是因为：

- 复杂性和可读性：嵌套代码很难阅读
- 维护：作为第一点的副作用，嵌套代码更难维护
- 调试：嵌套代码更难调试
- 范围问题：变量经常重叠，并导致作用域问题
- 测试：为大量的嵌套代码编写测试比较困难

请看这段代码片段：

```js
if (user && user.isAuthenticated) {
  // ...20 lines of code
    
  if (timezone) {
    // ...10 lines of code
      
    if (isQualified) {
      // ...50 lines of code
    }
  }
}
```

应该怎么优化呢？

```js
const userAuthenticated = user && user.isAuthenticated;
if (!userAuthenticated) {
  return;
}

// ...20 lines of code
const timezone = ...
if (!timezone) {
  return;
}

// ...10 lines of code
const isQualified = ...
if (!isQualified) {
    return;
}

// ...50 lines of code
```

你看这样多好。没有缩进，一切都更容易阅读。

与嵌套有关的另一个概念是提前返回。

提前返回是一种编程概念，即函数在完成代码之前退出并返回一个值。这通常用于处理特殊情况或错误条件。

让我们来看看这个例子：

```js
function getDailyRewards(user){
    if(user.isAuthenticated){
        // ...50 lines of code
    }
}
```

这个 if 条件包装了约 50 行代码。丑得要命。让我们重写它：

```js
funcion getDailyRewards(user) {
  if (!user.isAuthenticated) {
    return;
  }

  // ...50 lines of code
}
```

看起来好多了。

如果用户未通过身份验证，我们就提前退出，而不是用 if 条件来封装整个代码逻辑。代码的其余部分都在防卫语句 `guard clause` 下面，阅读起来更方便。





## 无用的 if/else 块





## 硬编码的字符串和数字







## 重复代码







## 函数参数混乱









