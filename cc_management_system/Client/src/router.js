import { createRouter, createWebHistory } from 'vue-router';
import CustomerOverview from './views/customerOverview';
import CMPDashboard from './views/cmpDashboard';
import CustomerDashboard from './views/customerDashboard';
import Configuration from './views/customerConfiguration';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CustomerOverview
  },
  {
    path: '/cmp-dashboard',
    name: 'CMPDashboard',
    component: CMPDashboard
  },
  {
    path: '/customer-dashboard',
    name: 'CustomerDashboard',
    component: CustomerDashboard
  },
  {
    path: '/config/:customerNumber?',
    name: 'Configuration',
    component: Configuration,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
