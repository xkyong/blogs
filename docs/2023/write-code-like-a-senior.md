# 【翻译】像高手一样编写代码：编写代码的 5 个必知技巧

> 原文地址：https://www.mensurdurakovic.com/write-code-like-a-senior-five-must-know-tips-for-crafting-code/

在本文中，我们将讨论 5 个简单的技巧，你可以从此刻开始使用它们来提高代码质量。

无论你使用哪种编程语言，也无论你有多少年的编程经验，你都可以在日常工作中使用这些技巧。

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

这一条是专门针对初学者的。当学生在代码中写入无用的 if/else 块时，我喜欢在练习中对他们进行提示。

这里有个典型的例子：

```js
function isEven(number) {
  if (number % 2 === 0) {
    return true;
  } else {
    return false;
  }
}
```

当我看到这样的代码时，我会问他们能不能写得更短、更优雅一些。然后，有些人就会这样做：

```js
function isEven(number) {
  if (number % 2 === 0) {
    return true;
  }
  return false;
}
```

然后，我问他们能否将这 4 行写成 1 行。然后他们会这样做：

```js
function isEven(number) {
  return number % 2 === 0 ? true : false; 
}
```

我再次询问他们是否可以不使用 if/else 或三元运算符，最后我们得到了这样的结果：

```js
function isEven(number) {
  return number % 2 === 0;
}
```

下面还有一个与第一种情况类似的例子。

```js
function getScheduleKey() {
  const hasSchedule = this.hasTeleVisitScheduled();
  if (hasSchedule) {
    return this.schedule.key;
  } else {
    return this.schedule.cancelSchedule.key;
  }
}
```

如果仔细观察，这里不需要写 else 块。反正函数已经结束，也有返回。

因此，我们可以这样解决：

```js
function getScheduleKey() {
  const hasSchedule = this.hasTeleVisitScheduled();
  if (hasSchedule) {
    return this.schedule.key;
  }
  return this.schedule.cancelSchedule.key;
}
```

这个故事的寓意是：避免使用无用的 if/else 块。



## 硬编码的字符串和数字

硬编码字符串和数字可在代码中嵌入值。而不是使用变量或常量来表示它们。

硬编码值通常被认为是不好的做法，这有几个原因：

- 缺乏灵活性和可维护性：如果在整个代码库中都对值进行硬编码，要对这些值进行更改，就需要找到并修改每一次出现的值。这意味着，如果你在代码中对一个字符串进行了 100 次硬编码，而 2 个月后你需要修改该字符串，那么你需要在 100 个地方再次修改该字符串。
- 可重用性：硬编码值很难在不同情况下重用相同的代码。如果想在不同的值中使用相同的逻辑，就需要复制代码。然后，你可以更改值，这就导致了代码的重复。
- 可读性：带有硬编码值的代码会变得更难阅读和理解。尤其是对于不熟悉代码的其他开发人员来说。有意义的变量名会让值的目的更加明确。
- 调试和错误检测：当出现错误时，如果使用命名的变量或常量，就更容易发现错误。
- 可扩展性：随着项目的增长，维护硬编码值变得非常具有挑战性。在整个代码库中更改一个值可能会变得繁琐且容易出错。

- 本地化和国际化：如果你的代码需要支持多种语言或本地化，硬编码值会使翻译变得困难。

总之，在代码中使用硬编码字符串和数字是不好的。

现在，让我们来看看这个精美的示例，它激发了我写这篇文章的灵感。这个例子的原版要长得多，但现在的版本更简短，减少了 if 条件：

```js
if (fitnessTrainingSchedule.name == "Training 03 Schedule") {
  checkWindowForTrainingSchedule(10, 16, "Milestone3Schedule", "Training 03 Schedule");
}
if (fitnessTrainingSchedule.name == "Training 04 Schedule") {
  checkWindowForTrainingSchedule(24, 30, "Milestone4Schedule", "Training 04 Schedule");
}
if (fitnessTrainingSchedule.name == "Training 05 Schedule") {
  checkWindowForTrainingSchedule(52, 58, "Milestone5Schedule", "Training 05 Schedule");
}
if (fitnessTrainingSchedule.name == "Training 06 Schedule") {
  checkWindowForTrainingSchedule(80, 86, "Milestone6Schedule", "Training 06 Schedule");
}
if (fitnessTrainingSchedule.name == "Training 07 Schedule") {
  checkWindowForTrainingSchedule(108, 114, "Milestone7Schedule", "Training 07 Schedule");
}
if (fitnessTrainingSchedule.name == "Training 08 Schedule") {
  checkWindowForTrainingSchedule(136, 142, "Milestone8Schedule", "Training 08 Schedule");
}
if (fitnessTrainingSchedule.name == "Training 09 Schedule") {
  checkWindowForTrainingSchedule(164, 170, "Milestone9Schedule", "Training 09 Schedule");
}
if (fitnessTrainingSchedule.name == "Training 10 Schedule") {
  checkWindowForTrainingSchedule(216, 230, "Milestone10Schedule", "Training 10 Schedule");
}
```

乍一看，你可以看到一堆相似的数字和字符串，但你根本不知道这些代码在做什么。你只知道它在做与健身训练时间表有关的事情。要理解这段代码，你需要看看其他脚本。

让我们看看重构后的版本：

```js
const TRAINING_SCHEDULE_03 = {
  name: "Training 03 Schedule",
  milestone: "Milestone3Schedule",
  startDaysInterval: 10,
  endDaysInterval: 16
};
const TRAINING_SCHEDULE_04 = {
  name: "Training 04 Schedule",
  milestone: "Milestone4Schedule",
  startDaysInterval: 24,
  endDaysInterval: 30
};
const TRAINING_SCHEDULE_05 = {
  name: "Training 05 Schedule",
  milestone: "Milestone5Schedule",
  startDaysInterval: 52,
  endDaysInterval: 58
};
const TRAINING_SCHEDULE_06 = {
  name: "Training 06 Schedule",
  milestone: "Milestone6Schedule",
  startDaysInterval: 80,
  endDaysInterval: 86
};
const TRAINING_SCHEDULE_07 = {
  name: "Training 07 Schedule",
  milestone: "Milestone7Schedule",
  startDaysInterval: 108,
  endDaysInterval: 114
};
const TRAINING_SCHEDULE_08 = {
  name: "Training 08 Schedule",
  milestone: "Milestone8Schedule",
  startDaysInterval: 136,
  endDaysInterval: 142
};
const TRAINING_SCHEDULE_09 = {
  name: "Training 09 Schedule",
  milestone: "Milestone9Schedule",
  startDaysInterval: 164,
  endDaysInterval: 170
};
const TRAINING_SCHEDULE_10 = {
  name: "Training 10 Schedule",
  milestone: "Milestone10Schedule",
  startDaysInterval: 216,
  endDaysInterval: 230
};

if (fitnessTrainingSchedule.name == TRAINING_SCHEDULE_03.name) {
  checkWindowForTrainingSchedule(
    TRAINING_SCHEDULE_03.startDaysInterval,
    TRAINING_SCHEDULE_03.endDaysInterval,
    TRAINING_SCHEDULE_03.milestone,
    TRAINING_SCHEDULE_03.name
  );
}
if (fitnessTrainingSchedule.name == TRAINING_SCHEDULE_04.name) {
  checkWindowForTrainingSchedule(
    TRAINING_SCHEDULE_04.startDaysInterval,
    TRAINING_SCHEDULE_04.endDaysInterval,
    TRAINING_SCHEDULE_04.milestone,
    TRAINING_SCHEDULE_04.name
  );
}
if (fitnessTrainingSchedule.name == TRAINING_SCHEDULE_05.name) {
  checkWindowForTrainingSchedule(
    TRAINING_SCHEDULE_05.startDaysInterval,
    TRAINING_SCHEDULE_05.endDaysInterval,
    TRAINING_SCHEDULE_05.milestone,
    TRAINING_SCHEDULE_05.name
  );
}
if (fitnessTrainingSchedule.name == TRAINING_SCHEDULE_06.name) {
  checkWindowForTrainingSchedule(
    TRAINING_SCHEDULE_06.startDaysInterval,
    TRAINING_SCHEDULE_06.endDaysInterval,
    TRAINING_SCHEDULE_06.milestone,
    TRAINING_SCHEDULE_06.name
  );
}
if (fitnessTrainingSchedule.name == TRAINING_SCHEDULE_07.name) {
  checkWindowForTrainingSchedule(
    TRAINING_SCHEDULE_07.startDaysInterval,
    TRAINING_SCHEDULE_07.endDaysInterval,
    TRAINING_SCHEDULE_07.milestone,
    TRAINING_SCHEDULE_07.name
  );
}
if (fitnessTrainingSchedule.name == TRAINING_SCHEDULE_08.name) {
  checkWindowForTrainingSchedule(
    TRAINING_SCHEDULE_08.startDaysInterval,
    TRAINING_SCHEDULE_08.endDaysInterval,
    TRAINING_SCHEDULE_08.milestone,
    TRAINING_SCHEDULE_08.name
  );
}
if (fitnessTrainingSchedule.name == TRAINING_SCHEDULE_09.name) {
  checkWindowForTrainingSchedule(
    TRAINING_SCHEDULE_09.startDaysInterval,
    TRAINING_SCHEDULE_09.endDaysInterval,
    TRAINING_SCHEDULE_09.milestone,
    TRAINING_SCHEDULE_09.name
  );
}
if (fitnessTrainingSchedule.name == TRAINING_SCHEDULE_10.name) {
  checkWindowForTrainingSchedule(
    TRAINING_SCHEDULE_10.startDaysInterval,
    TRAINING_SCHEDULE_10.endDaysInterval,
    TRAINING_SCHEDULE_10.milestone,
    TRAINING_SCHEDULE_10.name
  );
}
```

这段代码无疑更长，但更易读、易懂。你可以看到这段代码在做什么，参数的含义是什么。

当然，这段代码远非完美。它包含了很多重复的代码，我们下一步要修正这些代码。



## 重复代码

代码重复也称为代码冗余。它是指在一个项目中的许多地方出现相同或相似的代码块。在编程中，代码重复通常被认为是不好的，原因有以下几点：

- 维护复杂：当相同的代码出现在许多地方时，对该代码的任何更改或更新都需要在所有这些地方进行。这增加了引入错误的风险。这也增加了维护的难度和时间。
- Bug 扩散：如果重复代码中存在错误，则需要在每个实例中进行修复。漏掉哪怕一个实例都可能导致不一致的行为或意想不到的问题。
- 可读性和理解性：重复代码会使代码库更难阅读和理解。特别是对于可能需要处理或维护代码的其他开发人员来说。它掩盖了项目的逻辑和意图。
- 代码膨胀：重复代码会导致代码臃肿，使项目变得更大更慢。这会影响性能和效率。
- 代码审查和协作：在代码审查过程中，冗余代码会被标记为问题。这将引发有关代码组织和设计选择的讨论。这也会在版本控制系统中产生冲突。特别是当许多开发人员都在开发类似的代码时。

我们之前重构的代码示例有一个很大的问题，那就是代码重复。它违反了 DRY 原则，即“不要重复自己”。

让我们来解决这个问题：

```js
const TRAINING_SCHEDULES = [
  {
    name: "Training 03 Schedule",
    milestone: "Milestone3Schedule",
    startDaysInterval: 10,
    endDaysInterval: 16
  },
  {
    name: "Training 04 Schedule",
    milestone: "Milestone4Schedule",
    startDaysInterval: 24,
    endDaysInterval: 30
  },
  {
    name: "Training 05 Schedule",
    milestone: "Milestone5Schedule",
    startDaysInterval: 52,
    endDaysInterval: 58
  },
  {
    name: "Training 06 Schedule",
    milestone: "Milestone6Schedule",
    startDaysInterval: 80,
    endDaysInterval: 86
  },
  {
    name: "Training 07 Schedule",
    milestone: "Milestone7Schedule",
    startDaysInterval: 108,
    endDaysInterval: 114
  },
  {
    name: "Training 08 Schedule",
    milestone: "Milestone8Schedule",
    startDaysInterval: 136,
    endDaysInterval: 142
  },
  {
    name: "Training 09 Schedule",
    milestone: "Milestone9Schedule",
    startDaysInterval: 164,
    endDaysInterval: 170
  },
  {
    name: "Training 10 Schedule",
    milestone: "Milestone10Schedule",
    startDaysInterval: 216,
    endDaysInterval: 230
  }
];

const targetedTrainingSchedule = TRAINING_SCHEDULES.find(
  (trainingSchedule) => trainingSchedule.name === fitnessTrainingSchedule.name
);

if (!targetedTrainingSchedule) {
  return;
}

checkWindowForTrainingSchedule(
  targetedTrainingSchedule.startDaysInterval,
  targetedTrainingSchedule.endDaysInterval,
  targetedTrainingSchedule.milestone,
  targetedTrainingSchedule.name
);
```

正如你所看到的，我们将所有对象移到了一个数组中。然后，我们不再对每一个可能的健身训练计划重复 if 条件，而是找到我们要找的那个。然后，我们将目标训练计划的参数传递到函数中。

这样看起来比以前漂亮多了。



## 函数参数混乱

函数实参，又称函数形参（*注：其实都可以统称为函数参数，没必要过度比较*），是在调用函数时提供给函数的值。这些参数为函数执行任务或计算提供了必要的数据。

如果不认真对待函数参数的使用，就会在代码中造成混乱。我曾经遇到过这样一个函数：

```js
function createUser(
  username,
  email,
  password,
  firstName,
  lastName,
  birthdate,
  gender,
  phoneNumber,
  profilePicture,
  registerPurpose,
  isActive,
  isAdmin,
  isVerified,
  registrationDate,
  status,
  timezone,
  theme,
  accountType,
  subscriptionPlan,
  preferredLanguage,
  expiryDate,
  lastPasswordUpdate,
  lastLogin,
  notificationSettings,
  customFields
)
```

当一个函数有大量参数时，其理解、阅读和维护就会变得更加困难。要跟踪每个参数的作用以及它们之间的相互作用，都是一项挑战。  

包含大量参数的函数会使代码更难阅读和理解。尤其是对于新加入代码库的开发人员。

还有就是，测试带有多个参数的函数也会变得更加复杂。每个参数都可能有不同的值和交互作用。这就增加了涵盖函数行为所需的测试用例数量。此外，调试带有多个参数的函数中的问题也更具挑战性。

具有多个参数的函数可能与其调用者紧密耦合。如果一个参数发生变化，可能会影响函数的行为，需要在很多地方进行更改。

因此，上面这种情况后来被重构成了这样：

```js
function createUser(userData) 
```

这比以前好多了。

此外，在前面的示例中，函数从一个对象接收数据。没有必要逐个传递所有数据。你可以传递整个对象：

```js
// this is not OK
checkWindowForTrainingSchedule(
  targetedTrainingSchedule.startDaysInterval,
  targetedTrainingSchedule.endDaysInterval,
  targetedTrainingSchedule.milestone,
  targetedTrainingSchedule.name
);

// this is OK
checkWindowForTrainingSchedule(targetedTrainingSchedule);
```

总之，好的做法是使用参数数量合理的函数。  

如果发现需要很多参数才能实现某种功能，可以考虑使用对象等数据结构。对象允许你将相关参数组合在一起。你还可以将函数分解为更小更集中的函数。这些函数可以相互影响，以实现所需的效果。

这样可以使代码更简洁、更易于维护和测试。


