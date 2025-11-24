/**
 * Companion Chat Component
 * Real-time chat interface with AI companion using Claude LLM
 */

import { useState, useEffect, useRef } from 'react';
import { useCompanionStore } from '@/stores/companionStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameProgressStore } from '@/stores/gameProgressStore';
import './CompanionChat.css';

interface CompanionChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanionChat: React.FC<CompanionChatProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { state: companionState, sendMessage, isTyping } = useCompanionStore();
  const playerProfile = usePlayerStore((state) => state.profile);
  const progress = useGameProgressStore((state) => state.progress);

  const messages = companionState?.conversationHistory || [];
  const companionName = playerProfile?.companionName || 'Companion';

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      // Get current context with full awareness
      const currentSession = progress?.currentSession;
      const context = {
        currentEmotion: currentSession?.emotionId,
        currentModule: currentSession?.currentModule || 0,
        playerAge: playerProfile?.age,
        playerMood: 'engaged', // Could track this
        recentPlayerWriting: undefined, // TODO: Pass recent module writings for better context
      };

      await sendMessage(userMessage, context);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="companion-chat-overlay">
      <div className="companion-chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="companion-avatar">
            <div className="companion-glow"></div>
            <div className="companion-body"></div>
          </div>
          <div className="chat-header-text">
            <h2>{companionName}</h2>
            <p className="companion-status">
              {isTyping ? 'Typing...' : 'Here to support you'}
            </p>
          </div>
          <button className="chat-close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <p>
                Hello! I'm {companionName}, your emotional guide.
              </p>
              <p>
                I'm here to support you as you explore your feelings.
                Share what's on your mind, and I'll listen without judgment.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === 'player' ? 'user-message' : 'companion-message'}`}
              >
                {msg.sender === 'companion' && (
                  <div className="message-avatar">
                    <div className="small-companion"></div>
                  </div>
                )}
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {msg.sender === 'player' && (
                  <div className="message-avatar user-avatar">
                    <div className="user-initial">
                      {playerProfile?.name?.charAt(0).toUpperCase() || 'Y'}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {isTyping && (
            <div className="message companion-message">
              <div className="message-avatar">
                <div className="small-companion pulsing"></div>
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-container">
          <textarea
            className="chat-input"
            placeholder="Share your thoughts..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            rows={2}
          />
          <button
            className="chat-send-button"
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? '...' : '→'}
          </button>
        </div>

        {/* Help text */}
        <div className="chat-footer">
          <p className="help-text">
            💜 All conversations are private and safe
          </p>
        </div>
      </div>
    </div>
  );
};
