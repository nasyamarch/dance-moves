<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'

import MoveCard from '@/components/MoveCard.vue'
import {getDanceBySlug, getMovesByDance, sortMoves} from '@/data'
import type {Move, SortMode} from '@/types'

import {usePageTitle} from '@/composables/usePageTitle'

const route = useRoute()
const router = useRouter()

const danceSlug = computed(() => String(route.params.danceSlug))
const dance = computed(() => getDanceBySlug(danceSlug.value))

usePageTitle(() =>
    dance.value ? `${dance.value.name.ru} — Dance Moves` : 'Танец не найден — Dance Moves',
)

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
                aria-live="polite"
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

    @media (max-width: 550px) {
        padding: 16px 16px 48px;
    }

    &__breadcrumbs {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        font-size: 0.9rem;
        color: var(--text-subtle);

        a {
            color: var(--accent-text);
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
        color: var(--text-primary);
    }

    &__subtitle {
        margin: 4px 0 0;
        color: var(--text-subtle);
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
        background-color: var(--bg-surface);
        font: inherit;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 4px var(--accent-ring);
        }
    }

    &__sort {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        color: var(--text-secondary);

        select {
            padding: 10px 32px 10px 12px;
            border: 1px solid var(--border);
            border-radius: 10px;
            background-color: var(--bg-surface);
            font: inherit;
            color: var(--text-primary);
            cursor: pointer;

            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;

            background-image: var(--select-arrow);
            background-repeat: no-repeat;
            background-position: right 6px center;
            background-size: 24px;
        }
    }

    &__count {
        margin: 0 0 12px;
        font-size: 0.85rem;
        color: var(--text-faint);
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__empty {
        padding: 32px 0;
        text-align: center;
        color: var(--text-muted);

        a {
            color: var(--accent-text);
        }
    }
}
</style>
