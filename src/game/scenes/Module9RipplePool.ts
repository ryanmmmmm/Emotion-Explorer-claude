/**
 * Module 9: The Ripple Pool
 * Players create ripples and reflect on their emotional journey
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface Module9Data {
  emotionId: EmotionType;
}

interface Ripple {
  graphics: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export class Module9RipplePool extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private vfx!: VisualEffectsManager;
  private ripples: Ripple[] = [];
  private rippleCount: number = 0;
  private instructionText!: Phaser.GameObjects.Text;
  private reflectionPrompts: string[] = [];
  private currentPromptIndex: number = 0;
  private promptText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.MODULE_9);
  }

  init(data: Module9Data): void {
    this.emotionId = data.emotionId;
    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    this.emotionName = emotion.name;
    this.setEmotion(this.emotionId);
  }

  create(): void {
    this.fadeIn();

    // Initialize theme and narrative
    this.initializeTheme();

    this.vfx = new VisualEffectsManager(this);
    this.createBackground();

    // Enhanced visual atmosphere
    this.vfx.createAuroraBackground(this.emotionColor);
    this.vfx.createParallaxStars(2);
    this.vfx.createFloatingOrbs(15, this.emotionColor);
    this.createEmotionalWisps();

    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    const centerX = this.scale.width / 2;

    // Get narrative content based on age group
    const narrative = this.narrative!.module9;

    // Title - uses age-appropriate name
    this.add
      .text(centerX, 60, narrative.title, {
        fontSize: '52px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 6)
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 8);

    // Subtitle - age-appropriate
    this.add
      .text(centerX, 120, narrative.subtitle, {
        fontSize: '24px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
      })
      .setOrigin(0.5);

    // Emotion display
    this.add
      .text(centerX, 170, `Exploring: ${this.emotionName}`, {
        fontSize: '28px',
        color: emotion.color,
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    // Instructions - age-appropriate
    this.instructionText = this.add
      .text(
        centerX,
        220,
        this.isTeen()
          ? 'Click the pool to create ripples of reflection.\nEach ripple reveals a new way to think about your journey.'
          : narrative.instructions,
        {
          fontSize: '20px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
          align: 'center',
          lineSpacing: 6,
          wordWrap: { width: this.scale.width * 0.8 },
        }
      )
      .setOrigin(0.5);

    // Ripple counter
    const counterText = this.add
      .text(centerX, 280, 'Ripples Created: 0 / 3', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Reflection prompts
    this.reflectionPrompts = [
      'What have you learned about yourself through this emotion?',
      'How might understanding this emotion help your relationships?',
      'What intention will you set moving forward?',
    ];

    // Create the pool
    this.createPool(centerX, 520);

    // Prompt display
    this.promptText = this.add
      .text(centerX, 700, '', {
        fontSize: '20px',
        color: '#FFD700',
        fontFamily: 'Merriweather, serif',
        align: 'center',
        wordWrap: { width: 700 },
        lineSpacing: 8,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Continue button
    const continueBtn = this.createButton(
      centerX,
      this.scale.height - 80,
      'Complete Journey',
      () => this.completeModule(),
      300,
      60
    );
    continueBtn.setAlpha(0.3);

    // Update UI
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        counterText.setText(`Ripples Created: ${this.rippleCount} / 3`);

        if (this.rippleCount >= 3) {
          this.instructionText.setText(
            'You have completed your emotional journey.\nYour reflections create lasting change.'
          );
          continueBtn.setAlpha(1);
        } else if (this.rippleCount > 0) {
          this.instructionText.setText(
            'Beautiful! Create more ripples to complete your reflection.'
          );
        }
      },
    });

    // Animate ripples
    this.time.addEvent({
      delay: 32,
      loop: true,
      callback: () => this.updateRipples(),
    });

    console.log('✅ Module 9 - The Ripple Pool: Ready (Adventure Theme)');
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#1A0F08');
    this.createParchmentBackground();
    this.createOrnateFrame();

    const graphics = this.add.graphics();

    // Starfield
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const size = Phaser.Math.Between(1, 2);
      graphics.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.2, 0.6));
      graphics.fillCircle(x, y, size);
    }
  }

  private createPool(centerX: number, centerY: number): void {
    // Pool surface
    const pool = this.add
      .ellipse(centerX, centerY, 600, 300, 0x0a4a7a, 0.6)
      .setStrokeStyle(3, this.emotionColor, 0.8)
      .setInteractive({ useHandCursor: true });

    // Pool glow
    const poolGlow = this.add
      .ellipse(centerX, centerY, 620, 310, this.emotionColor, 0.2)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.tweens.add({
      targets: poolGlow,
      alpha: { from: 0.2, to: 0.4 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    // Shimmer particles on pool surface
    this.add.particles(centerX, centerY, 'particle', {
      x: { min: -280, max: 280 },
      y: { min: -130, max: 130 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.6, end: 0 },
      tint: this.emotionColor,
      lifespan: 2000,
      frequency: 200,
      quantity: 1,
      blendMode: 'ADD',
    });

    // Click to create ripple
    pool.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Convert click position relative to pool
      const localX = pointer.x;
      const localY = pointer.y;

      // Check if click is within ellipse bounds (approximate)
      const dx = (localX - centerX) / 300;
      const dy = (localY - centerY) / 150;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= 1 && this.rippleCount < this.reflectionPrompts.length) {
        this.createRipple(localX, localY);
        this.rippleCount++;

        // Show reflection prompt
        if (this.currentPromptIndex < this.reflectionPrompts.length) {
          this.showPrompt(this.reflectionPrompts[this.currentPromptIndex]);
          this.currentPromptIndex++;
        }

        // Visual feedback
        this.vfx.createSparkles(localX, localY, this.emotionColor, 25);
        this.cameras.main.flash(100, ...this.hexToRgb(this.emotionColor));
      }
    });

    // Hover effect
    pool.on('pointerover', () => {
      pool.setStrokeStyle(4, this.emotionColor, 1);
    });

    pool.on('pointerout', () => {
      pool.setStrokeStyle(3, this.emotionColor, 0.8);
    });
  }

  private createRipple(x: number, y: number): void {
    const rippleGraphics = this.add.graphics();

    const ripple: Ripple = {
      graphics: rippleGraphics,
      x,
      y,
      radius: 10,
      maxRadius: 200,
      alpha: 0.8,
    };

    this.ripples.push(ripple);
  }

  private updateRipples(): void {
    // Update and draw all ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const ripple = this.ripples[i];

      // Expand ripple
      ripple.radius += 2;
      ripple.alpha -= 0.01;

      // Remove if faded out
      if (ripple.alpha <= 0 || ripple.radius > ripple.maxRadius) {
        ripple.graphics.destroy();
        this.ripples.splice(i, 1);
        continue;
      }

      // Draw ripple
      ripple.graphics.clear();
      ripple.graphics.lineStyle(3, this.emotionColor, ripple.alpha);
      ripple.graphics.strokeCircle(ripple.x, ripple.y, ripple.radius);

      // Draw inner ripple
      if (ripple.radius > 20) {
        ripple.graphics.lineStyle(2, this.emotionColor, ripple.alpha * 0.5);
        ripple.graphics.strokeCircle(ripple.x, ripple.y, ripple.radius - 15);
      }
    }
  }

  private showPrompt(prompt: string): void {
    this.promptText.setText(prompt);

    // Fade in
    this.tweens.add({
      targets: this.promptText,
      alpha: 1,
      duration: 500,
    });

    // Fade out after reading
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: this.promptText,
        alpha: 0,
        duration: 500,
      });
    });
  }

  private hexToRgb(hex: number): [number, number, number] {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return [r, g, b];
  }

  private completeModule(): void {
    if (this.rippleCount < 3) {
      return; // Need 3 ripples
    }

    console.log(`✅ Module 9 completed - ${this.rippleCount} ripples of reflection`);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(9, {
      emotionSelected: this.emotionId,
      synthesisInsights: `Completed ${this.rippleCount} reflections`,
      intention: 'Moving forward with greater emotional awareness',
    });

    this.cameras.main.flash(500, 255, 215, 0);
    this.vfx.createEnergyPulse(
      this.scale.width / 2,
      this.scale.height / 2,
      0xffd700,
      20
    );

    // Show completion message
    this.time.delayedCall(600, () => {
      this.showCompletionCelebration();
    });
  }

  private showCompletionCelebration(): void {
    const overlay = this.add.container(
      this.scale.width / 2,
      this.scale.height / 2
    );
    overlay.setDepth(1000);

    const bg = this.add.rectangle(0, 0, 900, 500, 0x000000, 0.95);

    const titleText = this.add
      .text(0, -180, 'Journey Complete!', {
        fontSize: '56px',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    const messageText = this.add
      .text(
        0,
        -60,
        `You have completed all 9 modules exploring ${this.emotionName}.\n\n` +
        'Through this journey, you have:\n' +
        '• Understood your emotional intensity\n' +
        '• Connected memories to feelings\n' +
        '• Recognized body sensations\n' +
        '• Expressed yourself in words\n' +
        '• Gained new perspectives\n' +
        '• Practiced emotional regulation\n' +
        '• Identified your triggers\n' +
        '• Learned valuable wisdom\n' +
        '• Reflected on your growth',
        {
          fontSize: '18px',
          color: '#ffffff',
          fontFamily: 'Merriweather, serif',
          align: 'center',
          lineSpacing: 8,
        }
      )
      .setOrigin(0.5);

    const hubButton = this.createButton(
      0,
      190,
      'Return to Hub',
      () => {
        this.transitionToScene(SCENE_KEYS.HUB);
      },
      300,
      60
    );

    overlay.add([bg, titleText, messageText, hubButton]);
    overlay.setAlpha(0);

    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 500,
    });

    // Grand celebration particles
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 200, () => {
        this.vfx.createEnergyPulse(
          this.scale.width / 2,
          this.scale.height / 2,
          this.emotionColor,
          15
        );
      });
    }
  }

  private createParchmentBackground(): void {
    const graphics = this.add.graphics();
    const parchmentColors = [0x2C1810, 0x1A0F08, 0x3D2F24];
    const width = this.scale.width;
    const height = this.scale.height;

    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const radius = Phaser.Math.Between(50, 200);
      const color = Phaser.Utils.Array.GetRandom(parchmentColors);
      const alpha = Phaser.Math.FloatBetween(0.05, 0.15);
      graphics.fillStyle(color, alpha);
      graphics.fillCircle(x, y, radius);
    }

    for (let i = 0; i < 150; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.1, 0.3);
      graphics.fillStyle(0x5C4A3A, alpha);
      graphics.fillCircle(x, y, size);
    }

    graphics.setDepth(0);
    this.tweens.add({
      targets: graphics,
      alpha: 0.8,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createOrnateFrame(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    const margin = 40;
    const cornerSize = 60;
    const lineThickness = 4;

    const graphics = this.add.graphics();
    graphics.lineStyle(lineThickness, 0xD4AF37, 0.6);

    graphics.lineBetween(margin + cornerSize, margin, width - margin - cornerSize, margin);
    graphics.lineBetween(margin + cornerSize, height - margin, width - margin - cornerSize, height - margin);
    graphics.lineBetween(margin, margin + cornerSize, margin, height - margin - cornerSize);
    graphics.lineBetween(width - margin, margin + cornerSize, width - margin, height - margin - cornerSize);

    const corners = [
      { x: margin, y: margin },
      { x: width - margin, y: margin },
      { x: margin, y: height - margin },
      { x: width - margin, y: height - margin },
    ];

    corners.forEach((corner, index) => {
      const flipX = index % 2 === 1 ? -1 : 1;
      const flipY = index > 1 ? -1 : 1;

      graphics.lineStyle(lineThickness, 0xD4AF37, 0.8);
      graphics.lineBetween(corner.x, corner.y, corner.x + cornerSize * flipX, corner.y);
      graphics.lineBetween(corner.x, corner.y, corner.x, corner.y + cornerSize * flipY);

      graphics.lineStyle(2, 0xF4E5B8, 0.4);
      graphics.lineBetween(corner.x + 10 * flipX, corner.y + 10 * flipY, corner.x + (cornerSize - 15) * flipX, corner.y + 10 * flipY);
      graphics.lineBetween(corner.x + 10 * flipX, corner.y + 10 * flipY, corner.x + 10 * flipX, corner.y + (cornerSize - 15) * flipY);

      graphics.fillStyle(0xD4AF37, 0.8);
      graphics.fillCircle(corner.x + 10 * flipX, corner.y + 10 * flipY, 4);
    });

    graphics.setDepth(1);
    this.tweens.add({
      targets: graphics,
      alpha: 0.7,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
