import { createApp } from "vue";
import Toast from "../components/Toast.vue";
export  const toast= {
  instance: null,
  parent: document.createElement("div"),
  showToast({ title, duration = 2000, mask = false }) {
    if (this.instance !== null) this.clear();
    this.instance = createApp(Toast, { title: title.toString(), mask });
    document.body.appendChild(this.parent);
    this.instance.mount(this.parent);
    setTimeout(() => {
      this.clear();
    }, duration);
  },
  hideToast() {
    this.clear();
  },
  clear() {
    if (this.instance !== null) {
      this.instance.unmount(this.parent);
      document.body.removeChild(this.parent);
      this.instance = null;
    }
  },
};
