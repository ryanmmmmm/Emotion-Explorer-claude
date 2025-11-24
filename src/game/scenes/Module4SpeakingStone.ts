/**
 * Module 4: The Speaking Stone
 * Players write about their emotion with text input
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface Module4Data {
  emotionId: EmotionType;
}

export class Module4SpeakingStone extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private vfx!: VisualEffectsManager;
  private userText: string = '';
  private wordCount: number = 0;
  private textDisplay!: Phaser.GameObjects.Text;
  private stone!: Phaser.GameObjects.Arc;
  private instructionText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.MODULE_4);
  }

  init(data: Module4Data): void {
    this.emotionId = data.emotionId;
    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    this.emotionName = emotion.name;
    this.setEmotion(this.emotionId);
  }

  create(): void {
    this.fadeIn();

    this.vfx = new VisualEffectsManager(this);
    this.createBackground();

    // Enhanced visual atmosphere
    this.vfx.createAuroraBackground(this.emotionColor);
    this.vfx.createParallaxStars(2);
    this.vfx.createFloatingOrbs(15, this.emotionColor);
    this.createEmotionalWisps();


    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    const centerX = this.scale.width / 2;

    // Title - adventure theme
    this.add
      .text(centerX, 60, 'The Speaking Stone', {
        fontSize: '52px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 6)
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 10);

    this.add
      .text(centerX, 120, 'Module 4: Expression Through Words', {
        fontSize: '24px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
      })
      .setOrigin(0.5)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.8)', 6);

    // Emotion display
    this.add
      .text(centerX, 170, `Exploring: ${this.emotionName}`, {
        fontSize: '28px',
        color: '#D4AF37',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    // Instructions - adventure theme
    this.instructionText = this.add
      .text(
        centerX,
        220,
        'Click the glowing stone to describe this emotion in your own words.\nExpress what this feeling means to you.',
        {
          fontSize: '20px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
          align: 'center',
          lineSpacing: 6,
        }
      )
      .setOrigin(0.5);

    // Create glowing stone
    this.createSpeakingStone(centerX, 400);

    // Text display area - adventure theme
    this.add
      .rectangle(centerX, 580, 800, 200, 0x2C1810, 0.9)
      .setStrokeStyle(3, 0xD4AF37, 0.7);

    this.textDisplay = this.add
      .text(centerX, 580, 'Your words will appear here...', {
        fontSize: '18px',
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
        align: 'center',
        wordWrap: { width: 750 },
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    // Word counter - adventure theme
    const counterText = this.add
      .text(centerX, 700, 'Words: 0 / 10 minimum', {
        fontSize: '20px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(0.5);

    // Continue button
    const continueBtn = this.createButton(
      centerX,
      this.scale.height - 80,
      'Continue to Next Step',
      () => this.completeModule(),
      300,
      60
    );
    continueBtn.setAlpha(0.3);

    // Update UI periodically
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        counterText.setText(`Words: ${this.wordCount} / 10 minimum`);

        if (this.wordCount >= 10) {
          continueBtn.setAlpha(1);
          this.instructionText.setText(
            'Perfect! Your words have power.\nYou can add more or continue when ready.'
          );
        } else if (this.wordCount > 0) {
          this.instructionText.setText(
            `Keep going! Write at least ${10 - this.wordCount} more words to continue.`
          );
        }
      },
    });

    console.log('✅ Module 4 - The Speaking Stone: Ready (Adventure Theme)');
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#1A0F08');
    this.createParchmentBackground();
    this.createOrnateFrame();
  }

  private createSpeakingStone(x: number, y: number): void {
    // Outer glow
    const outerGlow = this.add.circle(x, y, 100, this.emotionColor, 0.2);
    outerGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: outerGlow,
      scale: { from: 0.9, to: 1.2 },
      alpha: { from: 0.3, to: 0.1 },
      duration: 2000,
      repeat: -1,
      yoyo: true,
    });

    // Inner glow
    const innerGlow = this.add.circle(x, y, 70, this.emotionColor, 0.4);
    innerGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: innerGlow,
      scale: { from: 1, to: 1.1 },
      alpha: { from: 0.4, to: 0.2 },
      duration: 1500,
      repeat: -1,
      yoyo: true,
    });

    // The stone itself
    this.stone = this.add
      .circle(x, y, 60, this.emotionColor, 0.8)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(3, 0xffffff, 0.8);

    // Pulsing animation
    this.tweens.add({
      targets: this.stone,
      scale: { from: 0.95, to: 1.05 },
      duration: 1800,
      repeat: -1,
      yoyo: true,
      ease: 'Sine.easeInOut',
    });

    // Sparkles around stone
    this.vfx.createSparkles(x, y, this.emotionColor, 80);

    // Click to input text
    this.stone.on('pointerdown', () => {
      this.openTextInput();
    });

    // Hover effect
    this.stone.on('pointerover', () => {
      this.tweens.add({
        targets: this.stone,
        scale: 1.15,
        duration: 200,
      });
    });

    this.stone.on('pointerout', () => {
      this.tweens.add({
        targets: this.stone,
        scale: 1.0,
        duration: 200,
      });
    });

    // Stone label
    this.add
      .text(x, y, 'SPEAK', {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
  }

  private async openTextInput(): Promise<void> {
    const input = await this.showTextInputModal(
      `Express Your ${this.emotionName} Emotion`,
      'Describe what you are feeling...',
      'What does this emotion feel like? What thoughts accompany it? What story does it tell? Express yourself freely.',
      10,
      this.userText
    );

    if (input && input.trim()) {
      this.userText = input.trim();
      this.wordCount = this.userText.split(/\s+/).length;

      // Animate text appearing
      this.textDisplay.setText('');
      this.textDisplay.setAlpha(1);

      let charIndex = 0;
      const chars = this.userText.split('');

      this.time.addEvent({
        delay: 30,
        callback: () => {
          if (charIndex < chars.length) {
            this.textDisplay.setText(this.textDisplay.text + chars[charIndex]);
            charIndex++;
          }
        },
        repeat: chars.length - 1,
      });

      // Visual feedback
      this.vfx.createSparkles(
        this.scale.width / 2,
        400,
        this.emotionColor,
        30
      );
      this.cameras.main.flash(200, ...this.hexToRgb(this.emotionColor));
    }
  }

  private hexToRgb(hex: number): [number, number, number] {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return [r, g, b];
  }

  private completeModule(): void {
    if (this.wordCount < 10) {
      return; // Need at least 10 words
    }

    console.log(`✅ Module 4 completed - ${this.wordCount} words written`);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(4, {
      emotionSelected: this.emotionId,
      letterBody: this.userText,
    });

    this.cameras.main.flash(500, 255, 215, 0);
    this.vfx.createEnergyPulse(
      this.scale.width / 2,
      this.scale.height / 2,
      0xffd700,
      15
    );

    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.MODULE_5, { emotionId: this.emotionId });
    });
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
  }
}
