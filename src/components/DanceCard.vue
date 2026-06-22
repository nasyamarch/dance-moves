<script setup lang="ts">
import { ref } from 'vue';
const isActive = ref(false);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['select'])
const handleClick = () => {
  emit('select', props.title)
}

function toggleCard() {
  isActive.value = !isActive.value
}
</script>

<template>
  <article
      class="dance-card"
      :class="{'is-active' : isActive}"
      @click="toggleCard"
  >
    <h2 class="dance-card__title">
      {{ title }}
    </h2>
  </article>
</template>

<style lang="scss">
.dance-card {
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 280px;
  border-radius: 24px;
  border: 6px solid #fff;
  background-color: #595ccd;
  cursor: pointer;
  transition: 0.4s ease;

  @media(max-width: 768px) {
    min-height: 260px;
  }
  @media(max-width: 550px) {
    min-height: 120px;
    border: 4px solid #fff;
  }

  @media(hover: hover) and (pointer: fine) {
    &:hover {
      background-color: rgba(248, 146, 243, 0.3);
      border: 6px solid #e25ffd;
      scale: 0.98;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

      .dance-card__title {
        color: rgba(44, 44, 44, 0.83);
      }

      @media(max-width: 550px) {
        border: 4px solid #e25ffd;
      }
    }
  }

  &:active, &.is-active {
    border: 6px solid #e25ffd;
    background-color: rgba(248, 146, 243, 1);

    .dance-card__title {
      color: rgba(44, 44, 44, 0.83);
    }

    @media(max-width: 550px) {
      border: 4px solid #e25ffd;
    }
  }

  &__title {
    margin: 0;
    font-size: clamp(1.5rem, 1.4rem + 0.512vw, 2rem);
    text-align: center;
    color: #fff;
  }
}

</style>