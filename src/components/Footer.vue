<script setup lang="ts">

</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <h4>Сайт создан в целях обучения и прикола</h4>
      <h5>Наслаждайтесь</h5>
      <h5>Предложения об улучшении и тапки кидать сюда:</h5>
    </div>
  </footer>
</template>

<style lang="scss">
  .footer {
    width: 100%;
    padding: 24px 32px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-top: 2px solid black;

    @media(max-width: 550px) {
      min-height: 120px;
      padding: 24px 16px;
    }

    &__container {
      width: 100%;
      max-width: 1462px;
    }
  }

</style>