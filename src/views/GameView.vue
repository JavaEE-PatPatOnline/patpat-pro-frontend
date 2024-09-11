<template>
  <div class="game-wrapper">
    <div class="game-frame">
      <iframe src="/game/index.html" width="1000px" height="630px"></iframe>
    </div>
  </div>
</template>

<style scoped>
div.game-wrapper {
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

div.game-wrapper .game-frame {
  width: 700px;
  height: 500px;
  position: relative;
  overflow: hidden;
}

div.game-wrapper .game-frame iframe {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* iframe {
  border: none; 
  scale: 0.8; 
  position: absolute;
  top: -60px;
} */
</style>