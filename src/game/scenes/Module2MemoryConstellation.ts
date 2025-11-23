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

    this.vfx = new VisualEffectsManager(this);

    // Enhanced visual atmosphere
    this.cameras.main.setBackgroundColor('#1A1A2E');
    this.vfx.createAuroraBackground(this.emotionColor);
    this.vfx.createParallaxStars(3);
    this.vfx.createFloatingOrbs(25, this.emotionColor);

    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    const centerX = this.scale.width / 2;

    // Title
    this.add
      .text(centerX, 80, 'Memory Constellation', {
        fontSize: '52px',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 140, 'Module 2: Mapping Emotional Memories', {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Merriweather, serif',
      })
      .setOrigin(0.5);

    // Emotion display
    this.add
      .text(centerX, 190, `Exploring: ${this.emotionName}`, {
        fontSize: '32px',
        color: emotion.color,
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    // Instructions
    this.instructionText = this.add
      .text(
        centerX,
        250,
        'Click anywhere to place a memory star.\nEach star represents a moment when you felt this emotion.',
        {
          fontSize: '20px',
          color: '#AACCFF',
          fontFamily: 'Merriweather, serif',
          align: 'center',
          lineSpacing: 6,
        }
      )
      .setOrigin(0.5);

    // Memory counter
    const counterText = this.add
      .text(centerX, 310, 'Memories Mapped: 0', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
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

    // Continue button (appears after placing at least 3 memories)
    const continueBtn = this.createButton(
      centerX,
      this.scale.height - 100,
      'Continue to Next Step',
      () => this.completeModule(),
      300,
      60
    );
    continueBtn.setAlpha(0.3);

    // Enable button after 3 memories
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (this.memoryCount >= 3) {
          continueBtn.setAlpha(1);
        }
      },
    });

    console.log('✅ Module 2 - Memory Constellation: Ready');
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
    if (this.memoryCount < 3) {
      return; // Need at least 3 memories
    }

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(2, {
      emotionSelected: this.emotionId,
    });

    console.log(`✅ Module 2 completed - ${this.memoryCount} memories mapped`);

    this.cameras.main.flash(500, 255, 215, 0);
    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.MODULE_3, { emotionId: this.emotionId });
    });
  }
}
