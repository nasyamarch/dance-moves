<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  previewVideo: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <div
      class="move-card"
      @click="emit('select')"
  >
    <div class="move-card__info">
      <h3>{{ name }}</h3>
      <p>{{ level }}</p>
    </div>
    <video
        class="move-card__video"
        :src="previewVideo"
        muted
        loop
        autoplay
        playsinline
    />
  </div>
</template>

<style scoped lang="scss">
.move-card {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;

  cursor: pointer;

  &__info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__video {
    width: 120px;
    height: 70px;
    object-fit: cover;
    border-radius: 8px;
  }
}
</style>