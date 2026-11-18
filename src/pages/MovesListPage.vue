<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'

import MoveCard from '@/components/MoveCard.vue'
import {getDanceBySlug, getMovesByDance, sortMoves} from '@/data'
import type {Move, SortMode} from '@/types'

const route = useRoute()
const router = useRouter()

const danceSlug = computed(() => String(route.params.danceSlug))
const dance = computed(() => getDanceBySlug(danceSlug.value))

const query = ref('')
const sortMode = ref<SortMode>('level')

const normalize = (value: string) => value.trim().toLowerCase()

const visibleMoves = computed(() => {
    if (!dance.value) return []
    const moves = getMovesByDance(dance.value.id)
    const q = normalize(query.value)
    const filtered = q
        ? moves.filter(
            (move) =>
                normalize(move.name.ru).includes(q) ||
                normalize(move.name.eng).includes(q),
        )
        : moves
    return sortMoves(filtered, sortMode.value)
})

const openMove = (move: Move) => {
    if (!dance.value) return
    router.push({
        name: 'move',
        params: {
            danceSlug: dance.value.slug,
            moveSlug: move.slug,
        },
    })
}
</script>

<template>
    <section class="moves-page">
        <template v-if="dance">
            <nav class="moves-page__breadcrumbs">
                <RouterLink :to="{ name: 'home' }">Главная</RouterLink>
                <span aria-hidden="true">/</span>
                <span>{{ dance.name.ru }}</span>
            </nav>

            <header class="moves-page__header">
                <h1 class="moves-page__title">{{ dance.name.ru }}</h1>
                <p class="moves-page__subtitle">{{ dance.name.eng }}</p>
            </header>

            <div class="moves-page__controls">
                <input
                    v-model="query"
                    class="moves-page__search"
                    type="search"
                    placeholder="Поиск в этом танце…"
                    aria-label="Поиск движений"
                />

                <label class="moves-page__sort">
                    <span>Сортировка</span>
                    <select v-model="sortMode">
                        <option value="level">По уровню сложности</option>
                        <option value="name-asc">По алфавиту (А→Я)</option>
                        <option value="name-desc">По алфавиту (Я→А)</option>
                        <option value="popular">По популярности</option>
                    </select>
                </label>
            </div>

            <p
                v-if="visibleMoves.length"
                class="moves-page__count"
            >
                Найдено движений: {{ visibleMoves.length }}
            </p>

            <div
                v-if="visibleMoves.length"
                class="moves-page__list"
            >
                <MoveCard
                    v-for="move in visibleMoves"
                    :key="move.id"
                    :move="move"
                    @select="openMove"
                />
            </div>

            <p
                v-else-if="query"
                class="moves-page__empty"
            >
                По запросу «{{ query }}» в этом танце ничего не найдено.
            </p>

            <p
                v-else
                class="moves-page__empty"
            >
                Для этого танца пока нет движений — база пополняется.
            </p>
        </template>

        <template v-else>
            <p class="moves-page__empty">
                Танец не найден.
                <RouterLink :to="{ name: 'home' }">Вернуться на главную</RouterLink>
            </p>
        </template>
    </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/formulas" as *;
@use "@/assets/styles/mixins" as *;

.moves-page {
    width: 100%;
    max-width: 1000px;
    padding: 24px 32px 64px;

    @media (max-width: 550px) {
        padding: 16px 16px 48px;
    }

    &__breadcrumbs {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        font-size: 0.9rem;
        color: #888;

        a {
            color: #595ccd;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    &__header {
        margin-bottom: 24px;
    }

    &__title {
        margin: 0;
        font-size: clamp(1.6rem, 1.3rem + 1.2vw, 2.4rem);
        color: #222;
    }

    &__subtitle {
        margin: 4px 0 0;
        color: #888;
    }

    &__controls {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
    }

    &__search {
        flex: 1;
        min-width: 220px;
        padding: 12px 16px;
        border: 2px solid transparent;
        border-radius: 999px;
        background-color: #fff;
        font: inherit;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &:focus {
            border-color: #595ccd;
            box-shadow: 0 0 0 4px rgba(89, 92, 205, 0.15);
        }
    }

    &__sort {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        color: #666;

        select {
            padding: 10px 32px 10px 12px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fff;
            font: inherit;
            color: #222;
            cursor: pointer;

            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;

            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cg id='SVGRepo_bgCarrier' stroke-width='0'%3e%3c/g%3e%3cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3e%3c/g%3e%3cg id='SVGRepo_iconCarrier'%3e%3c!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z' fill='%23000000'%3e%3c/path%3e%3c/g%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 6px center;
            background-size: 24px;
        }
    }

    &__count {
        margin: 0 0 12px;
        font-size: 0.85rem;
        color: #999;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__empty {
        padding: 32px 0;
        text-align: center;
        color: #777;

        a {
            color: #595ccd;
        }
    }
}
</style>
