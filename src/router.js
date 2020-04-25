import Vue from 'vue';
import Router from 'vue-router';
import Expenses from './components/Expenses.vue';
import Ping from './components/Ping.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Expenses',
      component: Expenses,

    },
    {
      path: '/ping',
      name: 'Ping',
      component: Ping,
    },
  ],
});
