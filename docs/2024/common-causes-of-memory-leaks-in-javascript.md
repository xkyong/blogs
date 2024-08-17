# [译] JavaScript 中内存泄漏的常见原因

> 原文地址：https://www.trevorlasn.com/blog/common-causes-of-memory-leaks-in-javascript

内存泄漏是一种“无声”的威胁，它会逐渐降低性能、导致崩溃并增加运营成本。 与显而易见的 Bug 不同，内存泄漏往往很隐蔽，在开始造成严重问题之前很难被发现。 

内存使用量的增加会推高服务器成本，并对用户体验产生负面影响。 了解内存泄漏是解决这些问题的第一步。

## 了解内存泄漏

当应用程序分配内存，但在不再需要时又不释放时，就会发生内存泄漏。 随着时间的推移，这些未释放的内存块会不断累积，导致内存消耗量逐渐增加。

这种情况在网络服务器等长时间运行的进程中尤为严重，内存泄漏会导致应用程序消耗越来越多的内存，直至最终崩溃或运行速度减慢。

## 了解 Node.js(V8) 中内存使用

Node.js (V8) 处理了几种不同类型的内存。 每种类型都对应用程序如何执行和利用资源起着至关重要的作用。

| 内存类型                    | 描述                                                         |
| --------------------------- | ------------------------------------------------------------ |
| **RSS (Resident Set Size)** | 为 Node.js 进程分配的总内存，包括内存的所有部分：代码、栈和堆 |
| **Heap Total**              | 为 JavaScript 对象分配的内存。 这是分配的堆的总大小          |
| **Heap Used**               | JavaScript 对象实际使用的内存。 这显示了当前堆正在使用的内存量 |
| **External**                | 链接到 JavaScript 对象的 C++ 对象使用的内存。 该内存在 V8 堆之外进行管理 |
| **Array Buffers**           | 为 **ArrayBuffer** 对象分配的内存，用于保存原始二进制数据    |

### 1. RSS(Resident Set Size)：为进程分配的内存总量

`RSS` 是指 Node.js 进程的总内存占用。 它包括为进程分配的所有内存，包括堆、栈和代码段。

```JS
// rss.js
console.log('Initial Memory Usage:', process.memoryUsage());

setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log(`RSS: ${memoryUsage.rss}`);
}, 1000);
```

该脚本每秒记录 `RSS` 内存使用情况。 我们可以观察总内存占用是如何随时间变化的。

```bash
➜ node rss.js
Initial Memory Usage: {
  rss: 38502400,
  heapTotal: 4702208,
  heapUsed: 2559000,
  external: 1089863,
  arrayBuffers: 10515
}
RSS: 41025536
RSS: 41041920
RSS: 41041920
RSS: 41041920
```

### 2. Heap Total：为 JavaScript 对象分配的内存量

`Heap Total` 表示 V8 引擎（Node.js 使用的 JavaScript 引擎）为 JavaScript 对象分配的内存总量。

```js
// heap.js
console.log('Initial Memory Usage:', process.memoryUsage());

const largeArray = new Array(1e6).fill('A');

setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log(`Heap Total: ${memoryUsage.heapTotal}`);
}, 1000);
```

分配大型数组会增加堆总数。 记录的 `heapTotal` 显示了为 JavaScript 对象分配的内存。

```bash
➜  node heap.js
Initial Memory Usage: {
  rss: 38535168,
  heapTotal: 4702208,
  heapUsed: 2559224,
  external: 1089863,
  arrayBuffers: 10515
}
Heap Total: 12976128
Heap Total: 12976128
Heap Total: 12976128
Heap Total: 12976128
Heap Total: 12976128
Heap Total: 12976128
Heap Total: 12976128
```

### 3. Heap Used：对象实际使用的内存量

`Heap Used` 指的是堆上的 JavaScript 对象当前使用的内存量。 

当我们将对象推入数组时，就会增加堆使用的内存量。

```js
// heap-used.js
console.log('Initial Memory Usage:', process.memoryUsage());

let data = [];
for (let i = 0; i < 1e6; i++) {
    data.push({ index: i });
}

setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log(`Heap Used: ${memoryUsage.heapUsed}`);
}, 1000);
```

随着对象的增加，堆使用值也会增加。

```bash
➜  node heap-used.js
Initial Memory Usage: {
  rss: 38748160,
  heapTotal: 4702208,
  heapUsed: 2559424,
  external: 1089863,
  arrayBuffers: 10515
}
Heap Used: 2833808
Heap Used: 2847776
Heap Used: 2850800
Heap Used: 2854352
Heap Used: 2875800
Heap Used: 2879488
```

### 4. External：绑定到 JavaScript 的 C++ 对象使用的内存

`External` 是指链接到 JavaScript 的 C++ 对象所使用的内存。 这些对象是通过绑定创建的，可让 JavaScript 与本地代码进行交互，在典型的 JavaScript 堆之外分配内存。 

JavaScript 中无法直接看到这些内存，但仍会增加应用程序使用的总内存。 

`Buffer.alloc` 方法分配了一个 50MB 的缓冲区，并将其作为外部内存进行跟踪。

```js
// external.js
const buffer = Buffer.alloc(50 * 1024 * 1024); // Allocate 50MB of buffer

console.log('Initial Memory Usage:', process.memoryUsage());

setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log(`External Memory: ${memoryUsage.external}`);
}, 1000);
```

此示例记录 `external` 内存的使用情况，这将反映缓冲区的分配情况。

```bash
➜  node external.js
Initial Memory Usage: {
  rss: 39223296,
  heapTotal: 4702208,
  heapUsed: 2560832,
  external: 53518663,
  arrayBuffers: 52439315
}
External Memory: 53814435
External Memory: 53814435
External Memory: 53814435
External Memory: 53814435
External Memory: 53814435
External Memory: 53814435
External Memory: 53814435
```

### 5. Array Buffers：为 `ArrayBuffer` 对象分配的内存

`Array Buffers` 是用于 `ArrayBuffer` 对象的内存。 这些对象在 JavaScript 中存储固定长度的二进制数据。 

`ArrayBuffer` 是 JavaScript 类型化数组系统的一部分，可以让你直接处理二进制数据。 

这些缓冲区的内存与普通 JavaScript 对象分开跟踪。 它们通常用于处理原始数据，如文件或网络协议。 

下面是一个例子，我分配了一个 50MB 的 `ArrayBuffer`，然后检查 Node.js 进程的初始内存使用情况。

```js
// array-buffer.js
const buffer = new ArrayBuffer(50 * 1024 * 1024); // 50MB ArrayBuffer

console.log('Initial Memory Usage:', process.memoryUsage());

setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log(`Array Buffers: ${memoryUsage.arrayBuffers}`);
}, 1000);
```

```bash
➜ node array-buffer.js
Initial Memory Usage: {
  rss: 39075840,
  heapTotal: 4702208,
  heapUsed: 2559496,
  external: 53518663,
  arrayBuffers: 52439315
}
Array Buffers: 52439315
Array Buffers: 52439315
Array Buffers: 52439315
Array Buffers: 52439315
Array Buffers: 52439315
Array Buffers: 52439315
```



## JavaScript 中内存泄漏的常见原因

JavaScript 中的内存泄漏通常是由以下原因造成的：

### 1. 变量管理不当

管理不当的变量会导致内存泄漏。 

例如，如果你声明的变量本应是临时的，但却忘记清理，那么它们就会继续消耗内存。

```js
let cache = {};

function storeData(key, value) {
    cache[key] = value;
}

// 模拟多次调用函数
storeData('item1', new Array(1000000).fill('A'));
storeData('item2', new Array(1000000).fill('B'));

// 内存泄漏：存储在 'cache' 中的数据没有被释放
```

在上面的示例中，数据被添加到一个名为 `cache` 的全局对象中。 如果不再需要这些数据时不将其删除，就会一直不必要地占用内存。 

如果这些变量存储在全局作用域中，使其在应用程序的整个生命周期中持续存在，问题就尤其严重。

```js
let globalUserSessions = {}; // 全局作用域

function addUserSession(sessionId, userData) {
  globalUserSessions[sessionId] = userData; // 在全局作用域下存储 user 数据
}

function removeUserSession(sessionId) {
  delete globalUserSessions[sessionId]; // 手动清除 user session 数据
}

// 模拟添加 user sessions 数据
addUserSession('session1', { name: 'Alice', data: new Array(1000000).fill('A') });
addUserSession('session2', { name: 'Bob', data: new Array(1000000).fill('B') });

// globalUserSessions 对象将在整个应用程序生命周期中持续存在，除非被手动清除
```

`globalUserSessions` 是一个全局对象，用于存储用户会话数据。 由于它处于全局范围内，因此会在应用程序的整个运行期间持续存在。

如果不使用 `removeUserSession` 适当地删除会话，数据将无限期地保留在内存中，从而导致内存泄漏。

### 2. 持久性全局对象

全局对象在内存中保留的时间可能超过需要。 全局对象中的数据在不再需要后仍会留在内存中。 这会逐渐增加内存使用量。

```js
global.config = {
    settings: new Array(1000000).fill('Configuration')
};
// 内存泄漏：'config' 是全局对象，在整个应用程序生命周期中都保留在内存中
```

由于 `config` 可全局访问且永不清除，因此其使用的内存会在应用程序的整个运行期间保留。 下面是避免内存泄漏的一种方法：

```js
function createConfig() {
    return {
        settings: new Array(1000000).fill('Configuration')
    };
}

// 只在需要时才使用 config，并在之后进行垃圾回收
function processConfig() {
    const config = createConfig();
    // 使用 config
    console.log(config.settings[0]);

    // 一旦 config 不再被引用，就会从内存中清除
}

processConfig();
```

我们没有将 `config` 存储在全局对象中，而是将其本地存储在函数中。这样可以确保在函数运行后，`config` 会被清除，从而为垃圾回收腾出内存。



### 3. 未移除事件监听器

添加事件监听器而不在不再需要时将其正确移除，会导致内存泄漏。

每个事件监听器都会保留对函数及其使用的任何变量的引用，从而阻止垃圾回收器回收内存。 

随着时间的推移，如果你不断添加监听器而不将其移除，就会导致内存使用量增加。 

下面的示例演示了如果不正确移除事件监听器，会如何导致内存泄漏：

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

function listener() {
    console.log('Event triggered!');
}

// 重复添加事件监听器
setInterval(() => {
    myEmitter.on('event', listener);
}, 1000);
```

每秒钟都会添加一个新的事件监听器。 然而，这些监听器从未被移除，从而导致它们在内存中累积。 

每个监听器都持有对 `listener` 函数和任何相关变量的引用，从而阻止了垃圾回收，并导致内存使用量随着时间的推移而增加。 

为防止这种内存泄漏，应在不再需要时移除事件监听器。

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

function listener() {
    console.log('Event triggered!');
}

// 添加事件监听器
myEmitter.on('event', listener);

// 触发事件并移除监听器
myEmitter.emit('event');
myEmitter.removeListener('event', listener);

// 或者，你也可以使用 `once` 方法添加一个监听器，该监听器在触发后会自动移除
myEmitter.once('event', listener);
```



### 4. 捕获变量的闭包

JavaScript 中的闭包（Closures）可能会无意中保留超过需要的变量。 当闭包捕获一个变量时，它会保留对该内存的引用。 

如果闭包在一个长期运行的进程中使用或没有正确终止，捕获的变量就会留在内存中，从而导致泄漏。

```js
function createClosure() {
    let capturedVar = new Array(1000000).fill('Data');

    return function() {
        console.log(capturedVar[0]);
    };
}

const closure = createClosure();
// 即使不再使用 'capturedVar'，闭包也会保留它
```

为了避免泄漏，请确保闭包不会不必要地捕获大变量或在不再需要时结束它们。

```js
function createClosure() {
    let capturedVar = new Array(1000000).fill('Data');

    return function() {
        console.log(capturedVar[0]);
        capturedVar = null; // 当不再需要时释放内存
    };
}

const closure = createClosure();
closure(); // 'capturedVar' 在使用完之后就被释放了
```



### 5. 不受制的回调

在某些情况下，如果不受制的回调对变量或对象的保留时间超过了需要的时间，就会导致内存问题。 

不过，一旦不再需要引用，JavaScript 的垃圾回收器通常会有效地清理内存。

```js
function fetchData(callback) {
    let data = new Array(1000000).fill('Data');

    setTimeout(() => {
        callback(data);
    }, 1000);
}

function handleData(data) {
    console.log(data[0]);
}

fetchData(handleData); // 'data' 保留在内存中
```

在上面的示例中：

- **数据分配**： `fetchData` 函数分配了一个大型数组（`data`），其中包含 100 万个元素。 
- **回调引用**： 回调函数（`handleData`）在 1 秒后被 `setTimeout` 调用时，会引用这个大数组。 

尽管分配了大量内存，JavaScript 的垃圾回收器仍会确保在不再需要时释放内存。 

除非是在处理非常复杂的场景时无意保留了引用，否则无需手动清除引用。

#### 避免不必要的复杂性 

在大多数情况下，无需手动清除标准异步回调中的引用。 

**过度复杂（不建议使用）的例子：**

```js
function fetchData(callback) {
  let data = new Array(1000000).fill('Data');

  setTimeout(() => {
      callback(data);
      data = null; // 释放引用
      global.gc(); // 显式触发垃圾回收
  }, 1000);
}

function handleData(data) {
  console.log(data[0]);
  data = null; // 处理完之后清理引用
}

console.log('Initial Memory Usage:', process.memoryUsage());

fetchData(handleData);

setTimeout(() => {
  console.log('Final Memory Usage:', process.memoryUsage());
}, 2000); // 给垃圾回收预留点时间
```

虽然这段代码手动清除了引用并显式触发了垃圾回收，但却带来了不必要的复杂性。 

JavaScript 的垃圾回收器通常足以处理内存清理，无需这些额外步骤。 

在大多数情况下，这种手动干预不仅是多余的，还会增加代码的维护难度。



### 6. 不正确使用 bind()

使用 `bind()` 创建一个新函数，并将 `this` 关键字设置为特定值。 稍有不慎，就会造成内存泄漏。

```js
function MyClass() {
    this.largeData = new Array(1000000).fill('leak');

    window.addEventListener('click', this.handleClick.bind(this));
}

MyClass.prototype.handleClick = function() {
    console.log('Clicked');
};

// 如果 MyClass 实例被销毁，但事件监听器没有被移除，
// 则绑定函数将在内存中保活该实例。
```

为什么 `bind()` 会发生内存泄漏？

1. **保留引用**： 使用 `bind()` 时，新函数会记住原始函数和该值。 如果不再需要该函数时不将其删除，它就会一直存在并占用内存。 
1. **大对象留在内存中**： 绑定函数会意外地将大对象保留在内存中，即使你不再需要它们。



### 7. 循环引用

当两个对象相互引用时，就会出现循环引用。 这会产生一个循环，使垃圾回收器感到困惑，无法释放内存。

```js
function CircularReference() {
    this.reference = this; // 循环引用
}

let obj = new CircularReference();
obj = null; // 设置 obj 为 null 并不能释放内存
```

即使将 `obj` 设置为 `null`，内存也可能因为自循环而无法释放。

#### 如何避免循环引用

1. **打破循环**：确保对象在不再需要时不互相引用。 这有助于垃圾回收器将它们清理出去。

   ```js
   function CircularReference() {
       this.reference = this;
   }
   
   let obj = new CircularReference();
   
   // 中断循环引用
   obj.reference = null; 
   obj = null; // 现在内存可以被释放了
   ```

   通过将 `obj.reference` 设置为空，我们打破了循环引用。 这样，当不再需要 `obj` 时，垃圾回收器就能释放内存。

2. **使用弱引用**：使用 `WeakMap`、`WeakSet` 或 `WeakRef`，即使存在引用，只要是弱引用，垃圾回收器也能清理内存。

   ```js
   let weakMap = new WeakMap();
   
   function CircularReference() {
       let obj = {};
       weakMap.set(obj, "This is a weak reference");
       return obj;
   }
   
   let obj = CircularReference();
   // 当不再需要时 obj 可以被垃圾回收掉
   ```

   `weakMap` 持有对 `obj` 的弱引用。 这意味着当 `obj` 在其他地方不再被使用时，即使它是在 `weakMap` 中被引用的，也仍然可以被垃圾回收。

   ```js
   let weakRef;
   
   function createObject() {
       let obj = { data: 'important' };
       weakRef = new WeakRef(obj);
       return obj;
   }
   
   let obj = createObject();
   
   console.log(weakRef.deref()); // { data: 'important' }
   
   obj = null; // 现在内存可以被垃圾回收了
   ```

   `weakRef` 允许你保持对 `obj` 的弱引用。 如果 `obj` 被设置为 `null` 且没有其他引用，那么即使 `weakRef` 仍然存在，它也会被垃圾回收。

   `WeakMap`、`WeakSet` 和 `WeakRef` 对于防止内存泄漏非常有用，但你可能并不总是需要它们。 它们更适用于高级用例，如管理缓存或大数据。 如果你正在开发典型的网络应用程序，可能不会经常用到它们，但在需要时知道它们的存在还是很有好处的。



## 剖析 Node.js 中的内存使用情况

要查找内存泄漏，你需要对应用程序进行剖析，以了解内存的使用情况。 

下面是一个 Node.js 应用程序，旨在模拟 CPU 密集型任务和 I/O 操作，并故意创建内存泄漏以进行测试。

```js
const http = require('http');
const url = require('url');

// 模拟 CPU 密集型任务
const handleCpuIntensiveTask = (req, res) => {
    let result = 0;
    for (let i = 0; i < 1e7; i++) {
        result += i * Math.random();
    }
    console.log('Memory Usage (CPU Task):', process.memoryUsage()); // Log memory usage
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Result of the CPU-intensive task: ${result}`);
};

// 创建巨大的内存缓存区
const largeBuffer = Buffer.alloc(1024 * 1024 * 50, 'a'); // 50MB buffer filled with 'a'

// 模拟 I/O 操作
const handleSimulateIo = (req, res) => {
    // 模拟读取缓冲区，就像读取文件一样
    setTimeout(() => {
        console.log('Memory Usage (Simulate I/O):', process.memoryUsage()); // Log memory usage
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Simulated I/O operation completed with data of length: ${largeBuffer.length}`);
    }, 500); // 模拟 500ms 的 I/O 操作
};

// 模拟内存泄漏（测试）
let memoryLeakArray = [];

const causeMemoryLeak = () => {
    memoryLeakArray.push(new Array(1000).fill('memory leak'));
    console.log('Memory leak array length:', memoryLeakArray.length);
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/cpu-intensive') {
        handleCpuIntensiveTask(req, res);
    } else if (parsedUrl.pathname === '/simulate-io') {
        handleSimulateIo(req, res);
    } else if (parsedUrl.pathname === '/cause-memory-leak') {
        causeMemoryLeak();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Memory leak caused. Check memory usage.');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

接下来，我们需要对服务器进行压力测试。 该脚本通过发送 100 个请求来模拟 CPU、I/O 和内存泄漏，从而对服务器进行压力测试。

```sh
#!/bin/bash

# 请求发送的数量
REQUESTS=100

# 端点 URL
CPU_INTENSIVE_URL="http://localhost:3000/cpu-intensive"
SIMULATE_IO_URL="http://localhost:3000/simulate-io"
MEMORY_LEAK_URL="http://localhost:3000/cause-memory-leak"

echo "Sending $REQUESTS requests to $CPU_INTENSIVE_URL and $SIMULATE_IO_URL..."

# 循环请求 CPU 密集型端点
for ((i=1;i<=REQUESTS;i++)); do
  curl -s $CPU_INTENSIVE_URL > /dev/null &
done

# 循环请求模拟的 I/O 端点
for ((i=1;i<=REQUESTS;i++)); do
  curl -s $SIMULATE_IO_URL > /dev/null &
done

# 循环请求内存泄漏端点
for ((i=1;i<=REQUESTS;i++)); do
  curl -s $MEMORY_LEAK_URL > /dev/null &
done

wait
echo "Done."
```

它循环遍历 URL，并使用 `curl` 发送静默请求，在后台运行以模拟高负载。

```bash
➜ ./load_test.sh
Sending 100 requests to http://localhost:3000/cpu-intensive and http://localhost:3000/simulate-io and http://localhost:3000/cause-memory-leak
Done.
```

下面是我们的服务器对压力测试的反应。开始测试前，请确保服务器正在运行。

```bash
➜  node --prof server.js
Server is running on port 3000
Memory Usage (Simulate I/O): {
  rss: 122863616,
  heapTotal: 17547264,
  heapUsed: 8668016,
  external: 54075004,
  arrayBuffers: 52439275
}
Memory leak array length: 25
Memory leak array length: 26
Memory leak array length: 27
Memory leak array length: 28
// ...
```

### 分析下结果

剖析数据将保存在一个文件中，文件名形如 `isolate-0xXXXXXXXXXXX-v8.log`。 要处理日志并获得人类可读的概要，请运行：

```bash
➜  node --prof-process isolate-0x140008000-42065-v8.log > processed-profile.txt
```

这将生成一个包含 CPU 剖析数据的 `processed-profile.txt` 文件，其中包括应用程序在哪些方面花费时间以及如何管理内存的详细信息。 

打开 `processed-profile.txt` 文件，查找使用大量时间或内存的区域。

> 译者注：具体输出数据详见原文！

```txt
Statistical profiling result from isolate-0x140008000-42065-v8.log, (4099 ticks, 308 unaccounted, 0 excluded).

 [Shared libraries]:
   ticks  total  nonlib   name

 [JavaScript]:
   ticks  total  nonlib   name
   1007   24.6%   24.6%  JS: *handleCpuIntensiveTask /Users/trevorindreklasn/Projects/labs/node-memory/server.js:5:32
      5    0.1%    0.1%  JS: +handleCpuIntensiveTask /Users/trevorindreklasn/Projects/labs/node-memory/server.js:5:32
      1    0.0%    0.0%  JS: ^onParserExecute node:_http_server:839:25
      1    0.0%    0.0%  JS: ^getKeys node:internal/util/inspect:709:17
      1    0.0%    0.0%  JS: ^clearBuffer node:internal/streams/writable:742:21
      1    0.0%    0.0%  JS: ^checkListener node:events:276:23
      1    0.0%    0.0%  JS: ^Socket node:net:353:16
      1    0.0%    0.0%  JS: +pushAsyncContext node:internal/async_hooks:539:26
      1    0.0%    0.0%  JS: +processTicksAndRejections node:internal/process/task_queues:67:35
// ...
```

特别注意：

- **CPU 占用率高的功能**：这些是代码中的瓶颈。 
- **内存密集型函数**：消耗大量内存的函数可能意味着潜在的内存泄漏，特别是如果这些函数对应的代码部分本应释放内存但却没有释放。 
- **事件循环和垃圾回收 (GC)**：查看在 GC 中花费的时间比例是否过高，因为这可能表明应用程序在内存管理方面遇到了困难。 

内存泄漏可能很微妙，但解决它们是保持 JavaScript 应用程序高效可靠的关键。



