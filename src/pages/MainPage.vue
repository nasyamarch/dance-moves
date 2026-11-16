<script setup lang="ts">
import DanceCard from '@/components/DanceCard.vue'
import MoveCard from '@/components/MoveCard.vue'
import Search from '@/components/Search.vue'
import { getAllDances, getDanceById, getMovesByDance, getPopularMoves } from '@/data'
import type { Dance, Move } from '@/types'
import { useRouter } from 'vue-router'

const router = useRouter()

const dances = getAllDances()
const popularMoves = getPopularMoves(6)

const moveCount = (danceId: string) => getMovesByDance(danceId).length

const openDance = (dance: Dance) => {
  router.push({
    name: 'dance',
    params: { danceSlug: dance.slug },
  })
}

const openMove = (move: Move) => {
  const dance = getDanceById(move.dance_id)
  if (!dance) return
  router.push({
    name: 'move',
    params: { danceSlug: dance.slug, moveSlug: move.slug },
  })
}
</script>

<template>
  <div class="home">
    <section class="home__hero">
      <h1 class="home__title">База танцевальных движений</h1>
      <p class="home__subtitle">
        Swing-танцы и не только: названия, уровни, описания и видео с движениями
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
.home {
  width: 100%;
  max-width: 1462px;
  padding: 24px 32px 64px;

  @media (max-width: 550px) {
    padding: 16px 16px 48px;
  }

  &__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 40px 0 56px;
    text-align: center;

    @media (max-width: 550px) {
      padding: 24px 0 40px;
    }
  }

  &__title {
    margin: 0;
    font-size: clamp(1.8rem, 1.3rem + 1.8vw, 3rem);
    color: #222;
  }

  &__subtitle {
    margin: 0;
    max-width: 560px;
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
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 32px;

    @media (max-width: 550px) {
      gap: 16px;
      grid-template-columns: repeat(1, minmax(160px, 320px));
      justify-content: center;
    }
  }

  &__moves {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 860px;
  }
}
</style>
