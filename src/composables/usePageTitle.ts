import {watchEffect} from 'vue'

/**
 * Устанавливает document.title при (ре)активном изменении значения.
 * Вызывать в setup каждой страницы, например:
 *   usePageTitle(() => dance.value ? `${dance.value.name.ru} — Dance Moves` : '…')
 */
export const usePageTitle = (title: () => string) => {
    watchEffect(() => {
        document.title = title()
    })
}
