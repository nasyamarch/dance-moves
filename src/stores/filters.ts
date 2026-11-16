import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { SortMode } from '@/types'

/** Что показывать на странице результатов. */
export type ResultType = 'all' | 'dances' | 'moves'

/**
 * Фильтры и сортировка страницы результатов поиска.
 * Сбрасываются при каждом заходе на страницу.
 */
export const useFiltersStore = defineStore('filters', () => {
  const resultType = ref<ResultType>('all')
  /** Slug танца или '' — «все танцы». */
  const danceSlug = ref('')
  /** ID тега уровня или null — «любой уровень». */
  const levelTagId = ref<number | null>(null)
  const sortMode = ref<SortMode>('level')

  const reset = () => {
    resultType.value = 'all'
    danceSlug.value = ''
    levelTagId.value = null
    sortMode.value = 'level'
  }

  return {
    resultType,
    danceSlug,
    levelTagId,
    sortMode,
    reset,
  }
})
