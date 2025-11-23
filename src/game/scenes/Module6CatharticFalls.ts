/**
 * Module 6: The Cathartic Falls
 * Players practice breathing exercise with animated visualization
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface Module6Data {
  emotionId: EmotionType;
}

export class Module6CatharticFalls extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private vfx!: VisualEffectsManager;
  private breathCircle!: Phaser.GameObjects.Arc;
  private breathText!: Phaser.GameObjects.Text;
  private cyclesCompleted: number = 0;
  private isBreathing: boolean = false;
  private instructionText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.MODULE_6);
  }

  init(data: Module6Data): void {
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
    this.vfx.createFloatingOrbs(20, this.emotionColor);
    this.createEmotionalWisps();

    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    const centerX = this.scale.width / 2;

    // Title
    this.add
      .text(centerX, 60, 'The Cathartic Falls', {
        fontSize: '52px',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 120, 'Module 6: Breath and Release', {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Merriweather, serif',
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

    // Instructions
    this.instructionText = this.add
      .text(
        centerX,
        220,
        'Follow the breathing circle to regulate your emotion.\nBreathe in, hold, breathe out. Complete 3 full cycles.',
        {
          fontSize: '20px',
          color: '#AACCFF',
          fontFamily: 'Merriweather, serif',
          align: 'center',
          lineSpacing: 6,
        }
      )
      .setOrigin(0.5);

    // Cycle counter
    const counterText = this.add
      .text(centerX, 280, 'Breath Cycles: 0 / 3', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Create waterfall particles
    this.createWaterfallParticles();

    // Create breathing circle
    this.createBreathingCircle(centerX, 480);

    // Breath instruction text
    this.breathText = this.add
      .text(centerX, 480, 'Click to Begin', {
        fontSize: '32px',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
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

    // Update UI
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        counterText.setText(`Breath Cycles: ${this.cyclesCompleted} / 3`);

        if (this.cyclesCompleted >= 3) {
          this.instructionText.setText(
            'Excellent work! Notice how your breath can calm your emotions.\nYou can continue breathing or move on.'
          );
          continueBtn.setAlpha(1);
        } else if (this.cyclesCompleted > 0) {
          this.instructionText.setText(
            `Good! ${3 - this.cyclesCompleted} more cycles to complete this exercise.`
          );
        }
      },
    });

    console.log('✅ Module 6 - The Cathartic Falls: Ready');
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#1A1A2E');

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

  private createWaterfallParticles(): void {
    // Waterfall effect on sides
    this.add.particles(150, 200, 'particle', {
      x: 0,
      y: { min: 0, max: this.scale.height },
      speedY: { min: 200, max: 300 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.5, end: 0.2 },
      alpha: { start: 0.6, end: 0 },
      tint: this.emotionColor,
      lifespan: 3000,
      frequency: 50,
      blendMode: 'ADD',
    });

    this.add.particles(this.scale.width - 150, 200, 'particle', {
      x: 0,
      y: { min: 0, max: this.scale.height },
      speedY: { min: 200, max: 300 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.5, end: 0.2 },
      alpha: { start: 0.6, end: 0 },
      tint: this.emotionColor,
      lifespan: 3000,
      frequency: 50,
      blendMode: 'ADD',
    });
  }

  private createBreathingCircle(x: number, y: number): void {
    // Outer guide circle (stays same size)
    this.add
      .circle(x, y, 150, 0xffffff, 0)
      .setStrokeStyle(2, 0xffffff, 0.3);

    // Breathing circle (expands and contracts)
    this.breathCircle = this.add
      .circle(x, y, 80, this.emotionColor, 0.5)
      .setStrokeStyle(3, this.emotionColor, 0.9);

    // Inner glow
    const innerGlow = this.add.circle(x, y, 70, this.emotionColor, 0.3);
    innerGlow.setBlendMode(Phaser.BlendModes.ADD);

    // Make interactive to start breathing
    this.breathCircle.setInteractive({ useHandCursor: true });
    this.breathCircle.on('pointerdown', () => {
      if (!this.isBreathing) {
        this.startBreathingCycle();
      }
    });

    // Idle pulsing when not breathing
    this.tweens.add({
      targets: [this.breathCircle, innerGlow],
      scale: { from: 0.95, to: 1.05 },
      alpha: { from: 0.5, to: 0.7 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private startBreathingCycle(): void {
    if (this.isBreathing) return;

    this.isBreathing = true;
    this.breathText.setText('');

    // Phase 1: Breathe In (4 seconds)
    this.breathText.setText('Breathe In');
    this.breathText.setColor('#4ADE80');

    this.tweens.add({
      targets: this.breathCircle,
      radius: 150,
      alpha: 0.8,
      duration: 4000,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Phase 2: Hold (4 seconds)
        this.breathText.setText('Hold');
        this.breathText.setColor('#FFD700');

        this.time.delayedCall(4000, () => {
          // Phase 3: Breathe Out (6 seconds)
          this.breathText.setText('Breathe Out');
          this.breathText.setColor('#60A5FA');

          this.tweens.add({
            targets: this.breathCircle,
            radius: 80,
            alpha: 0.5,
            duration: 6000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
              // Cycle complete
              this.cyclesCompleted++;
              this.isBreathing = false;
              this.breathText.setText('Click to Continue Breathing');
              this.breathText.setColor('#FFD700');

              // Visual celebration
              this.vfx.createSparkles(
                this.scale.width / 2,
                480,
                this.emotionColor,
                30
              );
              this.cameras.main.flash(150, ...this.hexToRgb(this.emotionColor));

              // Auto-start next cycle if not complete
              if (this.cyclesCompleted < 3) {
                this.time.delayedCall(1500, () => {
                  if (!this.isBreathing) {
                    this.startBreathingCycle();
                  }
                });
              }
            },
          });
        });
      },
    });
  }

  private hexToRgb(hex: number): [number, number, number] {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return [r, g, b];
  }

  private completeModule(): void {
    if (this.cyclesCompleted < 3) {
      return; // Need 3 breath cycles
    }

    console.log(`✅ Module 6 completed - ${this.cyclesCompleted} breath cycles`);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(6, {
      emotionSelected: this.emotionId,
      journalEntry: `Completed ${this.cyclesCompleted} breathing cycles`,
    });

    this.cameras.main.flash(500, 255, 215, 0);
    this.vfx.createEnergyPulse(
      this.scale.width / 2,
      this.scale.height / 2,
      0xffd700,
      15
    );

    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.MODULE_7, { emotionId: this.emotionId });
    });
  }
}
