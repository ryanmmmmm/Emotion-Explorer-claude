/**
 * Character Creation Scene - RESPONSIVE REDESIGN
 * Simplified, centered layout that works at any screen size
 */

import { BaseScene } from './BaseScene';
import { SCENE_KEYS } from '../config/constants';
import { usePlayerStore } from '@/stores/playerStore';
import {
  AvatarCustomization,
  BodyType,
  HairStyle,
  FaceShape,
  EyeShape,
  OutfitType,
  SKIN_TONES,
  HAIR_COLORS,
  EYE_COLORS,
} from '@/types/player.types';

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

  // UI state
  private nameText!: Phaser.GameObjects.Text;
  private companionNameText!: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.CHARACTER_CREATION);

    // Default avatar
    this.currentAvatar = {
      bodyType: 'average',
      skinTone: SKIN_TONES[3].value, // Medium
      hairStyle: 'shoulder-length',
      hairColor: HAIR_COLORS[2].value, // Brown
      faceShape: 'oval',
      eyeShape: 'almond',
      eyeColor: EYE_COLORS[0].value, // Brown
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
    this.cameras.main.setBackgroundColor('#1A1A2E');
    this.createStarfield();
    this.createEmotionalWisps();

    // Responsive positioning
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Title
    this.add
      .text(centerX, 80, 'Create Your Avatar', {
        fontSize: '56px',
        color: '#ffffff',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(
        centerX,
        140,
        'Customize your appearance for your journey',
        {
          fontSize: '22px',
          color: '#FFD700',
          fontFamily: 'Merriweather, serif',
          align: 'center',
        }
      )
      .setOrigin(0.5);

    // Create simplified UI
    this.createAvatarPreview();
    this.createQuickCustomization();
    this.createNameInput();
    this.createCompleteButton();

    console.log('✅ Character Creation Scene: Ready (Responsive)');
  }

  private createAvatarPreview(): void {
    const centerX = this.scale.width / 2;
    const previewY = 300;

    // Preview background
    this.add
      .rectangle(centerX, previewY, 300, 300, 0x0f3460, 0.5)
      .setStrokeStyle(3, 0xffffff, 0.3);

    // Create preview container
    this.previewContainer = this.add.container(centerX, previewY);
    this.updateAvatarPreview();
  }

  private updateAvatarPreview(): void {
    // Clear existing preview
    this.previewContainer.removeAll(true);

    const scale = 1.2;

    // Body
    const bodyColor = parseInt(this.currentAvatar.skinTone.replace('#', ''), 16);
    const body = this.add.ellipse(0, 40, 60 * scale, 90 * scale, bodyColor, 1);
    this.previewContainer.add(body);

    // Head
    const head = this.add.circle(0, -30, 40 * scale, bodyColor, 1);
    this.previewContainer.add(head);

    // Hair
    const hairColor = parseInt(this.currentAvatar.hairColor.replace('#', ''), 16);
    let hair: Phaser.GameObjects.GameObject;

    if (this.currentAvatar.hairStyle.includes('short') || this.currentAvatar.hairStyle === 'pixie') {
      hair = this.add.ellipse(0, -50, 80 * scale, 40 * scale, hairColor, 1);
    } else if (this.currentAvatar.hairStyle.includes('long')) {
      hair = this.add.ellipse(0, -20, 90 * scale, 110 * scale, hairColor, 1);
    } else if (this.currentAvatar.hairStyle === 'afro') {
      hair = this.add.circle(0, -40, 55 * scale, hairColor, 1);
    } else {
      hair = this.add.ellipse(0, -40, 80 * scale, 60 * scale, hairColor, 1);
    }
    this.previewContainer.add(hair);

    // Eyes
    const eyeColor = parseInt(this.currentAvatar.eyeColor.replace('#', ''), 16);
    const leftEye = this.add.ellipse(-15, -30, 12, 16, eyeColor, 1);
    const rightEye = this.add.ellipse(15, -30, 12, 16, eyeColor, 1);
    this.previewContainer.add([leftEye, rightEye]);

    // Outfit indicator
    const outfitColors = {
      wanderer: 0x8B4513,
      scholar: 0x4169E1,
      guardian: 0x696969,
      'free-spirit': 0xFF69B4,
    };
    const outfitColor = outfitColors[this.currentAvatar.outfit];
    const outfit = this.add.rectangle(0, 110, 80 * scale, 60 * scale, outfitColor, 1);
    this.previewContainer.add(outfit);
  }

  private createQuickCustomization(): void {
    const centerX = this.scale.width / 2;
    const startY = 530;
    const rowSpacing = 80;

    // Body Type
    this.createCustomRow(
      'Body Type:',
      startY,
      ['slender', 'athletic', 'average', 'curvy'],
      (type: string) => {
        this.currentAvatar.bodyType = type as BodyType;
        this.updateAvatarPreview();
      },
      (type: string) => this.currentAvatar.bodyType === type
    );

    // Hair Style
    this.createCustomRow(
      'Hair Style:',
      startY + rowSpacing,
      ['pixie', 'bob', 'shoulder-length', 'long'],
      (style: string) => {
        const styleMap: {[key:string]: HairStyle} = {
          'long': 'straight-long',
          'pixie': 'pixie',
          'bob': 'bob',
          'shoulder-length': 'shoulder-length'
        };
        this.currentAvatar.hairStyle = styleMap[style] || style as HairStyle;
        this.updateAvatarPreview();
      },
      (style: string) => {
        const styleMap: {[key:string]: HairStyle} = {
          'long': 'straight-long',
          'pixie': 'pixie',
          'bob': 'bob',
          'shoulder-length': 'shoulder-length'
        };
        return this.currentAvatar.hairStyle === (styleMap[style] || style);
      }
    );

    // Outfit
    this.createCustomRow(
      'Outfit:',
      startY + rowSpacing * 2,
      ['wanderer', 'scholar', 'guardian', 'free-spirit'],
      (outfit: string) => {
        this.currentAvatar.outfit = outfit as OutfitType;
        this.updateAvatarPreview();
      },
      (outfit: string) => this.currentAvatar.outfit === outfit
    );

    // Color swatches
    this.createColorRow('Hair Color:', startY + rowSpacing * 3, HAIR_COLORS.slice(0, 6), (color) => {
      this.currentAvatar.hairColor = color;
      this.updateAvatarPreview();
    });

    this.createColorRow('Skin Tone:', startY + rowSpacing * 4, SKIN_TONES.slice(0, 6), (color) => {
      this.currentAvatar.skinTone = color;
      this.updateAvatarPreview();
    });
  }

  private createCustomRow(
    label: string,
    y: number,
    options: string[],
    onClick: (value: string) => void,
    isSelected: (value: string) => boolean
  ): void {
    const centerX = this.scale.width / 2;
    const labelX = this.scale.width * 0.25; // 25% from left edge

    this.add
      .text(labelX, y, label, {
        fontSize: '20px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0, 0.5);

    const buttonWidth = Math.min(120, this.scale.width * 0.08); // Scale button width
    const buttonSpacing = buttonWidth + 10;
    const startX = centerX - ((options.length - 1) * buttonSpacing) / 2;

    options.forEach((option, index) => {
      const button = this.createOptionButton(
        startX + index * buttonSpacing,
        y,
        option.replace('-', ' '),
        () => onClick(option),
        isSelected(option),
        buttonWidth
      );
    });
  }

  private createColorRow(
    label: string,
    y: number,
    colors: Array<{name: string; value: string}>,
    onClick: (value: string) => void
  ): void {
    const centerX = this.scale.width / 2;
    const labelX = this.scale.width * 0.25; // 25% from left edge

    this.add
      .text(labelX, y, label, {
        fontSize: '20px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0, 0.5);

    const swatchSize = Math.min(18, this.scale.width * 0.012); // Scale swatch size
    const swatchSpacing = Math.min(50, this.scale.width * 0.035); // Scale spacing
    const startX = centerX - ((colors.length - 1) * swatchSpacing) / 2;

    colors.forEach((color, index) => {
      const swatch = this.add
        .circle(startX + index * swatchSpacing, y, swatchSize, parseInt(color.value.replace('#', ''), 16), 1)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(3, 0xffffff, 0.8);

      swatch.on('pointerdown', () => {
        onClick(color.value);
      });

      swatch.on('pointerover', () => {
        swatch.setScale(1.2);
      });

      swatch.on('pointerout', () => {
        swatch.setScale(1);
      });
    });
  }

  private createOptionButton(
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    isSelected: boolean,
    width: number = 120
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const height = 40;

    const bg = this.add
      .rectangle(0, 0, width, height, isSelected ? this.emotionColor : 0x4169E1, isSelected ? 1 : 0.6)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff, isSelected ? 1 : 0.3);

    const buttonText = this.add
      .text(0, 0, text, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    container.add([bg, buttonText]);

    bg.on('pointerdown', onClick);

    bg.on('pointerover', () => {
      bg.setFillStyle(this.emotionColor, 0.8);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(isSelected ? this.emotionColor : 0x4169E1, isSelected ? 1 : 0.6);
    });

    return container;
  }

  private createNameInput(): void {
    const centerX = this.scale.width / 2;
    const y = 920;

    // Player name
    this.add
      .text(centerX - 250, y - 30, 'Your Name:', {
        fontSize: '22px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    const nameBox = this.add
      .rectangle(centerX - 250, y + 10, 280, 50, 0x0f3460, 0.8)
      .setStrokeStyle(3, 0xffffff, 0.5)
      .setInteractive({ useHandCursor: true });

    this.nameText = this.add
      .text(centerX - 250, y + 10, 'Click here...', {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'Merriweather, serif',
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    nameBox.on('pointerdown', async () => {
      const name = await this.showTextInputModal(
        'Choose Your Name',
        'Enter your character name...',
        'This is how you will be addressed throughout your journey.',
        0,
        this.playerName
      );
      if (name && name.trim()) {
        this.playerName = name.trim();
        this.nameText.setText(this.playerName).setAlpha(1);
      }
    });

    // Companion name
    this.add
      .text(centerX + 250, y - 30, "Companion's Name:", {
        fontSize: '22px',
        color: '#9370DB',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    const companionBox = this.add
      .rectangle(centerX + 250, y + 10, 280, 50, 0x0f3460, 0.8)
      .setStrokeStyle(3, 0x9370db, 0.5)
      .setInteractive({ useHandCursor: true });

    this.companionNameText = this.add
      .text(centerX + 250, y + 10, 'Lumina', {
        fontSize: '18px',
        color: '#9370db',
        fontFamily: 'Merriweather, serif',
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    companionBox.on('pointerdown', async () => {
      const name = await this.showTextInputModal(
        'Name Your Companion',
        'Enter a name or leave blank for "Lumina"...',
        'Your companion will guide you through your journey.',
        0,
        this.companionName === 'Lumina' ? '' : this.companionName
      );
      const companionName = name && name.trim() ? name.trim() : 'Lumina';
      this.companionName = companionName;
      this.companionNameText.setText(companionName).setAlpha(1);
    });

    // Set default
    this.companionName = 'Lumina';
  }

  private createCompleteButton(): void {
    const centerX = this.scale.width / 2;
    const button = this.createButton(
      centerX,
      1000,
      'Begin Your Journey',
      () => this.completeCharacterCreation(),
      350,
      70
    );

    // Pulsing animation
    this.tweens.add({
      targets: button,
      scale: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  private async completeCharacterCreation(): Promise<void> {
    if (!this.playerName) {
      // Show error
      const errorText = this.add
        .text(this.scale.width / 2, 950, 'Please enter your name!', {
          fontSize: '22px',
          color: '#FF0000',
          fontFamily: 'Raleway, sans-serif',
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: errorText,
        alpha: 0,
        duration: 2000,
        delay: 1000,
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

    console.log('✅ Player profile created:', this.playerName, 'with companion:', this.companionName);

    // Visual feedback
    this.cameras.main.flash(500, 255, 215, 0);

    // Transition to Hub
    this.time.delayedCall(600, () => {
      this.transitionToScene(SCENE_KEYS.HUB);
    });
  }

  private createStarfield(): void {
    const graphics = this.add.graphics();
    for (let i = 0; i < 200; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const size = Phaser.Math.Between(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.3, 1);
      graphics.fillStyle(0xffffff, alpha);
      graphics.fillCircle(x, y, size);
    }
    graphics.setDepth(0);
  }
}
