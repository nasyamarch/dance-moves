<script setup lang="ts">
import type {Dance} from '@/types.ts'

const props = defineProps<{
    dance: Dance
    /** Количество движений в базе для этого танца. */
    moveCount: number
}>()

const emit = defineEmits<{
    select: [dance: Dance]
}>()
</script>

<template>
    <article
        class="dance-card"
        role="link"
        tabindex="0"
        @click="emit('select', props.dance)"
        @keydown.enter="emit('select', props.dance)"
    >
        <div class="dance-card__body">
            <h2 class="dance-card__title">
                {{ dance.name.ru }}
            </h2>
            <p class="dance-card__subtitle">
                {{ dance.name.eng }}
            </p>
        </div>

        <span class="dance-card__count">
      {{ moveCount }}
      {{ moveCount === 1 ? 'движение' : moveCount < 5 ? 'движения' : 'движений' }}
    </span>
    </article>
</template>

<style scoped lang="scss">
@use "@/assets/styles/formulas" as *;
@use "@/assets/styles/mixins" as *;

.dance-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    aspect-ratio: 1/0.6;
    padding: 24px;
    border-radius: 12px;
    border: 2px solid #e4e4e4;
    background-color: #fff;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

    &:focus-visible {
        outline: 2px solid #595ccd;
        outline-offset: 2px;
    }

    @media (max-width: 768px) {
        //min-height: 50px;
    }
    @media (max-width: 550px) {
        //min-height: 120px;
    }

    @media (hover: hover) and (pointer: fine) {
        &:hover {
            border-color: #595ccd;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
            transform: translateY(-1px);
        }
    }

    &__body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    &__title {
        margin: 0;
        font-size: clamp(1.25rem, 1.2rem + 0.256vw, 1.5rem);
        text-align: center;
        color: #222;
    }

    &__subtitle {
        margin: 0;
        font-size: 0.85rem;
        color: #888;
    }

    &__count {
        padding: 2px 8px;
        border-radius: 999px;
        background-color: rgba(89, 92, 205, 0.14);
        font-size: 0.7rem;
        font-weight: 600;
        color: #4b4eb5;
    }
}
</style>
