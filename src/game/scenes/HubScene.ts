/**
 * Hub Scene
 * Central realm where players select emotions to explore
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import { useAvatarStore } from '@/stores/avatarStore';
import { EMOTION_DEFINITIONS, EmotionType } from '@/types/emotion.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface EmotionCrystal {
  emotion: EmotionType;
  x: number;
  y: number;
  sprite?: Phaser.GameObjects.Container;
  unlocked: boolean;
}

export class HubScene extends BaseScene {
  private emotionCrystals: EmotionCrystal[] = [];
  private playerSprite!: Phaser.GameObjects.Container;
  private companionSprite!: Phaser.GameObjects.Container;
  private welcomeShown: boolean = false;
  private vfx!: VisualEffectsManager;

  constructor() {
    super(SCENE_KEYS.HUB);
  }

  create(): void {
    this.setEmotion('joy'); // Default welcoming atmosphere
    this.fadeIn();
    this.initializeTheme(); // Initialize age-based theme

    // Initialize visual effects manager
    this.vfx = new VisualEffectsManager(this);

    // Adventure-themed background
    this.createHubBackground();
    this.createParchmentBackground();
    this.createOrnateFrame();

    // MINIMAL visual effects - keep it clean
    this.vfx.createParallaxStars(2); // Reduced from 3
    this.vfx.createFloatingOrbs(5, 0xD4AF37); // Reduced from 25!

    // Subtle center glow only - no portal
    const centerGlow = this.add.circle(
      this.scale.width / 2,
      this.scale.height / 2,
      200,
      0xD4AF37,
      0.05
    );
    this.tweens.add({
      targets: centerGlow,
      alpha: 0.08,
      scale: 1.1,
      duration: 3000,
      yoyo: true,
      repeat: -1,
    });

    // Get player profile
    const playerProfile = usePlayerStore.getState().profile;
    const playerName = playerProfile?.name || 'Explorer';

    const centerX = this.scale.width / 2;

    // Title - age-appropriate
    const titleText = this.isAdult() ? 'Emotion Explorer' : 'The Emotional Realm';
    const title = this.add
      .text(centerX, 60, titleText, {
        fontSize: '56px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 6)
      .setShadow(0, 4, 'rgba(0, 0, 0, 0.8)', 10);

    // Gold glow around title
    const titleGlow = this.add
      .text(centerX, 60, titleText, {
        fontSize: '56px',
        color: '#D4AF37',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setAlpha(0.3)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(-1);

    // Gentle glow animation
    this.tweens.add({
      targets: [titleGlow],
      alpha: 0.15,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Welcome message (first time only)
    if (!this.welcomeShown) {
      this.showWelcomeMessage(playerName);
      this.welcomeShown = true;
    }

    // Player avatar (simplified)
    this.createPlayerAvatar();

    // Companion
    this.createCompanion();

    // Create emotion crystals in a circular arrangement
    this.createEmotionCrystals();

    // Add teen-only adventure visuals
    if (this.isTeen()) {
      this.createAdventureElements();
    }

    // Add adult-only calming visuals
    if (this.isAdult()) {
      this.createCalmingElements();
    }

    // UI Elements
    this.createUIPanel();

    console.log('✅ Hub Scene: Ready (Adventure Theme)');
  }

  private createAdventureElements(): void {
    // MINIMAL - just edge decorations, no clutter

    // Only 2 pillars at far edges
    this.vfx.createAncientPillar(80, this.scale.height - 50, 140);
    this.vfx.createAncientPillar(this.scale.width - 80, this.scale.height - 50, 140);
  }

  private createCalmingElements(): void {
    // MINIMAL - just edge decorations, no clutter

    // Only edge grounding elements
    this.vfx.createGroundingElement(80, this.scale.height - 150, 0x8B7355);
    this.vfx.createGroundingElement(this.scale.width - 80, this.scale.height - 150, 0x8B7355);

    // Subtle ambient particles (reduced from 20 to 5)
    this.vfx.createCalmAmbientParticles(5, 0xB0C4DE);

    // Gentle waves at bottom only
    this.vfx.createCalmWaves(this.scale.height - 200, 0x87CEEB);
  }

  private createHubBackground(): void {
    // Deep brown adventure background with gradient
    const graphics = this.add.graphics();

    // Create vertical gradient (brown tones)
    const gradientStops = [
      { offset: 0, color: 0x2C1810 },
      { offset: 0.5, color: 0x1A0F08 },
      { offset: 1, color: 0x3D2F24 },
    ];

    graphics.fillStyle(gradientStops[1].color);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    // Add mystical ground platform (brown wood)
    const platformY = this.scale.height - 150;
    graphics.fillStyle(0x5C4A3A, 0.6);
    graphics.fillRoundedRect(
      this.scale.width / 2 - 500,
      platformY,
      1000,
      10,
      5
    );

    // Add golden ethereal glow
    const glow = this.add.circle(
      this.scale.width / 2,
      this.scale.height / 2,
      400,
      0xD4AF37,
      0.05
    );

    this.tweens.add({
      targets: glow,
      scale: 1.2,
      alpha: 0.08,
      duration: 3000,
      yoyo: true,
      repeat: -1,
    });
  }

  private showWelcomeMessage(playerName: string): void {
    const overlay = this.add.container(this.scale.width / 2, this.scale.height / 2);
    overlay.setDepth(1000);

    // Adventure-styled background
    const bg = this.add.rectangle(0, 0, 900, 400, 0x2C1810, 0.95)
      .setStrokeStyle(4, 0xD4AF37, 0.8);

    const welcomeText = this.add
      .text(0, -120, `Welcome, ${playerName}!`, {
        fontSize: '52px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 8);

    // Age-appropriate message
    const messageContent = this.isAdult()
      ? 'Welcome to the Emotion Explorer.\n\n' +
        'Each symbol represents a different emotion.\n' +
        'Select an emotion to begin exploring your feelings.'
      : 'You have entered the Emotional Realm,\na mystical space where feelings take form.\n\n' +
        'Each glowing crystal represents an emotion.\n' +
        'Choose one to begin your journey of discovery.';

    const messageText = this.add
      .text(
        0,
        0,
        messageContent,
        {
          fontSize: '24px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
          align: 'center',
          lineSpacing: 10,
        }
      )
      .setOrigin(0.5);

    const buttonText = this.isAdult() ? 'Continue' : 'Begin Exploration';
    const continueButton = this.createButton(
      0,
      140,
      buttonText,
      () => {
        this.tweens.add({
          targets: overlay,
          alpha: 0,
          duration: 500,
          onComplete: () => overlay.destroy(),
        });
      },
      300,
      70
    );

    overlay.add([bg, welcomeText, messageText, continueButton]);
    overlay.setAlpha(0);

    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 800,
    });
  }

  private createPlayerAvatar(): void {
    // Move to BOTTOM-LEFT corner to avoid emotion wheel overlap
    const x = 120;
    const y = this.scale.height - 120;

    this.playerSprite = this.add.container(x, y);

    const playerProfile = usePlayerStore.getState().profile;
    if (!playerProfile) return;

    // Check if Ready Player Me avatar exists
    const avatarUrl = useAvatarStore.getState().avatarUrl;

    if (avatarUrl) {
      // Use Ready Player Me avatar
      const avatarId = avatarUrl.split('/').pop()?.replace('.glb', '');
      const avatarImageUrl = `https://models.readyplayer.me/${avatarId}.png?scene=halfbody-portrait-v1&quality=high`;

      // Load and display avatar
      this.load.image(`hub_avatar_${avatarId}`, avatarImageUrl);
      this.load.once('complete', () => {
        // Avatar frame with gold border
        const frame = this.add.rectangle(0, 0, 110, 140, 0x2C1810, 0.9)
          .setStrokeStyle(3, 0xD4AF37, 1);

        // Display avatar image
        const avatarImage = this.add.image(0, 0, `hub_avatar_${avatarId}`)
          .setDisplaySize(100, 130);

        this.playerSprite.add([frame, avatarImage]);

        // Gentle idle animation
        this.tweens.add({
          targets: this.playerSprite,
          y: y - 10,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        // Gold border glow
        this.tweens.add({
          targets: frame,
          alpha: 0.95,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      });
      this.load.start();
    } else {
      // Fallback to simple avatar representation
      const avatar = playerProfile.avatar;
      const bodyColor = parseInt(avatar.skinTone.replace('#', ''), 16);
      const hairColor = parseInt(avatar.hairColor.replace('#', ''), 16);

      // Body
      const body = this.add.ellipse(0, 20, 40, 60, bodyColor);

      // Head
      const head = this.add.circle(0, -20, 25, bodyColor);

      // Hair
      const hair = this.add.ellipse(0, -30, 50, 40, hairColor);

      // Simple eyes
      const leftEye = this.add.circle(-8, -20, 4, 0x000000);
      const rightEye = this.add.circle(8, -20, 4, 0x000000);

      this.playerSprite.add([hair, body, head, leftEye, rightEye]);

      // Gentle idle animation
      this.tweens.add({
        targets: this.playerSprite,
        y: y - 10,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Player name label below avatar
    this.add
      .text(x, y + 85, playerProfile.name, {
        fontSize: '20px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.9)', 4);
  }

  private createCompanion(): void {
    // Move to BOTTOM-RIGHT corner to avoid emotion wheel overlap
    const x = this.scale.width - 120;
    const y = this.scale.height - 120;

    this.companionSprite = this.add.container(x, y);

    // Simplified companion (mystical creature)
    const companionBody = this.add.circle(0, 0, 30, 0x9370db, 0.8);

    // Glow effect
    const glow = this.add.circle(0, 0, 40, 0x9370db, 0.3);

    // Eyes
    const leftEye = this.add.circle(-10, -5, 5, 0xffffff);
    const rightEye = this.add.circle(10, -5, 5, 0xffffff);

    // Pupils
    const leftPupil = this.add.circle(-10, -5, 2, 0x000000);
    const rightPupil = this.add.circle(10, -5, 2, 0x000000);

    this.companionSprite.add([glow, companionBody, leftEye, rightEye, leftPupil, rightPupil]);

    // Floating animation
    this.tweens.add({
      targets: this.companionSprite,
      y: y - 15,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Pulsing glow
    this.tweens.add({
      targets: glow,
      scale: 1.3,
      alpha: 0.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    // Companion name label
    const companionName = usePlayerStore.getState().profile?.companionName || 'Companion';
    this.add
      .text(x, y + 60, companionName, {
        fontSize: '18px',
        color: '#9370db',
        fontFamily: 'Merriweather, serif',
      })
      .setOrigin(0.5);
  }

  private createEmotionCrystals(): void {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2 - 50;
    const radius = 320;

    // Get all 16 emotions
    const emotions = Object.keys(EMOTION_DEFINITIONS) as EmotionType[];

    emotions.forEach((emotionId, index) => {
      const angle = (Math.PI * 2 * index) / emotions.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const emotion = EMOTION_DEFINITIONS[emotionId];
      const crystal = this.createEmotionCrystal(x, y, emotionId, emotion.name, emotion.color);

      this.emotionCrystals.push({
        emotion: emotionId,
        x,
        y,
        sprite: crystal,
        unlocked: true, // All unlocked for MVP
      });
    });
  }

  private createEmotionCrystal(
    x: number,
    y: number,
    emotionId: EmotionType,
    emotionName: string,
    colorHex: string
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const color = parseInt(colorHex.replace('#', ''), 16);

    // MUCH BETTER - Solid circular button with color
    const circle = this.add.circle(0, 0, 40, color, 1.0); // Solid color, bigger

    // Bright gold border
    const borderCircle = this.add.circle(0, 0, 42, 0xD4AF37, 0)
      .setStrokeStyle(3, 0xD4AF37, 1);

    // Inner highlight for depth
    const innerCircle = this.add.circle(0, -8, 12, 0xFFFFFF, 0.4);

    // Subtle glow (much less than before)
    const glow = this.add.circle(0, 0, 50, color, 0.15);

    // Better label with dark background for readability
    const labelBg = this.add.rectangle(0, 60, emotionName.length * 10 + 20, 28, 0x1A0F08, 0.85)
      .setStrokeStyle(2, 0xD4AF37, 0.6);

    const label = this.add
      .text(0, 60, emotionName, {
        fontSize: '18px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.9)', 4);

    container.add([glow, circle, innerCircle, borderCircle, labelBg, label]);

    // Make interactive
    const hitArea = this.add.circle(0, 0, 35, 0xffffff, 0).setInteractive({ useHandCursor: true });
    container.add(hitArea);

    // Hover effect
    hitArea.on('pointerover', () => {
      circle.setScale(1.15);
      borderCircle.setScale(1.15);
      innerCircle.setScale(1.15);
      label.setScale(1.05);
      labelBg.setScale(1.05);
      glow.setScale(1.3);
      this.tweens.add({
        targets: [circle, borderCircle, innerCircle],
        duration: 200,
      });
    });

    hitArea.on('pointerout', () => {
      circle.setScale(1);
      borderCircle.setScale(1);
      innerCircle.setScale(1);
      label.setScale(1);
      labelBg.setScale(1);
      glow.setScale(1);
    });

    hitArea.on('pointerdown', () => {
      this.selectEmotion(emotionId, emotionName);
    });

    // Floating animation with slight variation
    this.tweens.add({
      targets: container,
      y: y - 10,
      duration: 2000 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Twinkling
    this.tweens.add({
      targets: glow,
      alpha: 0.3,
      scale: 1.2,
      duration: 1500 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
    });

    return container;
  }

  private selectEmotion(emotionId: EmotionType, emotionName: string): void {
    console.log(`✨ Selected emotion: ${emotionName}`);

    const emotion = EMOTION_DEFINITIONS[emotionId];
    const color = parseInt(emotion.color.replace('#', ''), 16);

    // Enhanced visual feedback
    this.cameras.main.flash(300, ...this.hexToRgb(emotion.color));

    // Find the crystal position
    const crystal = this.emotionCrystals.find(c => c.emotion === emotionId);
    if (crystal) {
      // Energy pulse from crystal
      this.vfx.createEnergyPulse(crystal.x, crystal.y, color, 8);

      // Sparkles burst
      this.vfx.createSparkles(crystal.x, crystal.y, color, 80);

      // Light rays
      this.vfx.createLightRays(crystal.x, crystal.y, color, 16);
    }

    // Show emotion selection dialog
    this.showEmotionSelectionDialog(emotionId, emotionName);
  }

  private showEmotionSelectionDialog(emotionId: EmotionType, emotionName: string): void {
    const overlay = this.add.container(this.scale.width / 2, this.scale.height / 2);
    overlay.setDepth(1000);

    const emotion = EMOTION_DEFINITIONS[emotionId];
    const color = parseInt(emotion.color.replace('#', ''), 16);

    // Adventure-styled background
    const bg = this.add.rectangle(0, 0, 800, 500, 0x2C1810, 0.95)
      .setStrokeStyle(4, 0xD4AF37, 0.9);

    const titleText = this.add
      .text(0, -180, emotionName.toUpperCase(), {
        fontSize: '48px',
        color: emotion.color,
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setShadow(0, 3, 'rgba(0, 0, 0, 0.8)', 8);

    const domainText = this.add
      .text(0, -120, emotion.domainName, {
        fontSize: '28px',
        color: '#D4AF37',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
      })
      .setOrigin(0.5);

    const descText = this.add
      .text(0, -50, emotion.description, {
        fontSize: '20px',
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
        align: 'center',
        wordWrap: { width: 700 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    const companionDialogue = this.add
      .text(0, 60, `"${emotion.companionDialogue}"`, {
        fontSize: '18px',
        color: '#9370db',
        fontFamily: 'Crimson Text, serif',
        fontStyle: 'italic',
        align: 'center',
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);

    const exploreButton = this.createButton(
      -120,
      180,
      'Begin Journey',
      () => {
        this.startEmotionJourney(emotionId);
      },
      200,
      60
    );

    const backButton = this.createButton(
      120,
      180,
      'Not Yet',
      () => {
        this.tweens.add({
          targets: overlay,
          alpha: 0,
          duration: 300,
          onComplete: () => overlay.destroy(),
        });
      },
      200,
      60
    );

    overlay.add([bg, titleText, domainText, descText, companionDialogue, exploreButton, backButton]);
    overlay.setAlpha(0);

    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 300,
    });
  }

  private startEmotionJourney(emotionId: EmotionType): void {
    console.log(`🚀 Starting journey for emotion: ${emotionId}`);

    // Initialize progress tracking
    const progressStore = useGameProgressStore.getState();
    progressStore.startEmotionJourney(emotionId);

    // Visual feedback
    this.cameras.main.flash(500, 255, 215, 0);

    // Determine which module to navigate to based on progress
    const currentSession = progressStore.currentSession;
    const moduleNumber = currentSession?.currentModule || 1;

    // Map module number to scene key
    const moduleSceneKeys = [
      SCENE_KEYS.MODULE_1,
      SCENE_KEYS.MODULE_2,
      SCENE_KEYS.MODULE_3,
      SCENE_KEYS.MODULE_4,
      SCENE_KEYS.MODULE_5,
      SCENE_KEYS.MODULE_6,
      SCENE_KEYS.MODULE_7,
      SCENE_KEYS.MODULE_8,
      SCENE_KEYS.MODULE_9,
    ];

    const sceneKey = moduleSceneKeys[moduleNumber - 1];

    console.log(`📍 Navigating to Module ${moduleNumber}: ${sceneKey}`);

    // Transition to the appropriate module
    this.time.delayedCall(600, () => {
      this.transitionToScene(sceneKey, { emotionId });
    });
  }

  private createUIPanel(): void {
    // Top-right info panel with adventure styling
    const panelX = this.scale.width - 20;
    const panelY = 20;

    const playerProfile = usePlayerStore.getState().profile;
    if (!playerProfile) return;

    this.add
      .text(panelX, panelY, `${playerProfile.name}`, {
        fontSize: '24px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(1, 0)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.8)', 4);

    this.add
      .text(panelX, panelY + 30, `Age: ${playerProfile.ageGroup}`, {
        fontSize: '18px',
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(1, 0);

    // Menu button (bottom-left)
    this.createButton(
      120,
      this.scale.height - 50,
      'Main Menu',
      () => {
        this.transitionToScene(SCENE_KEYS.MAIN_MENU);
      },
      200,
      50
    );
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

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  }
}
