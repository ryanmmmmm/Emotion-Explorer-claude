import React, { useState, useEffect } from 'react';

interface TextInputModalProps {
  isOpen: boolean;
  title: string;
  placeholder: string;
  initialValue: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export const TextInputModal: React.FC<TextInputModalProps> = ({
  isOpen,
  title,
  placeholder,
  initialValue,
  onSubmit,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
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
          maxWidth: '540px',
          width: '90%',
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
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
