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
      {{ moveCount % 100 >= 11 && moveCount % 100 <= 14
            ? 'движений'
            : moveCount % 10 === 1
                ? 'движение'
                : moveCount % 10 >= 2 && moveCount % 10 <= 4
                    ? 'движения'
                    : 'движений'
            }}
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

    padding: clamp-f(12, 24);
    border-radius: 12px;
    border: 2px solid var(--border-soft);
    background: var(--gradient-dance-card);
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

    &:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }

    @include hover {
        border-color: var(--accent);
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
    }

    &:active {
        border-color: var(--accent);
        box-shadow: var(--shadow-md);
    }

    &__body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    &__title {
        margin: 0;
        font-size: fs(clamp-f(20, 28));
        text-align: center;
        color: var(--text-primary);
    }

    &__subtitle {
        margin: 0;
        font-size: fs(clamp-f(16, 20));
        color: var(--text-strong);
    }

    &__count {
        padding: 2px 8px;
        border-radius: 999px;
        background-color: var(--accent-soft-strong);
        font-size: fs(clamp-f(13, 15));
        font-weight: 600;
        color: var(--accent-strong);
    }
}
</style>
