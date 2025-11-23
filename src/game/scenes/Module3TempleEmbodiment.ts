/**
 * Module 3: Temple of Embodiment
 * Players click body parts to indicate where they feel the emotion
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface Module3Data {
  emotionId: EmotionType;
}

interface BodyPart {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  zone: Phaser.GameObjects.Arc;
  glow: Phaser.GameObjects.Arc;
  selected: boolean;
}

export class Module3TempleEmbodiment extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private vfx!: VisualEffectsManager;
  private bodyParts: BodyPart[] = [];
  private selectedParts: Set<string> = new Set();
  private instructionText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.MODULE_3);
  }

  init(data: Module3Data): void {
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
      .text(centerX, 60, 'Temple of Embodiment', {
        fontSize: '52px',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 120, 'Module 3: Body Awareness', {
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
        'Click on the body parts where you feel this emotion.\nEach area you select will glow with energy.',
        {
          fontSize: '20px',
          color: '#AACCFF',
          fontFamily: 'Merriweather, serif',
          align: 'center',
          lineSpacing: 6,
        }
      )
      .setOrigin(0.5);

    // Selection counter
    const counterText = this.add
      .text(centerX, 280, 'Areas Selected: 0', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Create body silhouette with interactive zones
    this.createBodyMap(centerX, 550);

    // Continue button (enabled after selecting 2 body parts)
    const continueBtn = this.createButton(
      centerX,
      this.scale.height - 80,
      'Continue to Next Step',
      () => this.completeModule(),
      300,
      60
    );
    continueBtn.setAlpha(0.3);

    // Update UI based on selections
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        counterText.setText(`Areas Selected: ${this.selectedParts.size}`);

        if (this.selectedParts.size === 1) {
          this.instructionText.setText(
            'Good! Click more areas where you feel this emotion.\nSelect at least 2 areas to continue.'
          );
        }

        if (this.selectedParts.size >= 2) {
          this.instructionText.setText(
            'Excellent! Your body holds important wisdom.\nYou can select more areas or continue.'
          );
          continueBtn.setAlpha(1);
        }
      },
    });

    console.log('✅ Module 3 - Temple of Embodiment: Ready');
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

  private createBodyMap(centerX: number, centerY: number): void {
    // Create simple human silhouette outline
    const graphics = this.add.graphics();
    graphics.lineStyle(3, 0xffffff, 0.4);

    // Head circle
    graphics.strokeCircle(centerX, centerY - 180, 40);

    // Neck
    graphics.lineBetween(centerX, centerY - 140, centerX, centerY - 110);

    // Torso (rectangle-ish)
    graphics.beginPath();
    graphics.moveTo(centerX - 60, centerY - 110);
    graphics.lineTo(centerX + 60, centerY - 110);
    graphics.lineTo(centerX + 70, centerY + 80);
    graphics.lineTo(centerX - 70, centerY + 80);
    graphics.closePath();
    graphics.strokePath();

    // Arms
    graphics.lineBetween(centerX - 60, centerY - 90, centerX - 110, centerY + 20);
    graphics.lineBetween(centerX + 60, centerY - 90, centerX + 110, centerY + 20);

    // Legs
    graphics.lineBetween(centerX - 30, centerY + 80, centerX - 35, centerY + 200);
    graphics.lineBetween(centerX + 30, centerY + 80, centerX + 35, centerY + 200);

    // Create interactive body zones
    this.createBodyPart('head', 'Head', centerX, centerY - 180, 45);
    this.createBodyPart('neck', 'Neck/Throat', centerX, centerY - 125, 35);
    this.createBodyPart('chest', 'Chest/Heart', centerX, centerY - 40, 60);
    this.createBodyPart('stomach', 'Stomach/Gut', centerX, centerY + 30, 55);
    this.createBodyPart('left-arm', 'Left Arm', centerX - 85, centerY - 35, 40);
    this.createBodyPart('right-arm', 'Right Arm', centerX + 85, centerY - 35, 40);
    this.createBodyPart('left-leg', 'Left Leg', centerX - 32, centerY + 140, 35);
    this.createBodyPart('right-leg', 'Right Leg', centerX + 32, centerY + 140, 35);
  }

  private createBodyPart(
    id: string,
    name: string,
    x: number,
    y: number,
    radius: number
  ): void {
    // Invisible glow (appears when selected)
    const glow = this.add.circle(x, y, radius + 10, this.emotionColor, 0);
    glow.setBlendMode(Phaser.BlendModes.ADD);

    // Interactive zone
    const zone = this.add
      .circle(x, y, radius, 0xffffff, 0)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff, 0.1);

    // Hover effect
    zone.on('pointerover', () => {
      if (!this.bodyParts.find(bp => bp.id === id)?.selected) {
        zone.setStrokeStyle(3, this.emotionColor, 0.5);
      }
    });

    zone.on('pointerout', () => {
      if (!this.bodyParts.find(bp => bp.id === id)?.selected) {
        zone.setStrokeStyle(2, 0xffffff, 0.1);
      }
    });

    // Click to select
    zone.on('pointerdown', () => {
      const bodyPart = this.bodyParts.find(bp => bp.id === id);
      if (!bodyPart) return;

      if (bodyPart.selected) {
        // Deselect
        bodyPart.selected = false;
        this.selectedParts.delete(id);
        zone.setStrokeStyle(2, 0xffffff, 0.1);
        glow.setAlpha(0);
      } else {
        // Select
        bodyPart.selected = true;
        this.selectedParts.add(id);
        zone.setStrokeStyle(3, this.emotionColor, 0.8);

        // Glow animation
        glow.setAlpha(0.4);
        this.tweens.add({
          targets: glow,
          alpha: { from: 0.4, to: 0.2 },
          scale: { from: 0.95, to: 1.05 },
          duration: 1500,
          repeat: -1,
          yoyo: true,
        });

        // Visual feedback
        this.vfx.createSparkles(x, y, this.emotionColor, 20);
        this.cameras.main.flash(100, ...this.hexToRgb(this.emotionColor));

        // Show label briefly
        const label = this.add
          .text(x, y - radius - 20, name, {
            fontSize: '18px',
            color: '#FFD700',
            fontFamily: 'Raleway, sans-serif',
            stroke: '#000000',
            strokeThickness: 4,
          })
          .setOrigin(0.5);

        this.tweens.add({
          targets: label,
          alpha: 0,
          y: y - radius - 40,
          duration: 2000,
          onComplete: () => label.destroy(),
        });
      }
    });

    this.bodyParts.push({ id, name, x, y, radius, zone, glow, selected: false });
  }

  private hexToRgb(hex: number): [number, number, number] {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return [r, g, b];
  }

  private completeModule(): void {
    if (this.selectedParts.size < 2) {
      return; // Need at least 2 body parts
    }

    console.log(`✅ Module 3 completed - Selected parts: ${Array.from(this.selectedParts).join(', ')}`);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(3, {
      emotionSelected: this.emotionId,
      bodyLocation: Array.from(this.selectedParts).join(', '),
    });

    this.cameras.main.flash(500, 255, 215, 0);
    this.vfx.createEnergyPulse(
      this.scale.width / 2,
      this.scale.height / 2,
      0xffd700,
      15
    );

    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.MODULE_4, { emotionId: this.emotionId });
    });
  }
}
