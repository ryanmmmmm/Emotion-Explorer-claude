/**
 * Module 5: The Mirror Portal
 * Players reframe emotions through different perspective cards
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface Module5Data {
  emotionId: EmotionType;
}

interface PerspectiveCard {
  id: string;
  question: string;
  perspective: string;
  container: Phaser.GameObjects.Container;
  revealed: boolean;
}

export class Module5MirrorPortal extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private vfx!: VisualEffectsManager;
  private cards: PerspectiveCard[] = [];
  private revealedCount: number = 0;
  private instructionText!: Phaser.GameObjects.Text;
  private reverseLetter: string = '';

  constructor() {
    super(SCENE_KEYS.MODULE_5);
  }

  init(data: Module5Data): void {
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
    this.vfx.createFloatingOrbs(18, this.emotionColor);
    this.createEmotionalWisps();

    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    const centerX = this.scale.width / 2;

    // Title
    this.add
      .text(centerX, 60, 'The Mirror Portal', {
        fontSize: '52px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 6)
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 8);

    this.add
      .text(centerX, 120, 'Module 5: Reframing Through New Perspectives', {
        fontSize: '24px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
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
        'Click the floating cards to reveal different perspectives.\nEach view offers a new way to understand your emotion.',
        {
          fontSize: '20px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
          align: 'center',
          lineSpacing: 6,
        }
      )
      .setOrigin(0.5);

    // Counter
    const counterText = this.add
      .text(centerX, 280, 'Perspectives Explored: 0', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Create perspective cards
    this.createPerspectiveCards();

    // Add reverse letter writing text input
    this.createReverseLetterInput(centerX);

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
        counterText.setText(`Perspectives Explored: ${this.revealedCount}`);

        if (this.revealedCount === 0) {
          this.instructionText.setText(
            'Click the floating cards to reveal different perspectives.\nThen write your reverse letter below.'
          );
        } else if (this.revealedCount >= 1 && this.reverseLetter.trim().length === 0) {
          this.instructionText.setText(
            'Good! Now write a letter from a different perspective below.'
          );
        } else if (this.reverseLetter.trim().length > 0) {
          this.instructionText.setText(
            'Excellent! You have explored new perspectives.\nYou can continue when ready.'
          );
          continueBtn.setAlpha(1);
        }
      },
    });

    console.log('✅ Module 5 - The Mirror Portal: Ready (Adventure Theme)');
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#1A0F08');
    this.createParchmentBackground();
    this.createOrnateFrame();

    const graphics = this.add.graphics();

    // Starfield
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const size = Phaser.Math.Between(1, 2);
      graphics.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.2, 0.6));
      graphics.fillCircle(x, y, size);
    }

    // Mirror frame
    const centerX = this.scale.width / 2;
    const centerY = 500;
    graphics.lineStyle(4, this.emotionColor, 0.4);
    graphics.strokeRect(centerX - 450, centerY - 220, 900, 440);
  }

  private createPerspectiveCards(): void {
    const perspectives = [
      {
        id: 'friend',
        question: 'What would a caring friend say?',
        perspective: 'A friend might say: "This emotion shows you care deeply. It\'s okay to feel this way. You\'re stronger than you think."',
      },
      {
        id: 'future',
        question: 'How will I feel about this in a week?',
        perspective: 'Looking ahead: "This intensity will pass. The situation may look different with time and distance. I can handle this."',
      },
      {
        id: 'lesson',
        question: 'What can I learn from this?',
        perspective: 'The lesson: "This emotion teaches me something about what matters to me. Every feeling has wisdom to share."',
      },
      {
        id: 'growth',
        question: 'How is this helping me grow?',
        perspective: 'For growth: "Experiencing this emotion builds my emotional capacity. I\'m becoming more resilient and self-aware."',
      },
    ];

    const startX = 300;
    const startY = 400;
    const spacing = 280;

    perspectives.forEach((p, index) => {
      const x = startX + (index % 2) * spacing + (Math.floor(index / 2) * spacing);
      const y = startY + Math.floor(index / 2) * 200;
      this.createCard(p.id, p.question, p.perspective, x, y, index);
    });
  }

  private createCard(
    id: string,
    question: string,
    perspective: string,
    x: number,
    y: number,
    index: number
  ): void {
    const container = this.add.container(x, y);

    // Card background (front)
    const cardFront = this.add
      .rectangle(0, 0, 240, 160, 0x2d3748, 0.9)
      .setStrokeStyle(3, this.emotionColor, 0.7);

    // Question text (front)
    const questionText = this.add
      .text(0, 0, question, {
        fontSize: '18px',
        color: '#FFD700',
        fontFamily: 'Merriweather, serif',
        align: 'center',
        wordWrap: { width: 210 },
      })
      .setOrigin(0.5);

    // Card background (back - hidden)
    const cardBack = this.add
      .rectangle(0, 0, 240, 160, 0x0f3460, 0.95)
      .setStrokeStyle(3, this.emotionColor, 0.9)
      .setVisible(false);

    // Perspective text (back - hidden)
    const perspectiveText = this.add
      .text(0, 0, perspective, {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Merriweather, serif',
        align: 'center',
        wordWrap: { width: 220 },
        lineSpacing: 4,
      })
      .setOrigin(0.5)
      .setVisible(false);

    // Glow effect
    const glow = this.add.circle(0, 0, 130, this.emotionColor, 0.15);
    glow.setBlendMode(Phaser.BlendModes.ADD);

    container.add([glow, cardFront, cardBack, questionText, perspectiveText]);

    // Make interactive
    cardFront.setInteractive({ useHandCursor: true });

    // Floating animation
    const delay = index * 300;
    this.tweens.add({
      targets: container,
      y: y - 10,
      duration: 2000 + index * 200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay,
    });

    // Glow pulsing
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.15, to: 0.25 },
      scale: { from: 1, to: 1.1 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      delay,
    });

    // Click to flip
    cardFront.on('pointerdown', () => {
      const card = this.cards.find(c => c.id === id);
      if (!card || card.revealed) return;

      this.flipCard(
        container,
        cardFront,
        cardBack,
        questionText,
        perspectiveText
      );
      card.revealed = true;
      this.revealedCount++;

      // Visual feedback
      this.vfx.createSparkles(x, y, this.emotionColor, 25);
      this.cameras.main.flash(150, ...this.hexToRgb(this.emotionColor));
    });

    // Hover effect
    cardFront.on('pointerover', () => {
      this.tweens.add({
        targets: container,
        scale: 1.05,
        duration: 200,
      });
      glow.setAlpha(0.3);
    });

    cardFront.on('pointerout', () => {
      this.tweens.add({
        targets: container,
        scale: 1.0,
        duration: 200,
      });
      glow.setAlpha(0.15);
    });

    this.cards.push({ id, question, perspective, container, revealed: false });
  }

  private flipCard(
    container: Phaser.GameObjects.Container,
    front: Phaser.GameObjects.Rectangle,
    back: Phaser.GameObjects.Rectangle,
    frontText: Phaser.GameObjects.Text,
    backText: Phaser.GameObjects.Text
  ): void {
    // Flip animation
    this.tweens.add({
      targets: container,
      scaleX: 0,
      duration: 200,
      onComplete: () => {
        // Switch visibility
        front.setVisible(false);
        frontText.setVisible(false);
        back.setVisible(true);
        backText.setVisible(true);

        // Flip back to normal
        this.tweens.add({
          targets: container,
          scaleX: 1,
          duration: 200,
        });
      },
    });
  }

  private createReverseLetterInput(centerX: number): void {
    const y = this.scale.height - 220;

    this.add
      .text(centerX, y - 50, 'Write a letter from a different perspective:', {
        fontSize: '22px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
        align: 'center',
        wordWrap: { width: 800 },
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, y - 20, '(From someone else involved, your future self, or a compassionate observer)', {
        fontSize: '16px',
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
        align: 'center',
        wordWrap: { width: 800 },
      })
      .setOrigin(0.5)
      .setAlpha(0.8);

    const textBox = this.add
      .rectangle(centerX, y + 60, 800, 120, 0x2C1810, 0.9)
      .setStrokeStyle(3, 0xD4AF37, 0.7)
      .setInteractive({ useHandCursor: true });

    const boxText = this.add
      .text(centerX, y + 60, 'Click to write your reverse letter...', {
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
      const guidance = `
        <p><strong>Shift your perspective</strong> and write from a different point of view:</p>
        <ul style="margin: 8px 0; padding-left: 20px;">
          <li><strong>Another person involved:</strong> What might they think or feel about this situation?</li>
          <li><strong>Your future self:</strong> Looking back a year from now, what wisdom would you offer?</li>
          <li><strong>A compassionate observer:</strong> What would a wise, kind friend say about your feelings?</li>
        </ul>
        <p style="margin-top: 12px;">This exercise helps you gain insight and empathy by seeing the emotion from outside yourself.</p>
      `;

      const response = await this.showTextInputModal(
        'The Mirror Portal',
        'Begin writing your reverse letter...',
        guidance,
        30, // minimum 30 words
        this.reverseLetter
      );

      if (response && response.trim()) {
        const displayText = response.trim().length > 200
          ? response.trim().substring(0, 197) + '...'
          : response.trim();
        boxText.setText(displayText);
        boxText.setAlpha(1);
        this.reverseLetter = response.trim();
      }
    });
  }

  private hexToRgb(hex: number): [number, number, number] {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return [r, g, b];
  }

  private completeModule(): void {
    if (this.reverseLetter.trim().length === 0) {
      return; // Need reverse letter written
    }

    console.log(`✅ Module 5 completed - ${this.revealedCount} perspectives explored`);
    console.log(`Reverse letter: ${this.reverseLetter.substring(0, 100)}...`);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(5, {
      emotionSelected: this.emotionId,
      perspectiveChoice: `Explored ${this.revealedCount} perspectives`,
      reverseLetter: this.reverseLetter,
    });

    this.cameras.main.flash(500, 255, 215, 0);
    this.vfx.createEnergyPulse(
      this.scale.width / 2,
      this.scale.height / 2,
      0xffd700,
      15
    );

    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.MODULE_6, { emotionId: this.emotionId });
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

    graphics.setDepth(0);
    this.tweens.add({
      targets: graphics,
      alpha: 0.8,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
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

    graphics.setDepth(1);
    this.tweens.add({
      targets: graphics,
      alpha: 0.7,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
