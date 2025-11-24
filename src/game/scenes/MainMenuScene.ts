/**
 * Main Menu Scene
 * First interactive scene - title screen and menu options
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS, DEPTHS } from '../config/constants';

export class MainMenuScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.MAIN_MENU);
  }

  create(): void {
    // Fade in
    this.fadeIn();

    // Deep brown adventure background
    this.cameras.main.setBackgroundColor('#1A0F08');

    // Create aged parchment texture with subtle starfield
    this.createParchmentBackground();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Ornate border frame
    this.createOrnateFrame();

    // Title with adventure styling
    const title = this.add
      .text(centerX, 280, 'EMOTION EXPLORER', {
        fontSize: '108px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 8)
      .setShadow(0, 4, 'rgba(0, 0, 0, 0.8)', 12)
      .setDepth(DEPTHS.UI);

    // Gold glow around title
    const titleGlow = this.add
      .text(centerX, 280, 'EMOTION EXPLORER', {
        fontSize: '108px',
        color: '#D4AF37',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setAlpha(0.3)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(DEPTHS.UI - 1);

    // Subtitle with italics
    const subtitle = this.add
      .text(centerX, 400, 'Realm of Feelings', {
        fontSize: '52px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
      })
      .setOrigin(0.5)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.8)', 8)
      .setDepth(DEPTHS.UI);

    // Decorative line under subtitle
    const line = this.add.graphics();
    line.lineStyle(3, 0xD4AF37, 0.6);
    line.lineBetween(centerX - 200, 450, centerX + 200, 450);
    line.setDepth(DEPTHS.UI);

    // Gentle glow animation on title
    this.tweens.add({
      targets: [titleGlow],
      alpha: 0.15,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Menu buttons with adventure styling
    const buttonY = 580;
    const buttonSpacing = 100;

    const newJourneyBtn = this.createAdventureButton(
      centerX,
      buttonY,
      'New Journey',
      () => this.startNewGame()
    );

    const continueBtn = this.createAdventureButton(
      centerX,
      buttonY + buttonSpacing,
      'Continue Journey',
      () => this.continueGame()
    );

    const settingsBtn = this.createAdventureButton(
      centerX,
      buttonY + buttonSpacing * 2,
      'Settings',
      () => this.openSettings()
    );

    // Decorative compass rose in corner
    this.createCompassRose(100, this.scale.height - 100);

    // Version text with adventure styling
    this.add
      .text(this.scale.width - 30, this.scale.height - 30, 'v1.0.0 MVP', {
        fontSize: '18px',
        color: '#5C4A3A',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(1)
      .setDepth(DEPTHS.UI);

    // Subtle floating particles
    this.setEmotion('joy');
    this.createEmotionalWisps();

    console.log('✅ Main Menu Scene: Ready (Adventure Theme)');
  }

  private createAdventureButton(
    x: number,
    y: number,
    text: string,
    callback: () => void,
    width: number = 350,
    height: number = 70
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Button background with gradient effect (simulated with overlapping rectangles)
    const bgDark = this.add
      .rectangle(0, 0, width, height, 0x3D2F24)
      .setStrokeStyle(3, 0x5C4A3A)
      .setAlpha(0.95);

    const bgLight = this.add
      .rectangle(0, 0, width, height, 0x5C4A3A)
      .setAlpha(0.3);

    // Gold inner glow
    const glow = this.add
      .rectangle(0, 0, width - 6, height - 6, 0xD4AF37)
      .setAlpha(0.1);

    // Button text
    const buttonText = this.add
      .text(0, 0, text, {
        fontSize: '28px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    container.add([bgDark, bgLight, glow, buttonText]);
    container.setSize(width, height);
    container.setInteractive({ useHandCursor: true });
    container.setDepth(DEPTHS.UI);

    // Hover effects
    container.on('pointerover', () => {
      bgDark.setStrokeStyle(3, 0xD4AF37, 1);
      glow.setAlpha(0.3);
      buttonText.setScale(1.05);
      this.tweens.add({
        targets: container,
        y: y - 5,
        duration: 200,
        ease: 'Power2',
      });
    });

    container.on('pointerout', () => {
      bgDark.setStrokeStyle(3, 0x5C4A3A);
      glow.setAlpha(0.1);
      buttonText.setScale(1);
      this.tweens.add({
        targets: container,
        y: y,
        duration: 200,
        ease: 'Power2',
      });
    });

    container.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: callback,
      });
    });

    return container;
  }

  private createParchmentBackground(): void {
    // Create aged parchment texture using graphics
    const graphics = this.add.graphics();

    // Base parchment color with gradient effect
    const parchmentColors = [0x2C1810, 0x1A0F08, 0x3D2F24];
    const width = this.scale.width;
    const height = this.scale.height;

    // Create layered parchment effect with random patches
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

    graphics.setDepth(DEPTHS.BACKGROUND + 1);

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
      { x: margin, y: margin }, // Top-left
      { x: width - margin, y: margin }, // Top-right
      { x: margin, y: height - margin }, // Bottom-left
      { x: width - margin, y: height - margin }, // Bottom-right
    ];

    corners.forEach((corner, index) => {
      // Determine corner orientation
      const flipX = index % 2 === 1 ? -1 : 1;
      const flipY = index > 1 ? -1 : 1;

      // Outer corner lines
      graphics.lineStyle(lineThickness, 0xD4AF37, 0.8);
      graphics.lineBetween(
        corner.x,
        corner.y,
        corner.x + cornerSize * flipX,
        corner.y
      );
      graphics.lineBetween(
        corner.x,
        corner.y,
        corner.x,
        corner.y + cornerSize * flipY
      );

      // Inner decorative lines
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

      // Corner dot accent
      graphics.fillStyle(0xD4AF37, 0.8);
      graphics.fillCircle(corner.x + 10 * flipX, corner.y + 10 * flipY, 4);
    });

    graphics.setDepth(DEPTHS.UI - 2);

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

  private createCompassRose(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Outer circle
    const outerCircle = this.add.graphics();
    outerCircle.lineStyle(3, 0xD4AF37, 0.8);
    outerCircle.strokeCircle(0, 0, 50);
    outerCircle.lineStyle(2, 0xF4E5B8, 0.4);
    outerCircle.strokeCircle(0, 0, 40);

    // Inner circle
    const innerCircle = this.add.graphics();
    innerCircle.lineStyle(2, 0x5C4A3A, 0.6);
    innerCircle.strokeCircle(0, 0, 15);
    innerCircle.fillStyle(0x2C1810, 0.8);
    innerCircle.fillCircle(0, 0, 15);

    // Cardinal directions (N, E, S, W)
    const directions = [
      { angle: -90, length: 45, color: 0xD4AF37, label: 'N' }, // North (up)
      { angle: 0, length: 35, color: 0xF4E5B8, label: 'E' }, // East
      { angle: 90, length: 35, color: 0xF4E5B8, label: 'S' }, // South
      { angle: 180, length: 35, color: 0xF4E5B8, label: 'W' }, // West
    ];

    const compass = this.add.graphics();
    directions.forEach((dir) => {
      const rad = Phaser.Math.DegToRad(dir.angle);
      const endX = Math.cos(rad) * dir.length;
      const endY = Math.sin(rad) * dir.length;

      // Direction line
      compass.lineStyle(3, dir.color, 0.8);
      compass.lineBetween(0, 0, endX, endY);

      // Direction pointer
      compass.fillStyle(dir.color, 0.9);
      compass.fillTriangle(
        endX,
        endY,
        endX + Math.cos(rad + 2.8) * 8,
        endY + Math.sin(rad + 2.8) * 8,
        endX + Math.cos(rad - 2.8) * 8,
        endY + Math.sin(rad - 2.8) * 8
      );

      // Label
      if (dir.label === 'N') {
        const label = this.add
          .text(endX, endY - 20, dir.label, {
            fontSize: '16px',
            color: '#D4AF37',
            fontFamily: 'Cinzel, serif',
            fontStyle: 'bold',
          })
          .setOrigin(0.5);
        container.add(label);
      }
    });

    container.add([outerCircle, innerCircle, compass]);
    container.setDepth(DEPTHS.UI);

    // Gentle rotation animation
    this.tweens.add({
      targets: compass,
      angle: 360,
      duration: 60000,
      repeat: -1,
      ease: 'Linear',
    });

    // Subtle glow pulse
    this.tweens.add({
      targets: [outerCircle, innerCircle],
      alpha: 0.6,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createStarfield(): void {
    const graphics = this.add.graphics();

    // Create random stars
    for (let i = 0; i < 200; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const size = Phaser.Math.Between(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.3, 1);

      graphics.fillStyle(0xffffff, alpha);
      graphics.fillCircle(x, y, size);
    }

    graphics.setDepth(DEPTHS.BACKGROUND);

    // Twinkling effect
    this.tweens.add({
      targets: graphics,
      alpha: 0.6,
      duration: 3000,
      yoyo: true,
      repeat: -1,
    });
  }

  private startNewGame(): void {
    console.log('📝 Starting new game...');
    // Transition to age selection
    this.transitionToScene(SCENE_KEYS.AGE_SELECTION);
  }

  private continueGame(): void {
    console.log('▶️ Continuing game...');
    // TODO: Load saved progress
    // For MVP, show placeholder
    const notice = this.createCenteredText(
      this.scale.height / 2,
      'Load Game Coming Soon!\n\nThis will load your saved progress\nand continue your emotional journey.',
      32,
      '#00CED1'
    );

    this.time.delayedCall(3000, () => {
      notice.destroy();
    });
  }

  private openSettings(): void {
    console.log('⚙️ Opening settings...');
    // TODO: Open settings UI
    // For MVP, show placeholder
    const notice = this.createCenteredText(
      this.scale.height / 2,
      'Settings Coming Soon!\n\nVolume Controls\nText Size\nAccessibility Options',
      32,
      '#00CED1'
    );

    this.time.delayedCall(3000, () => {
      notice.destroy();
    });
  }
}
