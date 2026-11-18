<script setup lang="ts">
import {computed} from 'vue'

import {getDanceById, getLevelTag, getTagsForMove, getYouTubeThumb} from '@/data'
import type {Move} from '@/types'

const props = withDefaults(
    defineProps<{
        move: Move
        /** Показывать название танца (нужно в результатах поиска и на главной). */
        showDance?: boolean
    }>(),
    {
        showDance: false,
    },
)

const emit = defineEmits<{
    select: [move: Move]
}>()

const levelTag = computed(() => getLevelTag(props.move))
const typeTags = computed(() =>
    getTagsForMove(props.move).filter((tag) => tag.category === 'type'),
)
const dance = computed(() => getDanceById(props.move.dance_id))
const thumbnail = computed(() => getYouTubeThumb(props.move.video_url))
</script>

<template>
    <article
        class="move-card"
        role="link"
        tabindex="0"
        @click="emit('select', move)"
        @keydown.enter="emit('select', move)"
    >
        <div
            v-if="thumbnail"
            class="move-card__preview"
        >
            <img
                :src="thumbnail"
                :alt="move.name.ru"
                loading="lazy"
            />
            <span class="move-card__play" aria-hidden="true">▶</span>
        </div>
        <div
            v-else
            class="move-card__preview move-card__preview--empty"
            aria-hidden="true"
        >
            ♪
        </div>

        <div class="move-card__info">
            <div class="move-card__tags">
        <span
            v-if="levelTag"
            class="move-card__tag move-card__tag--level"
        >
          {{ levelTag.name.ru }}
        </span>
                <span
                    v-for="tag in typeTags"
                    :key="tag.id"
                    class="move-card__tag"
                >
          {{ tag.name.ru }}
        </span>
                <span
                    v-if="showDance && dance"
                    class="move-card__dance"
                >
          {{ dance.name.ru }}
        </span>
                <span
                    v-if="showDance && dance"
                    class="move-card__dance-eng"
                >
          {{ dance.name.eng }}
        </span>
            </div>

            <h3 class="move-card__title">{{ move.name.ru }}</h3>
            <p class="move-card__subtitle">{{ move.name.eng }}</p>
        </div>

        <div class="move-card__meta">
      <span
          class="move-card__likes"
          :title="'Лайки появятся позже'"
      >
        ♥ {{ move.likes_count }}
      </span>
            <span class="move-card__arrow" aria-hidden="true">→</span>
        </div>
    </article>
</template>

<style scoped lang="scss">
@use "@/assets/styles/formulas" as *;
@use "@/assets/styles/mixins" as *;

.move-card {
    display: flex;
    align-items: center;
    gap: 16px;

    padding: 12px 16px;
    border-radius: 12px;
    border: 2px solid #e4e4e4;
    background-color: #fff;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

    &:focus-visible {
        outline: 2px solid #595ccd;
        outline-offset: 2px;
    }

    @include hover {
        border-color: #595ccd;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        transform: translateY(-1px);
    }

    &__preview {
        position: relative;
        flex-shrink: 0;
        width: 120px;
        height: 70px;
        border-radius: 8px;
        overflow: hidden;
        background-color: #ececec;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        &--empty {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            color: #aaa;
        }

        @media (max-width: 550px) {
            width: 96px;
            height: 58px;
        }
    }

    &__play {
        position: absolute;
        left: 8px;
        bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        font-size: 0.6rem;
        padding-left: 2px;
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
        flex: 1;
    }

    &__tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: clamp-f(6, 16);
    }

    &__tag {
        padding: 2px 8px;
        border-radius: 999px;
        background-color: #f0f0f5;
        font-size: clamp-f(13, 15);
        font-weight: 600;
        color: #666;

        &--level {
            background-color: rgba(89, 92, 205, 0.14);
            color: #4b4eb5;
        }
    }

    &__dance {
        font-size: clamp-f(14, 18);
        color: #222;
    }

    &__dance-eng {
        font-size: clamp-f(14, 18);
        color: #999;
    }

    &__title {
        margin: 0;
        font-size: clamp-f(16, 20);
        color: #222;
    }

    &__subtitle {
        margin: 0;
        font-size: clamp-f(14, 18);
        color: #888;
    }

    &__meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        flex-shrink: 0;
    }

    &__likes {
        font-size: 0.8rem;
        color: #b0b0b0;
    }

    &__arrow {
        color: #595ccd;
        font-size: 1.1rem;
    }

    @media (max-width: 550px) {
        padding: 10px 12px;
        gap: 12px;

        &__meta {
            display: none;
        }
    }
}
</style>
