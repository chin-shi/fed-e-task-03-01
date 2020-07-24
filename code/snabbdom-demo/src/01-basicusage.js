import { init } from "snabbdom/build/package/init";
import { h } from "snabbdom/build/package/h";
// import { thunk } from "snabbdom/build/package/thunk";

// 1. Hello World
// 参数：数组，模块
// 返回值：patch函数，作用是对比两个vnode的差异更新到真实DOM
const patch = init([]);
// 第一个参数：标签 + 选择器
// 第二个参数：如果是字符串的话就是标签中的内容
let vnode = h("div#container.cls", "Hello World");
const app = document.querySelector("#app");
// 第一个参数：可以是DOM元素，内部会把DOM元素转换成VNode
// 第二个参数：VNode
// 返回值：VNode
const oldVnode = patch(app, vnode);
vnode = h("div", "Hello Snabbdom");
patch(oldVnode, vnode);
