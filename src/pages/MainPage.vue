<script setup lang="ts">
import DanceCard from '@/components/DanceCard.vue'
import MoveCard from '@/components/MoveCard.vue'
import Search from '@/components/Search.vue'
import {getAllDances, getDanceById, getMovesByDance, getPopularMoves} from '@/data'
import type {Dance, Move} from '@/types'
import {useRouter} from 'vue-router'

const router = useRouter()

const dances = getAllDances()
const popularMoves = getPopularMoves(6)

const moveCount = (danceId: string) => getMovesByDance(danceId).length

const openDance = (dance: Dance) => {
    router.push({
        name: 'dance',
        params: {danceSlug: dance.slug},
    })
}

const openMove = (move: Move) => {
    const dance = getDanceById(move.dance_id)
    if (!dance) return
    router.push({
        name: 'move',
        params: {danceSlug: dance.slug, moveSlug: move.slug},
    })
}
</script>

<template>
    <div class="home">
        <section class="home__hero">
            <h1 class="home__title">База танцевальных движений</h1>
            <p class="home__subtitle">
                Swing-танцы и не&nbsp;только: названия, уровни, описания и&nbsp;видео с&nbsp;движениями
            </p>
            <div class="home__search">
                <Search
                    variant="large"
                    placeholder="Найти движение или танец…"
                />
            </div>
        </section>

        <section class="home__section">
            <h2 class="home__section-title">Танцы</h2>
            <div class="home__dances">
                <DanceCard
                    v-for="dance in dances"
                    :key="dance.id"
                    :dance="dance"
                    :move-count="moveCount(dance.id)"
                    @select="openDance"
                />
            </div>
        </section>

        <section
            v-if="popularMoves.length"
            class="home__section"
        >
            <h2 class="home__section-title">Популярные движения</h2>
            <div class="home__moves">
                <MoveCard
                    v-for="move in popularMoves"
                    :key="move.id"
                    :move="move"
                    show-dance
                    @select="openMove"
                />
            </div>
        </section>
    </div>
</template>

<style lang="scss">
@use "@/assets/styles/formulas" as *;
@use "@/assets/styles/mixins" as *;

.home {
    width: 100%;
    max-width: 1264px;
    padding: clamp-f(16, 24) clamp-f(16, 48) clamp-f(48, 64);

    &__hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: clamp-f(24, 40) 0 clamp-f(40, 56);
        text-align: center;
    }

    &__subtitle {
        max-width: 450px;
        color: #666;
    }

    &__search {
        width: 100%;
        max-width: 620px;
        margin-top: 12px;
    }

    &__section {
        margin-bottom: 56px;
    }

    &__section-title {
        margin: 0 0 20px;
        font-size: 1.5rem;
        color: #222;
    }

    &__dances {
        display: grid;
        grid-template-columns: repeat(1, minmax(100px, 1fr));
        grid-auto-rows: auto;
        gap: clamp-f(8, 20);

        @include mobile {
            grid-template-columns: repeat(2, minmax(100px, 1fr));
        }
        @include tablet {
            grid-template-columns: repeat(3, minmax(100px, 1fr));
        }
    }

    &__moves {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
}
</style>
