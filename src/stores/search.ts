import {defineStore} from 'pinia'
import {computed, ref, watch} from 'vue'

import {suggestAll} from '@/data'
import type {SearchResults} from '@/types'

const STORAGE_KEY = 'dance-moves:query'

/**
 * Состояние глобального поиска: запрос, открытые подсказки.
 * Синхронизируется со строкой поиска в шапке и страницей /search.
 * Запрос сохраняется в localStorage и переживает перезагрузку страницы.
 */
export const useSearchStore = defineStore('search', () => {
    const query = ref(localStorage.getItem(STORAGE_KEY) ?? '')
    const isOpen = ref(false)

    watch(query, (value) => {
        if (value) {
            localStorage.setItem(STORAGE_KEY, value)
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    })

    const normalizedQuery = computed(() => query.value.trim())
    const hasQuery = computed(() => normalizedQuery.value.length >= 2)

    const suggestions = computed<SearchResults>(() =>
        hasQuery.value
            ? suggestAll(normalizedQuery.value, {dances: 4, moves: 6})
            : {dances: [], moves: []},
    )

    const suggestionsCount = computed(
        () => suggestions.value.dances.length + suggestions.value.moves.length,
    )

    const setQuery = (value: string) => {
        query.value = value
    }

    const open = () => {
        isOpen.value = true
    }

    const close = () => {
        isOpen.value = false
    }

    const reset = () => {
        query.value = ''
        isOpen.value = false
    }

    return {
        query,
        isOpen,
        normalizedQuery,
        hasQuery,
        suggestions,
        suggestionsCount,
        setQuery,
        open,
        close,
        reset,
    }
})
