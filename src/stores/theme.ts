import {defineStore} from 'pinia'
import {computed, ref, watch} from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'dance-moves:theme'
const TRANSITION_CLASS = 'theme-anim'
const TRANSITION_MS = 300

const readStoredTheme = (): Theme | null => {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
}

const readSystemTheme = (): Theme =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const applyTheme = (theme: Theme) => {
    document.documentElement.dataset.theme = theme
}

/**
 * Тема оформления: светлая/тёмная.
 * Выбор пользователя сохраняется в localStorage; пока выбора не было —
 * используется системная тема (prefers-color-scheme) и можно за ней следить.
 */
export const useThemeStore = defineStore('theme', () => {
    const stored = ref<Theme | null>(readStoredTheme())
    const theme = ref<Theme>(stored.value ?? readSystemTheme())
    const isDark = computed(() => theme.value === 'dark')

    /** Кратковременная анимация смены цветов при переключении. */
    const animate = () => {
        const root = document.documentElement
        root.classList.add(TRANSITION_CLASS)
        window.setTimeout(
            () => root.classList.remove(TRANSITION_CLASS),
            TRANSITION_MS,
        )
    }

    const setTheme = (value: Theme) => {
        if (theme.value === value) return
        animate()
        stored.value = value
        theme.value = value
    }

    const toggle = () => setTheme(theme.value === 'dark' ? 'light' : 'dark')

    watch(theme, (value) => {
        applyTheme(value)
        if (stored.value) localStorage.setItem(STORAGE_KEY, value)
    })

    // Пока тема не выбрана вручную — следуем за системной.
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = (event: MediaQueryListEvent) => {
        if (!stored.value) theme.value = event.matches ? 'dark' : 'light'
    }
    media.addEventListener('change', onSystemChange)

    // Применяем тему сразу при инициализации стора.
    applyTheme(theme.value)

    return {
        theme,
        isDark,
        setTheme,
        toggle,
    }
})
