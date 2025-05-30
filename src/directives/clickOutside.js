const clickOutside = {
  bind: function (el, binding, vnode) {
    // // console.log('el', el);
    // el.event = function (event) {
    //   // 检查点击是否发生在节点之内（包括子节点）
    //   if (!(el == event.target || el.contains(event.target))) {
    //     // 如果没有，则触发调用
    //     // 若绑定值为函数，则执行
    //     // 这里我们可以通过钩子函数中的 vnode.context，来获取当前组件的作用域
    //     if (typeof vnode.context[binding.expression] == "function") {
    //       vnode.context[binding.expression](event);
    //     }
    //   }
    // };

    // // Get the selector or reference to the target modal or button to avoid closing on internal clicks
    // const modalSelector = ".day-content"; // Adjust this selector to match your modal element
    // const buttonSelector = ".whereBtnsRight"; // Adjust this to match the button that opens the modal

    // el.event = function (event) {
    //   // Check if the click is outside the modal and button
    //   const modal = document.querySelector(modalSelector);
    //   const button = document.querySelector(buttonSelector);

    //   if (
    //     !(modal && modal.contains(event.target)) && // Click is not inside the modal
    //     !(button && button.contains(event.target)) // Click is not inside the button
    //   ) {
    //     // Trigger the callback if the click is outside the modal and button
    //     if (typeof vnode.context[binding.expression] == "function") {
    //       vnode.context[binding.expression](event);
    //     }
    //   }
    // };
    // 提取传入的参数: parentClass, targetClass 和 eventHandler
    const { parentClass, targetClass, eventHandler } = binding.value;

    // 默认使用绑定表达式中传入的方法作为事件处理器
    const handleOutsideClick =
      eventHandler || vnode.context[binding.expression];

    // 获取父元素和目标元素（如果传入了类名）
    const parentEl = parentClass ? document.querySelector(parentClass) : null;
    const targetEl = targetClass ? document.querySelector(targetClass) : el; // 默认是当前元素

    // 事件监听函数，检测点击是否发生在父元素或目标元素内部
    el.event = function (event) {
      // 检查点击是否发生在传入的父元素或目标元素内
      const clickedOutsideParent = parentEl && !parentEl.contains(event.target); // 是否点击在父元素外
      const clickedOutsideTarget = targetEl && !targetEl.contains(event.target); // 是否点击在目标元素外

      // 如果点击事件发生在父元素和目标元素之外
      if (clickedOutsideParent && clickedOutsideTarget) {
        // 如果 eventHandler 是一个函数，则执行它
        if (typeof handleOutsideClick === "function") {
          handleOutsideClick(event);
        }
      }
    };

    // 绑定事件
    // 设置为true，代表在DOM树中，注册了该listener的元素，会先于它下方的任何事件目标，接收到该事件。
    document.body.addEventListener("click", el.event, true);
  },
  unbind: function (el) {
    // 解绑事件
    document.body.removeEventListener("click", el.event, true);
  },
};

export default clickOutside;
