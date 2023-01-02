# JUEJIN Card

## 项目功能

- 支持解析不同用户的掘金链接
- 支持将卡片导出为图片
- 支持跟随鼠标的卡片动态效果
- 支持深色模式切换

## 项目特点

- 通过`:hover`与`:active`伪类选择器实现点击按钮的动态放大效果
- 通过`:root`与CSS Variable实现了简单的深色模式切换
- 用到了`linear-gradient` `background-clip`等CSS特性
- Vue3 Composition API 数据驱动 管理卡片状态与事件监听
- Less预处理器 使用到了Less的嵌套语法与Mixin功能
- 布局方面使用了Flex布局

## 开发中遇到的问题

请求掘金的用户信息接口会遇到跨域问题

- 在本地开发时可以通过`Vite`提供的`Proxy`功能
  - NodeJS发送请求是不受跨域限制的
  - 所有`/api`的请求都会被代理服务器转发至配置好的`target`
- 部署至`Vercel`后的跨域问题
  - 可以通过根目录下`vercel.json`配置规则
  - `Vercel`项目内所有`/api`请求会被转发到`/api/proxy`
  - 而`/api/proxy`访问到的是我们在`proxy.js`中自定义的代理服务器
  - 通过此代理服务器可以处理跨域请求

## 相关技术

`Vite` `Vue3` `ArcoDesign` `Less`