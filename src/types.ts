/** Язык интерфейса/контента. В будущем расширяется новыми языками. */
export type Lang = 'ru' | 'eng'

/** Многоязычный текст: ключ — код языка. */
export type LocalizedText = Record<Lang, string>

export interface Dance {
  id: string
  slug: string
  name: LocalizedText
}

export interface RelatedLink {
  title: LocalizedText
  url: string
}

export interface Move {
  id: string
  /** ID танца, которому принадлежит движение. */
  dance_id: string
  slug: string
  name: LocalizedText
  description: LocalizedText
  /** Основное видео — воспроизводится во встроенном плеере. */
  video_url: string
  /** Другие видео по теме — открываются на стороннем сайте. */
  related_video_urls: string[]
  /** ID связанных движений. */
  related_move_ids: string[]
  /** Статьи и дополнительные материалы. */
  related_links: RelatedLink[]
  /** ID тегов: уровень сложности, тип и т.п. */
  tag_ids: number[]
  /** Заглушка для сортировки по популярности, позже наполняется лайками. */
  likes_count: number
  /** Порядок внутри списка танца. */
  order: number
}

export type TagCategory = 'level' | 'type'

export interface Tag {
  id: string
  category: TagCategory
  /** Порядок/значение внутри категории (для уровня: 1 — новичок, 4 — профи). */
  order: number
  name: LocalizedText
}

/** Режим сортировки списка движений. */
export type SortMode = 'level' | 'name-asc' | 'name-desc' | 'popular'

/** Результат поиска: танцы и движения отдельными списками. */
export interface SearchResults {
  dances: Dance[]
  moves: Move[]
}
