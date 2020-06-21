import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
const fb = require("./firebaseConfig.js");
import "./assets/app.scss";
import ElementUI from "element-ui";
import "./assets/element-variables.scss";

Vue.config.productionTip = false;
Vue.use(ElementUI);

let app;
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
