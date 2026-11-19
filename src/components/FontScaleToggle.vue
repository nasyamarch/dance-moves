<script setup lang="ts">
import {useTypographyStore} from '@/stores/typography'

const typography = useTypographyStore()
</script>

<template>
    <div
        class="font-scale"
        role="group"
        aria-label="Размер шрифта"
    >
        <button
            class="font-scale__btn"
            type="button"
            aria-label="Уменьшить шрифт"
            :title="`Уменьшить шрифт (сейчас ${typography.percent}%)`"
            :disabled="!typography.canDecrease"
            @click="typography.decrease()"
        >
            A−
        </button>

        <button
            class="font-scale__btn"
            type="button"
            aria-label="Увеличить шрифт"
            :title="`Увеличить шрифт (сейчас ${typography.percent}%)`"
            :disabled="!typography.canIncrease"
            @click="typography.increase()"
        >
            A+
        </button>
    </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.font-scale {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;

    &__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        padding: 0;
        border: 1px solid var(--border);
        border-radius: 50%;
        background-color: var(--bg-surface);
        font: inherit;
        font-size: 0.85rem;
        font-weight: 700;
        line-height: 1;
        color: var(--text-primary);
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.2s ease;

        &:disabled {
            opacity: 0.35;
            cursor: default;
        }

        &:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }

        @include hover {
            &:not(:disabled) {
                transform: scale(1.06);
                background-color: var(--bg-hover);
            }
        }
    }
}
</style>
