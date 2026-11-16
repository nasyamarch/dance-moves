import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { suggestAll } from '@/data'
import type { SearchResults } from '@/types'

/**
 * Состояние глобального поиска: запрос, открытые подсказки.
 * Синхронизируется со строкой поиска в шапке и страницей /search.
 */
export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const isOpen = ref(false)

  const normalizedQuery = computed(() => query.value.trim())
  const hasQuery = computed(() => normalizedQuery.value.length >= 2)

  const suggestions = computed<SearchResults>(() =>
    hasQuery.value
      ? suggestAll(normalizedQuery.value, { dances: 4, moves: 6 })
      : { dances: [], moves: [] },
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
