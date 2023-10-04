<script setup>
import HexSweeper from './components/HexSweeper.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <header>
    <img id="logo" src="./assets/logo.svg" />
    <div class="wrapper">
      <HexSweeper />
    </div>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;600&display=swap');

header {
  line-height: 1.5;
}

#logo {
  position: fixed;
  left: 30px;
  top: 30px;
  height: 36px;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
