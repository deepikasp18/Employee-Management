import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/employee',
    name: 'Employee',
    component: () => import( '../views/Employee.vue')
  },
  {
    path: '/department',
    name: 'Department',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Department.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
