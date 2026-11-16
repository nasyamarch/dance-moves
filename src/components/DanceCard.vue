<script setup lang="ts">
import type { Dance } from '@/types'

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
      @click="emit('select', props.dance)"
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
      {{ moveCount === 1 ? 'движение' : moveCount < 5 ? 'движения' : 'движений' }}
    </span>
  </article>
</template>

<style lang="scss">
.dance-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  min-height: 280px;
  padding: 24px;
  border-radius: 24px;
  border: 6px solid #fff;
  background-color: #595ccd;
  cursor: pointer;
  transition: 0.4s ease;

  @media (max-width: 768px) {
    min-height: 260px;
  }
  @media (max-width: 550px) {
    min-height: 120px;
    border: 4px solid #fff;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: rgba(248, 146, 243, 0.3);
      border: 6px solid #e25ffd;
      scale: 0.98;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

      .dance-card__title,
      .dance-card__subtitle,
      .dance-card__count {
        color: rgba(44, 44, 44, 0.83);
      }

      @media (max-width: 550px) {
        border: 4px solid #e25ffd;
      }
    }
  }

  &:active {
    border: 6px solid #e25ffd;
    background-color: rgba(248, 146, 243, 1);

    .dance-card__title,
    .dance-card__subtitle,
    .dance-card__count {
      color: rgba(44, 44, 44, 0.83);
    }

    @media (max-width: 550px) {
      border: 4px solid #e25ffd;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  &__title {
    margin: 0;
    font-size: clamp(1.5rem, 1.4rem + 0.512vw, 2rem);
    text-align: center;
    color: #fff;
  }

  &__subtitle {
    margin: 0;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.75);
  }

  &__count {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
