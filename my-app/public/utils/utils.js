export function debounce(fn, wait) {
  var timer = null; 
  // 返回函数对debounce作用域形成闭包
  return function () {
    var context = this;
    var args = arguments;
    if (timer) {
      // 事件被触发，清除timer并重新开始计时
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, wait);
  };
}
