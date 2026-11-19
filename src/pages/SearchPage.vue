<script setup lang="ts">
import {computed, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'

import MoveCard from '@/components/MoveCard.vue'
import Search from '@/components/Search.vue'
import {
    getAllDances,
    getDanceBySlug,
    getLevelTags,
    searchAll,
    sortMoves,
} from '@/data'
import {useFiltersStore} from '@/stores/filters'
import {useSearchStore} from '@/stores/search'
import type {Move} from '@/types'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const filters = useFiltersStore()

const queryParam = computed(() =>
    typeof route.query.q === 'string' ? route.query.q : '',
)

// Подхватываем запрос из URL при заходе на страницу.
watch(
    queryParam,
    (value) => {
        if (value !== searchStore.query) searchStore.setQuery(value)
    },
    {immediate: true},
)

// Держим URL в актуальном состоянии, чтобы ссылку можно было скопировать.
watch(
    () => searchStore.query,
    (value) => {
        if (value === queryParam.value) return
        router.replace({
            name: 'search',
            query: value.trim() ? {q: value.trim()} : {},
        })
    },
)

const results = computed(() => searchAll(searchStore.normalizedQuery))

const allDances = getAllDances()
const levelTags = getLevelTags()

const showDances = computed(() => filters.resultType !== 'moves')
const showMoves = computed(() => filters.resultType !== 'dances')

const visibleDances = computed(() => {
    if (!showDances.value) return []
    if (filters.danceSlug) {
        return results.value.dances.filter(
            (dance) => dance.slug === filters.danceSlug,
        )
    }
    return results.value.dances
})

const visibleMoves = computed(() => {
    if (!showMoves.value) return []
    let moves: Move[] = results.value.moves
    if (filters.danceSlug) {
        const dance = getDanceBySlug(filters.danceSlug)
        if (dance) moves = moves.filter((move) => move.dance_id === dance.id)
    }
    if (filters.levelTagId !== null) {
        moves = moves.filter((move) => move.tag_ids.includes(filters.levelTagId!))
    }
    return sortMoves(moves, filters.sortMode)
})

const total = computed(
    () => visibleDances.value.length + visibleMoves.value.length,
)
</script>

<template>
    <section class="search-page">
        <h1 class="search-page__title">Поиск</h1>

        <div class="search-page__search">
            <Search
                variant="large"
                placeholder="Найти движение или танец…"
            />
        </div>

        <template v-if="searchStore.hasQuery">
            <p class="search-page__count">
                Найдено: {{ results.dances.length }} танцев,
                {{ results.moves.length }} движений
            </p>

            <div
                v-if="results.dances.length || results.moves.length"
                class="search-page__filters"
            >
                <label>
                    <span>Показывать</span>
                    <select v-model="filters.resultType">
                        <option value="all">Всё</option>
                        <option value="dances">Только танцы</option>
                        <option value="moves">Только движения</option>
                    </select>
                </label>

                <label>
                    <span>Танец</span>
                    <select v-model="filters.danceSlug">
                        <option value="">Все танцы</option>
                        <option
                            v-for="dance in allDances"
                            :key="dance.id"
                            :value="dance.slug"
                        >
                            {{ dance.name.ru }}
                        </option>
                    </select>
                </label>

                <template v-if="showMoves">
                    <label>
                        <span>Уровень</span>
                        <select v-model="filters.levelTagId">
                            <option :value="null">Любой</option>
                            <option
                                v-for="tag in levelTags"
                                :key="tag.id"
                                :value="Number(tag.id)"
                            >
                                {{ tag.name.ru }}
                            </option>
                        </select>
                    </label>

                    <label>
                        <span>Сортировка</span>
                        <select v-model="filters.sortMode">
                            <option value="level">По уровню сложности</option>
                            <option value="name-asc">По алфавиту (А→Я)</option>
                            <option value="name-desc">По алфавиту (Я→А)</option>
                            <option value="popular">По популярности</option>
                        </select>
                    </label>
                </template>

                <button
                    class="search-page__reset"
                    type="button"
                    @click="filters.reset()"
                >
                    Сбросить
                </button>
            </div>

            <template v-if="total">
                <section
                    v-if="visibleDances.length"
                    class="search-page__block"
                >
                    <h2 class="search-page__block-title">Танцы</h2>
                    <ul class="search-page__dances">
                        <li
                            v-for="dance in visibleDances"
                            :key="dance.id"
                        >
                            <RouterLink
                                :to="{ name: 'dance', params: { danceSlug: dance.slug } }"
                            >
                                <strong>{{ dance.name.ru }}</strong>
                                <span>{{ dance.name.eng }}</span>
                            </RouterLink>
                        </li>
                    </ul>
                </section>

                <section
                    v-if="visibleMoves.length"
                    class="search-page__block"
                >
                    <h2 class="search-page__block-title">
                        Движения — {{ visibleMoves.length }}
                    </h2>
                    <div class="search-page__moves">
                        <MoveCard
                            v-for="move in visibleMoves"
                            :key="move.id"
                            :move="move"
                            show-dance
                            @select="router.push({
                  name: 'move',
                  params: {
                    danceSlug: allDances.find((d) => d.id === move.dance_id)?.slug ?? '',
                    moveSlug: move.slug,
                  },
                })"
                        />
                    </div>
                </section>
            </template>

            <p
                v-else
                class="search-page__empty"
            >
                По запросу «{{ searchStore.normalizedQuery }}» ничего не найдено.
                Попробуйте другое слово или уточните фильтры.
            </p>
        </template>

        <p
            v-else
            class="search-page__hint"
        >
            Введите хотя бы один символ — найдём танцы и движения по названию
            на русском и английском, а также по тегам уровня и типа.
        </p>
    </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/formulas" as *;
@use "@/assets/styles/mixins" as *;

.search-page {
    width: 100%;
    max-width: 1000px;
    padding: 24px 32px 64px;

    @media (max-width: 550px) {
        padding: 16px 16px 48px;
    }

    &__title {
        margin: 0 0 16px;
        font-size: clamp(1.6rem, 1.3rem + 1.2vw, 2.4rem);
        color: #222;
    }

    &__search {
        margin-bottom: 16px;
    }

    &__count {
        margin: 0 0 16px;
        font-size: 0.9rem;
        color: #888;
    }

    &__filters {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: clamp-f(8, 24);
        margin-bottom: 24px;
        padding: 16px;
        border-radius: 16px;
        background-color: #fff;

        @include mobile {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }

        @include tablet {
            display: flex;
            flex-direction: initial;
        }

        label {
            display: flex;
            flex-direction: column;
            gap: 4px;
            font-size: clamp-f(14, 20);
            color: #666;
        }

        select {
            padding: 9px 24px 9px 12px;
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
            background-position: right 0px center;
            background-size: 24px;
        }
    }

    &__reset {
        padding: 9px 16px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #fff;
        font: inherit;
        font-size: clamp-f(14, 20);
        color: #595ccd;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;

        @include hover {
            border-color: #595ccd;
            background-color: rgba(89, 92, 205, 0.1);
        }

        @include mobile {
            grid-column: 1 / -1;
            justify-self: start;
        }

        @include tablet {
            align-self: flex-end;
            margin-left: auto;
        }
    }

    &__block {
        margin-bottom: 32px;
    }

    &__block-title {
        margin: 0 0 12px;
        font-size: 1.2rem;
        color: #222;
    }

    &__dances {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 12px;
        margin: 0;
        padding: 0;
        list-style: none;

        a {
            display: flex;
            flex-direction: column;
            gap: 2px;
            height: 100%;
            padding: 16px;
            border-radius: 12px;
            background-color: #fff;
            text-decoration: none;
            transition: box-shadow 0.2s ease;

            &:hover {
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
            }

            strong {
                color: #222;
            }

            span {
                font-size: 0.85rem;
                color: #888;
            }
        }
    }

    &__moves {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__empty,
    &__hint {
        padding: 32px 0;
        text-align: center;
        color: #777;
    }
}
</style>
