import { init } from "snabbdom/build/package/init";
import { h } from "snabbdom/build/package/h";
// 1. 导入模块
import { styleModule } from "snabbdom/build/package/modules/style";
import { eventListenersModule } from "snabbdom/build/package/modules/eventlisteners";
// 2. 注册模块
const patch = init([styleModule, eventListenersModule]);
// 3. 使用 h() 函数的第二个参数传入模块需要的数据（对象）
let vnode = h(
  "div",
  {
    style: {
      backgroundColor: "red",
    },
    on: {
      click: eventHandler,
    },
  },
  [h("h1", "Hello Snabbdom"), h("p", "这是p标签")]
);
const app = document.querySelector("#app");
patch(app, vnode);

function eventHandler() {
  console.log("点击");
}
