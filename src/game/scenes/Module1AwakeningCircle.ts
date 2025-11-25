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

    // Initialize theme and narrative first
    this.initializeTheme();

    // Initialize visual effects
    this.vfx = new VisualEffectsManager(this);

    this.createBackground();

    // MINIMAL visual atmosphere - keep it clean!
    this.vfx.createParallaxStars(2);
    this.vfx.createFloatingOrbs(5, this.emotionColor); // Reduced from 15/8 to 5!

    // Get narrative content based on age group
    const narrative = this.narrative!.module1;

    const emotion = EMOTION_DEFINITIONS[this.emotionId];

    // RESPONSIVE LAYOUT: Detect compact mode for 13-inch laptops
    const isCompact = this.scale.height <= 900;
    const layout = {
      title: isCompact ? 50 : 80,
      subtitle: isCompact ? 90 : 150,
      emotionDisplay: isCompact ? 130 : 230,
      emotionCircleY: isCompact ? 320 : 550,
      instructions: isCompact ? 220 : 360,
      sliderY: isCompact ? 460 : 720,
      intensityDescY: isCompact ? 540 : 800,
      bodyDescY: isCompact ? 660 : 960,
      companionY: isCompact ? null : this.scale.height - 150, // Hide on compact
      continueButtonY: isCompact ? this.scale.height - 60 : this.scale.height - 70,
    };

    const fontSize = {
      title: isCompact ? '42px' : '56px',
      subtitle: isCompact ? '22px' : '28px',
      emotion: isCompact ? '28px' : '36px',
      instructions: isCompact ? '18px' : '22px',
      intensityLabel: isCompact ? '20px' : '24px',
    };

    // Title - adventure theme
    this.add
      .text(this.scale.width / 2, layout.title, narrative.title, {
        fontSize: fontSize.title,
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 6)
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 10);

    // Subtitle - adventure theme
    this.add
      .text(this.scale.width / 2, layout.subtitle, narrative.subtitle, {
        fontSize: fontSize.subtitle,
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
      })
      .setOrigin(0.5)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.8)', 6);

    // Emotion display
    this.add
      .text(this.scale.width / 2, layout.emotionDisplay, `Exploring: ${this.emotionName}`, {
        fontSize: fontSize.emotion,
        color: '#D4AF37',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    // Central emotion visualization (responsive position)
    this.createEmotionVisualization(layout.emotionCircleY, isCompact);

    // Instructions - adventure theme with better contrast
    this.add
      .text(
        this.scale.width / 2,
        layout.instructions,
        isCompact ? 'Use the slider to show your emotional intensity:' : narrative.instructions,
        {
          fontSize: fontSize.instructions,
          color: '#F4E5B8', // Better contrast!
          fontFamily: 'Crimson Text, serif',
          align: 'center',
          lineSpacing: 6,
          wordWrap: { width: this.scale.width * 0.8 },
        }
      )
      .setOrigin(0.5);

    // Create intensity slider
    this.createIntensitySlider(layout.sliderY, isCompact);

    // Create intensity description text area (LARGE)
    this.createIntensityDescriptionInput(layout.intensityDescY, isCompact);

    // Create body sensation input
    this.createDescriptionInput(layout.bodyDescY, isCompact);

    // Companion guidance (hide on compact screens)
    if (!isCompact && layout.companionY) {
      this.createCompanionGuidance(layout.companionY);
    }

    // Teen-only adventure visuals (MINIMAL!)
    if (this.isTeen()) {
      this.createAdventureElements();
    }

    // Adult-only calming visuals (MINIMAL!)
    if (this.isAdult()) {
      this.createCalmingElements();
    }

    // Continue button
    this.createContinueButton(layout.continueButtonY, isCompact);

    console.log('✅ Module 1 - Awakening Circle: Ready (Adventure Theme)');
  }

  private createAdventureElements(): void {
    // MINIMAL effects - only edge decorations, NO floating books!

    // Only pillars at bottom edges - nothing in the center!
    this.vfx.createAncientPillar(80, this.scale.height - 80, 100);
    this.vfx.createAncientPillar(this.scale.width - 80, this.scale.height - 80, 100);
  }

  private createCalmingElements(): void {
    // MINIMAL effects - only edge decorations, NO center clutter!

    // Only grounding elements at bottom edges
    this.vfx.createGroundingElement(100, this.scale.height - 120, 0x8B7355);
    this.vfx.createGroundingElement(this.scale.width - 100, this.scale.height - 120, 0x8B7355);

    // Subtle ambient particles (reduced from 12 to 5)
    this.vfx.createCalmAmbientParticles(5, 0xB0C4DE);
  }

  private createBackground(): void {
    // Deep brown adventure background
    this.cameras.main.setBackgroundColor('#1A0F08');

    // Create aged parchment texture
    this.createParchmentBackground();

    // Ornate border frame
    this.createOrnateFrame();

    // Mystical circles (concentric) with adventure colors
    const graphics = this.add.graphics();
    const centerX = this.scale.width / 2;
    const centerY = 550;

    for (let i = 3; i > 0; i--) {
      const radius = i * 120;
      const alpha = 0.05 + (i * 0.02);
      graphics.lineStyle(2, 0xD4AF37, alpha);
      graphics.strokeCircle(centerX, centerY, radius);
    }
  }

  private createEmotionVisualization(centerY: number, isCompact: boolean): void {
    const centerX = this.scale.width / 2;

    // MINIMAL visualization - NO light rays, NO emotion glow, NO sparkles!
    // Just the simple pulsing circle

    const circleSize = isCompact ? 60 : 80;

    // Central emotion circle that grows with intensity
    this.emotionCircle = this.add.circle(
      centerX,
      centerY,
      circleSize,
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

    // Inner glow (subtle)
    const innerGlow = this.add.circle(centerX, centerY, circleSize - 20, this.emotionColor, 0.5);
    innerGlow.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: innerGlow,
      scale: 1.2,
      alpha: 0.2,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });
  }

  private createIntensitySlider(sliderY: number, isCompact: boolean): void {
    const centerX = this.scale.width / 2;
    const sliderWidth = isCompact ? 500 : 600;

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

  private createIntensityDescriptionInput(y: number, isCompact: boolean): void {
    const centerX = this.scale.width / 2;
    const boxWidth = isCompact ? 650 : 750;
    const boxHeight = isCompact ? 80 : 120;
    const labelFontSize = isCompact ? '20px' : '24px';
    const textFontSize = isCompact ? '16px' : '18px';

    this.add
      .text(centerX, y, 'Describe how this intensity feels in your inner life and day:', {
        fontSize: labelFontSize,
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        align: 'center',
        wordWrap: { width: boxWidth - 50 },
      })
      .setOrigin(0.5);

    const textBox = this.add
      .rectangle(centerX, y + (isCompact ? 50 : 80), boxWidth, boxHeight, 0x2C1810, 0.9)
      .setStrokeStyle(3, 0xD4AF37, 0.7)
      .setInteractive({ useHandCursor: true });

    const boxText = this.add
      .text(centerX, y + (isCompact ? 50 : 80), 'Click to write about this intensity...', {
        fontSize: textFontSize,
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
        align: 'center',
        wordWrap: { width: boxWidth - 50 },
      })
      .setOrigin(0.5)
      .setAlpha(0.9); // Better visibility!

    textBox.on('pointerdown', async () => {
      const description = await this.showTextInputModal(
        'Describe Your Intensity',
        'Write a few words or phrases...',
        'Describe the intensity of this emotion, how it plays out in your inner life and your day. Move the slider to show how much or how little you are feeling this emotion.',
        15,
        ''
      );
      if (description && description.trim()) {
        // Truncate display text if too long
        const displayText = description.trim().length > 150
          ? description.trim().substring(0, 147) + '...'
          : description.trim();
        boxText.setText(displayText);
        boxText.setAlpha(1);
        this.intensityDescription = description.trim();
      }
    });
  }

  private createDescriptionInput(y: number, isCompact: boolean): void {
    const centerX = this.scale.width / 2;
    const boxWidth = isCompact ? 500 : 600;
    const boxHeight = isCompact ? 50 : 60;
    const labelFontSize = isCompact ? '22px' : '28px';
    const textFontSize = isCompact ? '18px' : '20px';

    this.add
      .text(centerX, y, 'Where do you feel this in your body?', {
        fontSize: labelFontSize,
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(0.5);

    const descBox = this.add
      .rectangle(centerX, y + (isCompact ? 45 : 60), boxWidth, boxHeight, 0x2C1810, 0.9)
      .setStrokeStyle(3, 0xD4AF37, 0.7)
      .setInteractive({ useHandCursor: true });

    const descText = this.add
      .text(centerX, y + (isCompact ? 45 : 60), 'Click to describe...', {
        fontSize: textFontSize,
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(0.5)
      .setAlpha(0.9); // Better visibility!

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

  private createCompanionGuidance(companionY: number): void {
    const companionBox = this.add.container(200, companionY);

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
        this.narrative!.module1.companionGuidance,
        {
          fontSize: '18px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
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

  private createContinueButton(buttonY: number, isCompact: boolean): void {
    const buttonHeight = isCompact ? 55 : 70;
    const buttonWidth = isCompact ? 300 : 350;

    const button = this.createButton(
      this.scale.width / 2,
      buttonY,
      'Continue to Next Step',
      () => this.completeModule(),
      buttonWidth,
      buttonHeight
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
        this.narrative!.module1.completionMessage,
        {
          fontSize: '22px',
          color: this.isTeen() ? '#ffffff' : '#2C3E50',
          fontFamily: this.theme!.secondaryFont,
          align: 'center',
          lineSpacing: 10,
          wordWrap: { width: 750 },
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
