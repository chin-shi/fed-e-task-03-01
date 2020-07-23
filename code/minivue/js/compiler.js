class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compiler(this.el)
  }

  // 编译模板，处理文本节点和元素节点
  compiler(el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach((node) => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compilerText(node)
      } else if (this.isElementNode(node)) {
        this.compilerElement(node)
      }

      // 判断node节点，是否存在子节点，如果有子节点，要递归调用compiler
      if (node.childNodes && node.childNodes.length) {
        this.compiler(node)
      }
    })
  }
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
  update(node, key, attrName) {
    const updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }
  // 处理v-text指令
  textUpdater(node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }
  // v-model
  modelUpdater(node, value, key) {
    node.value = value
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
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
  // 编译文本节点，处理插值表达式
  compilerText(node) {
    const reg = /\{\{(.+?)\}\}/
    const value = node.textContent
    if (reg.test(value)) {
      const key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
      // 创建watcher对象，当数据改变时更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }
  // 判断元素属性是否是指令
  isDireactive(attrName) {
    return attrName.startsWith('v-')
  }
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
  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}
