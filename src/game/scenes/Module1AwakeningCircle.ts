/**
 * Module 1: The Awakening Circle (Mood Meter)
 * Players explore their emotional intensity and physical sensations
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface Module1Data {
  emotionId: EmotionType;
}

export class Module1AwakeningCircle extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private intensity: number = 5; // 0-10 scale
  private intensityDescription: string = '';

  private sliderTrack!: Phaser.GameObjects.Rectangle;
  private sliderHandle!: Phaser.GameObjects.Container;
  private intensityText!: Phaser.GameObjects.Text;
  private intensityLabel!: Phaser.GameObjects.Text;
  private emotionCircle!: Phaser.GameObjects.Arc;
  private vfx!: VisualEffectsManager;

  constructor() {
    super(SCENE_KEYS.MODULE_1);
  }

  init(data: Module1Data): void {
    this.emotionId = data.emotionId;
    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    this.emotionName = emotion.name;
    this.setEmotion(this.emotionId);
  }

  create(): void {
    this.fadeIn();

    // Initialize visual effects
    this.vfx = new VisualEffectsManager(this);

    this.createBackground();

    // Enhanced visual atmosphere
    this.vfx.createAuroraBackground(this.emotionColor);
    this.vfx.createParallaxStars(2);
    this.vfx.createFloatingOrbs(15, this.emotionColor);

    this.createEmotionalWisps();

    // Title
    const emotion = EMOTION_DEFINITIONS[this.emotionId];

    this.add
      .text(this.scale.width / 2, 80, 'The Awakening Circle', {
        fontSize: '56px',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 150, 'Module 1: Understanding Your Intensity', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'Merriweather, serif',
      })
      .setOrigin(0.5);

    // Emotion display
    this.add
      .text(this.scale.width / 2, 230, `Exploring: ${this.emotionName}`, {
        fontSize: '36px',
        color: emotion.color,
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    // Central emotion visualization
    this.createEmotionVisualization();

    // Instructions
    this.add
      .text(
        this.scale.width / 2,
        360,
        'How intensely are you feeling this emotion right now?\nMove the slider to show the strength of your feeling.',
        {
          fontSize: '24px',
          color: '#ffffff',
          fontFamily: 'Merriweather, serif',
          align: 'center',
          lineSpacing: 8,
        }
      )
      .setOrigin(0.5);

    // Create intensity slider
    this.createIntensitySlider();

    // Create intensity description input
    this.createDescriptionInput();

    // Companion guidance
    this.createCompanionGuidance();

    // Continue button
    this.createContinueButton();

    console.log('✅ Module 1 - Awakening Circle: Ready');
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#1A1A2E');

    // Create mystical circle pattern
    const graphics = this.add.graphics();

    // Starfield
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const size = Phaser.Math.Between(1, 2);
      graphics.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.2, 0.6));
      graphics.fillCircle(x, y, size);
    }

    // Mystical circles (concentric)
    const centerX = this.scale.width / 2;
    const centerY = 550;

    for (let i = 3; i > 0; i--) {
      const radius = i * 120;
      const alpha = 0.05 + (i * 0.02);
      graphics.lineStyle(2, this.emotionColor, alpha);
      graphics.strokeCircle(centerX, centerY, radius);
    }
  }

  private createEmotionVisualization(): void {
    const centerX = this.scale.width / 2;
    const centerY = 550;

    // Add light rays emanating from center
    this.vfx.createLightRays(centerX, centerY, this.emotionColor, 24);

    // Emotion glow
    this.vfx.createEmotionGlow(centerX, centerY, this.emotionColor, 500);

    // Central emotion circle that grows with intensity
    this.emotionCircle = this.add.circle(
      centerX,
      centerY,
      80,
      this.emotionColor,
      0.3
    );
    this.emotionCircle.setBlendMode(Phaser.BlendModes.ADD);

    // Pulsing animation
    this.tweens.add({
      targets: this.emotionCircle,
      alpha: 0.5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    // Inner glow
    const innerGlow = this.add.circle(centerX, centerY, 60, this.emotionColor, 0.5);
    innerGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: innerGlow,
      scale: 1.2,
      alpha: 0.2,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // Sparkle particles around the emotion
    this.vfx.createSparkles(centerX, centerY, this.emotionColor, 120);
  }

  private createIntensitySlider(): void {
    const centerX = this.scale.width / 2;
    const sliderY = 720;
    const sliderWidth = 600;

    // Labels at ends
    this.add
      .text(centerX - sliderWidth / 2 - 60, sliderY, '0', {
        fontSize: '28px',
        color: '#888888',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX + sliderWidth / 2 + 60, sliderY, '10', {
        fontSize: '28px',
        color: this.emotionColor.toString(16),
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Slider track
    this.sliderTrack = this.add
      .rectangle(centerX, sliderY, sliderWidth, 12, 0x4a5568, 1)
      .setStrokeStyle(2, 0xffffff, 0.3);

    // Progress fill (grows with intensity)
    const progressFill = this.add
      .rectangle(
        centerX - sliderWidth / 2,
        sliderY,
        0,
        12,
        this.emotionColor,
        0.6
      )
      .setOrigin(0, 0.5);

    // Slider handle
    this.sliderHandle = this.add.container(centerX, sliderY);

    const handleCircle = this.add
      .circle(0, 0, 20, this.emotionColor, 1)
      .setStrokeStyle(3, 0xffffff, 1)
      .setInteractive({ useHandCursor: true, draggable: true });

    const handleGlow = this.add.circle(0, 0, 30, this.emotionColor, 0.3);

    this.sliderHandle.add([handleGlow, handleCircle]);

    // Intensity value display
    this.intensityText = this.add
      .text(centerX, sliderY - 60, '5', {
        fontSize: '64px',
        color: this.emotionColor.toString(16),
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.intensityLabel = this.add
      .text(centerX, sliderY - 100, 'Moderate', {
        fontSize: '32px',
        color: '#FFD700',
        fontFamily: 'Merriweather, serif',
      })
      .setOrigin(0.5);

    // Drag functionality
    handleCircle.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number) => {
      const minX = centerX - sliderWidth / 2;
      const maxX = centerX + sliderWidth / 2;
      const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);

      this.sliderHandle.x = clampedX;

      // Calculate intensity (0-10)
      const normalizedPosition = (clampedX - minX) / sliderWidth;
      this.intensity = Math.round(normalizedPosition * 10);

      // Update display
      this.updateIntensityDisplay();

      // Update progress fill
      progressFill.width = (clampedX - minX);

      // Update emotion circle size
      const scale = 0.5 + (this.intensity / 10) * 1.5;
      this.tweens.add({
        targets: this.emotionCircle,
        scale,
        duration: 200,
      });
    });

    // Click on track to jump
    this.sliderTrack.setInteractive();
    this.sliderTrack.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const minX = centerX - sliderWidth / 2;
      const maxX = centerX + sliderWidth / 2;
      const clampedX = Phaser.Math.Clamp(pointer.x, minX, maxX);

      this.tweens.add({
        targets: this.sliderHandle,
        x: clampedX,
        duration: 300,
        onUpdate: () => {
          const normalizedPosition = (this.sliderHandle.x - minX) / sliderWidth;
          this.intensity = Math.round(normalizedPosition * 10);
          this.updateIntensityDisplay();
          progressFill.width = this.sliderHandle.x - minX;

          const scale = 0.5 + (this.intensity / 10) * 1.5;
          this.emotionCircle.setScale(scale);
        },
      });
    });

    // Initialize at middle position
    this.updateIntensityDisplay();
  }

  private updateIntensityDisplay(): void {
    this.intensityText.setText(this.intensity.toString());

    // Update label based on intensity
    const labels = [
      'None',        // 0
      'Barely There', // 1
      'Slight',      // 2
      'Mild',        // 3
      'Noticeable',  // 4
      'Moderate',    // 5
      'Strong',      // 6
      'Very Strong', // 7
      'Intense',     // 8
      'Overwhelming', // 9
      'Extreme',     // 10
    ];

    this.intensityLabel.setText(labels[this.intensity]);
    this.intensityDescription = labels[this.intensity];

    // Color intensity feedback
    const alpha = 0.3 + (this.intensity / 10) * 0.7;
    this.emotionCircle.setAlpha(alpha);
  }

  private createDescriptionInput(): void {
    const centerX = this.scale.width / 2;
    const y = 850;

    this.add
      .text(centerX, y, 'Where do you feel this in your body?', {
        fontSize: '28px',
        color: '#FFD700',
        fontFamily: 'Merriweather, serif',
      })
      .setOrigin(0.5);

    const descBox = this.add
      .rectangle(centerX, y + 60, 600, 60, 0x0f3460, 0.8)
      .setStrokeStyle(3, this.emotionColor, 0.5)
      .setInteractive({ useHandCursor: true });

    const descText = this.add
      .text(centerX, y + 60, 'Click to describe...', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Merriweather, serif',
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    // Use beautiful modal system from BaseScene
    descBox.on('pointerdown', async () => {
      const description = await this.showTextInputModal(
        'Physical Sensations',
        'e.g., "tightness in my chest", "butterflies in stomach"',
        'Where do you feel this emotion in your body? Physical sensations help us understand our emotions more deeply.',
        0,
        ''
      );
      if (description && description.trim()) {
        descText.setText(description.trim());
        descText.setAlpha(1);
      }
    });
  }

  private createCompanionGuidance(): void {
    const companionBox = this.add.container(200, this.scale.height - 150);

    // Companion avatar (small)
    const companionGlow = this.add.circle(0, 0, 25, 0x9370db, 0.3);
    const companionBody = this.add.circle(0, 0, 20, 0x9370db, 0.8);

    // Message bubble
    const bubbleWidth = 500;
    const bubble = this.add
      .rectangle(280, 0, bubbleWidth, 120, 0x2d3748, 0.9)
      .setStrokeStyle(2, 0x9370db, 0.8);

    const guidanceText = this.add
      .text(
        280,
        0,
        'Take your time. There\'s no right or wrong answer.\nNotice how this emotion feels in your body.',
        {
          fontSize: '18px',
          color: '#ffffff',
          fontFamily: 'Merriweather, serif',
          align: 'center',
          wordWrap: { width: bubbleWidth - 40 },
        }
      )
      .setOrigin(0.5);

    companionBox.add([companionGlow, companionBody, bubble, guidanceText]);

    // Gentle floating
    this.tweens.add({
      targets: companionBox,
      y: this.scale.height - 160,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createContinueButton(): void {
    const button = this.createButton(
      this.scale.width / 2,
      this.scale.height - 70,
      'Continue to Next Step',
      () => this.completeModule(),
      350,
      70
    );

    // Pulsing hint
    this.tweens.add({
      targets: button,
      scale: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });
  }

  private completeModule(): void {
    console.log(`✅ Module 1 completed - Intensity: ${this.intensity}`);

    // Save module data
    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(1, {
      emotionSelected: this.emotionId,
      intensity: this.intensity,
      intensityDescription: this.intensityDescription,
    });

    // Enhanced visual celebration
    this.cameras.main.flash(400, 255, 215, 0);
    this.vfx.createEnergyPulse(
      this.scale.width / 2,
      this.scale.height / 2,
      0xffd700,
      10
    );

    // Transition back to hub for now (Module 2 coming next)
    this.time.delayedCall(500, () => {
      this.showCompletionMessage();
    });
  }

  private showCompletionMessage(): void {
    const overlay = this.add.container(this.scale.width / 2, this.scale.height / 2);
    overlay.setDepth(1000);

    const bg = this.add.rectangle(0, 0, 800, 450, 0x000000, 0.9);

    const titleText = this.add
      .text(0, -150, 'Module 1 Complete! ✨', {
        fontSize: '48px',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    const messageText = this.add
      .text(
        0,
        -50,
        `You've begun to understand your ${this.emotionName} emotion.\n\n` +
        `Intensity Level: ${this.intensity}/10 (${this.intensityDescription})\n\n` +
        'This awareness is the first step toward\nemotional understanding.',
        {
          fontSize: '22px',
          color: '#ffffff',
          fontFamily: 'Merriweather, serif',
          align: 'center',
          lineSpacing: 10,
        }
      )
      .setOrigin(0.5);

    const nextStepText = this.add
      .text(
        0,
        90,
        'Next: Module 2 - Memory Constellation\n(Associate memories with this emotion)',
        {
          fontSize: '20px',
          color: '#9370db',
          fontFamily: 'Merriweather, serif',
          fontStyle: 'italic',
          align: 'center',
        }
      )
      .setOrigin(0.5);

    const continueButton = this.createButton(
      0,
      170,
      'Continue to Module 2',
      () => {
        this.transitionToScene(SCENE_KEYS.MODULE_2, { emotionId: this.emotionId });
      },
      300,
      60
    );

    overlay.add([bg, titleText, messageText, nextStepText, continueButton]);
    overlay.setAlpha(0);

    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 500,
    });

    // Celebration particles
    this.createCelebrationParticles();
  }

  private createCelebrationParticles(): void {
    const emitter = this.add.particles(this.scale.width / 2, this.scale.height / 2, 'particle', {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: [this.emotionColor, 0xFFD700, 0xffffff],
      lifespan: 2000,
      gravityY: 200,
      quantity: 2,
      frequency: 50,
      blendMode: 'ADD',
    });

    emitter.setDepth(1001);

    this.time.delayedCall(3000, () => {
      emitter.stop();
      this.time.delayedCall(2000, () => emitter.destroy());
    });
  }
}
