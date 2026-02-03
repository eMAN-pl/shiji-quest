// Procedural sprite generator for characters
export function generateCharacterSprite(config) {
  const { bodyColor, hairColor, skinColor = '#FFD5B8', hasBeard, accessory } = config;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Sprite sheet: 4 frames (idle, run1, run2, jump) - each 32x48px
  canvas.width = 32 * 4;
  canvas.height = 48;
  
  for (let frame = 0; frame < 4; frame++) {
    const x = frame * 32;
    
    // BODY (hoodie/torso)
    ctx.fillStyle = bodyColor;
    roundRect(ctx, x + 6, 18, 20, 22, 4);
    
    // HEAD
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(x + 16, 12, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // HAIR
    ctx.fillStyle = hairColor;
    roundRect(ctx, x + 8, 4, 16, 8, 3);
    
    // EYES
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 12, 10, 2, 3);
    ctx.fillRect(x + 18, 10, 2, 3);
    
    // MOUTH (smile)
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 14, 15, 4, 1);
    
    // BEARD (backend only)
    if (hasBeard) {
      ctx.fillStyle = hairColor;
      roundRect(ctx, x + 12, 16, 8, 5, 2);
    }
    
    // LEGS (animated)
    ctx.fillStyle = '#374151';
    if (frame === 0) { // idle
      ctx.fillRect(x + 9, 40, 5, 8);
      ctx.fillRect(x + 18, 40, 5, 8);
    } else if (frame === 1) { // run1
      ctx.fillRect(x + 6, 40, 5, 8);
      ctx.fillRect(x + 21, 36, 5, 8);
    } else if (frame === 2) { // run2
      ctx.fillRect(x + 21, 40, 5, 8);
      ctx.fillRect(x + 6, 36, 5, 8);
    } else { // jump
      ctx.fillRect(x + 6, 36, 5, 6);
      ctx.fillRect(x + 21, 36, 5, 6);
    }
    
    // ACCESSORIES
    if (accessory === 'headphones') {
      ctx.fillStyle = '#8B5CF6';
      ctx.fillRect(x + 6, 6, 3, 10);
      ctx.fillRect(x + 23, 6, 3, 10);
      ctx.fillRect(x + 6, 3, 20, 4);
    }
    if (accessory === 'coffee') {
      ctx.fillStyle = '#FFF';
      roundRect(ctx, x + 24, 22, 7, 10, 2);
      ctx.fillStyle = '#6B4423';
      ctx.fillRect(x + 25, 24, 5, 6);
    }
  }
  
  return canvas.toDataURL();
}

// Helper: rounded rectangle
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

// Generate coin sprite (animated)
export function generateCoinSprite() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 4 frames of rotation
  canvas.width = 16 * 4;
  canvas.height = 16;
  
  const frames = [16, 12, 8, 12]; // width at each frame (fake 3D)
  
  frames.forEach((w, i) => {
    const x = i * 16 + 8;
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.ellipse(x, 8, w/2, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#EAB308';
    ctx.beginPath();
    ctx.ellipse(x, 8, w/2 - 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  
  return canvas.toDataURL();
}

// Generate bug/enemy sprite
export function generateBugSprite() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 2 frames (walk animation)
  canvas.width = 32 * 2;
  canvas.height = 24;
  
  for (let frame = 0; frame < 2; frame++) {
    const x = frame * 32;
    
    // Body
    ctx.fillStyle = '#EF4444';
    roundRect(ctx, x + 4, 6, 24, 14, 6);
    
    // Eyes
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(x + 10, 10, 4, 0, Math.PI * 2);
    ctx.arc(x + 22, 10, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + 11, 10, 2, 0, Math.PI * 2);
    ctx.arc(x + 23, 10, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Legs (animated)
    ctx.fillStyle = '#B91C1C';
    if (frame === 0) {
      ctx.fillRect(x + 6, 18, 3, 6);
      ctx.fillRect(x + 14, 18, 3, 6);
      ctx.fillRect(x + 22, 18, 3, 6);
    } else {
      ctx.fillRect(x + 8, 18, 3, 6);
      ctx.fillRect(x + 16, 18, 3, 6);
      ctx.fillRect(x + 24, 18, 3, 6);
    }
    
    // Antennae
    ctx.strokeStyle = '#B91C1C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 10, 6);
    ctx.lineTo(x + 8, 2);
    ctx.moveTo(x + 22, 6);
    ctx.lineTo(x + 24, 2);
    ctx.stroke();
  }
  
  return canvas.toDataURL();
}
