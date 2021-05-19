import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home.vue';
import Playground from './views/Playground.vue';

Vue.use(VueRouter);

export const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/playground', name: 'playground', component: Playground },
  { path: '*', redirect: '/' },
];

const router = new VueRouter({ routes });

export default router;
