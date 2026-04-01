import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Quiz from '../views/Quiz.vue'
import Result from '../views/Result.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: 'Home' }
    },
    {
      path: '/quiz',
      name: 'Quiz',
      component: Quiz,
      meta: { title: 'Quiz' }
    },
    {
      path: '/result',
      name: 'Result',
      component: Result,
      meta: { title: 'Result' }
    }
  ]
})

export default router