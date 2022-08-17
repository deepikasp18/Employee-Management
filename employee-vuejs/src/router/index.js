import { createRouter, createWebHistory } from 'vue-router'
import AboutEmployee from '../views/AboutEmployee.vue'

const routes = [
  {
    path: '/employee',
    name: 'Employee',
    component: AboutEmployee
  },
  {
    path: '/department',
    name: 'Department',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutDepartment.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
