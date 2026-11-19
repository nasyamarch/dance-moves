<script setup lang="ts">

import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <a class="skip-link" href="#main">Перейти к содержимому</a>

  <Header />
  <main id="main" tabindex="-1">
    <RouterView />
  </main>

  <Footer />
</template>
