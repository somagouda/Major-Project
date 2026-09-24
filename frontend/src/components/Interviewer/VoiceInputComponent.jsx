import React, { useState, useEffect, useRef } from 'react';

export default function VoiceInputComponent({ value, onChange, onSubmit, disabled }) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = (e) => {
        console.warn('Voice input error:', e.error);
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        onChange(transcript);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech start error:', e);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Recording Waveform Active Bar */}
      {isListening && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 1rem', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid var(--accent)', borderRadius: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulseGlow 1s infinite' }} />
          <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
            Microphone Active: Listening to your voice... Speak clearly.
          </span>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', marginLeft: 'auto' }}>
            <div style={{ width: '3px', height: '14px', background: 'var(--accent)', animation: 'float 0.8s infinite' }} />
            <div style={{ width: '3px', height: '22px', background: 'var(--accent)', animation: 'float 0.5s infinite 0.1s' }} />
            <div style={{ width: '3px', height: '16px', background: 'var(--accent)', animation: 'float 0.7s infinite 0.2s' }} />
          </div>
        </div>
      )}

      {/* Answer Text Area with Microphone Button */}
      <div style={{ position: 'relative' }}>
        <textarea
          className="glass-input"
          style={{ width: '100%', minHeight: '120px', paddingRight: '55px', resize: 'vertical' }}
          placeholder={
            !speechSupported
              ? "Speech Recognition API not supported in this browser. Please type your answer here..."
              : isListening
                ? "Recording voice transcript... You can also edit text manually."
                : "Type your answer or click the microphone button to record..."
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        {speechSupported && (
          <button
            type="button"
            className="btn"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: isListening ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
              border: '1px solid var(--glass-border)',
              color: '#fff',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              padding: 0,
              fontSize: '1.2rem',
              boxShadow: isListening ? '0 0 15px var(--accent)' : 'none',
              cursor: 'pointer'
            }}
            onClick={toggleListening}
            title={isListening ? "Stop Voice Recording" : "Start Voice Recording"}
          >
            🎙️
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {speechSupported ? "🎤 Voice input supported. Click Mic to toggle." : "⌨️ Text mode active."}
        </span>
        <button
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.75rem' }}
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
        >
          Submit Answer ➔
        </button>
      </div>
    </div>
  );
}
