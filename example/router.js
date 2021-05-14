import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Index.vue';

Vue.use(VueRouter);

export const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '*', redirect: '/' },
];

const router = new VueRouter({ routes });

export default router;
