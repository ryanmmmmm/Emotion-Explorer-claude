/**
 * Module 8: The Wisdom Tree
 * Players click wisdom orbs to learn psychoeducation facts
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface Module8Data {
  emotionId: EmotionType;
}

interface WisdomOrb {
  id: number;
  fact: string;
  x: number;
  y: number;
  orb: Phaser.GameObjects.Arc;
  glow: Phaser.GameObjects.Arc;
  revealed: boolean;
}

export class Module8WisdomTree extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private vfx!: VisualEffectsManager;
  private wisdomOrbs: WisdomOrb[] = [];
  private revealedCount: number = 0;
  private instructionText!: Phaser.GameObjects.Text;
  private treeTrunk!: Phaser.GameObjects.Graphics;
  private branches: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super(SCENE_KEYS.MODULE_8);
  }

  init(data: Module8Data): void {
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
    this.vfx.createFloatingOrbs(12, this.emotionColor);
    this.createEmotionalWisps();

    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    const centerX = this.scale.width / 2;

    // Get narrative content based on age group
    const narrative = this.narrative!.module8;

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
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 8);

    // Subtitle - age-appropriate
    this.add
      .text(centerX, 120, narrative.subtitle, {
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

    // Instructions - age-appropriate
    this.instructionText = this.add
      .text(
        centerX,
        220,
        this.isTeen()
          ? 'Click the glowing orbs to reveal wisdom about your emotion.\nEach fact helps the tree grow and deepens your understanding.'
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

    // Counter
    const counterText = this.add
      .text(centerX, 280, 'Wisdom Collected: 0 / 6', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Create wisdom tree
    this.createWisdomTree(centerX, 650);

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
        counterText.setText(`Wisdom Collected: ${this.revealedCount} / 6`);

        if (this.revealedCount >= 3 && this.revealedCount < 6) {
          this.instructionText.setText(
            'Good progress! Read at least 3 wisdom facts to continue,\nor collect all 6 for complete understanding.'
          );
          continueBtn.setAlpha(1);
        } else if (this.revealedCount >= 6) {
          this.instructionText.setText(
            'Tree of Wisdom complete! You have deep understanding now.\nYou may continue to the final module.'
          );
        }
      },
    });

    // Teen-only adventure visuals
    if (this.isTeen()) {
      this.createAdventureElements();
    }

    console.log('✅ Module 8 - The Wisdom Tree: Ready (Adventure Theme)');
  }

  private createAdventureElements(): void {
    // Ancient pillars as tree guardians
    this.vfx.createAncientPillar(130, this.scale.height - 100, 210);
    this.vfx.createAncientPillar(this.scale.width - 130, this.scale.height - 100, 230);
    this.vfx.createAncientPillar(90, 360, 170);
    this.vfx.createAncientPillar(this.scale.width - 90, 360, 180);

    // Magical torches illuminating the wisdom tree
    this.vfx.createMagicalTorch(160, 300, 0x228B22);
    this.vfx.createMagicalTorch(this.scale.width - 160, 300, 0x32CD32);
    this.vfx.createMagicalTorch(140, 450, this.emotionColor);
    this.vfx.createMagicalTorch(this.scale.width - 140, 450, 0xFFD700);

    // Floating mystical runes for wisdom
    this.vfx.createFloatingRunes(12, 0xD4AF37);

    // Many floating books for knowledge theme
    this.vfx.createFloatingBook(200, 200, 0x8B4513);
    this.vfx.createFloatingBook(this.scale.width - 200, 220, 0xA0522D);
    this.vfx.createFloatingBook(250, 280, 0x654321);
    this.vfx.createFloatingBook(this.scale.width - 250, 300, 0x8B4513);
    this.vfx.createFloatingBook(this.scale.width / 2 - 120, 240, 0xA0522D);

    // Guardian statues as tree protectors
    this.vfx.createGuardianStatue(100, this.scale.height - 190);
    this.vfx.createGuardianStatue(this.scale.width - 100, this.scale.height - 190);
    this.vfx.createGuardianStatue(this.scale.width / 2 - 80, this.scale.height - 180);
    this.vfx.createGuardianStatue(this.scale.width / 2 + 80, this.scale.height - 180);

    // Flying creatures with ancient wisdom
    this.time.addEvent({
      delay: 14000,
      loop: true,
      callback: () => {
        const side = Math.random() > 0.5;
        const startX = side ? -50 : this.scale.width + 50;
        const startY = Phaser.Math.Between(250, 400);
        this.vfx.createFlyingCreature(startX, startY, 0x228B22);
      }
    });
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
  }

  private createWisdomTree(centerX: number, baseY: number): void {
    // Trunk
    this.treeTrunk = this.add.graphics();
    this.treeTrunk.fillStyle(0x654321, 0.8);
    this.treeTrunk.fillRect(centerX - 20, baseY - 150, 40, 150);

    // Wisdom facts (generic emotional intelligence content)
    const wisdomFacts = [
      'All emotions serve a purpose - they provide valuable information about your needs and environment.',
      'Emotional regulation is a skill that improves with practice, not a fixed trait you are born with.',
      'Naming your emotions (affect labeling) reduces their intensity and helps you process them.',
      'Your thoughts, feelings, and behaviors are interconnected - changing one affects the others.',
      'Emotions are temporary visitors - allowing them space without judgment helps them pass naturally.',
      'Understanding your emotional patterns gives you the power to make conscious choices.',
    ];

    // Create 6 wisdom orbs positioned around the tree
    const positions = [
      { x: centerX - 120, y: baseY - 200 },
      { x: centerX + 120, y: baseY - 200 },
      { x: centerX - 180, y: baseY - 300 },
      { x: centerX + 180, y: baseY - 300 },
      { x: centerX - 100, y: baseY - 400 },
      { x: centerX + 100, y: baseY - 400 },
    ];

    wisdomFacts.forEach((fact, index) => {
      const pos = positions[index];
      this.createWisdomOrb(index, fact, pos.x, pos.y, centerX, baseY);
    });
  }

  private createWisdomOrb(
    id: number,
    fact: string,
    x: number,
    y: number,
    treeX: number,
    treeY: number
  ): void {
    // Outer glow
    const glow = this.add.circle(x, y, 35, this.emotionColor, 0.3);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: glow,
      scale: { from: 0.9, to: 1.2 },
      alpha: { from: 0.3, to: 0.1 },
      duration: 2000 + id * 200,
      yoyo: true,
      repeat: -1,
    });

    // Wisdom orb
    const orb = this.add
      .circle(x, y, 25, this.emotionColor, 0.7)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff, 0.8);

    // Twinkle effect
    this.tweens.add({
      targets: orb,
      alpha: { from: 0.7, to: 0.9 },
      scale: { from: 0.95, to: 1.05 },
      duration: 1500 + id * 100,
      yoyo: true,
      repeat: -1,
    });

    // Hover effect
    orb.on('pointerover', () => {
      this.tweens.add({
        targets: orb,
        scale: 1.15,
        duration: 200,
      });
      glow.setAlpha(0.5);
    });

    orb.on('pointerout', () => {
      this.tweens.add({
        targets: orb,
        scale: 1.0,
        duration: 200,
      });
      glow.setAlpha(0.3);
    });

    // Click to reveal wisdom
    orb.on('pointerdown', () => {
      const wisdomOrb = this.wisdomOrbs.find(w => w.id === id);
      if (!wisdomOrb || wisdomOrb.revealed) return;

      wisdomOrb.revealed = true;
      this.revealedCount++;

      // Visual feedback
      this.vfx.createSparkles(x, y, this.emotionColor, 30);
      this.cameras.main.flash(150, ...this.hexToRgb(this.emotionColor));

      // Change orb appearance
      orb.setFillStyle(0xFFD700, 1);

      // Grow a branch to the orb
      this.growBranch(treeX, treeY - 150, x, y);

      // Show wisdom text
      this.showWisdomText(fact);
    });

    this.wisdomOrbs.push({ id, fact, x, y, orb, glow, revealed: false });
  }

  private growBranch(fromX: number, fromY: number, toX: number, toY: number): void {
    const branch = this.add.graphics();
    branch.lineStyle(3, this.emotionColor, 0.6);

    // Animate branch growth
    let progress = 0;
    const growthTime = 1000;

    const timer = this.time.addEvent({
      delay: 16,
      callback: () => {
        progress += 16 / growthTime;
        if (progress > 1) progress = 1;

        const currentX = fromX + (toX - fromX) * progress;
        const currentY = fromY + (toY - fromY) * progress;

        branch.clear();
        branch.lineStyle(3, this.emotionColor, 0.6);
        branch.beginPath();
        branch.moveTo(fromX, fromY);
        branch.lineTo(currentX, currentY);
        branch.strokePath();

        if (progress >= 1) {
          timer.remove();
        }
      },
      loop: true,
    });

    this.branches.push(branch);
  }

  private showWisdomText(fact: string): void {
    // Show text popup
    const textBg = this.add
      .rectangle(this.scale.width / 2, 320, 700, 120, 0x0f3460, 0.95)
      .setStrokeStyle(3, this.emotionColor, 0.9)
      .setDepth(1000);

    const text = this.add
      .text(this.scale.width / 2, 320, fact, {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'Merriweather, serif',
        align: 'center',
        wordWrap: { width: 660 },
        lineSpacing: 6,
      })
      .setOrigin(0.5)
      .setDepth(1001);

    // Fade in
    textBg.setAlpha(0);
    text.setAlpha(0);

    this.tweens.add({
      targets: [textBg, text],
      alpha: 1,
      duration: 300,
    });

    // Auto-fade out after reading
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: [textBg, text],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          textBg.destroy();
          text.destroy();
        },
      });
    });
  }

  private hexToRgb(hex: number): [number, number, number] {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return [r, g, b];
  }

  private completeModule(): void {
    if (this.revealedCount < 3) {
      return; // Need at least 3 wisdom facts
    }

    console.log(`✅ Module 8 completed - ${this.revealedCount} wisdom facts learned`);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(8, {
      emotionSelected: this.emotionId,
      lessonsLearned: this.wisdomOrbs
        .filter(w => w.revealed)
        .map(w => w.fact),
    });

    this.cameras.main.flash(500, 255, 215, 0);
    this.vfx.createEnergyPulse(
      this.scale.width / 2,
      this.scale.height / 2,
      0xffd700,
      15
    );

    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.MODULE_9, { emotionId: this.emotionId });
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
