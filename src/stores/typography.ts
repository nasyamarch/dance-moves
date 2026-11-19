import {defineStore} from 'pinia'
import {computed, ref, watch} from 'vue'

export type FontScale = 1 | 1.25 | 1.5

const STORAGE_KEY = 'dance-moves:font-scale'
const STEPS: FontScale[] = [1, 1.25, 1.5]

const readStoredScale = (): FontScale => {
    const value = Number(localStorage.getItem(STORAGE_KEY))
    return (STEPS as number[]).includes(value) ? (value as FontScale) : 1
}

/**
 * Масштаб шрифта для слабовидящих: 100% → 125% → 150%.
 * Значение кладётся в CSS-переменную --font-scale на <html>
 * и сохраняется в localStorage.
 */
export const useTypographyStore = defineStore('typography', () => {
    const scale = ref<FontScale>(readStoredScale())

    const stepIndex = computed(() => STEPS.indexOf(scale.value))
    const percent = computed(() => Math.round(scale.value * 100))
    const canDecrease = computed(() => stepIndex.value > 0)
    const canIncrease = computed(() => stepIndex.value < STEPS.length - 1)

    const apply = (value: FontScale) => {
        document.documentElement.style.setProperty('--font-scale', String(value))
        localStorage.setItem(STORAGE_KEY, String(value))
    }

    watch(scale, apply)
    apply(scale.value)

    const increase = () => {
        const next = STEPS[stepIndex.value + 1]
        if (next !== undefined) scale.value = next
    }

    const decrease = () => {
        const previous = STEPS[stepIndex.value - 1]
        if (previous !== undefined) scale.value = previous
    }

    return {
        scale,
        percent,
        canDecrease,
        canIncrease,
        increase,
        decrease,
    }
})
