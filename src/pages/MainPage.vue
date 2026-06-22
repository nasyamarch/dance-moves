<script setup lang="ts">
  import DanceCard from "@/components/DanceCard.vue";
  import { useRouter } from 'vue-router'
  const router = useRouter()

  const openDance = (danceId: string) => {
    router.push({
      name: 'dance',
      params: {
        danceId,
      },
    })
  }

</script>

<template>
  <section class="dance-list__wrapper">
    <div class="dance-list">
      <DanceCard
          title="Lindy Hop"
          dance-id="lindy-hop"
          @select="openDance"
      />
      <DanceCard
          title="Balboa"
          dance-id="balboa"
          @select="openDance"
      />
      <DanceCard
          title="Blues"
          dance-id="bluez"
          @select="openDance"
      />
      <DanceCard
          title="Solo Jazz"
          dance-id="solo-jazz"
          @select="openDance"
      />
    </div>

  </section>
</template>

<style lang="scss">
.dance-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(160px, 360px));
  gap: 40px;

  @media(max-width: 768px) {
    grid-template-columns: repeat(2, minmax(160px, 320px));
    gap: 24px;
  }
  @media(max-width: 550px) {
    gap: 16px;
    grid-template-columns: repeat(1, minmax(160px, 320px));
  }

  &__wrapper {
    min-height: 98vh;
    max-width: 1462px;
    padding: 24px 32px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media(max-width: 550px) {
      padding: 24px 16px;
    }
  }
}
</style>