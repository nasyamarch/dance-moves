<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {useRouter} from 'vue-router'

import Search from '@/components/Search.vue'
import {getAllDances} from '@/data'
import {useSearchStore} from '@/stores/search'

const router = useRouter()
const searchStore = useSearchStore()

const dances = getAllDances()

const isNavOpen = ref(false)
const isDropdownOpen = ref(false)

const toggleNav = () => {
    isNavOpen.value = !isNavOpen.value
    isDropdownOpen.value = isNavOpen.value
    if (isNavOpen.value) searchStore.close()
}

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
}

const closeAll = () => {
    isNavOpen.value = false
    isDropdownOpen.value = false
}

const goToDance = (slug: string) => {
    closeAll()
    searchStore.reset()
    router.push({name: 'dance', params: {danceSlug: slug}})
}

const handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.header__nav') && !target.closest('.header__burger')) {
        isDropdownOpen.value = false
    }
    if (!target.closest('.header')) {
        isNavOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', handleDocumentClick))
onUnmounted(() => document.removeEventListener('click', handleDocumentClick))
</script>

<template>
    <header class="header">
        <RouterLink
            class="header__logo"
            :to="{ name: 'home' }"
            @click="closeAll"
        >
            dance<span>moves</span>
        </RouterLink>

        <div class="header__search">
            <Search variant="header"/>
        </div>

        <nav
            class="header__nav"
            :class="{ 'is-active': isNavOpen }"
        >
            <button
                class="header__nav-toggle"
                type="button"
                @click="toggleDropdown"
            >
                Танцы
                <span class="header__nav-arrow" :class="{ 'is-open': isDropdownOpen }">▾</span>
            </button>

            <ul
                v-if="isDropdownOpen"
                class="header__nav-list"
            >
                <li
                    v-for="dance in dances"
                    :key="dance.id"
                >
                    <RouterLink
                        class="header__nav-link"
                        :to="{ name: 'dance', params: { danceSlug: dance.slug } }"
                        @click="goToDance(dance.slug)"
                    >
                        {{ dance.name.ru }}
                        <span class="header__nav-link-meta">{{ dance.name.eng }}</span>
                    </RouterLink>
                </li>
            </ul>
        </nav>

        <div
            class="header__burger"
            :class="{ 'is-active': isNavOpen }"
            role="button"
            aria-label="Меню"
            @click="toggleNav"
        >
            <span></span>
            <span></span>
            <span></span>
        </div>
    </header>
</template>

<style lang="scss">
@use "@/assets/styles/formulas" as *;
@use "@/assets/styles/mixins" as *;

.header {
    position: relative;
    z-index: 40;
    display: flex;
    align-items: center;
    gap: clamp-f(12, 24);
    width: 100%;
    max-width: 1264px;
    padding: clamp-f(16, 20) clamp-f(16, 48);

    @media (max-width: 768px) {
        flex-wrap: wrap;
        padding: 16px;
    }

    &__logo {
        flex-shrink: 0;
        font-size: 1.35rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: #222;
        text-decoration: none;

        span {
            color: #595ccd;
        }
    }

    &__search {
        flex: 1;
        min-width: 0;
        max-width: 560px;

        @media (max-width: 768px) {
            order: 3;
            max-width: none;
            flex-basis: 100%;
        }
    }

    &__nav {
        position: relative;
        margin-left: auto;

        &-toggle {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 10px 14px;
            border: none;
            border-radius: 12px;
            background: none;
            font: inherit;
            font-weight: 600;
            color: #222;
            cursor: pointer;

            &:hover {
                background-color: rgba(0, 0, 0, 0.06);
            }
        }

        &-arrow {
            font-size: 0.7em;
            transition: transform 0.2s ease;

            &.is-open {
                transform: rotate(180deg);
            }
        }

        &-list {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            z-index: 30;
            min-width: 240px;
            margin: 0;
            padding: 8px;
            list-style: none;
            background-color: #fff;
            border-radius: 16px;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
        }

        &-link {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
            padding: 10px 12px;
            border-radius: 10px;
            color: #222;
            text-decoration: none;

            &:hover {
                background-color: rgba(89, 92, 205, 0.1);
            }
        }

        &-link-meta {
            font-size: 0.8rem;
            color: #999;
        }

        @media (max-width: 768px) {
            display: none;
            order: 2;
            flex-basis: 100%;
            margin-left: 0;

            &.is-active {
                display: block;
            }

            &-toggle {
                width: 100%;
                justify-content: space-between;
                background-color: #fff;
            }

            &-list {
                position: static;
                min-width: 0;
                margin-top: 8px;
                box-shadow: none;
                background-color: #fff;
            }
        }
    }

    &__burger {
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        margin-left: auto;
        cursor: pointer;

        span {
            width: 22px;
            height: 3px;
            border-radius: 2px;
            background-color: #222;
            transition: transform 0.3s ease, opacity 0.3s ease;
            transform-origin: center;
        }

        &.is-active {
            span:nth-child(1) {
                transform: translateY(7px) rotate(45deg);
            }

            span:nth-child(2) {
                opacity: 0;
            }

            span:nth-child(3) {
                transform: translateY(-7px) rotate(-45deg);
            }
        }

        @media (max-width: 768px) {
            display: flex;
        }
    }
}
</style>
