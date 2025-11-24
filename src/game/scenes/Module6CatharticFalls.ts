/**
 * Module 6: The Cathartic Falls
 * Players practice breathing exercise with animated visualization
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface Module6Data {
  emotionId: EmotionType;
}

export class Module6CatharticFalls extends BaseScene {
  private emotionId!: EmotionType;
  private emotionName!: string;
  private vfx!: VisualEffectsManager;
  private breathCircle!: Phaser.GameObjects.Arc;
  private breathText!: Phaser.GameObjects.Text;
  private cyclesCompleted: number = 0;
  private isBreathing: boolean = false;
  private instructionText!: Phaser.GameObjects.Text;
  private journalEntry: string = '';

  constructor() {
    super(SCENE_KEYS.MODULE_6);
  }

  init(data: Module6Data): void {
    this.emotionId = data.emotionId;
    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    this.emotionName = emotion.name;
    this.setEmotion(this.emotionId);
  }

  create(): void {
    this.fadeIn();
    this.initializeTheme(); // Initialize age-based theme

    this.vfx = new VisualEffectsManager(this);
    this.createBackground();

    // Enhanced visual atmosphere
    this.vfx.createAuroraBackground(this.emotionColor);
    this.vfx.createParallaxStars(2);
    this.vfx.createFloatingOrbs(20, this.emotionColor);
    this.createEmotionalWisps();

    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    const centerX = this.scale.width / 2;

    // Title - age-appropriate
    const title = this.isAdult() ? 'Feelings Journal' : 'The Cathartic Falls';
    this.add
      .text(centerX, 60, title, {
        fontSize: '52px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 6)
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 8);

    this.add
      .text(centerX, 120, 'Module 6: Breath and Release', {
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
        'Follow the breathing circle to regulate your emotion.\nBreathe in, hold, breathe out. Complete 3 full cycles.',
        {
          fontSize: '20px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
          align: 'center',
          lineSpacing: 6,
        }
      )
      .setOrigin(0.5);

    // Cycle counter
    const counterText = this.add
      .text(centerX, 280, 'Breath Cycles: 0 / 3', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Create waterfall particles
    this.createWaterfallParticles();

    // Create breathing circle
    this.createBreathingCircle(centerX, 480);

    // Breath instruction text
    this.breathText = this.add
      .text(centerX, 480, 'Click to Begin', {
        fontSize: '32px',
        color: '#FFD700',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Add journal input below breathing circle
    this.createJournalInput(centerX);

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
        counterText.setText(`Breath Cycles: ${this.cyclesCompleted} / 3`);

        if (this.cyclesCompleted < 3) {
          this.instructionText.setText(
            'Follow the breathing circle to regulate your emotion.\nThen journal about your experience below.'
          );
        } else if (this.cyclesCompleted >= 3 && this.journalEntry.trim().length === 0) {
          this.instructionText.setText(
            'Excellent breathing! Now journal about your emotional experience below.'
          );
        } else if (this.journalEntry.trim().length > 0) {
          this.instructionText.setText(
            'Perfect! You have practiced breath regulation and reflection.\nYou can continue when ready.'
          );
          continueBtn.setAlpha(1);
        }
      },
    });

    // Teen-only adventure visuals
    if (this.isTeen()) {
      this.createAdventureElements();
    }

    console.log('✅ Module 6 - The Cathartic Falls: Ready (Adventure Theme)');
  }

  private createAdventureElements(): void {
    // Ancient pillars with water erosion theme
    this.vfx.createAncientPillar(160, this.scale.height - 110, 180);
    this.vfx.createAncientPillar(this.scale.width - 160, this.scale.height - 110, 200);
    this.vfx.createAncientPillar(120, 380, 140);
    this.vfx.createAncientPillar(this.scale.width - 120, 380, 160);

    // Magical torches with water/blue colors for falls theme
    this.vfx.createMagicalTorch(190, 300, 0x00CED1);
    this.vfx.createMagicalTorch(this.scale.width - 190, 300, 0x4682B4);
    this.vfx.createMagicalTorch(150, 450, 0x5F9EA0);
    this.vfx.createMagicalTorch(this.scale.width - 150, 450, 0x87CEEB);

    // Floating mystical runes with aquatic theme
    this.vfx.createFloatingRunes(10, 0x40E0D0);

    // Floating book of breathing wisdom
    this.vfx.createFloatingBook(220, 220, 0x4682B4);
    this.vfx.createFloatingBook(this.scale.width - 220, 240, 0x5F9EA0);

    // Guardian statues watching over the falls
    this.vfx.createGuardianStatue(100, this.scale.height - 190);
    this.vfx.createGuardianStatue(this.scale.width - 100, this.scale.height - 190);

    // Shooting stars for cathartic release
    this.time.addEvent({
      delay: 18000,
      loop: true,
      callback: () => {
        this.vfx.createShootingStar(0x87CEEB);
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

  private createWaterfallParticles(): void {
    // Waterfall effect on sides
    this.add.particles(150, 200, 'particle', {
      x: 0,
      y: { min: 0, max: this.scale.height },
      speedY: { min: 200, max: 300 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.5, end: 0.2 },
      alpha: { start: 0.6, end: 0 },
      tint: this.emotionColor,
      lifespan: 3000,
      frequency: 50,
      blendMode: 'ADD',
    });

    this.add.particles(this.scale.width - 150, 200, 'particle', {
      x: 0,
      y: { min: 0, max: this.scale.height },
      speedY: { min: 200, max: 300 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.5, end: 0.2 },
      alpha: { start: 0.6, end: 0 },
      tint: this.emotionColor,
      lifespan: 3000,
      frequency: 50,
      blendMode: 'ADD',
    });
  }

  private createBreathingCircle(x: number, y: number): void {
    // Outer guide circle (stays same size)
    this.add
      .circle(x, y, 150, 0xffffff, 0)
      .setStrokeStyle(2, 0xffffff, 0.3);

    // Breathing circle (expands and contracts)
    this.breathCircle = this.add
      .circle(x, y, 80, this.emotionColor, 0.5)
      .setStrokeStyle(3, this.emotionColor, 0.9);

    // Inner glow
    const innerGlow = this.add.circle(x, y, 70, this.emotionColor, 0.3);
    innerGlow.setBlendMode(Phaser.BlendModes.ADD);

    // Make interactive to start breathing
    this.breathCircle.setInteractive({ useHandCursor: true });
    this.breathCircle.on('pointerdown', () => {
      if (!this.isBreathing) {
        this.startBreathingCycle();
      }
    });

    // Idle pulsing when not breathing
    this.tweens.add({
      targets: [this.breathCircle, innerGlow],
      scale: { from: 0.95, to: 1.05 },
      alpha: { from: 0.5, to: 0.7 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private startBreathingCycle(): void {
    if (this.isBreathing) return;

    this.isBreathing = true;
    this.breathText.setText('');

    // Phase 1: Breathe In (4 seconds)
    this.breathText.setText('Breathe In');
    this.breathText.setColor('#4ADE80');

    this.tweens.add({
      targets: this.breathCircle,
      radius: 150,
      alpha: 0.8,
      duration: 4000,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Phase 2: Hold (4 seconds)
        this.breathText.setText('Hold');
        this.breathText.setColor('#FFD700');

        this.time.delayedCall(4000, () => {
          // Phase 3: Breathe Out (6 seconds)
          this.breathText.setText('Breathe Out');
          this.breathText.setColor('#60A5FA');

          this.tweens.add({
            targets: this.breathCircle,
            radius: 80,
            alpha: 0.5,
            duration: 6000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
              // Cycle complete
              this.cyclesCompleted++;
              this.isBreathing = false;
              this.breathText.setText('Click to Continue Breathing');
              this.breathText.setColor('#FFD700');

              // Visual celebration
              this.vfx.createSparkles(
                this.scale.width / 2,
                480,
                this.emotionColor,
                30
              );
              this.cameras.main.flash(150, ...this.hexToRgb(this.emotionColor));

              // Auto-start next cycle if not complete
              if (this.cyclesCompleted < 3) {
                this.time.delayedCall(1500, () => {
                  if (!this.isBreathing) {
                    this.startBreathingCycle();
                  }
                });
              }
            },
          });
        });
      },
    });
  }

  private createJournalInput(centerX: number): void {
    const y = 650;

    const labelText = this.isAdult()
      ? 'Record your observations in your journal:'
      : 'Journal about your emotional experience:';

    this.add
      .text(centerX, y, labelText, {
        fontSize: '20px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
        align: 'center',
        wordWrap: { width: 800 },
      })
      .setOrigin(0.5);

    const textBox = this.add
      .rectangle(centerX, y + 70, 800, 120, 0x2C1810, 0.9)
      .setStrokeStyle(3, 0xD4AF37, 0.7)
      .setInteractive({ useHandCursor: true });

    const boxText = this.add
      .text(centerX, y + 70, 'Click to write your journal entry...', {
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
      const isAdult = this.isAdult();

      // Age-appropriate title
      const modalTitle = isAdult ? 'Feelings Journal' : 'Emotional Reflection';

      // Age-appropriate guidance
      const guidance = isAdult
        ? `<p><strong>Journal about your emotional state.</strong> Reflect on these aspects:</p>
           <ul style="margin: 8px 0; padding-left: 20px;">
             <li><strong>Current feelings:</strong> What emotions are you experiencing right now?</li>
             <li><strong>Breathing effects:</strong> What did you notice during the breathing exercise?</li>
             <li><strong>Physical sensations:</strong> How does your body feel after the breathing practice?</li>
             <li><strong>Emerging insights:</strong> What understanding or clarity has emerged?</li>
           </ul>
           <p style="margin-top: 12px;">Write freely without judgment. This journal is a safe space for honest self-exploration.</p>`
        : `<p><strong>Capture your experience!</strong> Write about what you felt and discovered:</p>
           <ul style="margin: 8px 0; padding-left: 20px;">
             <li><strong>Your emotions now:</strong> How do you feel after the breathing?</li>
             <li><strong>What you noticed:</strong> What happened during the Falls experience?</li>
             <li><strong>In your body:</strong> How does your body feel different?</li>
             <li><strong>What you learned:</strong> What insights or wisdom emerged?</li>
           </ul>
           <p style="margin-top: 12px;">Let your thoughts flow freely like water! Express yourself without worrying about getting it perfect.</p>`;

      const response = await this.showTextInputModal(
        modalTitle,
        'Write your thoughts...',
        guidance,
        20, // minimum 20 words
        this.journalEntry
      );

      if (response && response.trim()) {
        const displayText = response.trim().length > 200
          ? response.trim().substring(0, 197) + '...'
          : response.trim();
        boxText.setText(displayText);
        boxText.setAlpha(1);
        this.journalEntry = response.trim();
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
    if (this.cyclesCompleted < 3 || this.journalEntry.trim().length === 0) {
      return; // Need 3 breath cycles AND journal entry
    }

    console.log(`✅ Module 6 completed - ${this.cyclesCompleted} breath cycles`);
    console.log(`Journal entry: ${this.journalEntry.substring(0, 100)}...`);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(6, {
      emotionSelected: this.emotionId,
      journalEntry: this.journalEntry,
    });

    this.cameras.main.flash(500, 255, 215, 0);
    this.vfx.createEnergyPulse(
      this.scale.width / 2,
      this.scale.height / 2,
      0xffd700,
      15
    );

    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.MODULE_7, { emotionId: this.emotionId });
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
