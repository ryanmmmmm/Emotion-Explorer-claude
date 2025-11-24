/**
 * Module 2: Memory Constellation
 * Players identify and map emotionally charged memories as stars
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface Module2Data {
  emotionId: EmotionType;
}

interface Memory {
  x: number;
  y: number;
  star: Phaser.GameObjects.Arc;
  glow: Phaser.GameObjects.Arc;
}

export class Module2MemoryConstellation extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private vfx!: VisualEffectsManager;
  private memories: Memory[] = [];
  private memoryCount: number = 0;
  private instructionText!: Phaser.GameObjects.Text;
  private memoryAssociations: string = '';

  constructor() {
    super(SCENE_KEYS.MODULE_2);
  }

  init(data: Module2Data): void {
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

    // Enhanced visual atmosphere with adventure theme
    this.cameras.main.setBackgroundColor('#1A0F08');
    this.createParchmentBackground();
    this.createOrnateFrame();
    this.vfx.createAuroraBackground(this.emotionColor);
    this.vfx.createParallaxStars(3);
    this.vfx.createFloatingOrbs(25, this.emotionColor);


    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    const centerX = this.scale.width / 2;

    // Get narrative content based on age group
    const narrative = this.narrative!.module2;

    // Title - uses age-appropriate name
    this.add
      .text(centerX, 80, narrative.title, {
        fontSize: '52px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 6)
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 10);

    // Subtitle - age-appropriate
    this.add
      .text(centerX, 140, narrative.subtitle, {
        fontSize: '24px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
      })
      .setOrigin(0.5)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.8)', 6);

    // Emotion display
    this.add
      .text(centerX, 190, `Exploring: ${this.emotionName}`, {
        fontSize: '32px',
        color: '#D4AF37',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    // Instructions - age-appropriate
    this.instructionText = this.add
      .text(
        centerX,
        250,
        this.isTeen()
          ? 'Click anywhere to place a memory star.\nEach star represents a moment when you felt this emotion.'
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

    // Memory counter - adventure theme
    const counterText = this.add
      .text(centerX, 310, 'Memories Mapped: 0', {
        fontSize: '22px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(0.5);

    // Interactive area
    const interactiveZone = this.add
      .rectangle(centerX, 550, 900, 500, 0x000000, 0.0)
      .setInteractive({ useHandCursor: true });

    interactiveZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.placeMemoryStar(pointer.x, pointer.y);
      this.memoryCount++;
      counterText.setText(`Memories Mapped: ${this.memoryCount}`);

      if (this.memoryCount === 1) {
        this.instructionText.setText(
          'Great! Keep adding memories.\nWatch how they form a constellation of your emotional experiences.'
        );
      }

      if (this.memoryCount >= 5) {
        this.instructionText.setText(
          'Beautiful constellation! You can add more or continue when ready.'
        );
      }
    });

    // Add text input for memory associations
    this.createMemoryAssociationsInput(centerX);

    // Continue button (appears after placing at least 3 memories AND writing associations)
    const continueBtn = this.createButton(
      centerX,
      this.scale.height - 100,
      'Continue to Next Step',
      () => this.completeModule(),
      300,
      60
    );
    continueBtn.setAlpha(0.3);

    // Enable button after 3 memories AND associations written
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (this.memoryCount >= 3 && this.memoryAssociations.trim().length > 0) {
          continueBtn.setAlpha(1);
        }
      },
    });

    console.log('✅ Module 2 - Memory Constellation: Ready (Adventure Theme)');
  }

  private createMemoryAssociationsInput(centerX: number): void {
    const y = this.scale.height - 220;

    this.add
      .text(centerX, y - 30, 'Write words, phrases, scenes, names, or times associated with this feeling:', {
        fontSize: '20px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
        align: 'center',
        wordWrap: { width: 800 },
      })
      .setOrigin(0.5);

    const textBox = this.add
      .rectangle(centerX, y + 50, 800, 120, 0x2C1810, 0.9)
      .setStrokeStyle(3, 0xD4AF37, 0.7)
      .setInteractive({ useHandCursor: true });

    const boxText = this.add
      .text(centerX, y + 50, 'Click to write your memory associations...', {
        fontSize: '18px',
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
        align: 'center',
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    textBox.on('pointerover', () => {
      textBox.setStrokeStyle(4, 0xD4AF37, 1);
    });

    textBox.on('pointerout', () => {
      textBox.setStrokeStyle(3, 0xD4AF37, 0.7);
    });

    textBox.on('pointerdown', async () => {
      const response = await this.showTextInputModal(
        'Memory Associations',
        'Write your thoughts...',
        'Write whatever words, phrases, scenes, names, or times of life that your mind associates with this feeling right now. Free association - let your mind wander.',
        20, // minimum 20 words
        this.memoryAssociations
      );

      if (response && response.trim()) {
        const displayText = response.trim().length > 200
          ? response.trim().substring(0, 197) + '...'
          : response.trim();
        boxText.setText(displayText);
        boxText.setAlpha(1);
        this.memoryAssociations = response.trim();
      }
    });
  }

  private placeMemoryStar(x: number, y: number): void {
    const color = parseInt(EMOTION_DEFINITIONS[this.emotionId].color.replace('#', ''), 16);

    // Glow effect
    const glow = this.add.circle(x, y, 20, color, 0.3);
    this.tweens.add({
      targets: glow,
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 0.6, to: 0.1 },
      duration: 1500,
      repeat: -1,
      yoyo: true,
    });

    // Star
    const star = this.add.circle(x, y, 8, color, 1.0);

    // Pop-in animation
    star.setScale(0);
    this.tweens.add({
      targets: star,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });

    // Twinkle effect
    this.tweens.add({
      targets: star,
      alpha: { from: 1, to: 0.6 },
      duration: 1000 + Math.random() * 1000,
      repeat: -1,
      yoyo: true,
    });

    // Connect to previous stars with lines
    if (this.memories.length > 0) {
      const prevMemory = this.memories[this.memories.length - 1];
      const line = this.add.line(0, 0, prevMemory.x, prevMemory.y, x, y, color, 0.3);
      line.setLineWidth(2);

      // Fade in line
      line.setAlpha(0);
      this.tweens.add({
        targets: line,
        alpha: 0.3,
        duration: 500,
      });
    }

    // Visual feedback
    this.vfx.createSparkles(x, y, color, 15);

    this.memories.push({ x, y, star, glow });
  }

  private completeModule(): void {
    if (this.memoryCount < 3 || this.memoryAssociations.trim().length === 0) {
      return; // Need at least 3 memories AND associations written
    }

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(2, {
      emotionSelected: this.emotionId,
      memoryAssociations: this.memoryAssociations,
    });

    console.log(`✅ Module 2 completed - ${this.memoryCount} memories mapped`);
    console.log(`Memory associations: ${this.memoryAssociations.substring(0, 100)}...`);

    this.cameras.main.flash(500, 255, 215, 0);
    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.MODULE_3, { emotionId: this.emotionId });
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
