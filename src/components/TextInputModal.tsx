import React, { useState, useEffect } from 'react';

interface TextInputModalProps {
  isOpen: boolean;
  title: string;
  placeholder: string;
  initialValue: string;
  guidance: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export const TextInputModal: React.FC<TextInputModalProps> = ({
  isOpen,
  title,
  placeholder,
  initialValue,
  guidance,
  onSubmit,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue);
  const isLongForm = guidance.length > 0; // Show textarea with parchment if guidance exists

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Only submit on Enter for short inputs (no guidance)
    if (!isLongForm && e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 15, 10, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #2C1810 0%, #1A0F08 100%)',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: isLongForm ? '720px' : '540px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '4px solid',
          borderImage: 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 50%, #D4AF37 100%) 1',
          boxShadow: `
            0 20px 60px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 40px rgba(212, 175, 55, 0.3)
          `,
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ornate corner decorations */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          width: '24px',
          height: '24px',
          borderTop: '3px solid #D4AF37',
          borderLeft: '3px solid #D4AF37',
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '24px',
          height: '24px',
          borderTop: '3px solid #D4AF37',
          borderRight: '3px solid #D4AF37',
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          width: '24px',
          height: '24px',
          borderBottom: '3px solid #D4AF37',
          borderLeft: '3px solid #D4AF37',
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          width: '24px',
          height: '24px',
          borderBottom: '3px solid #D4AF37',
          borderRight: '3px solid #D4AF37',
          opacity: 0.6,
        }} />

        <h2
          style={{
            color: '#F4E5B8',
            fontSize: '32px',
            marginBottom: '24px',
            fontFamily: 'Cinzel, serif',
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.4)',
            letterSpacing: '1px',
          }}
        >
          {title}
        </h2>

        {/* Guidance Text - shown only for long-form writing */}
        {guidance && (
          <div
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.08)',
              border: '2px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '24px',
              fontFamily: 'Crimson Text, serif',
              color: '#D4C5B0',
              fontSize: '16px',
              lineHeight: '1.8',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}>
              <span style={{
                fontSize: '20px',
                color: '#D4AF37',
                marginRight: '8px',
              }}>✨</span>
              <strong style={{
                color: '#F4E5B8',
                fontFamily: 'Cinzel, serif',
                fontSize: '18px',
                letterSpacing: '0.5px',
              }}>Guidance</strong>
            </div>
            <div dangerouslySetInnerHTML={{ __html: guidance }} />
          </div>
        )}

        {/* Parchment-styled textarea for long-form OR simple input for short answers */}
        {isLongForm ? (
          <div style={{
            position: 'relative',
            marginBottom: '28px',
          }}>
            {/* Parchment scroll background */}
            <div style={{
              position: 'absolute',
              top: -10,
              left: -10,
              right: -10,
              bottom: -10,
              background: `
                linear-gradient(to bottom,
                  rgba(244, 229, 184, 0.03) 0%,
                  rgba(244, 229, 184, 0.08) 50%,
                  rgba(244, 229, 184, 0.03) 100%)
              `,
              borderRadius: '12px',
              boxShadow: `
                inset 0 0 40px rgba(212, 175, 55, 0.15),
                0 4px 20px rgba(0, 0, 0, 0.3)
              `,
              border: '3px solid rgba(212, 175, 55, 0.3)',
              pointerEvents: 'none',
            }} />

            {/* Scroll decorations */}
            <div style={{
              position: 'absolute',
              top: -15,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '10px',
              background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5), transparent)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              bottom: -15,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '10px',
              background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5), transparent)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />

            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              autoFocus
              rows={10}
              style={{
                width: '100%',
                padding: '24px',
                fontSize: '17px',
                backgroundColor: 'rgba(244, 237, 213, 0.12)',
                color: '#F4E5B8',
                border: '2px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '8px',
                outline: 'none',
                fontFamily: 'Crimson Text, serif',
                boxSizing: 'border-box',
                resize: 'vertical',
                minHeight: '280px',
                lineHeight: '1.8',
                position: 'relative',
                zIndex: 1,
                background: `
                  linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px),
                  linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
                  linear-gradient(to bottom,
                    rgba(26, 15, 8, 0.7) 0%,
                    rgba(44, 24, 16, 0.7) 100%)
                `,
                backgroundSize: '20px 20px, 20px 20px, 100% 100%',
                boxShadow: `
                  inset 0 4px 12px rgba(0, 0, 0, 0.5),
                  inset 0 0 60px rgba(212, 175, 55, 0.08),
                  0 2px 8px rgba(0, 0, 0, 0.3)
                `,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#D4AF37';
                e.currentTarget.style.boxShadow = `
                  inset 0 4px 12px rgba(0, 0, 0, 0.5),
                  inset 0 0 60px rgba(212, 175, 55, 0.12),
                  0 0 20px rgba(212, 175, 55, 0.4)
                `;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                e.currentTarget.style.boxShadow = `
                  inset 0 4px 12px rgba(0, 0, 0, 0.5),
                  inset 0 0 60px rgba(212, 175, 55, 0.08),
                  0 2px 8px rgba(0, 0, 0, 0.3)
                `;
              }}
            />
          </div>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            autoFocus
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '18px',
              backgroundColor: 'rgba(26, 15, 8, 0.6)',
              color: '#F4E5B8',
              border: '2px solid #5C4A3A',
              borderRadius: '8px',
              outline: 'none',
              fontFamily: 'Crimson Text, serif',
              marginBottom: '28px',
              boxSizing: 'border-box',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.boxShadow = 'inset 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#5C4A3A';
              e.currentTarget.style.boxShadow = 'inset 0 2px 8px rgba(0, 0, 0, 0.5)';
            }}
          />
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '14px 28px',
              fontSize: '18px',
              background: 'linear-gradient(135deg, #5C4A3A 0%, #3D2F24 100%)',
              color: '#D4C5B0',
              border: '2px solid #5C4A3A',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              letterSpacing: '0.5px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #3D2F24 0%, #2C1F18 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #5C4A3A 0%, #3D2F24 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '14px 36px',
              fontSize: '18px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 50%, #D4AF37 100%)',
              color: '#2C1810',
              border: '2px solid #D4AF37',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
              fontWeight: 700,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.5px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #F4E5B8 0%, #D4AF37 50%, #F4E5B8 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 50%, #D4AF37 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
          >
            {isLongForm ? 'Submit Letter' : 'Confirm'}
          </button>
        </div>

        {/* Word count for long-form writing */}
        {isLongForm && value.length > 0 && (
          <div style={{
            marginTop: '16px',
            textAlign: 'center',
            fontSize: '14px',
            color: 'rgba(212, 197, 176, 0.7)',
            fontFamily: 'Crimson Text, serif',
            fontStyle: 'italic',
          }}>
            {value.split(/\s+/).filter(w => w.length > 0).length} words
          </div>
        )}
      </div>
    </div>
  );
};
