import { createRouter, createWebHistory } from 'vue-router'

import MainPage from '@/pages/MainPage.vue'
import MovesListPage from '@/pages/MovesListPage.vue'
import MovePage from '@/pages/MovePage.vue'
import SearchPage from '@/pages/SearchPage.vue'

const router = createRouter({
  // Локально history работает без дополнительной настройки.
  // При деплое на статику достаточно перейти на hash-историю
  // или добавить rewrite-правило на сервере.
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPage,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchPage,
    },
    {
      path: '/dance/:danceSlug',
      name: 'dance',
      component: MovesListPage,
    },
    {
      path: '/dance/:danceSlug/:moveSlug',
      name: 'move',
      component: MovePage,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
