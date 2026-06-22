import { createRouter, createWebHistory } from 'vue-router'

import MainPage from '@/pages/MainPage.vue'
import MovesListPage from '@/pages/MovesListPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: MainPage,
        },
        {
            path: '/dance/:danceId',
            name: 'dance',
            component: MovesListPage,
        },
    ],
})

export default router