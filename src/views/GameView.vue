<template>
  <div class="game-wrapper">
    <iframe src="http://8.130.103.241/game/index.html" width="100%" height="80%"></iframe>
  </div>
</template>

<style scoped>
div.game-wrapper {
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
}

iframe {
  border: none; 
  scale: 0.8; 
  position: absolute;
  /* top: -60px; */
}
</style>