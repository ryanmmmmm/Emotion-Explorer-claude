/**
 * Age Selection Scene
 * Player selects their age bracket for age-appropriate content
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';

interface AgeBracket {
  range: string;
  minAge: number;
  maxAge: number;
  description: string;
}

export class AgeSelectionScene extends BaseScene {
  private selectedAge?: number;

  private ageBrackets: AgeBracket[] = [
    {
      range: 'Teen (12-18)',
      minAge: 12,
      maxAge: 18,
      description: 'Adventure narrative with quests and discovery',
    },
    {
      range: 'Adult (18+)',
      minAge: 18,
      maxAge: 99,
      description: 'Therapeutic approach with evidence-based practices',
    },
  ];

  constructor() {
    super(SCENE_KEYS.AGE_SELECTION);
  }

  create(): void {
    this.setEmotion('joy'); // Welcoming, positive emotion
    this.fadeIn();

    // Deep brown adventure background
    this.cameras.main.setBackgroundColor('#1A0F08');
    this.createParchmentBackground();
    this.createOrnateFrame();
    this.createEmotionalWisps();

    const centerX = this.scale.width / 2;

    // Title with adventure styling
    const title = this.add
      .text(centerX, 200, 'Who Will You Become?', {
        fontSize: '72px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
        align: 'center',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 6)
      .setShadow(0, 4, 'rgba(0, 0, 0, 0.8)', 10);

    // Gold glow around title
    const titleGlow = this.add
      .text(centerX, 200, 'Who Will You Become?', {
        fontSize: '72px',
        color: '#D4AF37',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
        align: 'center',
      })
      .setOrigin(0.5)
      .setAlpha(0.3)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(-1);

    // Subtitle with gold italics
    const subtitle = this.add
      .text(
        centerX,
        300,
        'Choose your path through the Realm of Emotions',
        {
          fontSize: '32px',
          color: '#D4AF37',
          fontFamily: 'Crimson Text, serif',
          fontStyle: 'italic',
          align: 'center',
        }
      )
      .setOrigin(0.5)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.8)', 6);

    // Entrance animation for title and subtitle
    this.tweens.add({
      targets: [title, subtitle, titleGlow],
      alpha: { from: 0, to: 1 },
      y: { from: '-=30', to: '+=30' },
      duration: 1000,
      ease: 'Power2',
    });

    // Gentle glow animation on title
    this.tweens.add({
      targets: [titleGlow],
      alpha: 0.15,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Create age bracket buttons (centered vertically with more spacing)
    const startY = 500;
    const spacing = 200;

    this.ageBrackets.forEach((bracket, index) => {
      this.createAgeBracketButton(
        this.scale.width / 2,
        startY + index * spacing,
        bracket,
        index
      );
    });

    // Instructions at bottom with adventure styling
    const instructions = this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 100,
        'Choose Teen for an adventure narrative or Adult for therapeutic guidance',
        {
          fontSize: '24px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
          align: 'center',
          wordWrap: { width: this.scale.width * 0.8 },
        }
      )
      .setOrigin(0.5)
      .setAlpha(0.8)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.6)', 4);

    // Pulsing animation for instructions
    this.tweens.add({
      targets: instructions,
      alpha: 0.5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    console.log('✅ Age Selection Scene: Ready (Adventure Theme)');
  }

  private createAgeBracketButton(
    x: number,
    y: number,
    bracket: AgeBracket,
    index: number
  ): void {
    const container = this.add.container(x, y);
    const width = 600;
    const height = 110;

    // Adventure-styled background with brown gradient effect
    const bgDark = this.add
      .rectangle(0, 0, width, height, 0x3D2F24, 0.9)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(3, 0x5C4A3A, 0.8);

    const bgLight = this.add
      .rectangle(0, 0, width, height, 0x5C4A3A, 0.3);

    // Gold inner glow
    const glow = this.add
      .rectangle(0, 0, width - 6, height - 6, 0xD4AF37, 0.1);

    // Age range text (large) with gold color
    const rangeText = this.add
      .text(0, -20, bracket.range, {
        fontSize: '48px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.8)', 4);

    // Description text (smaller) with cream color
    const descText = this.add
      .text(0, 25, bracket.description, {
        fontSize: '24px',
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(0.5)
      .setAlpha(0.95);

    container.add([bgDark, bgLight, glow, rangeText, descText]);

    // Staggered entrance animation
    container.setAlpha(0);
    this.tweens.add({
      targets: container,
      alpha: 1,
      x: { from: x - 50, to: x },
      duration: 600,
      delay: index * 150,
      ease: 'Back.easeOut',
    });

    // Hover effects with adventure styling
    bgDark.on('pointerover', () => {
      bgDark.setStrokeStyle(4, 0xD4AF37, 1);
      glow.setAlpha(0.3);
      this.tweens.add({
        targets: container,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
      });
    });

    bgDark.on('pointerout', () => {
      bgDark.setStrokeStyle(3, 0x5C4A3A, 0.8);
      glow.setAlpha(0.1);
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
      });
    });

    bgDark.on('pointerdown', () => {
      // Click animation
      this.tweens.add({
        targets: container,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.selectAgeBracket(bracket);
        },
      });
    });
  }

  private selectAgeBracket(bracket: AgeBracket): void {
    // Store the middle age of the bracket for profile creation
    this.selectedAge = Math.floor((bracket.minAge + bracket.maxAge) / 2);

    // Visual feedback - flash effect
    this.cameras.main.flash(300, 0, 206, 209); // Joy color

    // Transition to character creation with age data
    this.time.delayedCall(400, () => {
      this.transitionToScene(SCENE_KEYS.CHARACTER_CREATION, {
        age: this.selectedAge,
        ageBracket: bracket.range,
      });
    });
  }

  private createParchmentBackground(): void {
    const graphics = this.add.graphics();
    const parchmentColors = [0x2C1810, 0x1A0F08, 0x3D2F24];
    const width = this.scale.width;
    const height = this.scale.height;

    // Create layered parchment effect
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const radius = Phaser.Math.Between(50, 200);
      const color = Phaser.Utils.Array.GetRandom(parchmentColors);
      const alpha = Phaser.Math.FloatBetween(0.05, 0.15);

      graphics.fillStyle(color, alpha);
      graphics.fillCircle(x, y, radius);
    }

    // Add subtle texture noise
    for (let i = 0; i < 150; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.1, 0.3);

      graphics.fillStyle(0x5C4A3A, alpha);
      graphics.fillCircle(x, y, size);
    }

    graphics.setDepth(0);

    // Subtle animation
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

    // Top border
    graphics.lineBetween(margin + cornerSize, margin, width - margin - cornerSize, margin);
    // Bottom border
    graphics.lineBetween(margin + cornerSize, height - margin, width - margin - cornerSize, height - margin);
    // Left border
    graphics.lineBetween(margin, margin + cornerSize, margin, height - margin - cornerSize);
    // Right border
    graphics.lineBetween(width - margin, margin + cornerSize, width - margin, height - margin - cornerSize);

    // Ornate corners
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
      graphics.lineBetween(
        corner.x + 10 * flipX,
        corner.y + 10 * flipY,
        corner.x + (cornerSize - 15) * flipX,
        corner.y + 10 * flipY
      );
      graphics.lineBetween(
        corner.x + 10 * flipX,
        corner.y + 10 * flipY,
        corner.x + 10 * flipX,
        corner.y + (cornerSize - 15) * flipY
      );

      graphics.fillStyle(0xD4AF37, 0.8);
      graphics.fillCircle(corner.x + 10 * flipX, corner.y + 10 * flipY, 4);
    });

    graphics.setDepth(1);

    // Subtle pulse animation
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
