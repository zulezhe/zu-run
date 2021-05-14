import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import ZuRun from '../src/index.js';
import '../lib/zu-run.css';
import ZuRun from '../lib/zu-run.umd';
Vue.config.productionTip = false;
// 注册组件库
Vue.use(ZuRun);
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
