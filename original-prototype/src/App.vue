<script setup>
import '@eox/map'

import HexSweeper from './components/HexSweeper.vue'
import config from './gameConfig.js'
</script>

<template>
  <header>
    <img id="logo" src="./assets/logo.svg" />
    <div class="wrapper">
      <!--<HexSweeper />-->

      <eox-map
        ref="map"
        :layers="config.map.layers"
        :zoom="config.map.zoom"
        :center="config.map.center"
      />
    </div>
  </header>
</template>

<script>
  export default {
    computed: {
      map () {
        return this.$refs.map.map;
      }
    },
    mounted () {
      console.log(ol);

      var grid = new ol.HexGrid ({ size:4000, origin: this.map.getView().getCenter() });
      var hex = new ol.source.HexMap({ hexGrid: grid });
      this.map.addLayer(new ol.layer.Image({ source: hex }));
    },
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;600&display=swap');

eox-map {
  position: fixed;
  top: 100px;
  right: 40px;
  bottom: 40px;
  left: 40px;
  border-radius: 9px;
  overflow: hidden;
}

header {
  line-height: 1.5;
}

#logo {
  position: fixed;
  left: 30px;
  top: 30px;
  height: 36px;
  z-index: 9001;
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
