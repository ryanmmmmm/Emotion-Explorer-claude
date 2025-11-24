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
  private trajectoryPast: string = '';
  private trajectoryPresent: string = '';
  private trajectoryFuture: string = '';

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
    this.initializeTheme(); // Initialize age-based theme

    this.vfx = new VisualEffectsManager(this);
    this.createBackground();

    // Enhanced visual atmosphere
    this.vfx.createAuroraBackground(this.emotionColor);
    this.vfx.createParallaxStars(2);
    this.vfx.createFloatingOrbs(15, this.emotionColor);
    this.createEmotionalWisps();

    const emotion = EMOTION_DEFINITIONS[this.emotionId];
    const centerX = this.scale.width / 2;

    // Title - age-appropriate
    const title = this.isAdult() ? 'Emotional Trajectories' : 'The Emotional Compass';
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
      .text(centerX, 120, 'Module 7: Identifying Triggers and Patterns', {
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
        'Click the triggers around the compass that relate to your emotion.\nRecognizing patterns helps you understand when this feeling arises.',
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
      .text(centerX, 280, 'Triggers Selected: 0', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Create compass with triggers
    this.createCompass(centerX, 400);

    // Add trajectory text inputs
    this.createTrajectoryInputs(centerX);

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

        const allTrajectoriesFilled =
          this.trajectoryPast.trim().length > 0 &&
          this.trajectoryPresent.trim().length > 0 &&
          this.trajectoryFuture.trim().length > 0;

        if (this.selectedCount < 2) {
          this.instructionText.setText(
            'Click the triggers around the compass that relate to your emotion.\nThen write about past, present, and future below.'
          );
        } else if (!allTrajectoriesFilled) {
          this.instructionText.setText(
            'Good! Now write about the trajectory of this emotion: past, present, and future.'
          );
        } else {
          this.instructionText.setText(
            'Excellent! You understand your emotional patterns.\nYou can continue when ready.'
          );
          continueBtn.setAlpha(1);
        }
      },
    });

    console.log('✅ Module 7 - The Emotional Compass: Ready (Adventure Theme)');
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

  private createTrajectoryInputs(centerX: number): void {
    const y = 650;
    const boxWidth = 350;
    const boxHeight = 80;
    const spacing = 380;

    const isAdult = this.isAdult();

    // Age-appropriate labels and guidance
    const trajectories = isAdult
      ? [
          {
            x: centerX - spacing,
            label: 'PAST:\nOrigins',
            key: 'trajectoryPast',
            modalTitle: 'Past: Origins',
            guidance: `<p><strong>Trace the origin of this emotion.</strong> Reflect on:</p>
                       <ul style="margin: 8px 0; padding-left: 20px;">
                         <li><strong>First instances:</strong> When did you first experience this emotion?</li>
                         <li><strong>Triggering events:</strong> What circumstances or experiences led to it?</li>
                         <li><strong>Early patterns:</strong> How did this emotion show up in your past?</li>
                       </ul>
                       <p style="margin-top: 12px;">Understanding origins helps identify the roots of current emotional patterns.</p>`
          },
          {
            x: centerX,
            label: 'PRESENT:\nCurrent State',
            key: 'trajectoryPresent',
            modalTitle: 'Present: Current State',
            guidance: `<p><strong>Examine this emotion's current presence.</strong> Consider:</p>
                       <ul style="margin: 8px 0; padding-left: 20px;">
                         <li><strong>Frequency:</strong> How often does this emotion appear now?</li>
                         <li><strong>Intensity:</strong> How strong is it when it arises?</li>
                         <li><strong>Impact:</strong> How is it affecting your daily life and relationships?</li>
                       </ul>
                       <p style="margin-top: 12px;">Awareness of the present helps you understand your current emotional landscape.</p>`
          },
          {
            x: centerX + spacing,
            label: 'FUTURE:\nProjected Path',
            key: 'trajectoryFuture',
            modalTitle: 'Future: Projected Path',
            guidance: `<p><strong>Envision this emotion's future trajectory.</strong> Explore:</p>
                       <ul style="margin: 8px 0; padding-left: 20px;">
                         <li><strong>Natural evolution:</strong> Where might this emotion go if unchanged?</li>
                         <li><strong>Desired direction:</strong> How would you like this emotion to evolve?</li>
                         <li><strong>Action steps:</strong> What can you do to guide its development?</li>
                       </ul>
                       <p style="margin-top: 12px;">Anticipating the future empowers you to shape your emotional journey.</p>`
          },
        ]
      : [
          {
            x: centerX - spacing,
            label: 'PAST:\nWhere did it come from?',
            key: 'trajectoryPast',
            modalTitle: 'Journey Through Time: Past',
            guidance: `<p><strong>Discover the origins of your emotion!</strong> Think about:</p>
                       <ul style="margin: 8px 0; padding-left: 20px;">
                         <li><strong>The beginning:</strong> When did you first feel this way?</li>
                         <li><strong>What happened:</strong> What events or experiences brought this emotion to life?</li>
                         <li><strong>Early signs:</strong> How did it show up before?</li>
                       </ul>
                       <p style="margin-top: 12px;">Understanding your past helps you make sense of today!</p>`
          },
          {
            x: centerX,
            label: 'PRESENT:\nWhere is it now?',
            key: 'trajectoryPresent',
            modalTitle: 'Journey Through Time: Present',
            guidance: `<p><strong>Explore where your emotion lives right now!</strong> Consider:</p>
                       <ul style="margin: 8px 0; padding-left: 20px;">
                         <li><strong>How often:</strong> When does this emotion visit you these days?</li>
                         <li><strong>How strong:</strong> What's the power level of this feeling?</li>
                         <li><strong>Its effects:</strong> How is it changing your days and relationships?</li>
                       </ul>
                       <p style="margin-top: 12px;">Being aware of now helps you navigate your emotional journey!</p>`
          },
          {
            x: centerX + spacing,
            label: 'FUTURE:\nWhere might it be going?',
            key: 'trajectoryFuture',
            modalTitle: 'Journey Through Time: Future',
            guidance: `<p><strong>Imagine where your emotion might travel next!</strong> Dream about:</p>
                       <ul style="margin: 8px 0; padding-left: 20px;">
                         <li><strong>Natural path:</strong> Where might it go if nothing changes?</li>
                         <li><strong>Your hope:</strong> Where would you like it to go instead?</li>
                         <li><strong>Your power:</strong> What can you do to guide it on its journey?</li>
                       </ul>
                       <p style="margin-top: 12px;">You have the power to shape your emotional future!</p>`
          },
        ];

    trajectories.forEach(({ x, label, key, modalTitle, guidance }) => {
      this.add
        .text(x, y - 30, label, {
          fontSize: '16px',
          color: '#D4AF37',
          fontFamily: 'Crimson Text, serif',
          fontStyle: 'italic',
          align: 'center',
          wordWrap: { width: boxWidth - 20 },
        })
        .setOrigin(0.5);

      const textBox = this.add
        .rectangle(x, y + 40, boxWidth, boxHeight, 0x2C1810, 0.9)
        .setStrokeStyle(2, 0xD4AF37, 0.7)
        .setInteractive({ useHandCursor: true });

      const boxText = this.add
        .text(x, y + 40, 'Click to write...', {
          fontSize: '14px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
          align: 'center',
          wordWrap: { width: boxWidth - 20 },
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
        const currentValue = (this as any)[key] as string;
        const response = await this.showTextInputModal(
          modalTitle,
          'Write your thoughts...',
          guidance,
          15, // minimum 15 words
          currentValue
        );

        if (response && response.trim()) {
          const displayText = response.trim().length > 60
            ? response.trim().substring(0, 57) + '...'
            : response.trim();
          boxText.setText(displayText);
          boxText.setAlpha(1);
          (this as any)[key] = response.trim();
        }
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
    const allTrajectoriesFilled =
      this.trajectoryPast.trim().length > 0 &&
      this.trajectoryPresent.trim().length > 0 &&
      this.trajectoryFuture.trim().length > 0;

    if (this.selectedCount < 2 || !allTrajectoriesFilled) {
      return; // Need at least 2 triggers AND all 3 trajectories
    }

    const selectedTriggers = this.triggers
      .filter(t => t.selected)
      .map(t => t.label.replace(/\n/g, ' '))
      .join(', ');

    console.log(`✅ Module 7 completed - Triggers: ${selectedTriggers}`);
    console.log(`Trajectories - Past: ${this.trajectoryPast.substring(0, 50)}...`);
    console.log(`Trajectories - Present: ${this.trajectoryPresent.substring(0, 50)}...`);
    console.log(`Trajectories - Future: ${this.trajectoryFuture.substring(0, 50)}...`);

    const progressStore = useGameProgressStore.getState();
    progressStore.completeModule(7, {
      emotionSelected: this.emotionId,
      trajectoryPast: this.trajectoryPast,
      trajectoryPresent: this.trajectoryPresent,
      trajectoryFuture: this.trajectoryFuture,
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
