/**
 * Character Creation Scene - MVP SIMPLIFIED
 * Just name entry - customization moved to v2
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { usePlayerStore } from '@/stores/playerStore';
import { showTextInput } from '@/stores/modalStore';
import { useAvatarStore } from '@/stores/avatarStore';
import {
  AvatarCustomization,
  SKIN_TONES,
  HAIR_COLORS,
  EYE_COLORS,
} from '@/types/player.types';
import { VisualEffectsManager } from '../effects/VisualEffectsManager';

interface SceneData {
  age: number;
  ageBracket: string;
}

export class CharacterCreationScene extends BaseScene {
  private sceneData!: SceneData;
  private playerName: string = '';
  private companionName: string = '';
  private currentAvatar: AvatarCustomization;
  private previewContainer!: Phaser.GameObjects.Container;
  private vfx!: VisualEffectsManager;

  // UI state
  private nameText!: Phaser.GameObjects.Text;
  private companionNameText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.CHARACTER_CREATION);

    // Default avatar (no customization in MVP)
    this.currentAvatar = {
      bodyType: 'average',
      skinTone: SKIN_TONES[3].value,
      hairStyle: 'shoulder-length',
      hairColor: HAIR_COLORS[2].value,
      faceShape: 'oval',
      eyeShape: 'almond',
      eyeColor: EYE_COLORS[0].value,
      outfit: 'wanderer',
      accessories: [],
    };
  }

  init(data: SceneData): void {
    this.sceneData = data;
  }

  create(): void {
    this.setEmotion('playful');
    this.fadeIn();

    // Initialize VFX manager
    this.vfx = new VisualEffectsManager(this);

    // Adventure theme background
    this.cameras.main.setBackgroundColor('#1A0F08');
    this.createParchmentBackground();
    this.createOrnateFrame();
    this.createEmotionalWisps();

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Title with adventure styling
    this.add
      .text(centerX, 180, 'Welcome to Your Journey', {
        fontSize: '64px',
        color: '#F4E5B8',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setStroke('#2C1810', 6)
      .setShadow(0, 4, 'rgba(0, 0, 0, 0.8)', 10);

    // Subtitle with gold italics
    this.add
      .text(
        centerX,
        250,
        "Let's begin by introducing ourselves",
        {
          fontSize: '28px',
          color: '#D4AF37',
          fontFamily: 'Crimson Text, serif',
          fontStyle: 'italic',
        }
      )
      .setOrigin(0.5)
      .setShadow(0, 2, 'rgba(0, 0, 0, 0.8)', 6);

    // Avatar creation button
    this.createAvatarButton(centerX, 350);

    // Name inputs (better spacing)
    this.createNameInputs(centerX, 520);

    // Complete button (moved way down to avoid overlap)
    this.createCompleteButton(centerX, 750);

    // Add age-appropriate visual elements
    if (this.isTeen()) {
      this.createAdventureElements();
    }

    if (this.isAdult()) {
      this.createCalmingElements();
    }

    console.log('✅ Character Creation Scene: Ready (Adventure Theme)');
  }

  /**
   * Create adventure-themed visual elements for teens
   */
  private createAdventureElements(): void {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Add ancient pillars flanking the scene
    this.vfx.createAncientPillar(120, this.scale.height - 50, 200);
    this.vfx.createAncientPillar(this.scale.width - 120, this.scale.height - 50, 200);

    // Add treasure chest for the journey ahead
    this.vfx.createTreasureChest(centerX - 400, centerY + 100, 0xD4AF37);

    // Add magical torches in corners
    this.vfx.createMagicalTorch(150, 200, 0xFF6B35);
    this.vfx.createMagicalTorch(this.scale.width - 150, 200, 0xFF6B35);

    // Add floating mystical runes around the scene
    this.vfx.createFloatingRunes(8, 0x9370DB);

    // Add floating wisdom books for the journey
    this.vfx.createFloatingBook(centerX - 450, centerY - 100, 0xD4AF37);
    this.vfx.createFloatingBook(centerX + 450, centerY - 100, 0x9370DB);

    // Add guardian statues watching over
    this.vfx.createGuardianStatue(200, this.scale.height - 200);
    this.vfx.createGuardianStatue(this.scale.width - 200, this.scale.height - 200);

    // Add magical compass for guidance
    this.vfx.createMagicalCompass(centerX, this.scale.height - 100);

    // Add periodic flying creatures
    this.time.addEvent({
      delay: 8000,
      callback: () => {
        const startX = Phaser.Math.Between(0, 100);
        const startY = Phaser.Math.Between(200, 400);
        const color = Phaser.Utils.Array.GetRandom([0xFF6B9D, 0x9370DB, 0xD4AF37]);
        this.vfx.createFlyingCreature(startX, startY, color);
      },
      loop: true
    });

    // Add shooting stars periodically
    this.time.addEvent({
      delay: 6000,
      callback: () => {
        this.vfx.createShootingStar(0xD4AF37);
      },
      loop: true
    });
  }

  /**
   * Create calming therapeutic visual elements for adults
   */
  private createCalmingElements(): void {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Add gentle breathing circles for mindfulness
    this.vfx.createBreathingCircle(centerX - 400, centerY, 0x87CEEB, 80);
    this.vfx.createBreathingCircle(centerX + 400, centerY, 0xB0C4DE, 70);

    // Add calm ambient particles throughout
    this.vfx.createCalmAmbientParticles(15, 0xB0C4DE);

    // Add mindfulness ripples at center
    this.vfx.createMindfulnessRipples(centerX, centerY + 200, 0x87CEEB);

    // Add grounding elements for stability
    this.vfx.createGroundingElement(200, this.scale.height - 150, 0x8B7355);
    this.vfx.createGroundingElement(this.scale.width - 200, this.scale.height - 150, 0x8B7355);

    // Add therapeutic halos in layers
    this.vfx.createTherapeuticHalo(centerX, centerY - 150, 0x87CEEB, 120);
    this.vfx.createTherapeuticHalo(centerX, centerY - 150, 0xB0C4DE, 180);

    // Add calm waves at bottom for tranquility
    this.vfx.createCalmWaves(this.scale.height - 80, 0x87CEEB);

    // Add therapeutic gradient overlay
    this.vfx.createTherapeuticGradient(0x87CEEB);

    // Add meditation dot for focus
    this.vfx.createMeditationDot(centerX, this.scale.height - 100, 0xFFE4B5);

    // Add mindfulness symbols floating gently
    this.vfx.createMindfulnessSymbols(6, 0xB0C4DE);

    // Add focus rings around center
    this.vfx.createFocusRings(centerX, centerY - 150, 0x87CEEB);
  }

  private createAvatarButton(x: number, y: number): void {
    // Check if avatar already created
    const avatarUrl = useAvatarStore.getState().avatarUrl;

    if (avatarUrl) {
      // Extract avatar ID from URL for rendering
      // URL format: https://models.readyplayer.me/[id].glb
      const avatarId = avatarUrl.split('/').pop()?.replace('.glb', '');

      // Use Ready Player Me render API to display avatar as 2D image
      const avatarImageUrl = `https://models.readyplayer.me/${avatarId}.png?scene=fullbody-portrait-v1&quality=high`;

      // Load and display avatar image
      this.load.image(`avatar_${avatarId}`, avatarImageUrl);
      this.load.once('complete', () => {
        // Avatar portrait frame
        const frame = this.add.rectangle(x, y, 220, 300, 0x2C1810, 0.9)
          .setStrokeStyle(4, 0xD4AF37, 1);

        // Display avatar image
        const avatarImage = this.add.image(x, y, `avatar_${avatarId}`)
          .setDisplaySize(200, 280);

        // Gold border glow
        this.tweens.add({
          targets: frame,
          alpha: 0.95,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        // Label
        this.add.text(x, y - 170, 'Your Avatar', {
          fontSize: '20px',
          color: '#D4AF37',
          fontFamily: 'Cinzel, serif',
          fontStyle: 'bold',
        }).setOrigin(0.5);

        // Edit button below avatar
        this.createButton(x, y + 180, 'Edit Avatar', () => {
          console.log('Opening Ready Player Me to edit avatar...');
          useAvatarStore.getState().openAvatarCreator();
        }, 200, 50);
      });
      this.load.start();
    } else {
      // Create avatar button with adventure styling
      const btn = this.createButton(x, y, '🎭 Create Your Avatar', () => {
        console.log('Opening Ready Player Me...');
        useAvatarStore.getState().openAvatarCreator();
      }, 300, 70);

      // Add glow animation
      this.tweens.add({
        targets: btn,
        alpha: 0.8,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Add helper text
      this.add.text(x, y + 55, '(Optional - You can skip this)', {
        fontSize: '16px',
        color: '#888888',
        fontFamily: 'Crimson Text, serif',
      }).setOrigin(0.5);
    }
  }

  private createNameInputs(centerX: number, startY: number): void {
    const inputWidth = 400;
    const inputHeight = 60;
    const spacing = 140;

    // Your Name with adventure styling
    this.add
      .text(centerX, startY, 'Your Name:', {
        fontSize: '28px',
        color: '#D4AF37',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const nameBox = this.add
      .rectangle(centerX, startY + 40, inputWidth, inputHeight, 0x3D2F24, 0.9)
      .setStrokeStyle(3, 0x5C4A3A, 0.8)
      .setInteractive({ useHandCursor: true });

    this.nameText = this.add
      .text(centerX, startY + 40, 'Click to enter...', {
        fontSize: '24px',
        color: '#D4C5B0',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(0.5)
      .setAlpha(0.6);

    nameBox.on('pointerover', () => {
      nameBox.setStrokeStyle(3, 0xD4AF37, 1);
    });

    nameBox.on('pointerout', () => {
      nameBox.setStrokeStyle(3, 0x5C4A3A, 0.8);
    });

    nameBox.on('pointerdown', async () => {
      const name = await showTextInput(
        'What is your name?',
        'Enter your name...',
        this.playerName
      );
      if (name && name.trim()) {
        this.playerName = name.trim();
        this.nameText.setText(this.playerName).setAlpha(1).setColor('#F4E5B8');
      }
    });

    // Companion Name with adventure styling
    const companionY = startY + spacing;

    this.add
      .text(centerX, companionY, "Your Guide's Name:", {
        fontSize: '28px',
        color: '#9370DB',
        fontFamily: 'Cinzel, serif',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const companionBox = this.add
      .rectangle(centerX, companionY + 40, inputWidth, inputHeight, 0x3D2F24, 0.9)
      .setStrokeStyle(3, 0x9370DB, 0.8)
      .setInteractive({ useHandCursor: true });

    this.companionNameText = this.add
      .text(centerX, companionY + 40, 'Lumina', {
        fontSize: '24px',
        color: '#9370DB',
        fontFamily: 'Crimson Text, serif',
      })
      .setOrigin(0.5)
      .setAlpha(0.9);

    companionBox.on('pointerover', () => {
      companionBox.setStrokeStyle(3, 0xD4AF37, 1);
    });

    companionBox.on('pointerout', () => {
      companionBox.setStrokeStyle(3, 0x9370DB, 0.8);
    });

    companionBox.on('pointerdown', async () => {
      const name = await showTextInput(
        "Name Your Guide",
        'Enter a name (or leave empty for Lumina)...',
        this.companionName === 'Lumina' ? '' : this.companionName
      );
      const companionName = name && name.trim() ? name.trim() : 'Lumina';
      this.companionName = companionName;
      this.companionNameText.setText(companionName).setAlpha(1);
    });

    // Set default
    this.companionName = 'Lumina';
  }

  private createCompleteButton(centerX: number, y: number): void {
    const button = this.createButton(
      centerX,
      y,
      'Begin Your Journey',
      () => this.completeCharacterCreation(),
      400,
      80
    );

    // Pulsing animation
    this.tweens.add({
      targets: button,
      scale: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private async completeCharacterCreation(): Promise<void> {
    if (!this.playerName) {
      // Show error
      const errorText = this.add
        .text(this.scale.width / 2, this.scale.height / 2 + 200, 'Please enter your name first!', {
          fontSize: '28px',
          color: '#FF4444',
          fontFamily: 'Raleway, sans-serif',
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: errorText,
        alpha: 0,
        duration: 2000,
        delay: 1500,
        onComplete: () => errorText.destroy(),
      });
      return;
    }

    // Create player profile
    const playerStore = usePlayerStore.getState();
    await playerStore.createNewProfile(
      this.playerName,
      this.sceneData.age,
      this.currentAvatar
    );

    // Update with companion name
    await playerStore.updateCompanionName(this.companionName);

    console.log('✅ Player profile created:', this.playerName, 'with guide:', this.companionName);

    // Visual feedback
    this.cameras.main.flash(800, 255, 215, 0);

    // Transition to Hub
    this.time.delayedCall(1000, () => {
      this.transitionToScene(SCENE_KEYS.HUB);
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
