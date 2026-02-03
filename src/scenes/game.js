import { characters } from "../data/characters.js";
import { BRAND } from "../config/colors.js";

export function gameScene(k, gameState) {
  const char = characters[gameState.character];
  
  const SPEED = 320;
  const JUMP_FORCE = 650;
  const GRAVITY = 1800;
  const SUPER_COOLDOWN = 5;

  let superReady = true;
  let superTimer = 0;
  let gameTime = 0;
  let isMoving = false;

  k.setBackground(...BRAND.BG_DARK);
  k.setGravity(GRAVITY);

  // Continue music from splash or start new
  let music = gameState.music;
  if (!music) {
    try { music = k.play("music", { loop: true, volume: 0.3 }); } catch (e) {}
  }

  // Stars
  for (let i = 0; i < 60; i++) {
    k.add([
      k.circle(k.rand(1, 3)),
      k.pos(k.rand(0, 3000), k.rand(0, 350)),
      k.color(255, 255, 255),
      k.opacity(k.rand(0.1, 0.3)),
      k.z(-90),
    ]);
  }

  // Player
  const player = k.add([
    k.sprite(gameState.character),
    k.pos(80, 400),
    k.area({ shape: new k.Rect(k.vec2(0), 28, 44) }),
    k.body(),
    k.anchor("bot"),
    k.scale(1.5),
    "player",
  ]);
  player.play("idle");

  // Ground
  k.add([
    k.rect(3000, 50),
    k.pos(0, 555),
    k.color(55, 65, 81),
    k.area(),
    k.body({ isStatic: true }),
  ]);
  k.add([
    k.rect(3000, 4),
    k.pos(0, 553),
    k.color(...BRAND.SUCCESS),
    k.z(5),
  ]);

  // Platforms
  const platforms = [
    { x: 200, y: 480, w: 120 }, { x: 420, y: 420, w: 100 },
    { x: 650, y: 360, w: 130 }, { x: 900, y: 420, w: 100 },
    { x: 1130, y: 480, w: 120 }, { x: 1360, y: 380, w: 110 },
    { x: 1600, y: 320, w: 130 }, { x: 1840, y: 400, w: 100 },
    { x: 2020, y: 480, w: 150 },
  ];

  platforms.forEach(p => {
    k.add([
      k.rect(p.w, 20),
      k.pos(p.x, p.y),
      k.color(55, 65, 81),
      k.area(),
      k.body({ isStatic: true }),
      k.anchor("center"),
    ]);
    k.add([
      k.rect(p.w - 4, 3),
      k.pos(p.x, p.y - 8),
      k.color(...BRAND.SUCCESS),
      k.anchor("center"),
    ]);
  });

  // Coins
  const coinPositions = [
    { x: 200, y: 440 }, { x: 420, y: 380 }, { x: 650, y: 320 },
    { x: 900, y: 380 }, { x: 1130, y: 440 }, { x: 1360, y: 340 },
    { x: 1600, y: 280 }, { x: 1840, y: 360 },
  ];

  coinPositions.forEach(c => {
    const coin = k.add([
      k.sprite("coin"),
      k.pos(c.x, c.y),
      k.area({ shape: new k.Rect(k.vec2(0), 16, 16) }),
      k.anchor("center"),
      k.scale(1.5),
      { startY: c.y },
      "coin",
    ]);
    coin.play("spin");
  });

  k.onUpdate("coin", (coin) => {
    coin.pos.y = coin.startY + Math.sin(k.time() * 3) * 5;
  });

  // Bugs
  const bugPositions = [
    { x: 550, y: 532 }, { x: 1000, y: 532 },
    { x: 1480, y: 532 }, { x: 1750, y: 532 },
  ];

  bugPositions.forEach(b => {
    const bug = k.add([
      k.sprite("bug"),
      k.pos(b.x, b.y),
      k.area({ shape: new k.Rect(k.vec2(0), 28, 20) }),
      k.anchor("bot"),
      k.scale(1.2),
      { dir: 1, speed: 60, startX: b.x },
      "bug",
    ]);
    bug.play("walk");
  });

  k.onUpdate("bug", (bug) => {
    bug.pos.x += bug.dir * bug.speed * k.dt();
    if (Math.abs(bug.pos.x - bug.startX) > 80) {
      bug.dir *= -1;
      bug.flipX = bug.dir < 0;
    }
  });

  // Building (finish) - finish zone is under the flag (entire Y axis under flag)
  const buildingX = 2200;
  const flagX = buildingX + 2;
  
  // Finish zone - vertical strip under flag
  k.add([
    k.rect(40, 200),
    k.pos(flagX, 555),
    k.area(),
    k.anchor("bot"),
    k.opacity(0),
    "flag",
  ]);
  
  // Building visual
  k.add([k.rect(80, 120), k.pos(buildingX, 555), k.color(75, 85, 99), k.anchor("bot")]);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      k.add([
        k.rect(14, 18),
        k.pos(buildingX - 25 + col * 25, 555 - 110 + row * 28),
        k.color(250, 204, 21),
        k.opacity(0.8),
        k.anchor("bot"),
      ]);
    }
  }
  k.add([k.rect(90, 10), k.pos(buildingX, 435), k.color(55, 65, 81), k.anchor("bot")]);
  k.add([k.rect(4, 30), k.pos(buildingX, 405), k.color(100, 110, 120), k.anchor("bot")]);
  k.add([k.rect(30, 18), k.pos(flagX, 385), k.color(...BRAND.SUCCESS)]);
  k.add([k.text("🏁", { size: 14 }), k.pos(flagX + 15, 390), k.anchor("center")]);

  // Camera
  player.onUpdate(() => {
    k.camPos(Math.max(player.pos.x, 480), k.height() / 2);
  });

  // Controls
  const moveLeft = () => { player.move(-SPEED, 0); player.flipX = true; isMoving = true; };
  const moveRight = () => { player.move(SPEED, 0); player.flipX = false; isMoving = true; };

  k.onKeyDown("left", moveLeft);
  k.onKeyDown("a", moveLeft);
  k.onKeyDown("right", moveRight);
  k.onKeyDown("d", moveRight);
  k.onKeyRelease("left", () => isMoving = false);
  k.onKeyRelease("a", () => isMoving = false);
  k.onKeyRelease("right", () => isMoving = false);
  k.onKeyRelease("d", () => isMoving = false);

  const jump = () => {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      player.play("jump");
      try { k.play("jump", { volume: 0.4 }); } catch (e) {}
    }
  };

  k.onKeyPress("space", jump);
  k.onKeyPress("up", jump);
  k.onKeyPress("w", jump);

  k.onUpdate(() => {
    if (player.isGrounded()) {
      if (isMoving && player.curAnim() !== "run") player.play("run");
      else if (!isMoving && player.curAnim() !== "idle") player.play("idle");
    }
  });

  // Superpower
  k.onKeyPress("shift", () => {
    if (!superReady) return;
    superReady = false;
    superTimer = SUPER_COOLDOWN;
    try { k.play("powerup", { volume: 0.5 }); } catch (e) {}

    for (let i = 0; i < 8; i++) {
      k.add([
        k.circle(k.rand(5, 15)),
        k.pos(player.pos.x + k.rand(-30, 30), player.pos.y - 20 + k.rand(-30, 30)),
        k.color(...char.color),
        k.opacity(0.7),
        k.lifespan(0.4, { fade: 0.4 }),
      ]);
    }

    if (gameState.character === "frontend") {
      const bugs = k.get("bug");
      if (bugs.length > 0) {
        const nearest = bugs.reduce((a, b) => player.pos.dist(a.pos) < player.pos.dist(b.pos) ? a : b);
        const pos = nearest.pos.clone();
        nearest.destroy();
        const newCoin = k.add([
          k.sprite("coin"), k.pos(pos.x, pos.y - 20),
          k.area({ shape: new k.Rect(k.vec2(0), 16, 16) }),
          k.anchor("center"), k.scale(1.5), { startY: pos.y - 20 }, "coin",
        ]);
        newCoin.play("spin");
      }
    } else {
      player.pos.x += 200;
    }
  });

  // Collisions
  player.onCollide("coin", (coin) => {
    coin.destroy();
    gameState.coins++;
    try { k.play("coin", { volume: 0.4 }); } catch (e) {}
    for (let i = 0; i < 6; i++) {
      k.add([
        k.circle(k.rand(2, 5)),
        k.pos(coin.pos.x + k.rand(-15, 15), coin.pos.y + k.rand(-15, 15)),
        k.color(...BRAND.WARNING),
        k.lifespan(0.3, { fade: 0.3 }),
      ]);
    }
  });

  player.onCollide("bug", () => {
    gameState.lives--;
    try { k.play("hit", { volume: 0.5 }); } catch (e) {}
    player.opacity = 0.5;
    k.wait(0.1, () => player.opacity = 1);
    k.wait(0.2, () => player.opacity = 0.5);
    k.wait(0.3, () => player.opacity = 1);
    if (gameState.lives <= 0) {
      if (music) music.stop();
      gameState.music = null;
      gameState.lives = 3;
      gameState.coins = 0;
      k.go("game");
    } else {
      player.pos.x -= 100;
    }
  });

  player.onCollide("flag", () => {
    gameState.time = Math.floor(gameTime);
    if (music) music.stop();
    gameState.music = null;
    try { k.play("victory", { volume: 0.6 }); } catch (e) {}
    k.go("end");
  });

  // Game loop
  k.onUpdate(() => {
    gameTime += k.dt();
    if (!superReady) {
      superTimer -= k.dt();
      if (superTimer <= 0) superReady = true;
    }
    if (player.pos.y > 700) {
      gameState.lives--;
      if (gameState.lives <= 0) {
        if (music) music.stop();
        gameState.music = null;
        gameState.lives = 3;
        gameState.coins = 0;
      }
      k.go("game");
    }
  });

  // HUD - bars same width, centered, padding 20px
  const barW = 400;
  const barH = 40;
  const barPadding = 20;

  k.onDraw(() => {
    const camX = k.camPos().x;
    
    // Top bar - centered, same width as bottom
    k.drawRect({
      pos: k.vec2(camX - barW/2, 8),
      width: barW,
      height: barH,
      color: k.rgb(20, 25, 35),
      opacity: 0.9,
      radius: 8,
    });

    // Mute icon - inside bar, 20px from left
    k.drawText({
      text: gameState.muted ? "🔇" : "🔊",
      pos: k.vec2(camX - barW/2 + barPadding, 8 + barH/2),
      size: 18,
      anchor: "left",
    });

    // Hearts - after mute, centered vertically
    for (let i = 0; i < gameState.lives; i++) {
      k.drawText({
        text: "❤️",
        pos: k.vec2(camX - barW/2 + 60 + i * 26, 8 + barH/2),
        size: 18,
        anchor: "left",
      });
    }

    // Timer - absolute center
    k.drawText({
      text: `⏱️ ${Math.floor(gameTime)}s`,
      pos: k.vec2(camX, 8 + barH/2),
      size: 15,
      color: k.rgb(200, 200, 200),
      anchor: "center",
    });

    // Coins - 20px from right
    k.drawText({
      text: `🪙 ${gameState.coins}`,
      pos: k.vec2(camX + barW/2 - barPadding, 8 + barH/2),
      size: 18,
      color: k.rgb(...BRAND.WARNING),
      anchor: "right",
    });

    // Bottom bar - centered, same width
    const bottomY = k.height() - 8 - barH;
    k.drawRect({
      pos: k.vec2(camX - barW/2, bottomY),
      width: barW,
      height: barH,
      color: k.rgb(20, 25, 35),
      opacity: 0.9,
      radius: 8,
    });

    // Controls - 20px from left, centered vertically
    k.drawText({
      text: "← → move | SPACE jump",
      pos: k.vec2(camX - barW/2 + barPadding, bottomY + barH/2),
      size: 11,
      color: k.rgb(...BRAND.WHITE),
      anchor: "left",
    });

    // Superpower - 20px from right, no background
    const superText = superReady 
      ? `${char.superpower.icon} ${char.superpower.name} [SHIFT]` 
      : `${char.superpower.icon} ${Math.ceil(superTimer)}s`;
    
    k.drawText({
      text: superText,
      pos: k.vec2(camX + barW/2 - barPadding, bottomY + barH/2),
      size: 12,
      color: k.rgb(...BRAND.WHITE),
      anchor: "right",
    });
  });

  // Mute click area
  const muteBtn = k.add([
    k.rect(40, 40),
    k.pos(20, 8),
    k.area(),
    k.fixed(),
    k.opacity(0),
  ]);

  muteBtn.onClick(() => {
    gameState.muted = !gameState.muted;
    if (gameState.muted) {
      k.volume(0);
      if (music) music.paused = true;
    } else {
      k.volume(1);
      if (music) music.paused = false;
    }
  });
}
