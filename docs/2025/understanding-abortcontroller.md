# [译] 理解 Node.js AbortController 的完整指南

> 原文地址：https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/

在 Node.js 中，取消网络请求和文件系统读取等异步操作一直是个棘手的问题。由于缺乏标准化的中断机制，导致了一系列问题，其中包括竞态条件，在这种情况下，取消逻辑和操作完成可能会以不可预测的方式相互影响。此外，与未取消的操作相关的未回收资源所导致的内存泄漏、复杂的错误处理情形，以及系统和网络资源的低效利用，进一步使情况变得复杂。

为了解决这些问题，Node.js 引入了 [AbortController](https://nodejs.org/api/globals.html#class-abortcontroller)。这个方便的工具可让你向基于 Promise 的 API（如 fetch）发出取消信号，从而更轻松地取消正在进行的操作，提高应用程序的响应速度。

本文将指导你使用 `AbortController` 来简化异步操作的取消。

## 学习前提

要学习本教程，请确保你已：

- 安装了最新版本的 [Node.js](https://nodejs.org/en/download/package-manager)；
- 使用 Promises 进行异步编程的基本知识。



## AbortController API 是什么

AbortController 是一个可让你在异步操作完成前取消这些操作的 API。该方法对于防止任务无限期运行至关重要，因为任务无限期运行会降低应用程序性能，并使其面临资源耗尽攻击，如 [事件处理程序中毒](https://davisjam.medium.com/a-sense-of-time-for-javascript-and-node-js-68c9114f5d48) 或 [拒绝服务(DoS)](https://en.wikipedia.org/wiki/Denial-of-service_attack)。

常见用例包括：

- 终止超过合理时间限制的网络请求；
- 停止长时间运行的数据库查询；
- 停止资源密集型计算。

AbortController API 会创建一个 AbortSignal 对象，该对象可传递给异步操作（如 `fetch` 或自定义函数）。当调用 AbortController 上的 `abort()` 方法时，与其信号相关的任何异步操作都会终止。

AbortController API 最初是为浏览器引入的，用于取消 fetch 请求。后来在 Node.js 中也实现了这一功能。它最初在 Node.js 14.17.0 中作为实验功能引入，并在 Node.js v15.4.0 中变得稳定，从而在不同的 JavaScript 环境中扩展了其实用性。



## AbortController 在 Node.js 中如何工作

在本节中，我们将探讨 AbortController 在 Node.js 中的工作原理。为了突出 AbortController 的重要性，让我们先来看看异步编程中的一个常见问题：一旦启动就无法中断的长期运行操作。

下面的示例演示了这一问题：

:::code-group

```js[slow-operation.js]
import timersPromises from "node:timers/promises";

async function slowOperation() {
  // Resolve in 10 seconds
  return timersPromises.setTimeout(10000);
}

async function doSomethingAsync() {
  try {
    await slowOperation();
    console.log("Completed slow operation");
  } catch (err) {
    console.error("Failed to complete slow operation due to error:", err);
  }
}

doSomethingAsync();
```

:::

`slowOperation` 函数使用 Node.js 基于 Promise 的计时器模拟一个需要 10 秒才能完成的任务。主执行将此操作封装在一个 try-catch 块中，等待其完成并记录结果。

要运行代码，请输入以下命令：

```bash
$ node slow-program.js
```

10 秒后将输出结果：

```txt
Completed slow operation
```

一旦启动，无论是否还需要结果，该操作都将持续运行。这种缺乏取消机制的情况会导致资源浪费、应用程序响应速度下降以及在关闭或出错情况下的潜在问题。

为了解决不间断长期运行操作的问题，你可以按以下方式实现 `AbortController`：

:::code-group

```js[slow-operation.js]{3-5,8-11,14,17-19}
import timersPromises from "node:timers/promises";

async function slowOperation({ signal }) {
  return timersPromises.setTimeout(10000, null, { signal });
}

async function doSomethingAsync() {
  const controller = new AbortController();
  const signal = controller.signal;

  setTimeout(() => controller.abort(), 5000); // Abort after 5 seconds

  try {
    await slowOperation({ signal });
    console.log("Completed slow operation");
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("Operation aborted");
    } else {
      console.error("Failed to complete slow operation due to error:", err);
    }
  }
}
doSomethingAsync();
```

:::

对 `slowOperation()` 函数进行了修改，使其接受一个 `signal` 参数，然后将该参数传递给 `setTimeout()` 函数，使定时器得以终止。

在 `doSomethingAsync` 函数中，创建了一个 AbortController，并设置了其相关信号。一个单独的定时器被配置为在 5 秒后调用 `controller.abort()`，这将触发 `slowOperation` 的终止。

然后将 `signal` 传递给 `slowOperation()` 函数，建立与 AbortController 的连接。通过对 `AbortError` 进行特定检查，`catch` 块的功能得到了增强，从而可以对终止的操作和其他类型的错误进行不同的处理。

保存更改并再次运行文件后，你将看到类似下面的输出：

```txt
Operation aborted
```

通过这些更改，异步任务可以在其自然完成时间之前终止，从而更好地控制长期运行的操作并改善资源管理。

在了解了 AbortController 的工作原理后，你可以在下一节中使用它来取消网络请求。



## 取消网络请求

应用程序经常向应用程序接口发出网络请求以获取数据，通常是使用内置工具（如 `fetch`）。实现超时机制对于防止请求无限期挂起至关重要。虽然 `fetch` 的默认超时时间为 300 秒，但 AbortController API 提供了一种灵活的方式，可以取消超时时间更短的请求。

下面是将 AbortController 与 `fetch` 结合使用的示例：

:::code-group

```js[fetch-data.js]
const url = "https://jsonplaceholder.typicode.com/todos/1";

const controller = new AbortController();
const signal = controller.signal;

const fetchTodo = async () => {
  try {
    console.log("Fetching data...");
    const response = await fetch(url, { signal });
    const todo = await response.json();
    console.log("Todo:", todo);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Operation aborted");
    } else {
      console.error("Error:", error);
    }
  }
};


 // Set a timeout to abort the fetch after 5 seconds
setTimeout(() => controller.abort(), 5000);

fetchTodo();
```

:::

在本例中，创建了一个 AbortController 实例，并提取了其信号以启用终止功能。

`fetchTodo()` 函数将终止信号与 `fetch` 请求一起使用。当你把信号作为选项传递给 `fetch` 时，请求就会链接到 AbortController，从而允许外部取消。`fetchTodo()` 函数中的错误处理会检查 `AbortError`，当请求被终止时会抛出 AbortError。

为了模拟超时情况，`setTimeout` 用于在 5 秒后调用 `controller.abort()`。调用 `abort()` 时，会在 `fetch` 操作中触发 `AbortError`，然后在 `catch` 块中捕获并处理该错误。

将代码保存到名为 `fetch-data.js` 的文件中，然后用以下命令执行：

```bash
$ node fetch-data.js
```

如果请求时间超过 5 秒，输出结果将与此类似：

```txt
Fetching data...
Operation aborted
```

但是，如果请求在 5 秒内完成，输出结果将是：

```txt
Fetching data...
Todo: { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
```

虽然此方法有效，但 AbortController API 还提供了 `AbortSignal.timeout()` 方法，可以进一步简化和改进此示例。



## 使用 AbortSignal.timeout()

在前面的章节中，你创建了一个 AbortController 实例，并手动管理其信号和超时。不过，Node.js 现在提供了 `AbortSignal.timeout()`，它允许你直接为网络请求设置超时，从而减少了模板代码。

下面是 `AbortSignal.timeout()` 的实际使用方法：

:::code-group

```js[fetch-data.js]{4,14-15}
const url = "https://jsonplaceholder.typicode.com/todos/1";

const fetchTodo = async () => {
  const timeoutMS = 5;

  try {
    console.log("Fetching data...");
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMS),
    });
    const todo = await response.json();
    console.log("Todo:", todo);
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.log(`Operation timed out after ${timeoutMS} milliseconds`);
    } else {
      console.error("Error:", error);
    }
  }
};

fetchTodo();

```

:::

在本例中，超时持续时间设置为 5 毫秒，使用变量 `timeoutMS` 来演示超时的操作。在实际应用中，超时时间会更长。

`AbortSignal.timeout()` 方法设置了 `fetch` 请求的超时时间。错误处理部分明确检查 `TimeoutError`，并在操作超时时提供明确的反馈。

要保存并运行程序，请将代码保存到名为 `fetch-data-with-timeout.js` 的文件中，并使用以下命令执行：

```bash
$ node fetch-data-with-timeout.js
```

你会看到入下输出：

```txt
Fetching data...
Operation timed out after 5 milliseconds
```

为了进一步简化，你可以像这样使用 `fetch` 辅助函数：

```js
async function fetchWithTimeout(url, options = {}) {
  const { timeoutMS = 3000 } = options;

  return await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeoutMS),
  });
}
```

现在，你可以轻松设置 `fetch` 请求的超时时间，还可以将多个信号结合起来，以应对更复杂的情况。



## 通过 AbortSignal.any() 组合多个信号

有时，你可能有多种原因需要终止异步操作。例如，由于超时或用户操作，你可能想终止网络请求。在这种情况下，`AbortSignal.any()` 就显得非常重要。它允许你将多个信号合并为一个信号，如果任何提供的信号被终止，该信号就会触发。

请看下面的例子：

:::code-group

```js[use-multiple-signals.js]{5-7,15-18,21,25-27,41}
import readline from "readline";

const url = "https://jsonplaceholder.typicode.com/todos/1";

const timeoutMS = 5000;
const timeoutSignal = AbortSignal.timeout(timeoutMS);
const userAbortController = new AbortController();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fetchTodo = async () => {
  const combinedSignal = AbortSignal.any([
    timeoutSignal,
    userAbortController.signal,
  ]);
  try {
    console.log("Fetching data...");
    const response = await fetch(url, { signal: combinedSignal });
    const todo = await response.json();
    console.log("Todo:", todo);
  } catch (error) {
    if (timeoutSignal.aborted) {
      console.log(`Operation timed out after ${timeoutMS} ms`);
    } else if (userAbortController.signal.aborted) {
      console.log("Operation aborted by user");
    } else {
      console.error("Error:", error);
    }
  } finally {
    userAbortController.abort(); // Clean up
    rl.close();
  }
};

// Listen for user input to abort the operation
rl.question("Press Enter to abort the fetch operation:\n", () => {
  console.log("User initiated abort");
  userAbortController.abort();
});

fetchTodo();

```

:::

这段代码演示了如何使用 `AbortSignal.any()` 来组合多个终止信号，从而允许由于超时或用户操作而取消网络请求。它设置了 5000 毫秒的超时，并为用户发起的终止创建了一个 AbortController，将这些信号与 `AbortSignal.any()` 结合起来。

然后将组合信号传递给 `fetch` 请求。如果由于超时而终止了 `fetch`，则会记录一条超时信息；如果是用户终止的，则会记录用户终止了操作。此外，代码还会提示用户按 Enter 键手动终止 `fetch` 操作。程序会监听用户的输入，并对终止操作进行相应处理。

保存并运行程序：

```bash
$ node use-multiple-signals.js
```

运行时，如果你立即按 Enter 键，就会看到由于你的操作，运行被终止了：

```txt
Press Enter to abort the fetch operation:
Fetching data...

User initiated abort
Operation aborted by user
```

你还可以将超时时间修改为较短的持续时间，如 5 毫秒，以查看超时的实际效果：

:::code-group

```js[use-multiple-signals.js]{2}
...
const timeoutMS = 5;
```

:::

保存更改后，运行程序会很快超时：

```txt
Press Enter to abort the fetch operation:
Fetching data...
Operation timed out after 5 ms
```

正如你所看到的，程序现在可以因用户输入或超时而终止，这非常有用。



## 处理 AbortErrors

在使用 AbortController 时，处理错误对于保持应用程序的稳定性和可靠性至关重要。本节简要总结了错误处理方法，以确保你的应用程序有效地管理这些错误。

在使用 AbortController 时，你会遇到两种主要类型的错误：

- `TimeoutError`：当操作超过指定时限并因超时而终止时，就会发生这种错误。

- `AbortError`：当异步操作使用 AbortController 终止时，会出现此错误。

要处理这些错误，可以使用 `try-catch` 块，如下图所示：

```js
const fetchDataMethod = async () => {;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000),
    });
    ...
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.log(`your error message here`);
    } else {
      console.error("Error:", error);
    }
  }
}
```

不使用超时信号时，经常会遇到 AbortError。处理过程与此类似，但要检查 `AbortError` 名称：

```js
const fetchDataMethod = async () => {
  try {
    const response = await fetch(url, { signal });
    ...
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("your error messsage here");
    } else {
      console.error("Error:", error);
    }
  }
};
```

有了这些方法，当你在应用程序中使用 AbortController 时，就能自信地处理错误了。



## 使用 AbortController 取消流

流在 Node.js 中至关重要，它允许你的程序在不占用过多内存的情况下以较小的块消耗大文件。通常，流操作一旦开始，就很难停止，但有了 AbortController，你就可以随时取消流。

流方法 `stream.Writable()` 和 `stream.Readable()` 接受终止信号，你也可以将它们与 `fs.createReadStream` 等方法一起使用，如下图所示：

:::code-group

```js[streams.js]
import fs from "fs";
import { addAbortSignal } from "stream";
import { setTimeout as delay } from "timers/promises";

const controller = new AbortController();
setTimeout(() => controller.abort(), 50);

const inputStream = addAbortSignal(
  controller.signal,
  fs.createReadStream("text.txt")
);
const outputStream = fs.createWriteStream("output.txt");

async function process(chunk) {
  console.log(`Processing chunk: ${chunk.length} bytes`);
  // Simulating some async processing
  await delay(10);
  return chunk;
}

(async () => {
  try {
    for await (const chunk of inputStream) {
      const processedChunk = await process(chunk);
      if (!outputStream.write(processedChunk)) {
        // Handle backpressure
        await new Promise((resolve) => outputStream.once("drain", resolve));
      }
    }
    console.log("Stream processing completed");
  } catch (e) {
    if (e.name === "AbortError") {
      console.log("The operation was cancelled");
    } else {
      console.error("An error occurred:", e);
      throw e;
    }
  } finally {
    outputStream.end();
    await new Promise((resolve) => outputStream.once("finish", resolve));
    console.log("Output stream closed");
  }
})();

```

:::

这段代码演示了 Node.js 中带有终止机制的流处理，重点是从一个文件读取数据并写入另一个文件，同时处理潜在的超时。它从 `text.txt` 创建了一个可读流，并向 `output.txt` 创建了一个可写流，同时设置了一个在 50 毫秒后触发的 AbortController（用于演示）。主操作异步读取输入流中的数据块，通过模拟延迟处理这些数据块，并将它们写入输出流。如果在此过程中触发了终止信号，则会捕获 `AbortError` 并记录一条取消信息。

要测试这一点，请使用以下命令创建一个 `text.txt` 文件，其中包含重复 30 万次的 "This is a message"：

```bash
$ yes "This is a message" | head -n 300000 > text.txt
```

一旦文件创建完，你可以运行下脚本：

```bash
$ node streams.js
```

输出的内容如下：

```txt
Processing chunk: 65536 bytes
Processing chunk: 65536 bytes
Processing chunk: 65536 bytes
Processing chunk: 65536 bytes
The operation was cancelled
Output stream closed
```

此输出显示流已成功取消。

这样，你就可以在 Node.js 中使用 AbortController 取消流了。





## 探索 Node.js 内置方法中对 AbortSignal 的支持

当 Node.js 引入 AbortController API 时，许多内置方法都得到了增强，可以接受 AbortSignal。我们已经了解了如何在 fetch 和 streams 中使用此功能。本节将介绍一些可以传递信号的 API。这只是一个不完整的列表，目的是帮助你开始使用。

在 `child_process` 模块中，你可以向以下方法传递 AbortSignal：

- `child_process.exec`
- `child_process.execFile`
- `child_process.fork`
- `child_process.spawn`

下面是一个示例，其灵感来自如何在 `child_process.spawn` 中使用 AbortSignal 的文档：

```js
const controller = new AbortController();
const { signal } = controller;
const grep = spawn("grep", ["ssh"], { signal });
grep.on("error", (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // stops the process
```

常用于与文件系统交互的 `fs` 模块也支持 AbortSignal。你可以向以下方法传递终止信号：

- `fs.readFile`
- `fs.watch`
- `fs.writeFile`

`readline` 模块也可以接受 AbortSignal。你可以向以下方法传递终止信号：

- `readline.Interface`
- `readline.createInterface`



## 总结

本指南探讨了在 Node.js 中使用 AbortController 的各种技术，从取消网络请求到管理流。我们介绍了如何实现终止信号，以确保你的应用程序能够优雅地处理长期运行的操作，并在不同条件下保持响应。

这种方法将有助于确保你的应用程序提供良好的用户体验，即使在面临 API 服务缓慢等意外问题时也能保持可靠。

感谢你的阅读，祝你编码愉快！



