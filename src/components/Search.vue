<script setup lang="ts">
import {computed, nextTick, ref, watch} from 'vue'
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

/** Индекс подсвеченной (активной) опции в общем списке; -1 — нет активной. */
const activeIndex = ref(-1)

const query = computed({
    get: () => searchStore.query,
    set: (value: string) => searchStore.setQuery(value),
})

const isOpen = computed(() =>
    isFocused.value && searchStore.hasQuery && searchStore.isOpen,
)

const showDropdown = computed(() => isOpen.value && searchStore.suggestionsCount > 0)

/** Опция выпадашки: танец или движение — для выбора по Enter/клику. */
type Suggestion =
    | {kind: 'dance'; danceId: string}
    | {kind: 'move'; danceId: string; moveSlug: string}

type OptionItem = {
    index: number
    suggestion: Suggestion
    nameRu: string
    nameEng: string
    metaRu?: string
    metaEng?: string
}

/**
 * Группы опций с глобальными индексами: они же служат
 * разметкой listbox и источником для навигации стрелками.
 */
const optionGroups = computed(() => {
    const groups: Array<{title: string; items: OptionItem[]}> = []
    let index = 0

    if (searchStore.suggestions.dances.length) {
        groups.push({
            title: 'Танцы',
            items: searchStore.suggestions.dances.map((dance) => ({
                index: index++,
                suggestion: {kind: 'dance' as const, danceId: dance.id},
                nameRu: dance.name.ru,
                nameEng: dance.name.eng,
            })),
        })
    }

    if (searchStore.suggestions.moves.length) {
        groups.push({
            title: 'Движения',
            items: searchStore.suggestions.moves.map((move) => {
                const dance = getDanceById(move.dance_id)
                return {
                    index: index++,
                    suggestion: {
                        kind: 'move' as const,
                        danceId: move.dance_id,
                        moveSlug: move.slug,
                    },
                    nameRu: move.name.ru,
                    nameEng: move.name.eng,
                    metaRu: dance?.name.ru,
                    metaEng: dance?.name.eng,
                }
            }),
        })
    }

    return groups
})

const flatOptions = computed(() =>
    optionGroups.value.flatMap((group) => group.items),
)

/** id активной опции для aria-activedescendant. */
const activeDescendantId = computed(() =>
    showDropdown.value && activeIndex.value >= 0
        ? `search-option-${activeIndex.value}`
        : undefined,
)

// Новые подсказки — сбрасываем подсветку.
watch(() => searchStore.suggestionsCount, () => {
    activeIndex.value = -1
})

const scrollActiveIntoView = async () => {
    await nextTick()
    if (activeIndex.value < 0) return
    document
        .getElementById(`search-option-${activeIndex.value}`)
        ?.scrollIntoView({block: 'nearest'})
}

const closeSuggestions = () => {
    searchStore.close()
    activeIndex.value = -1
}

// Корень компонента и его фокусируемые элементы — чтобы закрывать
// выпадашку только когда фокус уходит совсем (Tab до кнопки её держит открытие).
const root = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const allButton = ref<HTMLButtonElement | null>(null)

const onFocusIn = () => {
    isFocused.value = true
    searchStore.open()
}

const onFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null
    // Фокус перешёл внутрь компонента (инпут или кнопка) — остаёмся открытыми.
    if (next && root.value?.contains(next)) return
    isFocused.value = false
    closeSuggestions()
}

const clear = () => {
    searchStore.reset()
    activeIndex.value = -1
}

const submit = () => {
    const q = searchStore.normalizedQuery
    if (!q) return
    closeSuggestions()
    router.push({name: 'search', query: {q}})
}

const goDance = (danceId: string) => {
    const dance = getDanceById(danceId)
    if (!dance) return
    closeSuggestions()
    router.push({name: 'dance', params: {danceSlug: dance.slug}})
}

const goMove = (danceId: string, moveSlug: string) => {
    const dance = getDanceById(danceId)
    if (!dance) return
    closeSuggestions()
    router.push({
        name: 'move',
        params: {danceSlug: dance.slug, moveSlug},
    })
}

const selectOption = (index: number) => {
    const item = flatOptions.value[index]
    if (!item) return
    if (item.suggestion.kind === 'dance') {
        goDance(item.suggestion.danceId)
    } else {
        goMove(item.suggestion.danceId, item.suggestion.moveSlug)
    }
}

/**
 * Клавиатура комбобокса. Цепочка: инпут → опции ↑/↓ → кнопка «Все результаты».
 * Enter — выбор, Escape — закрыть.
 */
const onKeydown = (event: KeyboardEvent) => {
    const count = flatOptions.value.length

    switch (event.key) {
        case 'ArrowDown':
            if (!showDropdown.value || !count) return
            event.preventDefault()
            if (activeIndex.value < count - 1) {
                activeIndex.value += 1
                scrollActiveIntoView()
            } else {
                // С последней опции — реальный фокус на кнопку действия.
                allButton.value?.focus()
            }
            break

        case 'ArrowUp':
            if (!showDropdown.value || !count) return
            event.preventDefault()
            if (activeIndex.value > 0) {
                activeIndex.value -= 1
                scrollActiveIntoView()
            } else if (activeIndex.value === 0) {
                activeIndex.value = -1
            } else {
                // Из состояния «нет активной опции» — замыкаем цепочку на кнопку.
                allButton.value?.focus()
            }
            break

        case 'Enter':
            if (activeIndex.value >= 0 && showDropdown.value) {
                event.preventDefault()
                selectOption(activeIndex.value)
            } else {
                submit()
            }
            break

        case 'Escape':
            closeSuggestions()
            break
    }
}

/** Клавиатура на кнопке «Все результаты»: ↑ — назад к опциям, Escape — закрыть. */
const onAllButtonKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
        case 'ArrowUp': {
            const count = flatOptions.value.length
            if (!count) return
            event.preventDefault()
            activeIndex.value = count - 1
            inputEl.value?.focus()
            scrollActiveIntoView()
            break
        }

        case 'ArrowDown':
            // Конец цепочки: остаёмся на кнопке, но гасим скролл страницы.
            event.preventDefault()
            break

        case 'Escape':
            event.preventDefault()
            closeSuggestions()
            inputEl.value?.focus()
            break
    }
}

const goAllResults = () => {
    submit()
}
</script>

<template>
    <div
        ref="root"
        class="search"
        :class="[`search--${variant}`]"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
    >
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
                ref="inputEl"
                v-model="query"
                class="search__input"
                type="search"
                role="combobox"
                :placeholder="placeholder"
                aria-label="Поиск"
                :aria-expanded="showDropdown"
                :aria-controls="showDropdown ? 'search-listbox' : undefined"
                aria-autocomplete="list"
                :aria-activedescendant="activeDescendantId"
                @keydown="onKeydown"
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
                id="search-listbox"
                class="search__list"
                role="listbox"
                aria-label="Результаты поиска"
            >
                <li
                    v-for="group in optionGroups"
                    :key="group.title"
                    class="search__group"
                    role="group"
                    :aria-labelledby="`search-group-title-${group.title}`"
                >
                    <div
                        class="search__group-title"
                        :id="`search-group-title-${group.title}`"
                    >
                        {{ group.title }}
                    </div>

                    <ul class="search__items">
                        <li
                            v-for="item in group.items"
                            :id="`search-option-${item.index}`"
                            :key="item.index"
                            class="search__item"
                            role="option"
                            :aria-selected="item.index === activeIndex"
                            @click="selectOption(item.index)"
                            @mouseenter="activeIndex = item.index"
                        >
                            <template v-if="item.suggestion.kind === 'dance'">
                                <span class="search__item-name">{{ item.nameRu }}</span>
                                <span class="search__item-meta">{{ item.nameEng }}</span>
                            </template>

                            <template v-else>
                                <span class="search__item-text">
                                    <span class="search__item-name">{{ item.nameRu }}</span>
                                    <span class="search__item-eng">{{ item.nameEng }}</span>
                                </span>
                                <span class="search__item-meta">
                                    <span>{{ item.metaRu }}</span>
                                    <span class="search__item-eng">{{ item.metaEng }}</span>
                                </span>
                            </template>
                        </li>
                    </ul>
                </li>
            </ul>

            <button
                ref="allButton"
                class="search__all"
                type="button"
                @click="goAllResults"
                @keydown="onAllButtonKeydown"
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
        background-color: var(--bg-surface);
        border: 2px solid transparent;
        border-radius: 999px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &:focus-within {
            border-color: var(--accent);
            box-shadow: 0 0 0 4px var(--accent-ring);
        }
    }

    &__icon {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        fill: var(--text-muted);
    }

    &__input {
        width: 100%;
        padding: 12px 0;
        border: none;
        outline: none;
        background: transparent;
        font: inherit;
        color: var(--text-primary);

        &::-webkit-search-cancel-button {
            display: none;
        }
    }

    &__clear {
        border: none;
        background: none;
        font-size: 1.4rem;
        line-height: 1;
        color: var(--text-faint);
        cursor: pointer;

        &:hover {
            color: var(--text-strong);
        }
    }

    &--large &__field {
        padding: 0 clamp-f(12, 20);
        border-radius: 16px;
        box-shadow: var(--shadow-sm);

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
        background-color: var(--bg-surface);
        border-radius: 16px;
        box-shadow: var(--shadow-lg);
    }

    &__list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    &__items {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    &__group {
        list-style: none;
        margin: 0;
        padding: 0;

        & + & {
            margin-top: 4px;
            padding-top: 4px;
            border-top: 1px solid var(--border-divider);
        }
    }

    &__group-title {
        padding: 6px 10px 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--text-faint);
    }

    &__item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding: 9px 10px;
        border-radius: 10px;
        cursor: pointer;

        &:hover {
            background-color: var(--accent-soft);
        }

        // Активная опция при навигации с клавиатуры (↑/↓).
        &[aria-selected='true'] {
            background-color: var(--accent-soft);
        }
    }

    &__item-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        text-align: left;
    }

    &__item-name {
        color: var(--text-primary);
    }

    &__item-meta {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex-shrink: 0;
        text-align: right;
        font-size: 0.85rem;
        color: var(--text-subtle);
    }

    &__item-eng {
        font-size: 0.85rem;
        color: var(--text-subtle);
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
        color: var(--accent-text);
        cursor: pointer;

        &:hover {
            background-color: var(--accent-soft);
        }
    }
}
</style>
