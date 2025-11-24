import React, { useEffect, useRef, useState } from 'react';

interface ReadyPlayerMeAvatarProps {
  isOpen: boolean;
  onAvatarCreated: (avatarUrl: string) => void;
  onClose: () => void;
}

export const ReadyPlayerMeAvatar: React.FC<ReadyPlayerMeAvatarProps> = ({
  isOpen,
  onAvatarCreated,
  onClose,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      // Ready Player Me sends messages when avatar is created
      if (event.data?.source === 'readyplayerme') {
        if (event.data.eventName === 'v1.avatar.exported') {
          const avatarUrl = event.data.data.url;
          console.log('✅ Avatar created:', avatarUrl);
          onAvatarCreated(avatarUrl);
        } else if (event.data.eventName === 'v1.frame.ready') {
          setIsLoading(false);
          console.log('✅ Ready Player Me frame loaded');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen, onAvatarCreated]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 15, 10, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2C1810 0%, #1A0F08 100%)',
          padding: '20px 40px',
          borderRadius: '12px 12px 0 0',
          maxWidth: '800px',
          width: '90%',
          border: '3px solid #D4AF37',
          borderBottom: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            color: '#F4E5B8',
            fontSize: '28px',
            fontFamily: 'Cinzel, serif',
            margin: 0,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
          }}
        >
          Create Your Avatar
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #5C4A3A 0%, #3D2F24 100%)',
            color: '#D4C5B0',
            border: '2px solid #5C4A3A',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
            fontSize: '16px',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #3D2F24 0%, #2C1F18 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #5C4A3A 0%, #3D2F24 100%)';
          }}
        >
          Skip for Now
        </button>
      </div>

      {/* iframe container */}
      <div
        style={{
          background: '#000000',
          maxWidth: '800px',
          width: '90%',
          height: '600px',
          border: '3px solid #D4AF37',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#F4E5B8',
              fontSize: '20px',
              fontFamily: 'Cinzel, serif',
              textAlign: 'center',
            }}
          >
            Loading Avatar Creator...
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="https://demo.readyplayer.me/avatar?frameApi"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allow="camera *; microphone *"
        />
      </div>

      {/* Instructions */}
      <div
        style={{
          marginTop: '20px',
          maxWidth: '800px',
          width: '90%',
          padding: '16px',
          background: 'rgba(44, 24, 16, 0.8)',
          border: '2px solid #5C4A3A',
          borderRadius: '8px',
          color: '#D4C5B0',
          fontFamily: 'Crimson Text, serif',
          fontSize: '16px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: '0 0 8px 0' }}>
          🎭 Customize your adventurer's appearance using the avatar creator above
        </p>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
          Your avatar will be saved and used throughout your journey
        </p>
      </div>
    </div>
  );
};
