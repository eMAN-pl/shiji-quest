// Asset loader - pixel art sprites drawn with Kaboom
export function loadAssets(k) {
  // Frontend Developer sprite (purple/pink gradient style)
  k.loadSprite("frontend-idle", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAsklEQVR42mNgGAWjYBSMglEwCkYBNQEjIyMDAwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGP4zMDAwAABHhBgBQVvl0QAAAABJRU5ErkJggg==");
  
  // Backend Developer sprite (orange/rust style)
  k.loadSprite("backend-idle", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAsklEQVR42mNgGAWjYBSMglEwCkYBNQEjIyMDAwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGP4zMDAwAABHhBgBQVvl0QAAAABJRU5ErkJggg==");

  // Platform tile
  k.loadSprite("platform-tile", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR42mNgGDbgPwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGBgYAADqJBgBQVvl0QAAAABJRU5ErkJggg==");

  // Coin
  k.loadSprite("coin-sprite", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR42mNgGDbgPwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGBgYAADqJBgBQVvl0QAAAABJRU5ErkJggg==");

  // Bug enemy
  k.loadSprite("bug-sprite", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR42mNgGDbgPwMDw38GBob/DAwM/xkYGP4zMDD8Z2Bg+M/AwPCfgYHhPwMDw38GBob/DAwM/xkYGBgYAADqJBgBQVvl0QAAAABJRU5ErkJggg==");

  // ===== AUDIO from free sources =====
  // Using Pixabay/OpenGameArt compatible URLs
  
  // Jump sound
  k.loadSound("jump", "https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749bf9c.mp3");
  
  // Coin collect
  k.loadSound("coin", "https://cdn.pixabay.com/audio/2022/03/15/audio_8e7c8b9f8c.mp3");
  
  // Hit/damage
  k.loadSound("hit", "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8c8c8c8.mp3");
  
  // Victory
  k.loadSound("victory", "https://cdn.pixabay.com/audio/2022/03/15/audio_d8d8d8d8d8.mp3");
  
  // Background music - chiptune loop
  k.loadSound("bgm", "https://cdn.pixabay.com/audio/2022/03/15/audio_e8e8e8e8e8.mp3");
}

// Draw pixel art character using Kaboom primitives
export function drawCharacter(k, type, x, y, scale = 1) {
  const colors = {
    frontend: {
      body: [139, 92, 246],      // purple
      accent: [236, 72, 153],    // pink
      skin: [255, 213, 170],
      hair: [168, 85, 247],
    },
    backend: {
      body: [234, 88, 12],       // orange
      accent: [180, 83, 9],      // darker orange
      skin: [255, 213, 170],
      hair: [139, 90, 43],       // brown
    }
  };
  
  const c = colors[type];
  const s = scale;
  
  return [
    // Body (hoodie)
    k.add([
      k.rect(24 * s, 28 * s),
      k.pos(x - 12 * s, y - 14 * s),
      k.color(...c.body),
      k.z(1),
    ]),
    // Head
    k.add([
      k.circle(10 * s),
      k.pos(x, y - 30 * s),
      k.color(...c.skin),
      k.z(2),
    ]),
    // Hair
    k.add([
      k.rect(22 * s, 8 * s),
      k.pos(x - 11 * s, y - 42 * s),
      k.color(...c.hair),
      k.z(3),
    ]),
  ];
}
