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

    // Enhanced visual atmosphere (more particles for teens, less for adults)
    this.vfx.createAuroraBackground(this.emotionColor);
    this.vfx.createParallaxStars(2);
    this.vfx.createFloatingOrbs(this.isTeen() ? 15 : 8, this.emotionColor);

    if (this.isTeen()) {
      this.createEmotionalWisps();
    }

    // Get narrative content based on age group
    const narrative = this.narrative!.module1;

    const emotion = EMOTION_DEFINITIONS[this.emotionId];

    // Title - adventure theme
    this.add
      .text(this.scale.width / 2, 80, narrative.title, {
        fontSize: '56px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 6)
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 10);

    // Subtitle - adventure theme
    this.add
      .text(this.scale.width / 2, 150, narrative.subtitle, {
        fontSize: '28px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
      })
      .setOrigin(0.5)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.8)', 6);

    // Emotion display
    this.add
      .text(this.scale.width / 2, 230, `Exploring: ${this.emotionName}`, {
        fontSize: '36px',
        color: '#D4AF37',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    // Central emotion visualization
    this.createEmotionVisualization();

    // Instructions - adventure theme
    this.add
      .text(
        this.scale.width / 2,
        360,
        narrative.instructions,
        {
          fontSize: '22px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
          align: 'center',
          lineSpacing: 8,
          wordWrap: { width: this.scale.width * 0.8 },
        }
      )
      .setOrigin(0.5);

    // Create intensity slider
    this.createIntensitySlider();

    // Create intensity description text area (LARGE)
    this.createIntensityDescriptionInput();

    // Create body sensation input
    this.createDescriptionInput();

    // Companion guidance
    this.createCompanionGuidance();

    // Teen-only adventure visuals
    if (this.isTeen()) {
      this.createAdventureElements();
    }

    // Adult-only calming visuals
    if (this.isAdult()) {
      this.createCalmingElements();
    }

    // Continue button
    this.createContinueButton();

    console.log('✅ Module 1 - Awakening Circle: Ready (Adventure Theme)');
  }

  private createAdventureElements(): void {
    const centerX = this.scale.width / 2;
    const centerY = 550;

    // Add floating magical books around the circle
    this.vfx.createFloatingBook(centerX - 250, centerY - 150, 0x8B4513);
    this.vfx.createFloatingBook(centerX + 250, centerY - 150, 0x654321);
    this.vfx.createFloatingBook(centerX - 280, centerY + 150, 0x8B4513);
    this.vfx.createFloatingBook(centerX + 280, centerY + 150, 0x654321);

    // Add mystical runes floating around the awakening circle
    this.vfx.createFloatingRunes(10, this.emotionColor);

    // Add magical compass as a guide
    this.vfx.createMagicalCompass(centerX - 350, 250);

    // Add ancient pillars to frame the circle
    this.vfx.createAncientPillar(150, this.scale.height - 100, 150);
    this.vfx.createAncientPillar(this.scale.width - 150, this.scale.height - 100, 150);

    // Add magical torches
    this.vfx.createMagicalTorch(200, 350, this.emotionColor);
    this.vfx.createMagicalTorch(this.scale.width - 200, 350, this.emotionColor);

    // Add periodic flying creatures
    this.time.addEvent({
      delay: 10000,
      loop: true,
      callback: () => {
        const side = Math.random() > 0.5;
        const startX = side ? -50 : this.scale.width + 50;
        const startY = Phaser.Math.Between(150, 350);
        this.vfx.createFlyingCreature(startX, startY, this.emotionColor);
      }
    });

    // Add guardian statues watching over the circle
    this.vfx.createGuardianStatue(80, this.scale.height - 200);
    this.vfx.createGuardianStatue(this.scale.width - 80, this.scale.height - 200);
  }

  private createCalmingElements(): void {
    const centerX = this.scale.width / 2;

    // Add multiple breathing circles for mindfulness focus
    this.vfx.createBreathingCircle(centerX, 400, this.emotionColor, 80);
    this.vfx.createBreathingCircle(250, 320, 0x87CEEB, 60);
    this.vfx.createBreathingCircle(this.scale.width - 250, 320, 0xB0C4DE, 60);

    // Add calm ambient particles for tranquility
    this.vfx.createCalmAmbientParticles(12, 0xB0C4DE);

    // Add mindfulness ripples at key focus points
    this.vfx.createMindfulnessRipples(centerX, 550, 0x87CEEB);
    this.vfx.createMindfulnessRipples(centerX, 450, 0xDDA0DD);

    // Add grounding elements for stability
    this.vfx.createGroundingElement(150, this.scale.height - 150, 0x8B7355);
    this.vfx.createGroundingElement(this.scale.width - 150, this.scale.height - 150, 0x8B7355);

    // Add therapeutic halos around emotion circle
    this.vfx.createTherapeuticHalo(centerX, 550, 0xFFE4B5, 200);
    this.vfx.createTherapeuticHalo(centerX, 550, 0xDDA0DD, 150);

    // Add meditation dot for centering
    this.vfx.createMeditationDot(centerX, 200, 0xFFFFFF);

    // Add mindfulness symbols for peace
    this.vfx.createMindfulnessSymbols(5, 0xB0C4DE);

    // Add focus rings around main activity area
    this.vfx.createFocusRings(centerX, 550, 0x87CEEB);
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

  private createIntensityDescriptionInput(): void {
    const centerX = this.scale.width / 2;
    const y = 800;

    this.add
      .text(centerX, y, 'Describe how this intensity feels in your inner life and day:', {
        fontSize: '24px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        align: 'center',
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);

    const textBox = this.add
      .rectangle(centerX, y + 80, 750, 120, 0x2C1810, 0.9)
      .setStrokeStyle(3, 0xD4AF37, 0.7)
      .setInteractive({ useHandCursor: true });

    const boxText = this.add
      .text(centerX, y + 80, 'Click to write about this intensity...', {
        fontSize: '18px',
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
        align: 'center',
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

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

  private createDescriptionInput(): void {
    const centerX = this.scale.width / 2;
    const y = 960;

    this.add
      .text(centerX, y, 'Where do you feel this in your body?', {
        fontSize: '28px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(0.5);

    const descBox = this.add
      .rectangle(centerX, y + 60, 600, 60, 0x2C1810, 0.9)
      .setStrokeStyle(3, 0xD4AF37, 0.7)
      .setInteractive({ useHandCursor: true });

    const descText = this.add
      .text(centerX, y + 60, 'Click to describe...', {
        fontSize: '20px',
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
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
