# 唠唠 Chrome Devtools 中一些实用的小技巧

核心内容大纲

- 通过修改响应头解决资源请求跨域问题，override 效果只有在开启 devtools 时才能生效
- source 面板开启 `Group by Authored/Deployed`以更好区分项目源代码和编译的代码
- 解决dropdown类的面板难以调试问题
- - 开启 `Emulate a focused page`
  - 设置 `debugger`
- 通过 source 面板添加 snippet 存储些需要经常在浏览器中测试的代码片段，然后通过 `ctrl + p`和 `!`选择执行对应的 snippet
- 条件断点 `conditional breakpoints`和日志断点 `log breakpoints`的使用
- 通过 recorder 面板记录手动录入等重复的操作（比如长表单的内容键入），后续直接通过 replay 来完成重复输入的工作
- 通过 rendering 面板直观感受页面回流和重绘
- ...

参考资料主要来源 chrome developer 文档以及 [〖FEDAY〗你不知道的 Chrome DevTools（开发者工具） - Jecelyn](https://www.bilibili.com/video/BV1mG411i7f2/?spm_id_from=333.788&vd_source=ad5cc68ae8a67158e89a325e5f74aa53) 视频提到的链接树！

