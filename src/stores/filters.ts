import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import type { SortMode } from '@/types'

/** Что показывать на странице результатов. */
export type ResultType = 'all' | 'dances' | 'moves'

const STORAGE_KEY = 'dance-moves:filters'

const SORT_MODES: SortMode[] = ['level', 'name-asc', 'name-desc', 'popular']

interface SavedFilters {
  resultType?: string
  danceSlug?: string
  levelTagId?: number | null
  sortMode?: string
}

/** Восстановление из localStorage с защитой от мусора в данных. */
const loadSaved = (): SavedFilters => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedFilters) : {}
  } catch {
    return {}
  }
}

const saved = loadSaved()

/**
 * Фильтры и сортировка страницы результатов поиска.
 * Сохраняются в localStorage и переживают перезагрузку страницы.
 */
export const useFiltersStore = defineStore('filters', () => {
  const resultType = ref<ResultType>(
    saved.resultType === 'dances' || saved.resultType === 'moves'
      ? saved.resultType
      : 'all',
  )
  /** Slug танца или '' — «все танцы». */
  const danceSlug = ref(
    typeof saved.danceSlug === 'string' ? saved.danceSlug : '',
  )
  /** ID тега уровня или null — «любой уровень». */
  const levelTagId = ref<number | null>(
    typeof saved.levelTagId === 'number' ? saved.levelTagId : null,
  )
  const sortMode = ref<SortMode>(
    SORT_MODES.includes(saved.sortMode as SortMode)
      ? (saved.sortMode as SortMode)
      : 'level',
  )

  watch(
    [resultType, danceSlug, levelTagId, sortMode],
    ([type, slug, level, sort]) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          resultType: type,
          danceSlug: slug,
          levelTagId: level,
          sortMode: sort,
        }),
      )
    },
  )

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
