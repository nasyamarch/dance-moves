import rawData from './data.json'

import type {
  Dance,
  Move,
  SearchResults,
  SortMode,
  Tag,
} from '@/types'

/**
 * Единая точка доступа к базе данных.
 * Все страницы и компоненты работают только через этот модуль —
 * при появлении бэкенда меняется лишь его содержимое (fetch вместо JSON).
 */
interface Database {
  dance: Record<string, Dance>
  move: Record<string, Move>
  tag: Record<string, Tag>
}

const db = rawData as unknown as Database

const normalize = (value: string): string => value.trim().toLowerCase()

/* ---------------------------------------------------- Танцы */

export const getAllDances = (): Dance[] => Object.values(db.dance)

export const getDanceById = (id: string): Dance | undefined => db.dance[id]

export const getDanceBySlug = (slug: string): Dance | undefined =>
  Object.values(db.dance).find((dance) => dance.slug === slug)

/* ---------------------------------------------------- Теги */

export const getTagById = (id: number): Tag | undefined => db.tag[String(id)]

export const getAllTags = (): Tag[] => Object.values(db.tag)

export const getLevelTags = (): Tag[] =>
  getAllTags()
    .filter((tag) => tag.category === 'level')
    .sort((a, b) => a.order - b.order)

export const getTypeTags = (): Tag[] =>
  getAllTags()
    .filter((tag) => tag.category === 'type')
    .sort((a, b) => a.order - b.order)

/** Теги конкретного движения. */
export const getTagsForMove = (move: Move): Tag[] =>
  move.tag_ids
    .map((tagId) => getTagById(tagId))
    .filter((tag): tag is Tag => tag !== undefined)

/** Уровень сложности движения (тег категории level с наименьшим order). */
export const getLevelTag = (move: Move): Tag | undefined =>
  getTagsForMove(move)
    .filter((tag) => tag.category === 'level')
    .sort((a, b) => a.order - b.order)[0]

/* ---------------------------------------------------- Движения */

const byOrder = (a: Move, b: Move): number => a.order - b.order

export const getAllMoves = (): Move[] => Object.values(db.move)

/** Движения танца, отсортированные по порядку добавления. */
export const getMovesByDance = (danceId: string): Move[] =>
  getAllMoves()
    .filter((move) => move.dance_id === danceId)
    .sort(byOrder)

export const getMoveById = (id: string): Move | undefined => db.move[id]

export const getMoveBySlug = (slug: string): Move | undefined =>
  Object.values(db.move).find((move) => move.slug === slug)

/** Движение в пределах танца (для URL /dance/:danceSlug/:moveSlug). */
export const getMoveBySlugs = (
  danceSlug: string,
  moveSlug: string,
): Move | undefined => {
  const dance = getDanceBySlug(danceSlug)
  if (!dance) return undefined
  return getMovesByDance(dance.id).find((move) => move.slug === moveSlug)
}

export const getMovesByIds = (ids: string[]): Move[] =>
  ids
    .map((id) => getMoveById(id))
    .filter((move): move is Move => move !== undefined)

/** Самые популярные движения (по счётчику лайков). */
export const getPopularMoves = (limit = 5): Move[] =>
  [...getAllMoves()]
    .sort((a, b) => b.likes_count - a.likes_count)
    .slice(0, limit)

/* ---------------------------------------------------- Сортировка */

const byLevel = (a: Move, b: Move): number => {
  const levelA = getLevelTag(a)?.order ?? Number.MAX_SAFE_INTEGER
  const levelB = getLevelTag(b)?.order ?? Number.MAX_SAFE_INTEGER
  if (levelA !== levelB) return levelA - levelB
  return byOrder(a, b)
}

const byName =
  (direction: 'asc' | 'desc') =>
  (a: Move, b: Move): number => {
    const nameA = normalize(a.name.ru)
    const nameB = normalize(b.name.ru)
    const result = nameA.localeCompare(nameB, 'ru')
    return direction === 'asc' ? result : -result
  }

export const sortMoves = (moves: Move[], mode: SortMode): Move[] => {
  const sorted = [...moves]
  switch (mode) {
    case 'level':
      return sorted.sort(byLevel)
    case 'name-asc':
      return sorted.sort(byName('asc'))
    case 'name-desc':
      return sorted.sort(byName('desc'))
    case 'popular':
      return sorted.sort((a, b) => b.likes_count - a.likes_count || byOrder(a, b))
  }
}

/* ---------------------------------------------------- Поиск */

const matchesQuery = (text: string, query: string): boolean =>
  normalize(text).includes(query)

/**
 * Поиск по названиям движений (ru/eng), названиям танцев и тегам.
 * Название танца как тег притягивает все его движения.
 */
export const searchAll = (rawQuery: string): SearchResults => {
  const query = normalize(rawQuery)
  if (!query) return { dances: [], moves: [] }

  const dances = getAllDances().filter(
    (dance) =>
      matchesQuery(dance.name.ru, query) ||
      matchesQuery(dance.name.eng, query) ||
      matchesQuery(dance.slug, query),
  )

  const matchedTagIds = getAllTags()
    .filter(
      (tag) =>
        matchesQuery(tag.name.ru, query) || matchesQuery(tag.name.eng, query),
    )
    .map((tag) => Number(tag.id))

  const danceIdsByName = new Set(dances.map((dance) => dance.id))

  const moves = getAllMoves().filter((move) => {
    const byName =
      matchesQuery(move.name.ru, query) || matchesQuery(move.name.eng, query)
    const byTag = move.tag_ids.some((tagId) => matchedTagIds.includes(tagId))
    // Движения принадлежат найденному танцу, даже если название не совпало.
    const byDance = danceIdsByName.has(move.dance_id)
    return byName || byTag || byDance
  })

  return { dances, moves }
}

/** Подсказки для автокомплита: танцы и движения, отсортированные по популярности. */
export const suggestAll = (
  rawQuery: string,
  limits: { dances: number; moves: number },
): SearchResults => {
  const { dances, moves } = searchAll(rawQuery)
  return {
    dances: dances.slice(0, limits.dances),
    moves: [...moves]
      .sort((a, b) => b.likes_count - a.likes_count)
      .slice(0, limits.moves),
  }
}

/* ---------------------------------------------------- YouTube */

/**
 * ID видео из ссылки YouTube: watch?v=, youtu.be/, /shorts/, /embed/.
 * Возвращает null, если ссылка не является видео YouTube.
 */
export const getYouTubeId = (url: string): string | null => {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return parsed.pathname.slice(1).split('/')[0] || null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const fromQuery = parsed.searchParams.get('v')
      if (fromQuery) return fromQuery
      const match = parsed.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/)
      if (match) return match[1] ?? null
    }

    return null
  } catch {
    return null
  }
}

/** Миниатюра видео с CDN YouTube (файлы у нас не хранятся). */
export const getYouTubeThumb = (url: string): string | null => {
  const id = getYouTubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null
}

/** Ссылка для встраивания видео в iframe-плеер. */
export const getYouTubeEmbedUrl = (url: string): string | null => {
  const id = getYouTubeId(url)
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
    : null
}
