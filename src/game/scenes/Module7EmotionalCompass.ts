/**
 * Module 7: The Emotional Compass
 * Players identify triggers and patterns in 8 directions
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface Module7Data {
  emotionId: EmotionType;
}

interface CompassTrigger {
  id: string;
  label: string;
  angle: number;
  x: number;
  y: number;
  container: Phaser.GameObjects.Container;
  selected: boolean;
}

export class Module7EmotionalCompass extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private vfx!: VisualEffectsManager;
  private triggers: CompassTrigger[] = [];
  private selectedCount: number = 0;
  private instructionText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.MODULE_7);
  }

  init(data: Module7Data): void {
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

    // Title
    this.add
      .text(centerX, 60, 'The Emotional Compass', {
        fontSize: '52px',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 120, 'Module 7: Identifying Triggers and Patterns', {
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
        'Click the triggers around the compass that relate to your emotion.\nRecognizing patterns helps you understand when this feeling arises.',
        {
          fontSize: '20px',
          color: '#AACCFF',
          fontFamily: 'Merriweather, serif',
          align: 'center',
          lineSpacing: 6,
        }
      )
      .setOrigin(0.5);

    // Counter
    const counterText = this.add
      .text(centerX, 280, 'Triggers Selected: 0', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Create compass with triggers
    this.createCompass(centerX, 500);

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
        counterText.setText(`Triggers Selected: ${this.selectedCount}`);

        if (this.selectedCount === 1) {
          this.instructionText.setText(
            'Good start! Select at least one more trigger to continue.'
          );
        }

        if (this.selectedCount >= 2) {
          this.instructionText.setText(
            'Excellent! Understanding your triggers empowers you.\nSelect more or continue when ready.'
          );
          continueBtn.setAlpha(1);
        }
      },
    });

    console.log('✅ Module 7 - The Emotional Compass: Ready');
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

  private createCompass(centerX: number, centerY: number): void {
    // Draw compass rose
    const graphics = this.add.graphics();

    // Outer circle
    graphics.lineStyle(3, this.emotionColor, 0.5);
    graphics.strokeCircle(centerX, centerY, 220);

    // Inner circle
    graphics.lineStyle(2, this.emotionColor, 0.3);
    graphics.strokeCircle(centerX, centerY, 180);

    // Cardinal lines
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * Math.PI / 180;
      const x1 = centerX + Math.cos(angle) * 50;
      const y1 = centerY + Math.sin(angle) * 50;
      const x2 = centerX + Math.cos(angle) * 180;
      const y2 = centerY + Math.sin(angle) * 180;

      graphics.lineStyle(1, 0xffffff, 0.2);
      graphics.lineBetween(x1, y1, x2, y2);
    }

    // Center compass point
    const center = this.add.circle(centerX, centerY, 15, this.emotionColor, 0.6);
    this.tweens.add({
      targets: center,
      alpha: 0.9,
      scale: 1.1,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // Create 8 trigger points
    const triggerData = [
      { id: 'social', label: 'Social\nSituations', angle: 0 },
      { id: 'work', label: 'Work/\nSchool', angle: 45 },
      { id: 'family', label: 'Family', angle: 90 },
      { id: 'health', label: 'Health', angle: 135 },
      { id: 'relationships', label: 'Romantic\nRelationships', angle: 180 },
      { id: 'finances', label: 'Money/\nFinances', angle: 225 },
      { id: 'future', label: 'Future/\nUncertainty', angle: 270 },
      { id: 'self', label: 'Self-\nImage', angle: 315 },
    ];

    triggerData.forEach(trigger => {
      this.createTrigger(
        trigger.id,
        trigger.label,
        trigger.angle,
        centerX,
        centerY
      );
    });
  }

  private createTrigger(
    id: string,
    label: string,
    angleDeg: number,
    centerX: number,
    centerY: number
  ): void {
    const angle = angleDeg * Math.PI / 180;
    const radius = 220;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    const container = this.add.container(x, y);

    // Glow (invisible until selected)
    const glow = this.add.circle(0, 0, 50, this.emotionColor, 0);
    glow.setBlendMode(Phaser.BlendModes.ADD);

    // Trigger point
    const point = this.add
      .circle(0, 0, 30, 0x2d3748, 0.9)
      .setStrokeStyle(2, this.emotionColor, 0.6)
      .setInteractive({ useHandCursor: true });

    // Label
    const text = this.add
      .text(0, 0, label, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Raleway, sans-serif',
        align: 'center',
      })
      .setOrigin(0.5);

    container.add([glow, point, text]);

    // Hover effect
    point.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        scale: 1.1,
        duration: 200,
      });
      if (!this.triggers.find(t => t.id === id)?.selected) {
        point.setStrokeStyle(3, this.emotionColor, 0.9);
      }
    });

    point.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        scale: 1.0,
        duration: 200,
      });
      if (!this.triggers.find(t => t.id === id)?.selected) {
        point.setStrokeStyle(2, this.emotionColor, 0.6);
      }
    });

    // Click to select/deselect
    point.on('pointerdown', () => {
      const trigger = this.triggers.find(t => t.id === id);
      if (!trigger) return;

      if (trigger.selected) {
        // Deselect
        trigger.selected = false;
        this.selectedCount--;
        point.setFillStyle(0x2d3748, 0.9);
        point.setStrokeStyle(2, this.emotionColor, 0.6);
        glow.setAlpha(0);
      } else {
        // Select
        trigger.selected = true;
        this.selectedCount++;
        point.setFillStyle(this.emotionColor, 0.8);
        point.setStrokeStyle(3, 0xffffff, 1);

        // Glow animation
        glow.setAlpha(0.4);
        this.tweens.add({
          targets: glow,
          alpha: { from: 0.4, to: 0.2 },
          scale: { from: 1, to: 1.2 },
          duration: 1500,
          yoyo: true,
          repeat: -1,
        });

        // Visual feedback
        this.vfx.createSparkles(x, y, this.emotionColor, 20);
        this.cameras.main.flash(100, ...this.hexToRgb(this.emotionColor));
      }
    });

    this.triggers.push({
      id,
      label,
      angle: angleDeg,
      x,
      y,
      container,
      selected: false,
    });
  }

  private hexToRgb(hex: number): [number, number, number] {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return [r, g, b];
  }

  private completeModule(): void {
    if (this.selectedCount < 2) {
      return; // Need at least 2 triggers
    }

    const selectedTriggers = this.triggers
      .filter(t => t.selected)
      .map(t => t.label.replace(/\n/g, ' '))
      .join(', ');

    console.log(`✅ Module 7 completed - Triggers: ${selectedTriggers}`);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(7, {
      emotionSelected: this.emotionId,
    });

    this.cameras.main.flash(500, 255, 215, 0);
    this.vfx.createEnergyPulse(
      this.scale.width / 2,
      this.scale.height / 2,
      0xffd700,
      15
    );

    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.MODULE_8, { emotionId: this.emotionId });
    });
  }
}
