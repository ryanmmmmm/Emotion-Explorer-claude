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

interface BodyLanguageResponses {
  whereFeeling: string;
  whatFeelsLike: string;
  ifCouldTalk: string;
  ifCouldAsk: string;
  actionWouldTake: string;
}

export class Module3TempleEmbodiment extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private vfx!: VisualEffectsManager;
  private bodyParts: BodyPart[] = [];
  private selectedParts: Set<string> = new Set();
  private instructionText!: Phaser.GameObjects.Text;
  private bodyLanguageResponses: BodyLanguageResponses = {
    whereFeeling: '',
    whatFeelsLike: '',
    ifCouldTalk: '',
    ifCouldAsk: '',
    actionWouldTake: '',
  };

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

    // Initialize theme and narrative
    this.initializeTheme();

    this.vfx = new VisualEffectsManager(this);
    this.createBackground();

    // Enhanced visual atmosphere
    this.vfx.createAuroraBackground(this.emotionColor);
    this.vfx.createParallaxStars(2);
    this.vfx.createFloatingOrbs(20, this.emotionColor);
    this.createEmotionalWisps();


    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    const centerX = this.scale.width / 2;

    // Get narrative content based on age group
    const narrative = this.narrative!.module3;

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
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 10);

    // Subtitle - age-appropriate
    this.add
      .text(centerX, 120, narrative.subtitle, {
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

    // Instructions - age-appropriate
    this.instructionText = this.add
      .text(
        centerX,
        220,
        this.isTeen()
          ? 'Click on the body parts where you feel this emotion.\nEach area you select will glow with energy.'
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

    // Selection counter - adventure theme
    const counterText = this.add
      .text(centerX, 280, 'Areas Selected: 0', {
        fontSize: '22px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(0.5);

    // Create body silhouette with interactive zones
    this.createBodyMap(centerX, 550);

    // Create 5 text input boxes for body language questions
    this.createBodyLanguageInputs(centerX, 550);

    // Continue button (enabled after all 5 responses filled)
    const continueBtn = this.createButton(
      centerX,
      this.scale.height - 80,
      'Continue to Next Step',
      () => this.completeModule(),
      300,
      60
    );
    continueBtn.setAlpha(0.3);

    // Update UI based on responses
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        counterText.setText(`Areas Selected: ${this.selectedParts.size}`);

        const responsesCount = Object.values(this.bodyLanguageResponses).filter(r => r.trim().length > 0).length;

        if (this.selectedParts.size === 0) {
          this.instructionText.setText(
            'Click on the body parts where you feel this emotion.\nThen answer the 5 questions below.'
          );
        } else if (responsesCount < 5) {
          this.instructionText.setText(
            `Good! Now answer all 5 questions below (${responsesCount}/5 complete).`
          );
        } else {
          this.instructionText.setText(
            'Excellent! Your body holds important wisdom.\nYou can continue to the next module.'
          );
          continueBtn.setAlpha(1);
        }
      },
    });

    console.log('✅ Module 3 - Temple of Embodiment: Ready (Adventure Theme)');
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#1A0F08');
    this.createParchmentBackground();
    this.createOrnateFrame();
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
            color: '#D4AF37',
            fontFamily: 'Crimson Text, serif',
            stroke: '#2C1810',
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

  private createBodyLanguageInputs(centerX: number, bodyY: number): void {
    // Position around the body diagram
    const positions = [
      { x: centerX - 280, y: bodyY - 150, key: 'whereFeeling', label: 'Where do you feel it?', prompt: 'Where in your body do you feel this emotion?' },
      { x: centerX + 280, y: bodyY - 150, key: 'whatFeelsLike', label: 'What does it feel like?', prompt: 'What physical sensations do you notice? (achy, tight, butterflies, warm, cold, etc.)' },
      { x: centerX + 280, y: bodyY + 50, key: 'ifCouldTalk', label: 'If it could talk?', prompt: 'If that part of your body could talk, what would it say?' },
      { x: centerX - 280, y: bodyY + 250, key: 'ifCouldAsk', label: 'If it could ask?', prompt: 'If that part of your body could ask for something, what would it ask for?' },
      { x: centerX, y: bodyY + 350, key: 'actionWouldTake', label: 'What action?', prompt: 'If that part of your body could take action, what would it do?' },
    ];

    positions.forEach(({ x, y, key, label, prompt }) => {
      // Label text
      this.add
        .text(x, y - 25, label, {
          fontSize: '18px',
          color: '#D4AF37',
          fontFamily: 'Crimson Text, serif',
          fontStyle: 'italic',
          align: 'center',
          wordWrap: { width: 200 },
        })
        .setOrigin(0.5);

      // Input box
      const textBox = this.add
        .rectangle(x, y + 20, 220, 80, 0x2C1810, 0.9)
        .setStrokeStyle(2, 0xD4AF37, 0.7)
        .setInteractive({ useHandCursor: true });

      const boxText = this.add
        .text(x, y + 20, 'Click to write...', {
          fontSize: '16px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
          align: 'center',
          wordWrap: { width: 200 },
        })
        .setOrigin(0.5)
        .setAlpha(0.7);

      textBox.on('pointerover', () => {
        textBox.setStrokeStyle(3, 0xD4AF37, 1);
      });

      textBox.on('pointerout', () => {
        textBox.setStrokeStyle(2, 0xD4AF37, 0.7);
      });

      textBox.on('pointerdown', async () => {
        const response = await this.showTextInputModal(
          label,
          'Write your thoughts...',
          prompt,
          10, // minimum 10 words
          this.bodyLanguageResponses[key as keyof BodyLanguageResponses]
        );

        if (response && response.trim()) {
          const displayText = response.trim().length > 80
            ? response.trim().substring(0, 77) + '...'
            : response.trim();
          boxText.setText(displayText);
          boxText.setAlpha(1);
          this.bodyLanguageResponses[key as keyof BodyLanguageResponses] = response.trim();
        }
      });
    });
  }

  private completeModule(): void {
    // Check that all 5 responses are filled
    const allResponsesFilled = Object.values(this.bodyLanguageResponses).every(r => r.trim().length > 0);

    if (!allResponsesFilled) {
      return; // Need all 5 responses
    }

    console.log(`✅ Module 3 completed - Body parts: ${Array.from(this.selectedParts).join(', ')}`);
    console.log(`Body Language Responses:`, this.bodyLanguageResponses);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(3, {
      emotionSelected: this.emotionId,
      bodyLocation: Array.from(this.selectedParts).join(', '),
      bodyLanguageResponses: this.bodyLanguageResponses,
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
