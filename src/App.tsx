/**
 * Main App Component
 * Root React component that initializes the game
 */

import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './game/config/gameConfig';
import { BootScene } from './game/scenes/BootScene';
import { MainMenuScene } from './game/scenes/MainMenuScene';
import { AgeSelectionScene } from './game/scenes/AgeSelectionScene';
import { CharacterCreationScene } from './game/scenes/CharacterCreationScene';
import { HubScene } from './game/scenes/HubScene';
import { Module1AwakeningCircle } from './game/scenes/Module1AwakeningCircle';
import { Module2MemoryConstellation } from './game/scenes/Module2MemoryConstellation';
import { Module3TempleEmbodiment } from './game/scenes/Module3TempleEmbodiment';
import { Module4SpeakingStone } from './game/scenes/Module4SpeakingStone';
import { Module5MirrorPortal } from './game/scenes/Module5MirrorPortal';
import { Module6CatharticFalls } from './game/scenes/Module6CatharticFalls';
import { Module7EmotionalCompass } from './game/scenes/Module7EmotionalCompass';
import { Module8WisdomTree } from './game/scenes/Module8WisdomTree';
import { Module9RipplePool } from './game/scenes/Module9RipplePool';
import { CompanionChat } from './components/CompanionChat';
import { CompanionChatButton } from './components/CompanionChatButton';
import { TextInputModal } from './components/TextInputModal';
import { ReadyPlayerMeAvatar } from './components/ReadyPlayerMeAvatar';
import { useCompanionStore } from './stores/companionStore';
import { usePlayerStore } from './stores/playerStore';
import { useModalStore } from './stores/modalStore';
import { useAvatarStore } from './stores/avatarStore';
import './App.css';

function App() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const playerProfile = usePlayerStore((state) => state.profile);
  const { initializeCompanion } = useCompanionStore();
  const modalState = useModalStore();
  const avatarState = useAvatarStore();

  useEffect(() => {
    // Initialize Phaser game
    if (!gameRef.current) {
      const config = {
        ...gameConfig,
        scene: [
          BootScene,
          MainMenuScene,
          AgeSelectionScene,
          CharacterCreationScene,
          HubScene,
          Module1AwakeningCircle,
          Module2MemoryConstellation,
          Module3TempleEmbodiment,
          Module4SpeakingStone,
          Module5MirrorPortal,
          Module6CatharticFalls,
          Module7EmotionalCompass,
          Module8WisdomTree,
          Module9RipplePool,
        ],
      };

      gameRef.current = new Phaser.Game(config);

      // Expose game to window for Playwright testing
      (window as any).game = gameRef.current;

      console.log('🎮 Phaser game initialized');
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Initialize companion when player profile is available
  useEffect(() => {
    if (playerProfile && !useCompanionStore.getState().state) {
      const companionName = playerProfile.companionName || 'Lumina';
      initializeCompanion(playerProfile.id, companionName);
      console.log('💜 Companion initialized:', companionName);
    }
  }, [playerProfile, initializeCompanion]);

  return (
    <div className="app-container">
      {/* Phaser game renders into this div */}
      <div id="phaser-game-container" />

      {/* React UI overlay */}
      <div className="ui-overlay">
        {/* Companion Chat Interface */}
        {playerProfile && (
          <>
            <CompanionChatButton
              onClick={() => setIsChatOpen(true)}
              isOpen={isChatOpen}
            />
            <CompanionChat
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          </>
        )}
      </div>

      {/* Text Input Modal */}
      <TextInputModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        placeholder={modalState.placeholder}
        initialValue={modalState.initialValue}
        guidance={modalState.guidance}
        onSubmit={(value) => modalState.onSubmit?.(value)}
        onCancel={() => modalState.onCancel?.()}
      />

      {/* Ready Player Me Avatar Creator */}
      <ReadyPlayerMeAvatar
        isOpen={avatarState.isAvatarCreatorOpen}
        onAvatarCreated={(url) => {
          avatarState.setAvatarUrl(url);
          avatarState.closeAvatarCreator();
        }}
        onClose={() => avatarState.closeAvatarCreator()}
      />
    </div>
  );
}

export default App;
