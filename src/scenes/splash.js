import { BRAND } from "../config/colors.js";

export function splashScene(k, gameState) {
  k.setBackground(...BRAND.BG_DARK);

  // Start music on splash
  let music = null;
  try { music = k.play("music", { loop: true, volume: 0.3 }); } catch (e) {}
  gameState.music = music;

  // Particles
  for (let i = 0; i < 20; i++) {
    k.add([
      k.circle(k.rand(2, 5)),
      k.pos(k.rand(0, k.width()), k.rand(0, k.height())),
      k.color(255, 255, 255),
      k.opacity(k.rand(0.1, 0.2)),
      { speed: k.rand(30, 60) },
      "particle",
    ]);
  }

  k.onUpdate("particle", (p) => {
    p.pos.y -= p.speed * k.dt();
    if (p.pos.y < 0) {
      p.pos.y = k.height();
      p.pos.x = k.rand(0, k.width());
    }
  });

  // Layout: Logo -> 80px -> Text -> 80px -> Avatars -> 80px -> Button -> 24px -> hint
  const logoY = 140;
  const textY = logoY + 80 + 40; // 80px gap + half text height
  const avatarY = textY + 40 + 80; // 80px gap
  const btnY = avatarY + 50 + 80; // 80px gap
  const hintY = btnY + 28 + 24; // 24px gap

  // Shiji Logo
  k.add([
    k.sprite("shiji-logo"),
    k.pos(k.width() / 2, logoY),
    k.anchor("center"),
    k.scale(0.5),
  ]);

  // Main tagline
  k.add([
    k.text("Every adventure begins somewhere.", { size: 28 }),
    k.pos(k.width() / 2, textY - 20),
    k.anchor("center"),
    k.color(...BRAND.WHITE),
  ]);

  k.add([
    k.text("Yours begins with Shiji.", { size: 28 }),
    k.pos(k.width() / 2, textY + 20),
    k.anchor("center"),
    k.color(...BRAND.WHITE),
  ]);

  // Character previews - centered
  const frontendPreview = k.add([
    k.sprite("frontend"),
    k.pos(k.width() / 2 - 50, avatarY),
    k.anchor("center"),
    k.scale(2.2),
  ]);
  frontendPreview.play("run");

  const backendPreview = k.add([
    k.sprite("backend"),
    k.pos(k.width() / 2 + 50, avatarY),
    k.anchor("center"),
    k.scale(2.2),
  ]);
  backendPreview.play("run");
  backendPreview.flipX = true;

  // Play button
  const startBtn = k.add([
    k.rect(220, 56, { radius: 12 }),
    k.pos(k.width() / 2, btnY),
    k.anchor("center"),
    k.color(...BRAND.PRIMARY),
    k.area(),
    "startBtn",
  ]);

  k.add([
    k.text("▶ PLAY", { size: 26 }),
    k.pos(k.width() / 2, btnY),
    k.anchor("center"),
    k.color(...BRAND.WHITE),
  ]);

  startBtn.onHover(() => startBtn.color = k.rgb(37, 99, 235));
  startBtn.onHoverEnd(() => startBtn.color = k.rgb(...BRAND.PRIMARY));

  // Hint under button
  k.add([
    k.text("...or press SPACE", { size: 13 }),
    k.pos(k.width() / 2, hintY),
    k.anchor("center"),
    k.color(...BRAND.GRAY),
  ]);

  // Credits - bottom left, same size as hint (13px)
  const creditsLink = k.add([
    k.text("Music by EricSkiff", { size: 13 }),
    k.pos(24, k.height() - 24),
    k.anchor("left"),
    k.color(...BRAND.GRAY),
    k.area(),
  ]);

  creditsLink.onClick(() => window.open("https://ericskiff.com/music/", "_blank"));

  // Shiji link - bottom right, same size as hint (13px)
  const shijiLink = k.add([
    k.text("shijigroup.com", { size: 13 }),
    k.pos(k.width() - 24, k.height() - 24),
    k.anchor("right"),
    k.color(...BRAND.GRAY),
    k.area(),
  ]);

  shijiLink.onClick(() => window.open("https://www.shijigroup.com/", "_blank"));

  // Handlers
  startBtn.onClick(() => k.go("select"));
  k.onKeyPress("space", () => k.go("select"));
  k.onKeyPress("enter", () => k.go("select"));
}
