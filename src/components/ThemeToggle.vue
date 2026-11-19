<script setup lang="ts">
import {useThemeStore} from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
    <div
        class="theme-toggle"
        role="group"
        aria-label="Тема оформления"
    >
        <button
            class="theme-toggle__btn theme-toggle__btn--sun"
            :class="{ 'is-active': !themeStore.isDark }"
            type="button"
            title="Светлая тема"
            aria-label="Светлая тема"
            :aria-pressed="!themeStore.isDark"
            @click="themeStore.setTheme('light')"
        >
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="4.2"
                    fill="#f5b43c"
                />
                <path
                    d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.35 5.35l1.85 1.85M16.8 16.8l1.85 1.85M18.65 5.35L16.8 7.2M7.2 16.8l-1.85 1.85"
                    stroke="#f5b43c"
                    stroke-width="2"
                    stroke-linecap="round"
                    fill="none"
                />
            </svg>
        </button>

        <button
            class="theme-toggle__btn theme-toggle__btn--moon"
            :class="{ 'is-active': themeStore.isDark }"
            type="button"
            title="Тёмная тема"
            aria-label="Тёмная тема"
            :aria-pressed="themeStore.isDark"
            @click="themeStore.setTheme('dark')"
        >
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M20.6 14.9A8.9 8.9 0 0 1 9.1 3.4 8.9 8.9 0 1 0 20.6 14.9Z"
                    fill="#ffffff"
                />
            </svg>
        </button>
    </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.theme-toggle {
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
        border-radius: 50%;
        cursor: pointer;
        opacity: 0.55;
        transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

        svg {
            width: 20px;
            height: 20px;
        }

        &--sun {
            background-color: #ffffff;
            border: 1px solid var(--border);
        }

        &--moon {
            background-color: #222222;
            border: 1px solid rgba(255, 255, 255, 0.16);
        }

        &.is-active {
            opacity: 1;
            box-shadow: 0 0 0 2px var(--accent);
        }

        &:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }

        @include hover {
            opacity: 1;
            transform: scale(1.06);
        }
    }
}
</style>
