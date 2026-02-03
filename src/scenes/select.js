import { characters } from "../data/characters.js";
import { BRAND } from "../config/colors.js";

export function selectScene(k, gameState) {
  let selectedChar = null;

  k.setBackground(...BRAND.BG_DARK);

  // Particles
  for (let i = 0; i < 30; i++) {
    k.add([
      k.circle(k.rand(2, 4)),
      k.pos(k.rand(0, k.width()), k.rand(0, k.height())),
      k.color(255, 255, 255),
      k.opacity(k.rand(0.1, 0.2)),
      { speed: k.rand(20, 50) },
      "particle",
    ]);
  }

  k.onUpdate("particle", (p) => {
    p.pos.y -= p.speed * k.dt();
    if (p.pos.y < 0) p.pos.y = k.height();
  });

  // Layout - balanced spacing
  const titleY = 50;
  const subtitleY = titleY + 24 + 16;
  const cardHeight = 400;
  const btnY = k.height() - 60;
  const cardY = (subtitleY + 30 + btnY - 30) / 2; // center between subtitle and button

  // Title
  k.add([
    k.text("Select Character", { size: 28 }),
    k.pos(k.width() / 2, titleY),
    k.anchor("center"),
    k.color(...BRAND.WHITE),
  ]);

  // Subtitle
  k.add([
    k.text("Each character has a unique superpower!", { size: 15 }),
    k.pos(k.width() / 2, subtitleY),
    k.anchor("center"),
    k.color(...BRAND.GRAY),
  ]);

  // Character cards - taller
  const charList = Object.values(characters);
  const cardWidth = 300;
  const gapBetween = 48;
  const startX = (k.width() - (cardWidth * 2 + gapBetween)) / 2;

  charList.forEach((char, i) => {
    const x = startX + i * (cardWidth + gapBetween) + cardWidth / 2;

    // Card shadow
    k.add([
      k.rect(cardWidth, cardHeight, { radius: 16 }),
      k.pos(x + 4, cardY + 4),
      k.anchor("center"),
      k.color(0, 0, 0),
      k.opacity(0.3),
    ]);

    // Card
    const card = k.add([
      k.rect(cardWidth, cardHeight, { radius: 16 }),
      k.pos(x, cardY),
      k.anchor("center"),
      k.color(45, 55, 72),
      k.area(),
      k.outline(4, k.rgb(...char.color)),
      { charId: char.id, selected: false, baseY: cardY },
      "charCard",
    ]);

    // Character sprite - moved up 20px more to not overlap name
    const spriteY = cardY - 70;
    const preview = k.add([
      k.sprite(char.id),
      k.pos(x, spriteY),
      k.anchor("center"),
      k.scale(2.8),
      { charId: char.id },
      "charPreview",
    ]);
    preview.play("idle");

    // Character name - below sprite with proper gap
    const nameY = spriteY + 90;
    k.add([
      k.text(char.name, { size: 20 }),
      k.pos(x, nameY),
      k.anchor("center"),
      k.color(...BRAND.WHITE),
    ]);

    // Superpower badge
    k.add([
      k.rect(160, 32, { radius: 16 }),
      k.pos(x, nameY + 45),
      k.anchor("center"),
      k.color(...char.color),
      k.opacity(0.3),
    ]);

    k.add([
      k.text(`${char.superpower.icon} ${char.superpower.name}`, { size: 14 }),
      k.pos(x, nameY + 45),
      k.anchor("center"),
      k.color(...BRAND.GRAY),
    ]);

    // Description - centered
    k.add([
      k.text(char.superpower.description, { size: 13, width: cardWidth - 32 }),
      k.pos(x, nameY + 95),
      k.anchor("center"),
      k.color(...BRAND.GRAY),
    ]);

    // Tech stack - centered
    const techHint = char.id === "frontend" 
      ? "React • TypeScript • CSS" 
      : ".NET • PostgreSQL • AWS";
    k.add([
      k.text(techHint, { size: 11 }),
      k.pos(x, nameY + 145),
      k.anchor("center"),
      k.color(...BRAND.GRAY),
    ]);

    // Hover
    card.onHover(() => {
      card.outline.width = 6;
      k.get("charPreview").forEach(p => {
        if (p.charId === char.id) p.play("run");
      });
    });

    card.onHoverEnd(() => {
      if (!card.selected) card.outline.width = 4;
      k.get("charPreview").forEach(p => {
        if (p.charId === char.id && !card.selected) p.play("idle");
      });
    });

    // Click
    card.onClick(() => {
      k.get("charCard").forEach(c => {
        c.selected = false;
        c.outline.color = k.rgb(...characters[c.charId].color);
        c.outline.width = 4;
      });
      k.get("charPreview").forEach(p => p.play("idle"));
      
      card.selected = true;
      card.outline.color = k.rgb(...BRAND.WHITE);
      card.outline.width = 6;
      selectedChar = char.id;
      
      k.get("charPreview").forEach(p => {
        if (p.charId === char.id) p.play("run");
      });
    });
  });

  // Start button
  const startBtn = k.add([
    k.rect(200, 52, { radius: 12 }),
    k.pos(k.width() / 2, btnY),
    k.anchor("center"),
    k.color(75, 85, 99),
    k.area(),
    "startBtn",
  ]);

  const startText = k.add([
    k.text("▶ START GAME", { size: 18 }),
    k.pos(k.width() / 2, btnY),
    k.anchor("center"),
    k.color(...BRAND.GRAY),
    "startText",
  ]);

  k.onUpdate(() => {
    if (selectedChar) {
      startBtn.color = k.rgb(...BRAND.PRIMARY);
      startText.color = k.rgb(...BRAND.WHITE);
    }

    k.get("charCard").forEach(card => {
      card.pos.y = card.selected 
        ? card.baseY + Math.sin(k.time() * 4) * 3 
        : card.baseY;
    });
  });

  startBtn.onClick(() => {
    if (selectedChar) {
      gameState.character = selectedChar;
      gameState.coins = 0;
      gameState.lives = 3;
      gameState.time = 0;
      k.go("game");
    }
  });

  k.onKeyPress("1", () => selectCharacter("frontend"));
  k.onKeyPress("2", () => selectCharacter("backend"));
  k.onKeyPress("enter", () => {
    if (selectedChar) {
      gameState.character = selectedChar;
      gameState.coins = 0;
      gameState.lives = 3;
      k.go("game");
    }
  });

  function selectCharacter(id) {
    selectedChar = id;
    k.get("charCard").forEach(c => {
      c.selected = c.charId === id;
      c.outline.color = c.selected ? k.rgb(...BRAND.WHITE) : k.rgb(...characters[c.charId].color);
      c.outline.width = c.selected ? 6 : 4;
    });
    k.get("charPreview").forEach(p => {
      p.play(p.charId === id ? "run" : "idle");
    });
  }
}
