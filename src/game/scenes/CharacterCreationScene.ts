/**
 * Character Creation Scene
 * Avatar customization and name input
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
  private currentCategory: string = 'body';

  // UI state
  private nameText!: Phaser.GameObjects.Text;
  private companionNameText!: Phaser.GameObjects.Text;
  private customizationPanel!: Phaser.GameObjects.Container;
  private categoryButtons: Map<string, Phaser.GameObjects.Container> = new Map();

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
    this.setEmotion('playful'); // Creative, fun emotion
    this.fadeIn();
    this.cameras.main.setBackgroundColor('#1A1A2E');
    this.createStarfield();
    this.createEmotionalWisps();

    // Title
    this.add
      .text(this.scale.width / 2, 80, 'Create Your Avatar', {
        fontSize: '64px',
        color: '#ffffff',
        fontFamily: 'Cinzel, serif',
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(
        this.scale.width / 2,
        150,
        'Customize your appearance for your journey through the Realm of Emotions',
        {
          fontSize: '24px',
          color: '#FFD700',
          fontFamily: 'Merriweather, serif',
          align: 'center',
        }
      )
      .setOrigin(0.5);

    // Layout: Preview on left, controls on right
    this.createAvatarPreview();
    this.createCategorySelector();
    this.createCustomizationControls();
    this.selectCategory('body'); // Initialize with body category
    this.createNameInput();
    this.createCompleteButton();

    console.log('✅ Character Creation Scene: Ready');
  }

  private createAvatarPreview(): void {
    const previewX = 350;
    const previewY = 500;

    // Preview background
    this.add
      .rectangle(previewX, previewY, 500, 600, 0x0f3460, 0.5)
      .setStrokeStyle(3, 0xffffff, 0.3);

    this.add
      .text(previewX, 240, 'Preview', {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    // Create preview container
    this.previewContainer = this.add.container(previewX, previewY);
    this.updateAvatarPreview();
  }

  private updateAvatarPreview(): void {
    // Clear existing preview
    this.previewContainer.removeAll(true);

    const scale = 1.5;

    // Body (simplified representation)
    const bodyColor = parseInt(this.currentAvatar.skinTone.replace('#', ''), 16);
    const body = this.add.ellipse(0, 60, 80 * scale, 120 * scale, bodyColor, 1);
    this.previewContainer.add(body);

    // Head
    const head = this.add.circle(0, -40, 50 * scale, bodyColor, 1);
    this.previewContainer.add(head);

    // Hair
    const hairColor = parseInt(this.currentAvatar.hairColor.replace('#', ''), 16);
    let hair: Phaser.GameObjects.GameObject;

    // Different hair shapes based on style
    if (this.currentAvatar.hairStyle.includes('short') || this.currentAvatar.hairStyle === 'pixie') {
      hair = this.add.ellipse(0, -60, 100 * scale, 50 * scale, hairColor, 1);
    } else if (this.currentAvatar.hairStyle.includes('long')) {
      hair = this.add.ellipse(0, -30, 110 * scale, 140 * scale, hairColor, 1);
    } else if (this.currentAvatar.hairStyle === 'afro') {
      hair = this.add.circle(0, -50, 70 * scale, hairColor, 1);
    } else {
      hair = this.add.ellipse(0, -50, 100 * scale, 80 * scale, hairColor, 1);
    }
    this.previewContainer.add(hair);

    // Eyes
    const eyeColor = parseInt(this.currentAvatar.eyeColor.replace('#', ''), 16);
    const leftEye = this.add.ellipse(-20, -40, 15, 20, eyeColor, 1);
    const rightEye = this.add.ellipse(20, -40, 15, 20, eyeColor, 1);
    this.previewContainer.add([leftEye, rightEye]);

    // Outfit indicator (simplified)
    const outfitColors = {
      wanderer: 0x8B4513,
      scholar: 0x4169E1,
      guardian: 0x696969,
      'free-spirit': 0xFF69B4,
    };
    const outfitColor = outfitColors[this.currentAvatar.outfit];
    const outfit = this.add.rectangle(0, 150, 100 * scale, 80 * scale, outfitColor, 1);
    this.previewContainer.add(outfit);

    // Add sparkles around avatar
    this.createSparkles();
  }

  private createSparkles(): void {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 150;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      const sparkle = this.add.star(x, y, 4, 4, 8, 0xFFD700, 0.8);
      this.previewContainer.add(sparkle);

      this.tweens.add({
        targets: sparkle,
        alpha: 0.3,
        scale: 0.5,
        duration: 1000 + i * 200,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private createCategorySelector(): void {
    const categories = [
      { id: 'body', label: 'Body', icon: '👤' },
      { id: 'face', label: 'Face', icon: '😊' },
      { id: 'hair', label: 'Hair', icon: '💇' },
      { id: 'eyes', label: 'Eyes', icon: '👁️' },
      { id: 'outfit', label: 'Outfit', icon: '👕' },
    ];

    const startX = 800;
    const startY = 250;
    const spacing = 150;

    categories.forEach((cat, index) => {
      const x = startX + (index % 3) * spacing;
      const y = startY + Math.floor(index / 3) * 100;

      const button = this.createCategoryButton(x, y, cat.id, cat.label, cat.icon);
      this.categoryButtons.set(cat.id, button);
    });
  }

  private createCategoryButton(
    x: number,
    y: number,
    id: string,
    label: string,
    icon: string
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const width = 120;
    const height = 80;

    const bg = this.add
      .rectangle(0, 0, width, height, 0x4169E1, 0.6)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xffffff, 0.3);

    const iconText = this.add
      .text(0, -15, icon, {
        fontSize: '32px',
      })
      .setOrigin(0.5);

    const labelText = this.add
      .text(0, 20, label, {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    container.add([bg, iconText, labelText]);

    bg.on('pointerdown', () => {
      this.selectCategory(id);
    });

    bg.on('pointerover', () => {
      if (this.currentCategory !== id) {
        bg.setFillStyle(0x4169E1, 0.8);
      }
    });

    bg.on('pointerout', () => {
      if (this.currentCategory !== id) {
        bg.setFillStyle(0x4169E1, 0.6);
      }
    });

    return container;
  }

  private selectCategory(category: string): void {
    // Deselect previous
    const prevButton = this.categoryButtons.get(this.currentCategory);
    if (prevButton) {
      const bg = prevButton.getAt(0) as Phaser.GameObjects.Rectangle;
      bg.setFillStyle(0x4169E1, 0.6);
      bg.setStrokeStyle(2, 0xffffff, 0.3);
    }

    // Select new
    this.currentCategory = category;
    const button = this.categoryButtons.get(category);
    if (button) {
      const bg = button.getAt(0) as Phaser.GameObjects.Rectangle;
      bg.setFillStyle(this.emotionColor, 1);
      bg.setStrokeStyle(3, 0xffffff, 1);
    }

    this.updateCustomizationControls();
  }

  private createCustomizationControls(): void {
    const panelX = 1100;
    const panelY = 550;

    // Background panel
    this.add
      .rectangle(panelX, panelY, 700, 550, 0x0f3460, 0.5)
      .setStrokeStyle(3, 0xffffff, 0.3);

    this.customizationPanel = this.add.container(panelX, panelY);
    this.updateCustomizationControls();
  }

  private updateCustomizationControls(): void {
    this.customizationPanel.removeAll(true);

    const startY = -200;
    const spacing = 60;

    switch (this.currentCategory) {
      case 'body':
        this.createBodyTypeSelector(startY, spacing);
        this.createSkinToneSelector(startY + spacing * 4, spacing);
        break;
      case 'face':
        this.createFaceShapeSelector(startY, spacing);
        break;
      case 'hair':
        this.createHairStyleSelector(startY, spacing);
        this.createHairColorSelector(startY + spacing * 6, spacing);
        break;
      case 'eyes':
        this.createEyeShapeSelector(startY, spacing);
        this.createEyeColorSelector(startY + spacing * 4, spacing);
        break;
      case 'outfit':
        this.createOutfitSelector(startY, spacing);
        break;
    }
  }

  private createBodyTypeSelector(startY: number, spacing: number): void {
    const label = this.add
      .text(0, startY, 'Body Type:', {
        fontSize: '24px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);
    this.customizationPanel.add(label);

    const bodyTypes: BodyType[] = ['slender', 'athletic', 'average', 'curvy'];
    bodyTypes.forEach((type, index) => {
      const button = this.createOptionButton(
        -250 + index * 130,
        startY + spacing,
        type.replace('-', ' '),
        () => {
          this.currentAvatar.bodyType = type;
          this.updateAvatarPreview();
        },
        this.currentAvatar.bodyType === type
      );
      this.customizationPanel.add(button);
    });
  }

  private createSkinToneSelector(startY: number, spacing: number): void {
    const label = this.add
      .text(0, startY, 'Skin Tone:', {
        fontSize: '24px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);
    this.customizationPanel.add(label);

    // Show color swatches
    const displayTones = SKIN_TONES.slice(0, 8); // Show 8 tones
    displayTones.forEach((tone, index) => {
      const x = -280 + (index % 4) * 80;
      const y = startY + spacing + Math.floor(index / 4) * 50;

      const swatch = this.add
        .circle(x, y, 20, parseInt(tone.value.replace('#', ''), 16), 1)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(2, 0xffffff, this.currentAvatar.skinTone === tone.value ? 1 : 0.3);

      swatch.on('pointerdown', () => {
        this.currentAvatar.skinTone = tone.value;
        this.updateAvatarPreview();
        this.updateCustomizationControls();
      });

      this.customizationPanel.add(swatch);
    });
  }

  private createHairStyleSelector(startY: number, spacing: number): void {
    const label = this.add
      .text(0, startY, 'Hair Style:', {
        fontSize: '24px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);
    this.customizationPanel.add(label);

    const styles: HairStyle[] = ['pixie', 'bob', 'shoulder-length', 'straight-long', 'curly-long', 'afro'];
    styles.forEach((style, index) => {
      const x = -280 + (index % 3) * 190;
      const y = startY + spacing + Math.floor(index / 3) * 50;

      const button = this.createOptionButton(
        x,
        y,
        style.replace('-', ' '),
        () => {
          this.currentAvatar.hairStyle = style;
          this.updateAvatarPreview();
        },
        this.currentAvatar.hairStyle === style,
        170
      );
      this.customizationPanel.add(button);
    });
  }

  private createHairColorSelector(startY: number, spacing: number): void {
    const label = this.add
      .text(0, startY, 'Hair Color:', {
        fontSize: '24px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);
    this.customizationPanel.add(label);

    const displayColors = HAIR_COLORS.slice(0, 12);
    displayColors.forEach((color, index) => {
      const x = -280 + (index % 6) * 50;
      const y = startY + spacing + Math.floor(index / 6) * 50;

      const swatch = this.add
        .circle(x, y, 18, parseInt(color.value.replace('#', ''), 16), 1)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(2, 0xffffff, this.currentAvatar.hairColor === color.value ? 1 : 0.3);

      swatch.on('pointerdown', () => {
        this.currentAvatar.hairColor = color.value;
        this.updateAvatarPreview();
        this.updateCustomizationControls();
      });

      this.customizationPanel.add(swatch);
    });
  }

  private createFaceShapeSelector(startY: number, spacing: number): void {
    const label = this.add
      .text(0, startY, 'Face Shape:', {
        fontSize: '24px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);
    this.customizationPanel.add(label);

    const shapes: FaceShape[] = ['round', 'oval', 'heart', 'square'];
    shapes.forEach((shape, index) => {
      const button = this.createOptionButton(
        -250 + index * 130,
        startY + spacing,
        shape,
        () => {
          this.currentAvatar.faceShape = shape;
          this.updateAvatarPreview();
        },
        this.currentAvatar.faceShape === shape
      );
      this.customizationPanel.add(button);
    });
  }

  private createEyeShapeSelector(startY: number, spacing: number): void {
    const label = this.add
      .text(0, startY, 'Eye Shape:', {
        fontSize: '24px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);
    this.customizationPanel.add(label);

    const shapes: EyeShape[] = ['almond', 'round', 'upturned', 'hooded'];
    shapes.forEach((shape, index) => {
      const button = this.createOptionButton(
        -250 + index * 130,
        startY + spacing,
        shape,
        () => {
          this.currentAvatar.eyeShape = shape;
          this.updateAvatarPreview();
        },
        this.currentAvatar.eyeShape === shape
      );
      this.customizationPanel.add(button);
    });
  }

  private createEyeColorSelector(startY: number, spacing: number): void {
    const label = this.add
      .text(0, startY, 'Eye Color:', {
        fontSize: '24px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);
    this.customizationPanel.add(label);

    EYE_COLORS.slice(0, 8).forEach((color, index) => {
      const x = -280 + (index % 4) * 80;
      const y = startY + spacing + Math.floor(index / 4) * 50;

      const swatch = this.add
        .circle(x, y, 20, parseInt(color.value.replace('#', ''), 16), 1)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(2, 0xffffff, this.currentAvatar.eyeColor === color.value ? 1 : 0.3);

      swatch.on('pointerdown', () => {
        this.currentAvatar.eyeColor = color.value;
        this.updateAvatarPreview();
        this.updateCustomizationControls();
      });

      this.customizationPanel.add(swatch);
    });
  }

  private createOutfitSelector(startY: number, spacing: number): void {
    const label = this.add
      .text(0, startY, 'Starting Outfit:', {
        fontSize: '24px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);
    this.customizationPanel.add(label);

    const outfits: OutfitType[] = ['wanderer', 'scholar', 'guardian', 'free-spirit'];
    const descriptions = {
      wanderer: 'Explorer',
      scholar: 'Wise',
      guardian: 'Protector',
      'free-spirit': 'Creative',
    };

    outfits.forEach((outfit, index) => {
      const y = startY + spacing + index * 60;
      const button = this.createOptionButton(
        0,
        y,
        `${outfit.replace('-', ' ')} (${descriptions[outfit]})`,
        () => {
          this.currentAvatar.outfit = outfit;
          this.updateAvatarPreview();
        },
        this.currentAvatar.outfit === outfit,
        300
      );
      this.customizationPanel.add(button);
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

    bg.on('pointerdown', () => {
      onClick();
      this.updateCustomizationControls();
    });

    bg.on('pointerover', () => {
      bg.setFillStyle(this.emotionColor, 0.8);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(isSelected ? this.emotionColor : 0x4169E1, isSelected ? 1 : 0.6);
    });

    return container;
  }

  private createNameInput(): void {
    const x = this.scale.width / 2;
    const y = 880;

    // Player name
    this.add
      .text(x - 250, y - 40, 'Your Name:', {
        fontSize: '24px',
        color: '#FFD700',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    const nameBox = this.add
      .rectangle(x - 250, y + 20, 300, 55, 0x0f3460, 0.8)
      .setStrokeStyle(3, 0xffffff, 0.5)
      .setInteractive({ useHandCursor: true });

    this.nameText = this.add
      .text(x - 250, y + 20, 'Click here...', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Merriweather, serif',
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    nameBox.on('pointerdown', async () => {
      const name = await this.showTextInputModal(
        'Choose Your Name',
        'Enter your character name...',
        'This is how you will be addressed throughout your journey in the Realm of Emotions. Choose a name that feels right to you.',
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
      .text(x + 250, y - 40, "Companion's Name:", {
        fontSize: '24px',
        color: '#9370DB',
        fontFamily: 'Raleway, sans-serif',
      })
      .setOrigin(0.5);

    const companionBox = this.add
      .rectangle(x + 250, y + 20, 300, 55, 0x0f3460, 0.8)
      .setStrokeStyle(3, 0x9370db, 0.5)
      .setInteractive({ useHandCursor: true });

    this.companionNameText = this.add
      .text(x + 250, y + 20, 'Click here...', {
        fontSize: '20px',
        color: '#9370db',
        fontFamily: 'Merriweather, serif',
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    companionBox.on('pointerdown', async () => {
      const name = await this.showTextInputModal(
        'Name Your Mystical Companion',
        'Enter a name or leave blank for "Lumina"...',
        'Your companion will guide you through the Realm of Emotions, offering wisdom and support. Choose a name that resonates with you.',
        0,
        this.companionName === 'Lumina' ? '' : this.companionName
      );
      const companionName = name && name.trim() ? name.trim() : 'Lumina';
      this.companionName = companionName;
      this.companionNameText.setText(companionName).setAlpha(1);
    });

    // Set default
    this.companionName = 'Lumina';
    this.companionNameText.setText('Lumina').setAlpha(0.7);
  }

  private createCompleteButton(): void {
    const button = this.createButton(
      this.scale.width / 2,
      1000,
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
    });
  }

  private async completeCharacterCreation(): Promise<void> {
    if (!this.playerName) {
      // Show error
      const errorText = this.add
        .text(this.scale.width / 2, 950, 'Please enter your name!', {
          fontSize: '24px',
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
