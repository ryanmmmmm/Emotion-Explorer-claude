/**
 * Visual Effects Manager
 * Advanced particle systems, lighting, and post-processing effects using Phaser 3 WebGL
 */

import Phaser from 'phaser';

export class VisualEffectsManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Create magical aurora background effect
   */
  createAuroraBackground(color: number = 0x9370db): void {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    // Multiple layers of aurora
    for (let i = 0; i < 3; i++) {
      const graphics = this.scene.add.graphics();
      graphics.setDepth(-10 + i);

      // Draw wavy aurora bands
      const waveY = 200 + i * 100;

      graphics.fillGradientStyle(color, color, 0x000000, 0x000000, 0.2, 0.1, 0, 0);

      const points: number[][] = [];
      for (let x = 0; x <= width; x += 20) {
        const y = waveY + Math.sin((x / width) * Math.PI * 4 + i) * 50;
        points.push([x, y]);
      }

      // Create smooth curve
      const curve = new Phaser.Curves.Spline(points);
      const curvePoints = curve.getPoints(100);

      const bottomPoints = [
        new Phaser.Math.Vector2(width, height),
        new Phaser.Math.Vector2(0, height)
      ];
      graphics.fillPoints([...curvePoints, ...bottomPoints], true);

      // Animate aurora
      this.scene.tweens.add({
        targets: graphics,
        alpha: 0.15 + i * 0.05,
        duration: 3000 + i * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  /**
   * Create volumetric light rays
   */
  createLightRays(x: number, y: number, color: number = 0xffd700, count: number = 12): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const length = 300 + Math.random() * 200;

      const ray = this.scene.add.rectangle(
        x,
        y,
        5,
        length,
        color,
        0.15
      );

      ray.setOrigin(0.5, 0);
      ray.setRotation(angle);
      ray.setBlendMode(Phaser.BlendModes.ADD);
      ray.setDepth(5);

      // Animate ray
      this.scene.tweens.add({
        targets: ray,
        alpha: 0.05,
        scaleX: 0.5,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 1000
      });

      // Rotate rays slowly
      this.scene.tweens.add({
        targets: ray,
        rotation: angle + Math.PI * 2,
        duration: 20000,
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  /**
   * Create magical sparkle particles
   */
  createSparkles(x: number, y: number, color: number = 0xffd700, radius: number = 100): Phaser.GameObjects.Particles.ParticleEmitter {
    // Create particle texture
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('sparkle', 8, 8);
    graphics.destroy();

    const circle = new Phaser.Geom.Circle(0, 0, radius);
    const emitter = this.scene.add.particles(x, y, 'sparkle', {
      speed: { min: 20, max: 80 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: color,
      lifespan: 2000,
      frequency: 100,
      blendMode: Phaser.BlendModes.ADD,
      emitZone: { type: 'random', source: circle as any }
    });

    emitter.setDepth(100);
    return emitter;
  }

  /**
   * Create energy pulse effect
   */
  createEnergyPulse(x: number, y: number, color: number = 0x00ced1, count: number = 5): void {
    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 300, () => {
        const ring = this.scene.add.circle(x, y, 10, color, 0);
        ring.setStrokeStyle(3, color, 1);
        ring.setBlendMode(Phaser.BlendModes.ADD);
        ring.setDepth(50);

        this.scene.tweens.add({
          targets: ring,
          scaleX: 8,
          scaleY: 8,
          alpha: 0,
          duration: 1500,
          ease: 'Cubic.easeOut',
          onComplete: () => ring.destroy()
        });
      });
    }
  }

  /**
   * Create floating orbs
   */
  createFloatingOrbs(count: number = 20, color: number = 0x9370db): Phaser.GameObjects.Group {
    const orbs = this.scene.add.group();

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, this.scene.scale.width);
      const y = Phaser.Math.Between(0, this.scene.scale.height);

      const container = this.scene.add.container(x, y);

      // Outer glow
      const glow = this.scene.add.circle(0, 0, 15, color, 0.2);
      glow.setBlendMode(Phaser.BlendModes.ADD);

      // Inner orb
      const orb = this.scene.add.circle(0, 0, 8, color, 0.6);
      orb.setBlendMode(Phaser.BlendModes.ADD);

      // Core light
      const core = this.scene.add.circle(0, 0, 3, 0xffffff, 0.8);
      core.setBlendMode(Phaser.BlendModes.ADD);

      container.add([glow, orb, core]);
      container.setDepth(15);

      orbs.add(container);

      // Floating animation
      this.scene.tweens.add({
        targets: container,
        y: y + Phaser.Math.Between(-50, 50),
        x: x + Phaser.Math.Between(-30, 30),
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 2000
      });

      // Pulsing animation
      this.scene.tweens.add({
        targets: [glow, orb],
        scale: 1.3,
        alpha: 0.8,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    return orbs;
  }

  /**
   * Create depth-based parallax stars
   */
  createParallaxStars(layerCount: number = 3): void {
    for (let layer = 0; layer < layerCount; layer++) {
      const depth = layer - 20;
      const count = 50 - layer * 10;
      const speed = (layer + 1) * 0.2;

      for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(0, this.scene.scale.width);
        const y = Phaser.Math.Between(0, this.scene.scale.height);
        const size = 1 + (layerCount - layer) * 0.5;
        const alpha = 0.3 + (layerCount - layer) * 0.2;

        const star = this.scene.add.circle(x, y, size, 0xffffff, alpha);
        star.setDepth(depth);
        star.setBlendMode(Phaser.BlendModes.ADD);

        // Twinkling
        this.scene.tweens.add({
          targets: star,
          alpha: alpha * 0.3,
          duration: 1000 + Math.random() * 2000,
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 2000
        });

        // Parallax movement (very subtle)
        this.scene.tweens.add({
          targets: star,
          x: x + 20,
          duration: 10000 / speed,
          repeat: -1,
          yoyo: true,
          ease: 'Linear'
        });
      }
    }
  }

  /**
   * Create emotion-colored glow overlay
   */
  createEmotionGlow(x: number, y: number, color: number, radius: number = 400): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    graphics.setDepth(2);

    // Radial gradient glow
    graphics.fillGradientStyle(
      color, color, color, color,
      0.3, 0.2, 0.1, 0
    );

    graphics.fillCircle(x, y, radius);
    graphics.setBlendMode(Phaser.BlendModes.ADD);

    // Pulsing animation
    this.scene.tweens.add({
      targets: graphics,
      alpha: 0.5,
      scale: 1.1,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return graphics;
  }

  /**
   * Create mystical portal effect
   */
  createPortalEffect(x: number, y: number, color: number = 0x9370db): void {
    // Outer rings
    for (let i = 0; i < 5; i++) {
      const ring = this.scene.add.circle(x, y, 100 + i * 30, color, 0);
      ring.setStrokeStyle(2, color, 0.3 - i * 0.05);
      ring.setBlendMode(Phaser.BlendModes.ADD);
      ring.setDepth(25);

      this.scene.tweens.add({
        targets: ring,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 0,
        duration: 2000,
        repeat: -1,
        delay: i * 400,
        ease: 'Cubic.easeOut'
      });
    }

    // Center glow
    const glow = this.scene.add.circle(x, y, 80, color, 0.4);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    glow.setDepth(25);

    this.scene.tweens.add({
      targets: glow,
      scale: 1.3,
      alpha: 0.2,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Particle swirl
    const emitter = this.scene.add.particles(x, y, 'sparkle', {
      speed: 50,
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      tint: color,
      lifespan: 2000,
      frequency: 50,
      blendMode: Phaser.BlendModes.ADD,
      emitZone: {
        type: 'edge',
        source: new Phaser.Geom.Circle(0, 0, 100),
        quantity: 50
      }
    });

    emitter.setDepth(26);
  }

  /**
   * Create rain effect
   */
  createRainEffect(intensity: number = 100, color: number = 0x00ced1): Phaser.GameObjects.Particles.ParticleEmitter {
    const emitter = this.scene.add.particles(0, -50, 'particle', {
      x: { min: 0, max: this.scene.scale.width },
      y: 0,
      lifespan: 2000,
      speedY: { min: 300, max: 500 },
      speedX: { min: -20, max: 20 },
      scaleX: 0.1,
      scaleY: { min: 2, max: 4 },
      alpha: { start: 0.6, end: 0.3 },
      tint: color,
      frequency: 1000 / intensity,
      blendMode: Phaser.BlendModes.ADD
    });

    emitter.setDepth(150);
    return emitter;
  }

  /**
   * Create firefly swarm
   */
  createFireflies(count: number = 30, color: number = 0xffd700): void {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, this.scene.scale.width);
      const y = Phaser.Math.Between(0, this.scene.scale.height);

      const firefly = this.scene.add.circle(x, y, 3, color, 0.8);
      firefly.setBlendMode(Phaser.BlendModes.ADD);
      firefly.setDepth(30);

      // Erratic movement
      const moveFirefly = () => {
        const newX = Phaser.Math.Between(0, this.scene.scale.width);
        const newY = Phaser.Math.Between(0, this.scene.scale.height);
        const distance = Phaser.Math.Distance.Between(firefly.x, firefly.y, newX, newY);
        const duration = distance * 10;

        this.scene.tweens.add({
          targets: firefly,
          x: newX,
          y: newY,
          duration,
          ease: 'Sine.easeInOut',
          onComplete: moveFirefly
        });
      };

      moveFirefly();

      // Flickering
      this.scene.tweens.add({
        targets: firefly,
        alpha: 0.2,
        scale: 0.5,
        duration: 500 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  /**
   * Create screen flash effect
   */
  flashScreen(color: number = 0xffffff, duration: number = 300): void {
    const flash = this.scene.add.rectangle(
      0, 0,
      this.scene.scale.width,
      this.scene.scale.height,
      color,
      0.6
    );
    flash.setOrigin(0);
    flash.setDepth(200);

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration,
      onComplete: () => flash.destroy()
    });
  }

  /**
   * Create vignette effect
   */
  createVignette(intensity: number = 0.6): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    graphics.setDepth(180);

    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    graphics.fillGradientStyle(
      0x000000, 0x000000, 0x000000, 0x000000,
      0, intensity, intensity, 0
    );

    graphics.fillRect(0, 0, width, height);
    graphics.setBlendMode(Phaser.BlendModes.MULTIPLY);

    return graphics;
  }

  /**
   * Create floating treasure chest
   */
  createTreasureChest(x: number, y: number, color: number = 0xD4AF37): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const graphics = this.scene.add.graphics();

    // Chest body
    graphics.fillStyle(0x8B4513, 1);
    graphics.fillRect(-25, -15, 50, 30);

    // Chest lid
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-25, -25, 50, 12);

    // Gold trim
    graphics.lineStyle(3, color, 1);
    graphics.strokeRect(-25, -15, 50, 30);
    graphics.strokeRect(-25, -25, 50, 12);

    // Keyhole
    graphics.fillStyle(color, 1);
    graphics.fillCircle(0, 0, 4);

    // Sparkles from chest
    const sparkle1 = this.scene.add.circle(-15, -30, 3, color, 0.8);
    const sparkle2 = this.scene.add.circle(15, -30, 2, color, 0.8);
    const sparkle3 = this.scene.add.circle(0, -35, 2, 0xFFFFFF, 0.8);
    sparkle1.setBlendMode(Phaser.BlendModes.ADD);
    sparkle2.setBlendMode(Phaser.BlendModes.ADD);
    sparkle3.setBlendMode(Phaser.BlendModes.ADD);

    container.add([graphics, sparkle1, sparkle2, sparkle3]);
    container.setDepth(20);

    // Floating animation
    this.scene.tweens.add({
      targets: container,
      y: y - 10,
      duration: 2000 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Sparkle twinkle
    this.scene.tweens.add({
      targets: [sparkle1, sparkle2, sparkle3],
      alpha: 0.2,
      scale: 0.5,
      duration: 800 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return container;
  }

  /**
   * Create flying bird/creature
   */
  createFlyingCreature(startX: number, startY: number, color: number = 0x9370DB): void {
    const bird = this.scene.add.container(startX, startY);
    const graphics = this.scene.add.graphics();

    // Bird body (simple silhouette)
    graphics.fillStyle(color, 0.7);
    graphics.fillCircle(0, 0, 8);

    // Wings (two triangles)
    graphics.beginPath();
    graphics.moveTo(-15, 0);
    graphics.lineTo(-8, -5);
    graphics.lineTo(-8, 5);
    graphics.closePath();
    graphics.fillPath();

    graphics.beginPath();
    graphics.moveTo(15, 0);
    graphics.lineTo(8, -5);
    graphics.lineTo(8, 5);
    graphics.closePath();
    graphics.fillPath();

    // Glow trail
    const glow = this.scene.add.circle(0, 0, 15, color, 0.2);
    glow.setBlendMode(Phaser.BlendModes.ADD);

    bird.add([glow, graphics]);
    bird.setDepth(15);

    // Wing flapping animation
    this.scene.tweens.add({
      targets: graphics,
      scaleY: 0.8,
      duration: 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Flight path across screen
    const endX = startX > this.scene.scale.width / 2
      ? -100
      : this.scene.scale.width + 100;
    const midY = startY + Phaser.Math.Between(-100, 100);

    this.scene.tweens.add({
      targets: bird,
      x: endX,
      y: midY,
      duration: 8000 + Math.random() * 4000,
      ease: 'Sine.easeInOut',
      onComplete: () => bird.destroy()
    });

    // Bobbing motion
    this.scene.tweens.add({
      targets: bird,
      y: `+=${Phaser.Math.Between(10, 30)}`,
      duration: 1000 + Math.random() * 500,
      yoyo: true,
      repeat: 10,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Create ancient stone pillar
   */
  createAncientPillar(x: number, y: number, height: number = 200): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const graphics = this.scene.add.graphics();

    // Pillar body
    graphics.fillStyle(0x696969, 0.8);
    graphics.fillRect(-20, -height, 40, height);

    // Pillar top
    graphics.fillStyle(0x555555, 0.9);
    graphics.fillRect(-25, -height - 15, 50, 15);

    // Cracks and weathering
    graphics.lineStyle(2, 0x4A4A4A, 0.6);
    graphics.lineBetween(-10, -height + 50, 15, -height + 70);
    graphics.lineBetween(5, -height + 120, -15, -height + 150);

    // Ancient runes
    graphics.fillStyle(0xD4AF37, 0.4);
    for (let i = 0; i < 3; i++) {
      const runeY = -height + 40 + i * 50;
      graphics.fillCircle(0, runeY, 4);
      graphics.fillRect(-8, runeY, 16, 2);
    }

    container.add(graphics);
    container.setDepth(5);

    // Subtle glow on runes
    const runeGlow = this.scene.add.circle(0, -height / 2, 30, 0xD4AF37, 0.1);
    runeGlow.setBlendMode(Phaser.BlendModes.ADD);
    container.add(runeGlow);

    this.scene.tweens.add({
      targets: runeGlow,
      alpha: 0.05,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return container;
  }

  /**
   * Create magical torch/lantern
   */
  createMagicalTorch(x: number, y: number, color: number = 0xFFA500): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const graphics = this.scene.add.graphics();

    // Torch handle
    graphics.fillStyle(0x8B4513, 1);
    graphics.fillRect(-5, 0, 10, 60);

    // Torch top
    graphics.fillStyle(0x654321, 1);
    graphics.fillCircle(0, -5, 12);

    container.add(graphics);

    // Flame
    const flame = this.scene.add.circle(0, -15, 15, color, 0.8);
    flame.setBlendMode(Phaser.BlendModes.ADD);
    container.add(flame);

    // Flame glow
    const glow = this.scene.add.circle(0, -15, 30, color, 0.3);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    container.add(glow);

    // Light particles
    const emitter = this.scene.add.particles(x, y - 15, 'sparkle', {
      speed: { min: 10, max: 30 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.8, end: 0 },
      tint: color,
      lifespan: 1000,
      frequency: 100,
      blendMode: Phaser.BlendModes.ADD
    });
    emitter.setDepth(21);

    container.setDepth(20);

    // Flickering animation
    this.scene.tweens.add({
      targets: [flame, glow],
      scaleX: { from: 0.9, to: 1.1 },
      scaleY: { from: 1.1, to: 0.9 },
      alpha: { from: 0.6, to: 1 },
      duration: 200 + Math.random() * 200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return container;
  }

  /**
   * Create shooting star effect
   */
  createShootingStar(color: number = 0xFFFFFF): void {
    const startX = Phaser.Math.Between(0, this.scene.scale.width);
    const startY = Phaser.Math.Between(0, this.scene.scale.height / 3);

    const star = this.scene.add.circle(startX, startY, 4, color, 1);
    star.setBlendMode(Phaser.BlendModes.ADD);
    star.setDepth(100);

    // Trail
    const trail = this.scene.add.rectangle(startX, startY, 40, 2, color, 0.6);
    trail.setOrigin(1, 0.5);
    trail.setBlendMode(Phaser.BlendModes.ADD);
    trail.setDepth(99);

    const angle = Phaser.Math.Between(30, 60);
    trail.setRotation(Phaser.Math.DegToRad(angle));

    // Shooting animation
    const distance = 400;
    const endX = startX + Math.cos(Phaser.Math.DegToRad(angle)) * distance;
    const endY = startY + Math.sin(Phaser.Math.DegToRad(angle)) * distance;

    this.scene.tweens.add({
      targets: [star, trail],
      x: endX,
      y: endY,
      duration: 1500,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        star.destroy();
        trail.destroy();
      }
    });

    // Fade out
    this.scene.tweens.add({
      targets: [star, trail],
      alpha: 0,
      duration: 1500,
      ease: 'Cubic.easeIn'
    });
  }

  /**
   * Create floating magical book
   */
  createFloatingBook(x: number, y: number, color: number = 0x8B4513): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const graphics = this.scene.add.graphics();

    // Book pages
    graphics.fillStyle(0xF5E6D3, 1);
    graphics.fillRect(-20, -15, 40, 30);

    // Book cover
    graphics.fillStyle(color, 1);
    graphics.fillRect(-22, -16, 3, 32);
    graphics.fillRect(19, -16, 3, 32);

    // Book spine
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(-2, -15, 4, 30);

    // Magical glow
    const glow = this.scene.add.circle(0, 0, 35, 0xD4AF37, 0.2);
    glow.setBlendMode(Phaser.BlendModes.ADD);

    // Sparkles
    const sparkle = this.scene.add.circle(0, -20, 3, 0xFFD700, 0.8);
    sparkle.setBlendMode(Phaser.BlendModes.ADD);

    container.add([glow, graphics, sparkle]);
    container.setDepth(20);

    // Floating animation
    this.scene.tweens.add({
      targets: container,
      y: y - 15,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Gentle rotation
    this.scene.tweens.add({
      targets: container,
      rotation: 0.2,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Sparkle twinkle
    this.scene.tweens.add({
      targets: sparkle,
      alpha: 0.2,
      scale: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    return container;
  }

  /**
   * Create mystical runes floating around
   */
  createFloatingRunes(count: number = 8, color: number = 0xD4AF37): void {
    const runeSymbols = ['◊', '⚡', '✦', '◈', '⬡', '⭐', '◬', '☆'];

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
      const y = Phaser.Math.Between(100, this.scene.scale.height - 100);

      const rune = this.scene.add.text(x, y, runeSymbols[i % runeSymbols.length], {
        fontSize: '32px',
        color: `#${color.toString(16).padStart(6, '0')}`,
        fontFamily: 'Arial'
      });
      rune.setOrigin(0.5);
      rune.setAlpha(0.4);
      rune.setBlendMode(Phaser.BlendModes.ADD);
      rune.setDepth(15);

      // Floating movement
      this.scene.tweens.add({
        targets: rune,
        y: y + Phaser.Math.Between(-50, 50),
        x: x + Phaser.Math.Between(-30, 30),
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 1000
      });

      // Slow rotation
      this.scene.tweens.add({
        targets: rune,
        rotation: Math.PI * 2,
        duration: 8000,
        repeat: -1,
        ease: 'Linear'
      });

      // Pulsing glow
      this.scene.tweens.add({
        targets: rune,
        alpha: 0.8,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  /**
   * Create ancient guardian statue
   */
  createGuardianStatue(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const graphics = this.scene.add.graphics();

    // Statue body (simplified humanoid)
    graphics.fillStyle(0x696969, 0.8);
    graphics.fillRect(-15, -60, 30, 60);

    // Head
    graphics.fillCircle(0, -70, 15);

    // Arms
    graphics.fillRect(-25, -50, 10, 30);
    graphics.fillRect(15, -50, 10, 30);

    // Eyes (glowing)
    const leftEye = this.scene.add.circle(-6, -70, 3, 0x00CED1, 0.8);
    const rightEye = this.scene.add.circle(6, -70, 3, 0x00CED1, 0.8);
    leftEye.setBlendMode(Phaser.BlendModes.ADD);
    rightEye.setBlendMode(Phaser.BlendModes.ADD);

    container.add([graphics, leftEye, rightEye]);
    container.setDepth(10);

    // Glowing eyes animation
    this.scene.tweens.add({
      targets: [leftEye, rightEye],
      alpha: 0.3,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return container;
  }

  /**
   * Create magical compass
   */
  createMagicalCompass(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const graphics = this.scene.add.graphics();

    // Compass body
    graphics.lineStyle(3, 0xD4AF37, 1);
    graphics.strokeCircle(0, 0, 40);

    graphics.fillStyle(0x2C1810, 0.9);
    graphics.fillCircle(0, 0, 40);

    // Compass needle
    graphics.fillStyle(0xFF0000, 1);
    graphics.beginPath();
    graphics.moveTo(0, -30);
    graphics.lineTo(-5, 0);
    graphics.lineTo(5, 0);
    graphics.closePath();
    graphics.fillPath();

    graphics.fillStyle(0xFFFFFF, 1);
    graphics.beginPath();
    graphics.moveTo(0, 30);
    graphics.lineTo(-5, 0);
    graphics.lineTo(5, 0);
    graphics.closePath();
    graphics.fillPath();

    // Cardinal directions
    const north = this.scene.add.text(0, -55, 'N', {
      fontSize: '16px',
      color: '#D4AF37',
      fontFamily: 'Cinzel, serif'
    }).setOrigin(0.5);

    container.add([graphics, north]);
    container.setDepth(25);

    // Needle rotation
    const needle = this.scene.add.graphics();
    needle.fillStyle(0xFF0000, 1);
    needle.beginPath();
    needle.moveTo(0, -30);
    needle.lineTo(-5, 0);
    needle.lineTo(5, 0);
    needle.closePath();
    needle.fillPath();

    container.add(needle);

    this.scene.tweens.add({
      targets: needle,
      rotation: Math.PI * 2,
      duration: 4000,
      repeat: -1,
      ease: 'Linear'
    });

    return container;
  }

  // ===== ADULT-THEMED CALMING VISUAL EFFECTS =====

  /**
   * Create gentle breathing circle for mindfulness
   */
  createBreathingCircle(x: number, y: number, color: number = 0x87CEEB, size: number = 80): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);

    // Outer breathing ring
    const outerRing = this.scene.add.circle(0, 0, size, color, 0);
    outerRing.setStrokeStyle(2, color, 0.3);
    outerRing.setBlendMode(Phaser.BlendModes.ADD);

    // Inner breathing ring
    const innerRing = this.scene.add.circle(0, 0, size * 0.7, color, 0);
    innerRing.setStrokeStyle(2, color, 0.2);
    innerRing.setBlendMode(Phaser.BlendModes.ADD);

    // Gentle glow
    const glow = this.scene.add.circle(0, 0, size * 0.5, color, 0.1);
    glow.setBlendMode(Phaser.BlendModes.ADD);

    container.add([glow, innerRing, outerRing]);
    container.setDepth(10);

    // Breathing animation (4 seconds in, 4 seconds out)
    this.scene.tweens.add({
      targets: [outerRing, innerRing],
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0.5,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.scene.tweens.add({
      targets: glow,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0.2,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return container;
  }

  /**
   * Create soft ambient particles that float gently
   */
  createCalmAmbientParticles(count: number = 15, color: number = 0xB0C4DE): void {
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, this.scene.scale.width);
      const y = Phaser.Math.Between(0, this.scene.scale.height);

      const particle = this.scene.add.circle(x, y, Phaser.Math.Between(2, 4), color, 0.3);
      particle.setBlendMode(Phaser.BlendModes.ADD);
      particle.setDepth(5);

      // Slow, gentle floating
      this.scene.tweens.add({
        targets: particle,
        y: y + Phaser.Math.Between(-60, 60),
        x: x + Phaser.Math.Between(-40, 40),
        duration: 6000 + Math.random() * 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 2000
      });

      // Gentle fade
      this.scene.tweens.add({
        targets: particle,
        alpha: 0.6,
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  /**
   * Create mindfulness ripples (water-inspired tranquility)
   */
  createMindfulnessRipples(x: number, y: number, color: number = 0x87CEEB): void {
    this.scene.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        for (let i = 0; i < 3; i++) {
          this.scene.time.delayedCall(i * 800, () => {
            const ripple = this.scene.add.circle(x, y, 10, color, 0);
            ripple.setStrokeStyle(2, color, 0.4);
            ripple.setBlendMode(Phaser.BlendModes.ADD);
            ripple.setDepth(8);

            this.scene.tweens.add({
              targets: ripple,
              scaleX: 6,
              scaleY: 6,
              alpha: 0,
              duration: 2400,
              ease: 'Sine.easeOut',
              onComplete: () => ripple.destroy()
            });
          });
        }
      }
    });
  }

  /**
   * Create grounding element (stable, centering visual)
   */
  createGroundingElement(x: number, y: number, color: number = 0x8B7355): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const graphics = this.scene.add.graphics();

    // Centered square (grounding symbol)
    graphics.lineStyle(3, color, 0.5);
    graphics.strokeRect(-30, -30, 60, 60);

    // Inner square
    graphics.lineStyle(2, color, 0.3);
    graphics.strokeRect(-20, -20, 40, 40);

    // Center point
    graphics.fillStyle(color, 0.6);
    graphics.fillCircle(0, 0, 5);

    // Corner marks
    const cornerSize = 8;
    const offset = 30;
    const corners = [
      [-offset, -offset],
      [offset, -offset],
      [-offset, offset],
      [offset, offset]
    ];

    corners.forEach(([cx, cy]) => {
      graphics.lineStyle(2, color, 0.4);
      graphics.lineBetween(cx, cy, cx + (cx > 0 ? -cornerSize : cornerSize), cy);
      graphics.lineBetween(cx, cy, cx, cy + (cy > 0 ? -cornerSize : cornerSize));
    });

    container.add(graphics);
    container.setDepth(10);

    // Subtle pulse
    this.scene.tweens.add({
      targets: graphics,
      alpha: 0.7,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return container;
  }

  /**
   * Create therapeutic light halo
   */
  createTherapeuticHalo(x: number, y: number, color: number = 0xFFE4B5, radius: number = 100): void {
    const halo = this.scene.add.circle(x, y, radius, color, 0.08);
    halo.setBlendMode(Phaser.BlendModes.ADD);
    halo.setDepth(3);

    this.scene.tweens.add({
      targets: halo,
      scaleX: 1.15,
      scaleY: 1.15,
      alpha: 0.15,
      duration: 3500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Create calm wave pattern (ocean-inspired)
   */
  createCalmWaves(y: number, color: number = 0x87CEEB): void {
    const width = this.scene.scale.width;

    for (let i = 0; i < 2; i++) {
      const graphics = this.scene.add.graphics();
      graphics.setDepth(2);
      graphics.setAlpha(0.15 - i * 0.05);

      const waveY = y + i * 40;
      const points: Phaser.Math.Vector2[] = [];

      for (let x = 0; x <= width; x += 30) {
        const yOffset = Math.sin((x / width) * Math.PI * 3 + i) * 20;
        points.push(new Phaser.Math.Vector2(x, waveY + yOffset));
      }

      graphics.lineStyle(2, color, 0.3);
      const curve = new Phaser.Curves.Spline(points);
      curve.draw(graphics, 100);

      // Gentle wave motion
      this.scene.tweens.add({
        targets: graphics,
        y: graphics.y + 10,
        duration: 4000 + i * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  /**
   * Create soft gradient overlay for therapeutic atmosphere
   */
  createTherapeuticGradient(color: number = 0x4A5568): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    graphics.fillGradientStyle(
      color, color, 0x000000, 0x000000,
      0.05, 0.03, 0, 0
    );

    graphics.fillRect(0, 0, width, height / 2);
    graphics.setDepth(1);
    graphics.setBlendMode(Phaser.BlendModes.MULTIPLY);

    return graphics;
  }

  /**
   * Create gentle pulsing dot (meditation focus point)
   */
  createMeditationDot(x: number, y: number, color: number = 0xFFFFFF): void {
    const dot = this.scene.add.circle(x, y, 6, color, 0.6);
    dot.setBlendMode(Phaser.BlendModes.ADD);
    dot.setDepth(15);

    const glow = this.scene.add.circle(x, y, 12, color, 0.2);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    glow.setDepth(14);

    // Slow pulse (meditation rhythm)
    this.scene.tweens.add({
      targets: [dot, glow],
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: { from: 0.6, to: 0.3 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Create floating mindfulness symbols (peaceful icons)
   */
  createMindfulnessSymbols(count: number = 6, color: number = 0xB0C4DE): void {
    const symbols = ['○', '◇', '△', '□', '☆', '◯'];

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
      const y = Phaser.Math.Between(100, this.scene.scale.height - 100);

      const symbol = this.scene.add.text(x, y, symbols[i % symbols.length], {
        fontSize: '28px',
        color: `#${color.toString(16).padStart(6, '0')}`,
        fontFamily: 'Arial'
      });
      symbol.setOrigin(0.5);
      symbol.setAlpha(0.25);
      symbol.setBlendMode(Phaser.BlendModes.ADD);
      symbol.setDepth(8);

      // Slow, gentle movement
      this.scene.tweens.add({
        targets: symbol,
        y: y + Phaser.Math.Between(-40, 40),
        x: x + Phaser.Math.Between(-30, 30),
        duration: 8000 + Math.random() * 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 2000
      });

      // Gentle fade
      this.scene.tweens.add({
        targets: symbol,
        alpha: 0.4,
        duration: 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  /**
   * Create centered focus rings (attention/presence indicators)
   */
  createFocusRings(x: number, y: number, color: number = 0x87CEEB): void {
    for (let i = 0; i < 3; i++) {
      const ring = this.scene.add.circle(x, y, 40 + i * 30, color, 0);
      ring.setStrokeStyle(1, color, 0.2 - i * 0.05);
      ring.setBlendMode(Phaser.BlendModes.ADD);
      ring.setDepth(7);

      // Gentle expansion
      this.scene.tweens.add({
        targets: ring,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 0.1,
        duration: 3000 + i * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: i * 800
      });
    }
  }
}
