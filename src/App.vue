<script setup lang="ts">

import Homepage from '@/components/Homepage.vue'
</script>

<template>
  <Homepage/>
</template>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'); */

html {
  scroll-behavior: smooth;
}

@font-face {
  font-family: "PMarker";
  unicode-range: U+000-5FF;
  src: url("@/assets/fonts/Permanent_Marker/PermanentMarker-Regular.ttf");
}

@font-face {
  font-family: "LiuJianMaoCao";
  unicode-range: U+000-5FF;
  src: url("@/assets/fonts/Liu_Jian_Mao_Cao/LiuJianMaoCao-Regular.ttf");
}

@font-face {
  font-family: "Jayscript";
  unicode-range: U+000-5FF;
  src: url("@/assets/fonts/jayscript-font/Jayscript-YBAL.ttf");
}

@font-face {
  font-family: "RalewayDots";
  unicode-range: U+000-5FF;
  src: url("@/assets/fonts/Raleway_Dots/RalewayDots-Regular.ttf");
}

@font-face {
  font-family: "desyrel";
  unicode-range: U+000-5FF;
  src: url("@/assets/fonts/desyrel/DESYREL_.ttf");
}

@font-face {
  font-family: "TrainOne";
  font-weight: normal;
  unicode-range: U+000-5FF;
  src: url("@/assets/fonts/Train_One/TrainOne-Regular.ttf");
}

@font-face {
  font-family: "edo";
  font-weight: normal;
  unicode-range: U+000-5FF;
  src: url("@/assets/fonts/edo.ttf");
}

@font-face {
  font-family: "BungeeHairline";
  font-weight: normal;
  unicode-range: U+000-5FF;
  src: url("@/assets/fonts/Bungee_Hairline/BungeeHairline-Regular.ttf");
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
body {
  margin: 0;
  overflow-x: hidden;
  background-color: ghostwhite;
}

</style>
