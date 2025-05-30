// utils/TimerManager.js

const TimerManager = {
  timers: {},

  // 初始化时从 localStorage 恢复
  init(callback) {
    const savedTimers = JSON.parse(localStorage.getItem("vue_timers") || "{}");
    const now = Date.now();

    Object.keys(savedTimers).forEach((key) => {
      const remain = savedTimers[key] - now;
      if (remain > 0) {
        this.set(key, remain, () => {
          callback && callback(key);
        });
      } else {
        // 过期了也立刻触发一次回调
        callback && callback(key);
      }
    });
  },

  // 设置定时器
  set(id, timeout, callback) {
    this.clear(id);
    const endTime = Date.now() + timeout;

    const timer = setTimeout(() => {
      this.clear(id);
      callback && callback(id);
    }, timeout);

    this.timers[id] = {
      id,
      timer,
      endTime,
    };

    this._saveToLocalStorage();
  },

  // 清除某个定时器
  clear(id) {
    if (this.timers[id]) {
      clearTimeout(this.timers[id].timer);
      delete this.timers[id];
      this._saveToLocalStorage();
    }
  },

  // 清除所有定时器
  clearAll() {
    Object.keys(this.timers).forEach((id) => this.clear(id));
  },

  _saveToLocalStorage() {
    const obj = {};
    Object.keys(this.timers).forEach((key) => {
      obj[key] = this.timers[key].endTime;
    });
    localStorage.setItem("vue_timers", JSON.stringify(obj));
  },
};

export default TimerManager;
