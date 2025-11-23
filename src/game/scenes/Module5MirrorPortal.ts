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
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 120, 'Module 5: Reframing Through New Perspectives', {
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
        'Click the floating cards to reveal different perspectives.\nEach view offers a new way to understand your emotion.',
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
      .text(centerX, 280, 'Perspectives Explored: 0', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Create perspective cards
    this.createPerspectiveCards();

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

        if (this.revealedCount === 1) {
          this.instructionText.setText(
            'Good start! Explore at least one more perspective to continue.'
          );
        }

        if (this.revealedCount >= 2) {
          this.instructionText.setText(
            'Excellent! Multiple perspectives bring wisdom.\nExplore more or continue when ready.'
          );
          continueBtn.setAlpha(1);
        }
      },
    });

    console.log('✅ Module 5 - The Mirror Portal: Ready');
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

  private hexToRgb(hex: number): [number, number, number] {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return [r, g, b];
  }

  private completeModule(): void {
    if (this.revealedCount < 2) {
      return; // Need at least 2 perspectives
    }

    console.log(`✅ Module 5 completed - ${this.revealedCount} perspectives explored`);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(5, {
      emotionSelected: this.emotionId,
      perspectiveChoice: `Explored ${this.revealedCount} perspectives`,
    });

    this.cameras.main.flash(500, 255, 215, 0);
    this.vfx.createEnergyPulse(
      this.scale.width / 2,
      this.scale.height / 2,
      0xffd700,
      15
    );

    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.HUB);
    });
  }
}
