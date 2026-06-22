<script setup lang="ts">
  import { ref } from 'vue';
  const isActive = ref(false);

  function toggleNav() {
    isActive.value = !isActive.value;
  }

</script>

<template>
  <header class="header">
    <a class="header__link" href="/">
      logo
    </a>
    <div class="header__search">
      Поисковая строка
    </div>
    <div
        class="header__burger"
        :class="{'is-active': isActive}"
        @click="toggleNav"
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  </header>
</template>

<style lang="scss">
.header {
  max-width: 1462px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px 32px;

  @media(max-width: 550px) {
    padding: 16px;
  }

  &__search {
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__burger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;

    span {
      width: 20px;
      height: 3px;
      background-color: #000;

      transition: transform 0.3s ease, opacity 0.3s ease;
      transform-origin: center;
    }

    &.is-active {
      span:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
      }
      span:nth-child(2) {
        opacity: 0;
      }
      span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }
    }
  }
}
</style>