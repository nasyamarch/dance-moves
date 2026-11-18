<script setup lang="ts">
import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'

import MoveCard from '@/components/MoveCard.vue'
import {
    getDanceById,
    getDanceBySlug,
    getLevelTag,
    getMoveBySlugs,
    getMovesByIds,
    getTagsForMove,
    getYouTubeEmbedUrl,
} from '@/data'
import type {Move} from '@/types'

const route = useRoute()
const router = useRouter()

const danceSlug = computed(() => String(route.params.danceSlug))
const moveSlug = computed(() => String(route.params.moveSlug))

const dance = computed(() => getDanceBySlug(danceSlug.value))
const move = computed<Move | undefined>(() =>
    dance.value ? getMoveBySlugs(danceSlug.value, moveSlug.value) : undefined,
)

const levelTag = computed(() => (move.value ? getLevelTag(move.value) : undefined))
const typeTags = computed(() =>
    move.value
        ? getTagsForMove(move.value).filter((tag) => tag.category === 'type')
        : [],
)

const embedUrl = computed(() =>
    move.value ? getYouTubeEmbedUrl(move.value.video_url) : null,
)

const relatedVideos = computed(() => move.value?.related_video_urls ?? [])

const relatedMoves = computed(() =>
    move.value ? getMovesByIds(move.value.related_move_ids) : [],
)

const relatedLinks = computed(() => move.value?.related_links ?? [])

const openRelatedMove = (relatedMove: Move) => {
    const relatedDance = getDanceById(relatedMove.dance_id)
    if (!relatedDance) return
    router.push({
        name: 'move',
        params: {
            danceSlug: relatedDance.slug,
            moveSlug: relatedMove.slug,
        },
    })
}

/** Короткое доменное имя для подписи к внешней ссылке. */
const hostOf = (url: string): string => {
    try {
        return new URL(url).hostname.replace(/^www\./, '')
    } catch {
        return 'ссылка'
    }
}
</script>

<template>
    <section class="move-page">
        <template v-if="dance && move">
            <nav class="move-page__breadcrumbs">
                <RouterLink :to="{ name: 'home' }">Главная</RouterLink>
                <span aria-hidden="true">/</span>
                <RouterLink
                    :to="{ name: 'dance', params: { danceSlug: dance.slug } }"
                >
                    {{ dance.name.ru }}
                </RouterLink>
                <span aria-hidden="true">/</span>
                <span>{{ move.name.ru }}</span>
            </nav>

            <header class="move-page__header">
                <div class="move-page__tags">
          <span
              v-if="levelTag"
              class="move-page__tag move-page__tag--level"
          >
            {{ levelTag.name.ru }}
          </span>
                    <span
                        v-for="tag in typeTags"
                        :key="tag.id"
                        class="move-page__tag"
                    >
            {{ tag.name.ru }}
          </span>
                    <RouterLink
                        class="move-page__tag move-page__tag--dance"
                        :to="{ name: 'dance', params: { danceSlug: dance.slug } }"
                    >
                        {{ dance.name.ru }}
                    </RouterLink>
                </div>

                <h1 class="move-page__title">{{ move.name.ru }}</h1>
                <p class="move-page__subtitle">{{ move.name.eng }}</p>
            </header>

            <p class="move-page__description">{{ move.description.ru }}</p>

            <!-- Встроенный плеер: видео не хранится у нас, только ссылка -->
            <div
                v-if="embedUrl"
                class="move-page__player"
            >
                <iframe
                    :key="move.id"
                    :src="embedUrl"
                    :title="`Видео: ${move.name.ru}`"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                />
            </div>
            <p
                v-else
                class="move-page__player-fallback"
            >
                Видео для этого движения пока недоступно во встроенном плеере.
            </p>

            <!-- Другие видео: открываются на стороннем сайте -->
            <section
                v-if="relatedVideos.length"
                class="move-page__block"
            >
                <h2 class="move-page__block-title">Другие видео</h2>
                <ul class="move-page__links">
                    <li
                        v-for="url in relatedVideos"
                        :key="url"
                    >
                        <a
                            :href="url"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {{ hostOf(url) }} ↗
                        </a>
                    </li>
                </ul>
            </section>

            <!-- Связанные движения -->
            <section
                v-if="relatedMoves.length"
                class="move-page__block"
            >
                <h2 class="move-page__block-title">Связанные движения</h2>
                <div class="move-page__related">
                    <MoveCard
                        v-for="related in relatedMoves"
                        :key="related.id"
                        :move="related"
                        show-dance
                        @select="openRelatedMove"
                    />
                </div>
            </section>

            <!-- Статьи и дополнительные материалы -->
            <section
                v-if="relatedLinks.length"
                class="move-page__block"
            >
                <h2 class="move-page__block-title">Дополнительные материалы</h2>
                <ul class="move-page__links">
                    <li
                        v-for="link in relatedLinks"
                        :key="link.url"
                    >
                        <a
                            :href="link.url"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {{ link.title.ru }} ↗
                        </a>
                    </li>
                </ul>
            </section>

            <!-- Заглушки под будущие лайки и комментарии -->
            <section class="move-page__block move-page__feedback">
                <div class="move-page__likes">
                    <button
                        class="move-page__like"
                        type="button"
                        disabled
                        title="Лайки появятся позже"
                    >
                        ♥ {{ move.likes_count }}
                    </button>
                    <span class="move-page__hint">лайков — скоро можно будет ставить свои</span>
                </div>

                <div class="move-page__comments">
                    <h2 class="move-page__block-title">Комментарии</h2>
                    <p class="move-page__hint">
                        Здесь можно будет оставить мнение или корректировку к описанию —
                        комментарии и личный кабинет появятся позже.
                    </p>
                </div>
            </section>
        </template>

        <template v-else>
            <p class="move-page__empty">
                Движение не найдено.
                <RouterLink :to="{ name: 'home' }">Вернуться на главную</RouterLink>
            </p>
        </template>
    </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/formulas" as *;
@use "@/assets/styles/mixins" as *;

.move-page {
    width: 100%;
    max-width: 900px;
    padding: clamp-f(16, 24) clamp-f(16, 48) clamp-f(48, 64);
    align-self: flex-start;

    &__breadcrumbs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
        font-size: 0.9rem;
        color: #888;

        a {
            color: #595ccd;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    &__header {
        margin-bottom: 16px;
    }

    &__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
    }

    &__tag {
        padding: 4px 12px;
        border-radius: 999px;
        background-color: #f0f0f5;
        font-size: 0.8rem;
        font-weight: 600;
        color: #666;
        text-decoration: none;

        &--level {
            background-color: rgba(89, 92, 205, 0.14);
            color: #4b4eb5;
        }

        &--dance:hover {
            background-color: rgba(89, 92, 205, 0.22);
        }
    }

    &__title {
        margin: 0;
        font-size: clamp(1.6rem, 1.3rem + 1.2vw, 2.4rem);
        color: #222;
    }

    &__subtitle {
        margin: 4px 0 0;
        color: #888;
    }

    &__description {
        margin: 0 0 24px;
        font-size: 1.05rem;
        line-height: 1.6;
        color: #444;
    }

    &__player {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        margin-bottom: 24px;
        border-radius: 16px;
        overflow: hidden;
        background-color: #000;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);

        iframe {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
    }

    &__player-fallback {
        margin: 0 0 24px;
        padding: 24px;
        border-radius: 16px;
        background-color: #fff;
        text-align: center;
        color: #777;
    }

    &__block {
        margin-bottom: 32px;
    }

    &__block-title {
        margin: 0 0 12px;
        font-size: 1.2rem;
        color: #222;
    }

    &__links {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 0;
        padding: 0;
        list-style: none;

        a {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #595ccd;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    &__related {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__feedback {
        padding-top: 24px;
        border-top: 1px solid #e0e0e0;
    }

    &__likes {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
    }

    &__like {
        padding: 10px 18px;
        border: 1px solid #ddd;
        border-radius: 999px;
        background-color: #fff;
        font: inherit;
        font-weight: 600;
        color: #b0b0b0;
        cursor: not-allowed;
    }

    &__hint {
        margin: 0;
        font-size: 0.9rem;
        color: #999;
    }

    &__empty {
        padding: 48px 0;
        text-align: center;
        color: #777;

        a {
            color: #595ccd;
        }
    }
}
</style>
