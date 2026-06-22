<script setup lang="ts">
import MoveCard from '@/components/MoveCard.vue'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { dances } from '@/data/dances.js'
import { moves } from '@/data/moves.js'

const route = useRoute()

const currentDance = computed(() =>
    dances.find(
        dance => dance.id === danceId.value
    )
)
const currentMoves = computed(() =>
    moves.filter(
        move => move.danceId === danceId.value
    )
)

const danceId = computed(() => route.params.danceId)
const openMove = (moveName: string) => {
  console.log('Открыть движение:', moveName)
}
</script>

<template>
  <section class="moves-page">
    <h1>{{ currentDance.name.eng (currentDance.name.ru) }}</h1>

    <div class="moves-page__list">
      <MoveCard
          v-for="move in currentMoves"
          :key="move.id"
          :move="move"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">

</style>