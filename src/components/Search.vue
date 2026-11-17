<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'

import {getDanceById} from '@/data'
import {useSearchStore} from '@/stores/search'

const props = withDefaults(
    defineProps<{
        /** Размер строки: компактная в шапке или крупная на главной. */
        variant?: 'header' | 'large'
        placeholder?: string
    }>(),
    {
        variant: 'header',
        placeholder: 'Поиск танцев и движений…',
    },
)

const router = useRouter()
const searchStore = useSearchStore()

const isFocused = ref(false)

const query = computed({
    get: () => searchStore.query,
    set: (value: string) => searchStore.setQuery(value),
})

const isOpen = computed(() =>
    isFocused.value && searchStore.hasQuery && searchStore.isOpen,
)

const showDropdown = computed(() => isOpen.value && searchStore.suggestionsCount > 0)

const clear = () => {
    searchStore.reset()
}

const submit = () => {
    const q = searchStore.normalizedQuery
    if (!q) return
    searchStore.close()
    router.push({name: 'search', query: {q}})
}

const goDance = (danceId: string) => {
    const dance = getDanceById(danceId)
    if (!dance) return
    searchStore.close()
    router.push({name: 'dance', params: {danceSlug: dance.slug}})
}

const goMove = (danceId: string, moveSlug: string) => {
    const dance = getDanceById(danceId)
    if (!dance) return
    searchStore.close()
    router.push({
        name: 'move',
        params: {danceSlug: dance.slug, moveSlug},
    })
}

const goAllResults = () => {
    submit()
}
</script>

<template>
    <div class="search" :class="[`search--${variant}`]">
        <div class="search__field">
            <svg
                class="search__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M10.5 3a7.5 7.5 0 1 0 4.55 13.46l4.24 4.25 1.42-1.42-4.25-4.24A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
                />
            </svg>

            <input
                v-model="query"
                class="search__input"
                type="search"
                :placeholder="placeholder"
                aria-label="Поиск"
                @focus="isFocused = true; searchStore.open()"
                @blur="isFocused = false; searchStore.close()"
                @keydown.enter="submit"
                @keydown.esc="searchStore.close()"
            />

            <button
                v-if="query"
                class="search__clear"
                type="button"
                aria-label="Очистить"
                @mousedown.prevent
                @click="clear"
            >
                ×
            </button>
        </div>

        <div
            v-if="showDropdown"
            class="search__dropdown"
            @mousedown.prevent
        >
            <ul
                v-if="searchStore.suggestions.dances.length"
                class="search__group"
            >
                <li class="search__group-title">Танцы</li>
                <li
                    v-for="dance in searchStore.suggestions.dances"
                    :key="dance.id"
                    class="search__item"
                    @click="goDance(dance.id)"
                >
                    <span class="search__item-name">{{ dance.name.ru }}</span>
                    <span class="search__item-meta">{{ dance.name.eng }}</span>
                </li>
            </ul>

            <ul
                v-if="searchStore.suggestions.moves.length"
                class="search__group"
            >
                <li class="search__group-title">Движения</li>
                <li
                    v-for="move in searchStore.suggestions.moves"
                    :key="move.id"
                    class="search__item"
                    @click="goMove(move.dance_id, move.slug)"
                >
                    <span class="search__item-name">{{ move.name.ru }}</span>
                    <span class="search__item-meta">
            {{ getDanceById(move.dance_id)?.name.ru }}
          </span>
                </li>
            </ul>

            <button
                class="search__all"
                type="button"
                @click="goAllResults"
            >
                Все результаты для «{{ searchStore.normalizedQuery }}»
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/formulas" as *;
@use "@/assets/styles/mixins" as *;

.search {
    position: relative;
    width: 100%;

    &__field {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 0 14px;
        background-color: #fff;
        border: 2px solid transparent;
        border-radius: 999px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &:focus-within {
            border-color: #595ccd;
            box-shadow: 0 0 0 4px rgba(89, 92, 205, 0.15);
        }
    }

    &__icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        fill: #777;
    }

    &__input {
        width: 100%;
        padding: 12px 0;
        border: none;
        outline: none;
        background: transparent;
        font: inherit;
        color: #222;

        &::-webkit-search-cancel-button {
            display: none;
        }
    }

    &__clear {
        border: none;
        background: none;
        font-size: 1.4rem;
        line-height: 1;
        color: #999;
        cursor: pointer;

        &:hover {
            color: #444;
        }
    }

    &--large &__field {
        padding: 0 20px;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

        &:focus-within {
            border-radius: 16px;
        }
    }

    &--large &__input {
        padding: 18px 0;
        font-size: 1.1rem;
    }

    &__dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        z-index: 30;
        max-height: 70vh;
        overflow-y: auto;
        padding: 8px;
        background-color: #fff;
        border-radius: 16px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
    }

    &__group {
        list-style: none;
        margin: 0;
        padding: 0;

        & + & {
            margin-top: 4px;
            padding-top: 4px;
            border-top: 1px solid #eee;
        }
    }

    &__group-title {
        padding: 6px 10px 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #999;
    }

    &__item {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        padding: 9px 10px;
        border-radius: 10px;
        cursor: pointer;

        &:hover {
            background-color: rgba(89, 92, 205, 0.1);
        }
    }

    &__item-name {
        color: #222;
    }

    &__item-meta {
        flex-shrink: 0;
        font-size: 0.85rem;
        color: #888;
    }

    &__all {
        display: block;
        width: 100%;
        margin-top: 4px;
        padding: 10px;
        border: none;
        border-radius: 10px;
        background: none;
        font: inherit;
        text-align: center;
        color: #595ccd;
        cursor: pointer;

        &:hover {
            background-color: rgba(89, 92, 205, 0.1);
        }
    }
}
</style>
