import { characters } from "../data/characters.js";
import { jobs } from "../data/jobs.js";
import { BRAND } from "../config/colors.js";

export function endScene(k, gameState) {
  const char = characters[gameState.character];
  const job = jobs[gameState.character];

  k.setBackground(...BRAND.BG_DARK);

  // Confetti
  for (let i = 0; i < 50; i++) {
    const colors = [BRAND.WARNING, BRAND.SUCCESS, [139, 92, 246], [236, 72, 153]];
    const col = colors[Math.floor(Math.random() * colors.length)];
    k.add([
      k.rect(k.rand(4, 10), k.rand(4, 10)),
      k.pos(k.rand(0, k.width()), k.rand(-100, 0)),
      k.color(...col),
      k.rotate(k.rand(0, 360)),
      { fallSpeed: k.rand(80, 150), rotSpeed: k.rand(-200, 200) },
      "confetti",
    ]);
  }

  k.onUpdate("confetti", (c) => {
    c.pos.y += c.fallSpeed * k.dt();
    c.angle += c.rotSpeed * k.dt();
    if (c.pos.y > k.height() + 20) {
      c.pos.y = -20;
      c.pos.x = k.rand(0, k.width());
    }
  });

  // Layout - 40px margins top and bottom for card
  const headerY = 28;
  const statsY = headerY + 24 + 16;
  const margin = 40;
  const btnY = k.height() - 80;
  const cardTop = statsY + 16 + margin;
  const cardBottom = btnY - margin;
  const cardH = cardBottom - cardTop;
  const cardY = cardTop + cardH / 2;
  const cardW = 640;

  // Header - "Mission Complete!"
  k.add([
    k.text("🎉 Mission Complete! 🎉", { size: 30 }),
    k.pos(k.width() / 2, headerY),
    k.anchor("center"),
    k.color(...BRAND.SUCCESS),
  ]);

  // Stats bar
  k.add([
    k.rect(320, 32, { radius: 16 }),
    k.pos(k.width() / 2, statsY),
    k.anchor("center"),
    k.color(45, 55, 72),
  ]);

  k.add([
    k.text(`⏱️ ${gameState.time}s`, { size: 14 }),
    k.pos(k.width() / 2 - 80, statsY),
    k.anchor("center"),
    k.color(...BRAND.GRAY),
  ]);

  k.add([
    k.text(`🪙 ${gameState.coins}`, { size: 14 }),
    k.pos(k.width() / 2, statsY),
    k.anchor("center"),
    k.color(...BRAND.WARNING),
  ]);

  k.add([
    k.text(`❤️ ${gameState.lives}`, { size: 14 }),
    k.pos(k.width() / 2 + 80, statsY),
    k.anchor("center"),
    k.color(239, 68, 68),
  ]);

  // Job card
  k.add([
    k.rect(cardW, cardH, { radius: 16 }),
    k.pos(k.width() / 2 + 4, cardY + 4),
    k.anchor("center"),
    k.color(0, 0, 0),
    k.opacity(0.3),
  ]);

  k.add([
    k.rect(cardW, cardH, { radius: 16 }),
    k.pos(k.width() / 2, cardY),
    k.anchor("center"),
    k.color(45, 55, 72),
    k.outline(3, k.rgb(...char.color)),
  ]);

  // Content layout inside card
  const contentTop = cardTop + 20;
  
  // Avatar - scale increased by 10% more (total ~28% from original)
  const charSprite = k.add([
    k.sprite(gameState.character),
    k.pos(k.width() / 2, contentTop + 45),
    k.anchor("center"),
    k.scale(2.28),
  ]);
  charSprite.play("idle");

  // "Hiring" badge - 20px gap below avatar (accounting for larger sprite)
  const badgeY = contentTop + 115;
  k.add([
    k.rect(100, 24, { radius: 12 }),
    k.pos(k.width() / 2, badgeY),
    k.anchor("center"),
    k.color(...char.color),
  ]);
  k.add([
    k.text("🚀 Hiring", { size: 12 }),
    k.pos(k.width() / 2, badgeY),
    k.anchor("center"),
    k.color(...BRAND.WHITE),
  ]);

  // Job title - 20px gap below badge
  const titleY = badgeY + 44;
  k.add([
    k.text(job.title, { size: 17 }),
    k.pos(k.width() / 2, titleY),
    k.anchor("center"),
    k.color(...BRAND.WHITE),
  ]);

  // Location
  k.add([
    k.text(`📍 ${job.team} • ${job.location}`, { size: 11 }),
    k.pos(k.width() / 2, titleY + 25),
    k.anchor("center"),
    k.color(...BRAND.GRAY),
  ]);

  // Salary
  let nextY = titleY + 50;
  if (job.salary) {
    k.add([
      k.rect(170, 24, { radius: 12 }),
      k.pos(k.width() / 2, nextY),
      k.anchor("center"),
      k.color(...BRAND.SUCCESS),
      k.opacity(0.2),
    ]);
    k.add([
      k.text(`💰 ${job.salary}`, { size: 13 }),
      k.pos(k.width() / 2, nextY),
      k.anchor("center"),
      k.color(...BRAND.SUCCESS),
    ]);
    nextY += 28;
  }

  // Tech stack
  k.add([
    k.text(`Tech: ${job.tech.join(" • ")}`, { size: 10, width: 580 }),
    k.pos(k.width() / 2, nextY + 5),
    k.anchor("center"),
    k.color(...BRAND.GRAY),
  ]);

  // Highlights
  const highlightX = k.width() / 2 - cardW / 2 + 24;
  job.highlights.forEach((h, i) => {
    k.add([
      k.text(`✓ ${h}`, { size: 11 }),
      k.pos(highlightX, nextY + 35 + i * 22),
      k.anchor("left"),
      k.color(...BRAND.SUCCESS),
    ]);
  });

  // Email row - inside card with border
  // Border: 16px side padding, 8px top padding, 24px gap between email and copy
  const emailBoxW = cardW - 32; // 16px each side
  const emailBoxH = 36;
  const emailInsideY = cardBottom - 8 - emailBoxH/2; // 8px from bottom
  
  // Email border box
  k.add([
    k.rect(emailBoxW, emailBoxH, { radius: 8 }),
    k.pos(k.width() / 2, emailInsideY),
    k.anchor("center"),
    k.color(45, 55, 72),
    k.outline(1, k.rgb(75, 85, 99)),
  ]);
  
  const emailLink = k.add([
    k.text(`📧 ${job.contact}`, { size: 12 }),
    k.pos(k.width() / 2 - 12, emailInsideY), // shifted left for 24px gap
    k.anchor("center"),
    k.color(...BRAND.GRAY),
    k.area(),
  ]);

  emailLink.onClick(() => {
    window.location.href = `mailto:${job.contact}`;
  });

  // Copy email button - 24px gap from email
  const copyBtn = k.add([
    k.text("📋 Copy", { size: 11 }),
    k.pos(k.width() / 2 + 140, emailInsideY), // 24px gap
    k.anchor("center"),
    k.color(...BRAND.GRAY),
    k.area(),
  ]);

  copyBtn.onClick(() => {
    navigator.clipboard.writeText(job.contact);
    k.add([
      k.text("✓ Copied!", { size: 11 }),
      k.pos(k.width() / 2 + 140, emailInsideY - 25),
      k.anchor("center"),
      k.color(...BRAND.SUCCESS),
      k.lifespan(1.5, { fade: 0.5 }),
    ]);
  });

  // Action buttons
  const btnW = 160;
  const btnGap = 16;
  const totalW = btnW * 3 + btnGap * 2;
  const btnStartX = (k.width() - totalW) / 2 + btnW / 2;

  const applyUrl = gameState.character === "frontend"
    ? "https://jobs.smartrecruiters.com/ShijiGroup/744000103501925-senior-frontend-developer-i-daylight"
    : "https://jobs.smartrecruiters.com/ShijiGroup/744000102015355-backend-developer-net-i-daylight";

  const applyBtn = k.add([
    k.rect(btnW, 44, { radius: 10 }),
    k.pos(btnStartX, btnY),
    k.anchor("center"),
    k.color(...BRAND.PRIMARY),
    k.area(),
  ]);
  k.add([
    k.text("📝 APPLY", { size: 14 }),
    k.pos(btnStartX, btnY),
    k.anchor("center"),
    k.color(...BRAND.WHITE),
  ]);

  const playBtn = k.add([
    k.rect(btnW, 44, { radius: 10 }),
    k.pos(btnStartX + btnW + btnGap, btnY),
    k.anchor("center"),
    k.color(55, 65, 81),
    k.area(),
  ]);
  k.add([
    k.text("🔄 Play again", { size: 13 }),
    k.pos(btnStartX + btnW + btnGap, btnY),
    k.anchor("center"),
    k.color(...BRAND.GRAY),
  ]);

  const shareBtn = k.add([
    k.rect(btnW, 44, { radius: 10 }),
    k.pos(btnStartX + (btnW + btnGap) * 2, btnY),
    k.anchor("center"),
    k.color(55, 65, 81),
    k.area(),
  ]);
  k.add([
    k.text("📤 Share", { size: 14 }),
    k.pos(btnStartX + (btnW + btnGap) * 2, btnY),
    k.anchor("center"),
    k.color(...BRAND.GRAY),
  ]);

  // Shiji link
  const shijiLink = k.add([
    k.text("shijigroup.com", { size: 11 }),
    k.pos(k.width() / 2, k.height() - 16),
    k.anchor("center"),
    k.color(...BRAND.GRAY),
    k.area(),
  ]);

  shijiLink.onClick(() => window.open("https://www.shijigroup.com/", "_blank"));

  // Handlers
  applyBtn.onClick(() => window.open(applyUrl, "_blank"));
  playBtn.onClick(() => k.go("select"));
  shareBtn.onClick(() => {
    const text = `🎮 I completed Shiji Quest as ${char.name} in ${gameState.time}s! Check out job offers at Shiji Poland.`;
    if (navigator.share) {
      navigator.share({ title: "Shiji Quest", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      k.add([
        k.text("✓ Copied!", { size: 12 }),
        k.pos(btnStartX + (btnW + btnGap) * 2, btnY - 28),
        k.anchor("center"),
        k.color(...BRAND.SUCCESS),
        k.lifespan(2, { fade: 1 }),
      ]);
    }
  });

  k.onKeyPress("enter", () => k.go("select"));
  k.onKeyPress("space", () => k.go("select"));
}
