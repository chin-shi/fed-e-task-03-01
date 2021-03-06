# Part3 | 模块一

## 一、简答题

### 第一题

**Question**：当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么

**Answer**：不是响应式数据，可以通过 $set 方法将属性设置为响应式数据，内部原理是调用 defineReactive 方法，将属性设置为响应式数据，然后再调用 notify 方法通知视图。

### 第二题

**Question**：请简述 Diff 算法的执行过程

**Answer**：

- diff 的过程就是调用 patch 函数，比较新旧节点
- patch 函数接收两个参数 oldVnode 和 Vnode，调用 sameVnode 函数判断 oldVnode 和 Vnode 是否相同，根据 sameVnode 返回结果分为两种情况：
  - true：执行  patchVnode
  - false：用  Vnode 替换 oldVnode
- patchVnode 这个函数做了以下事情：
  - 获取对应的真实 dom 属性 elm
  - 判断 oldVnode 和 Vnode 是否完全相同，相同直接返回
  - 如果它们都有文本节点并且内容不相同，那么将 elm 的文本节点设置为 Vnode 的文本节点
  - 如果 Vnode 有文本节点内容为空，而 oldVnode 文本节点不为空，则设置 elm 文本节点内容为空
  - 如果 Vnode 有子节点，而 oldVnode 没有子节点，则将 Vnode 的子节点真实化后添加到 elm
  - 如果 Vnode 没有子节点，而 oldVnode 有子节点，则删除 elm 的子节点
  - 如果两者都有子节点，则执行 updateChildren 函数比较子节点，更新 elm

## 二、编程题

### 第一题

**Question**：模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化

**Answer**：

详细代码在code文件中，部分修改代码如下：

```js
// 修改router-link跳转
clickHandle (e) {
  // 修改hash
  window.location.hash = this.to
  this.$router.data.current = this.to
  e.preventDefault()
}
// ...
// 修改注册事件
initEvent () {
  // 初始化页面加载时，设置hash值为'/'
  window.addEventListener('load', () => {
    window.location.hash = '/'
  })
  // 监听hashchange事件，保存当前路由
  window.addEventListener('hashchange', () => {
    this.data.current = window.location.hash.slice(1)
  })
}
```

### 第二题

**Question**：在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

**Answer**：

详细代码在code文件中，部分修改代码如下：

```html
<!-- index.html -->
<div v-html="content">
  <h1>Hi</h1>
</div>
<h1>v-on</h1>
<button v-on:click="handleClick">v-on</button>
<!-- 
	content: "<h4>hello world, v-html</h4>",
	methods: {
		handleClick() {
			alert('v-on')
		}
	}
-->
```

```js
// compiler.js
// v-html
htmlUpdater(node, value, key) {
  // 先循环删除node下所有节点
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
  // 将value赋值给innerHTML
  node.innerHTML = value
  new Watcher(this.vm, key, (newValue) => {
    node.innerHTML = newValue
  })
}

// ...

// compilerElement
// 编译元素节点，处理指令
compilerElement(node) {
  // 遍历所有的属性节点
  Array.from(node.attributes).forEach((attr) => {
    // 判断是否是指令
    let attrName = attr.name
    if (this.isDireactive(attrName)) {
      // v-text --> text
      attrName = attrName.substr(2)
      const key = attr.value
      if (this.isEventDirective(attrName)) {
        this.eventHandler(node, key, attrName)
      } else {
        this.update(node, key, attrName)
      }
    }
  })
}
// ...

// 判断元素属性是否是事件指令
isEventDirective(attrName) {
  return attrName.indexOf('on') === 0
}

// v-on事件处理
eventHandler(node, key, attrName) {
  const eventType = attrName.split(':')[1]
  const fn = this.vm.$options.methods && this.vm.$options.methods[key]
  if (eventType && fn) {
    node.addEventListener(eventType, fn.bind(this.vm), false)
  }
}
```

### 第三题

**Question**：参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果

**Answer**：

详细代码在code/snabbdom-demo文件中。