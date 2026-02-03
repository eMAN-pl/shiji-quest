import kaboom from "kaboom";
import { BRAND } from "./config/colors.js";
import { generateCharacterSprite, generateCoinSprite, generateBugSprite } from "./utils/spriteGenerator.js";

// Initialize Kaboom - 20% larger (960x720)
const k = kaboom({
  width: 960,
  height: 720,
  scale: 1,
  crisp: true,
  background: BRAND.BG_DARK,
  canvas: document.querySelector("canvas"),
  global: false,
});

// Game state
const gameState = {
  character: null,
  coins: 0,
  lives: 3,
  time: 0,
  muted: false,
};

// ===== LOAD ASSETS =====

// Logo
k.loadSprite("shiji-logo", "/Logo.png");

// Generate character sprites
const frontendSprite = generateCharacterSprite({
  bodyColor: '#8B5CF6',
  hairColor: '#EC4899',
  hasBeard: false,
  accessory: 'headphones'
});

const backendSprite = generateCharacterSprite({
  bodyColor: '#374151',
  hairColor: '#78350F',
  hasBeard: true,
  accessory: 'coffee'
});

k.loadSprite("frontend", frontendSprite, {
  sliceX: 4,
  sliceY: 1,
  anims: {
    idle: { from: 0, to: 0 },
    run: { from: 1, to: 2, loop: true, speed: 10 },
    jump: { from: 3, to: 3 }
  }
});

k.loadSprite("backend", backendSprite, {
  sliceX: 4,
  sliceY: 1,
  anims: {
    idle: { from: 0, to: 0 },
    run: { from: 1, to: 2, loop: true, speed: 10 },
    jump: { from: 3, to: 3 }
  }
});

// Coin sprite
k.loadSprite("coin", generateCoinSprite(), {
  sliceX: 4,
  sliceY: 1,
  anims: {
    spin: { from: 0, to: 3, loop: true, speed: 8 }
  }
});

// Bug sprite
k.loadSprite("bug", generateBugSprite(), {
  sliceX: 2,
  sliceY: 1,
  anims: {
    walk: { from: 0, to: 1, loop: true, speed: 6 }
  }
});

// ===== LOAD AUDIO =====
k.loadSound("jump", "/jump.wav");
k.loadSound("coin", "/coin.wav");
k.loadSound("hit", "/hit.wav");
k.loadSound("powerup", "/powerup.wav");
k.loadSound("victory", "/victory.wav");
k.loadSound("music", "https://ericskiff.com/music/Resistor%20Anthems/03%20Chibi%20Ninja.mp3");

// Load scenes
import { splashScene } from "./scenes/splash.js";
import { selectScene } from "./scenes/select.js";
import { gameScene } from "./scenes/game.js";
import { endScene } from "./scenes/end.js";

// Register scenes
k.scene("splash", () => splashScene(k, gameState));
k.scene("select", () => selectScene(k, gameState));
k.scene("game", () => gameScene(k, gameState));
k.scene("end", () => endScene(k, gameState));

// Start with splash
k.go("splash");
