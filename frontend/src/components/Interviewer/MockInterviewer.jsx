import React, { useState, useRef, useEffect } from 'react';
import FeedbackPanel from './FeedbackPanel';

export default function MockInterviewer({ user, token, onActionTriggered }) {
  const [activeSession, setActiveSession] = useState(null);
  const [track, setTrack] = useState('Technical'); // Technical, HR
  const [gender, setGender] = useState('Female'); // Female, Male
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [muteSpeech, setMuteSpeech] = useState(false);
  const [completedFeedback, setCompletedFeedback] = useState(null);
  const [turnsCount, setTurnsCount] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Proctor State & Refs
  const [proctorLogs, setProctorLogs] = useState([]);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [proctorStatus, setProctorStatus] = useState('Camera Off');
  const [statusColor, setStatusColor] = useState('yellow');
  const [activeWarning, setActiveWarning] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const trackerTaskRef = useRef(null);
  const proctorLogsRef = useRef([]);
  const integrityScoreRef = useRef(100);
  const violationThrottles = useRef({});

  // Synchronize state refs for access inside asynchronous handlers
  useEffect(() => {
    proctorLogsRef.current = proctorLogs;
  }, [proctorLogs]);

  useEffect(() => {
    integrityScoreRef.current = integrityScore;
  }, [integrityScore]);

  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      console.warn('Browser speech recognition not supported.');
    } else {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setUserInput(transcript);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    // Stop speaking on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Monitor Fullscreen changes to enforce proctor integrity
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      // If active session is running and they exited fullscreen -> terminate!
      if (!isCurrentlyFullscreen && activeSession) {
        setActiveSession(null);
        if (synthRef.current) {
          synthRef.current.cancel();
        }
        alert('Proctor Notice: Interview terminated because you exited fullscreen mode.');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [activeSession]);

  // Helper to load tracking.js from CDN
  const loadProctorScripts = () => {
    return new Promise((resolve, reject) => {
      if (window.tracking) {
        resolve();
        return;
      }
      
      const existingScript = document.querySelector('script[src*="tracking-min.js"]');
      if (existingScript) {
        const checkInterval = setInterval(() => {
          if (window.tracking && window.tracking.ObjectTracker) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }

      const script1 = document.createElement('script');
      script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/tracking.js/1.1.3/tracking-min.js';
      script1.async = true;
      script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/tracking.js/1.1.3/data/face-min.js';
        script2.async = true;
        script2.onload = () => {
          resolve();
        };
        script2.onerror = (e) => reject(new Error('Failed to load tracking face data'));
        document.body.appendChild(script2);
      };
      script1.onerror = (e) => reject(new Error('Failed to load tracking.js'));
      document.body.appendChild(script1);
    });
  };

  // Helper to trigger and record proctor violations
  const triggerViolation = (type, message) => {
    const now = Date.now();
    if (violationThrottles.current[type] && now - violationThrottles.current[type] < 6000) {
      return;
    }
    violationThrottles.current[type] = now;

    let penalty = 10;
    if (type === 'tab_switch') penalty = 15;
    if (type === 'multiple_faces') penalty = 15;

    const nextScore = Math.max(0, integrityScoreRef.current - penalty);
    setIntegrityScore(nextScore);

    const logEntry = {
      type,
      message,
      timestamp: new Date()
    };
    setProctorLogs(prev => [...prev, logEntry]);
    setActiveWarning(message);

    setTimeout(() => {
      setActiveWarning(prev => prev === message ? null : prev);
    }, 4500);
  };

  const cleanupProctoring = () => {
    if (trackerTaskRef.current) {
      try {
        trackerTaskRef.current.stop();
      } catch (err) {
        console.warn('Error stopping tracker task', err);
      }
      trackerTaskRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(t => t.stop());
      } catch (err) {
        console.warn('Error stopping media tracks', err);
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setProctorStatus('Camera Off');
    setStatusColor('yellow');
    setActiveWarning(null);
  };

  // Proctoring camera monitoring engine
  useEffect(() => {
    let isMounted = true;

    if (!activeSession) {
      cleanupProctoring();
      return;
    }

    const startProctoring = async () => {
      try {
        setProctorStatus('Initializing...');
        setStatusColor('yellow');
        await loadProctorScripts();
        if (!isMounted) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false
        });
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && isMounted) {
              videoRef.current.play().catch(e => console.log('Play failed', e));
            }
          };
        }

        const tracker = new window.tracking.ObjectTracker('face');
        tracker.setInitialScale(1.25);
        tracker.setStepSize(1.75);
        tracker.setEdgesDensity(0.1);

        const task = window.tracking.track(videoRef.current, tracker);
        trackerTaskRef.current = task;

        let faceLastSeen = Date.now();

        tracker.on('track', (event) => {
          if (!canvasRef.current || !videoRef.current) return;
          const ctx = canvasRef.current.getContext('2d');
          
          if (canvasRef.current.width !== videoRef.current.offsetWidth) {
            canvasRef.current.width = videoRef.current.offsetWidth;
          }
          if (canvasRef.current.height !== videoRef.current.offsetHeight) {
            canvasRef.current.height = videoRef.current.offsetHeight;
          }

          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          const scaleX = canvasRef.current.width / videoRef.current.videoWidth;
          const scaleY = canvasRef.current.height / videoRef.current.videoHeight;

          if (event.data.length === 0) {
            const timeSinceLastSeen = Date.now() - faceLastSeen;
            if (timeSinceLastSeen > 7000) {
              setProctorStatus('Face Missing / Looked Away');
              setStatusColor('red');
              triggerViolation('no_face', 'Please look directly at the camera / Face missing');
            } else {
              setProctorStatus('Detecting Face...');
              setStatusColor('yellow');
            }
          } else {
            faceLastSeen = Date.now();
            if (event.data.length > 1) {
              setProctorStatus('Multiple Faces');
              setStatusColor('red');
              triggerViolation('multiple_faces', 'Multiple faces detected in frame');
            } else {
              setProctorStatus('Focus Locked');
              setStatusColor('green');
              setActiveWarning(null);
            }

            event.data.forEach((rect) => {
              const x = rect.x * scaleX;
              const y = rect.y * scaleY;
              const w = rect.width * scaleX;
              const h = rect.height * scaleY;

              ctx.strokeStyle = '#06b6d4';
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, w, h);

              ctx.fillStyle = '#06b6d4';
              ctx.fillRect(x, y, 8, 2);
              ctx.fillRect(x, y, 2, 8);
              ctx.fillRect(x + w - 8, y, 8, 2);
              ctx.fillRect(x + w - 2, y, 2, 8);
              ctx.fillRect(x, y + h - 2, 8, 2);
              ctx.fillRect(x, y + h - 8, 2, 8);
              ctx.fillRect(x + w - 8, y + h - 2, 8, 2);
              ctx.fillRect(x + w - 2, y + h - 8, 2, 8);
            });
          }
        });
      } catch (err) {
        console.error('Proctoring camera setup error:', err);
        setProctorStatus('Camera Blocked / Off');
        setStatusColor('red');
      }
    };

    startProctoring();

    const handleBlur = () => {
      triggerViolation('tab_switch', 'Focus warning: tab switch / window minimized detected');
    };
    window.addEventListener('blur', handleBlur);

    return () => {
      isMounted = false;
      window.removeEventListener('blur', handleBlur);
      cleanupProctoring();
    };
  }, [activeSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.chatHistory]);

  // Voice synthesis speaker
  const speakText = (text) => {
    if (!synthRef.current || muteSpeech) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    let selectedVoice = null;

    if (gender === 'Female') {
      selectedVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('zira') || 
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('hazel') ||
        v.name.toLowerCase().includes('google us english')
      );
    } else {
      selectedVoice = voices.find(v => 
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('david') || 
        v.name.toLowerCase().includes('george') ||
        v.name.toLowerCase().includes('google uk english male')
      );
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Speak AI questions
  useEffect(() => {
    if (activeSession?.chatHistory) {
      const history = activeSession.chatHistory;
      if (history.length > 0) {
        const lastMsg = history[history.length - 1];
        if (lastMsg.sender === 'AI') {
          setTimeout(() => speakText(lastMsg.message), 200);
        }
      }
    }
  }, [activeSession?.chatHistory, muteSpeech]);

  const handleStartInterview = async () => {
    setLoading(true);
    setCompletedFeedback(null);
    setTurnsCount(0);
    setProctorLogs([]);
    setIntegrityScore(100);
    proctorLogsRef.current = [];
    integrityScoreRef.current = 100;
    violationThrottles.current = {};
    
    try {
      const response = await fetch('http://localhost:5000/api/interviews/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type: track })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Could not start interview.');
      setActiveSession(data);

      // Trigger Fullscreen Proctored Mode
      setTimeout(async () => {
        try {
          if (containerRef.current) {
            if (containerRef.current.requestFullscreen) {
              await containerRef.current.requestFullscreen();
            } else if (containerRef.current.webkitRequestFullscreen) {
              await containerRef.current.webkitRequestFullscreen();
            }
          }
        } catch (fErr) {
          console.warn('Fullscreen request blocked by browser restrictions:', fErr.message);
        }
      }, 100);

    } catch (err) {
      console.error(err);
      // Fallback
      setActiveSession({
        _id: 'mock_session_123',
        type: track,
        status: 'in_progress',
        chatHistory: [{
          sender: 'AI',
          message: track === 'HR' 
            ? "Welcome. Tell me about a time you handled a critical disagreement with a senior manager." 
            : `Hello. Let us discuss systems. In a high-traffic ${user?.targetRole || 'Software Development'} role, how do you handle cache coherence if DB records get updated frequently?`
        }]
      });

      // Try triggering fallback fullscreen anyway
      setTimeout(async () => {
        try {
          if (containerRef.current?.requestFullscreen) {
            await containerRef.current.requestFullscreen();
          }
        } catch (fErr) {
          console.warn('Fallback fullscreen blocked:', fErr.message);
        }
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleSendResponse = async () => {
    if (!userInput.trim()) return;

    const input = userInput;
    setUserInput('');
    setTurnsCount(prev => prev + 1);

    if (synthRef.current) synthRef.current.cancel();

    // Optimistically update local UI transcript
    const updatedHistory = [
      ...activeSession.chatHistory,
      { sender: 'Candidate', message: input }
    ];
    setActiveSession({ ...activeSession, chatHistory: updatedHistory });

    try {
      const response = await fetch(`http://localhost:5000/api/interviews/session/${activeSession._id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Fail in AI exchange.');
      
      setActiveSession({
        ...activeSession,
        chatHistory: data.chatHistory
      });
    } catch (err) {
      console.error(err);
      // Fallback simulation
      setTimeout(() => {
        const fallbackAiMsg = turnsCount === 0 
          ? "Good approach. Could you elaborate on what specific consistency models (like strong consistency vs eventual consistency) apply to that setup?"
          : "Understood. That explains your approach clearly. We are ready to compile your results. Please click 'Complete Evaluation' below.";
        
        setActiveSession(prev => ({
          ...prev,
          chatHistory: [
            ...prev.chatHistory,
            { sender: 'Candidate', message: input },
            { sender: 'AI', message: fallbackAiMsg }
          ]
        }));
      }, 800);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setUserInput('');
      recognitionRef.current.start();
    }
  };

  const handleExitInterview = () => {
    // Programmatically close fullscreen, triggers listener which terminates session
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    ) {
      const exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
      if (exitFs) {
        exitFs.call(document).catch(err => console.log('Fullscreen exit error:', err));
      }
    }
    cleanupProctoring();
    setActiveSession(null);
    if (synthRef.current) synthRef.current.cancel();
  };

  const handleCompleteInterview = async () => {
    setLoading(true);
    if (synthRef.current) synthRef.current.cancel();
    
    // Exit Fullscreen programmatically
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.log('Error exiting fullscreen:', err);
      }
    }

    cleanupProctoring();

    try {
      const response = await fetch(`http://localhost:5000/api/interviews/session/${activeSession._id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          proctorLogs: proctorLogsRef.current,
          integrityScore: integrityScoreRef.current
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failure finalizing interview.');
      
      setCompletedFeedback(data.feedback);
      setActiveSession(null);
      if (onActionTriggered) onActionTriggered();
    } catch (err) {
      console.error(err);
      // Fallback
      const finalLogs = proctorLogsRef.current;
      const finalScore = integrityScoreRef.current;
      
      let fallbackFeedback = {
        overallScore: 68,
        whyDidIFail: track === 'HR'
          ? "You failed to fully structure your answers using the STAR format. The situation description was clear, but you did not focus enough on your personal actions or outline direct metrics regarding the 20% speedup."
          : "You failed to handle the cache stampede edge cases. While Write-Through cache handles write latency, simultaneous reads on a missing index will cause database overload, showing gaps in scaling fundamentals.",
        categories: {
          technicalAccuracy: 60,
          communication: 75,
          structureAndApproach: 68
        },
        actionableTips: [
          "Use the STAR model explicitly for behavioral queries.",
          "Read up on mutex locks for cache-stampede avoidance.",
          "Describe resource budgets in architectural layouts."
        ],
        integrityScore: finalScore,
        proctorLogs: finalLogs
      };

      if (finalScore < 85) {
        const penalty = Math.round((100 - finalScore) * 0.4);
        fallbackFeedback.categories.technicalAccuracy = Math.max(30, fallbackFeedback.categories.technicalAccuracy - penalty);
        fallbackFeedback.categories.communication = Math.max(30, fallbackFeedback.categories.communication - penalty);
        fallbackFeedback.categories.structureAndApproach = Math.max(30, fallbackFeedback.categories.structureAndApproach - penalty);
        fallbackFeedback.overallScore = Math.round((fallbackFeedback.categories.technicalAccuracy + fallbackFeedback.categories.communication + fallbackFeedback.categories.structureAndApproach) / 3);
        
        fallbackFeedback.whyDidIFail += `\n\n[Proctor Integrity Notice] Your overall assessment score was penalized because the system detected multiple integrity violations (Integrity Score: ${finalScore}%). Specifically, we logged: ${finalLogs.map(l => l.message).join(', ') || 'unspecified camera/focus issues'}. In a professional recruitment environment, these flags would result in immediate disqualification.`;
        
        fallbackFeedback.actionableTips.push("Maintain constant eye contact with the screen and camera during interviews.");
        fallbackFeedback.actionableTips.push("Do not switch tabs, minimize the window, or navigate away from the active browser tab.");
        fallbackFeedback.actionableTips.push("Ensure you are alone in a well-lit room to avoid multiple face detections.");
      }

      setCompletedFeedback(fallbackFeedback);
      setActiveSession(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className={activeSession ? 'proctored-fullscreen-overlay' : 'glass-container'}>
      <div className={activeSession ? '' : 'practice-container'}>
        {/* Chat / Setup Screen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!activeSession && !completedFeedback && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 2.5rem' }}>
              <div style={{ fontSize: '3rem', animation: 'float 4s ease-in-out infinite', marginBottom: '1rem' }}>🎙️</div>
              <h2>AI Voice Interview Proctored Mode</h2>
              <p style={{ marginBottom: '2rem' }}>
                Start a simulated interview. To prevent interruptions, starting the session will lock the browser to **fullscreen proctored mode**.
              </p>
              
              {/* Type Selection */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button 
                  className={`btn ${track === 'Technical' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTrack('Technical')}
                >
                  Technical Track
                </button>
                <button 
                  className={`btn ${track === 'HR' ? 'btn-accent' : 'btn-secondary'}`}
                  onClick={() => setTrack('HR')}
                >
                  HR & Behavioral Track
                </button>
              </div>

              {/* Interviewer Persona Selection */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Choose AI Interviewer Persona:</h4>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button 
                    className="btn" 
                    style={{ 
                      flex: '0 1 200px',
                      borderColor: gender === 'Female' ? 'var(--primary)' : 'var(--glass-border)',
                      background: gender === 'Female' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: '#fff'
                    }}
                    onClick={() => setGender('Female')}
                  >
                    👩 Executive (Female Voice)
                  </button>
                  <button 
                    className="btn" 
                    style={{ 
                      flex: '0 1 200px',
                      borderColor: gender === 'Male' ? 'var(--secondary)' : 'var(--glass-border)',
                      background: gender === 'Male' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: '#fff'
                    }}
                    onClick={() => setGender('Male')}
                  >
                    👨 Executive (Male Voice)
                  </button>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '250px' }} onClick={handleStartInterview} disabled={loading}>
                {loading ? 'Powering Voice API...' : 'Enter Fullscreen & Start'}
              </button>
            </div>
          )}

          {activeSession && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '90vh', padding: 0, border: 'none', background: 'transparent' }}>
              
              {/* Header bar with controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--accent)' }}>🔒 PROCTORED SCREEN ACTIVE</h4>
                  <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                    {activeSession.type} Track • Fullscreen Mode
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                    onClick={() => setMuteSpeech(!muteSpeech)}
                  >
                    {muteSpeech ? '🔈 Unmute' : '🔇 Mute'}
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: 'var(--danger)', color: '#fff' }} 
                    onClick={handleExitInterview}
                  >
                    Exit Fullscreen & Stop
                  </button>
                </div>
              </div>

              {/* Boardroom Interview Environment */}
              <div className="interview-environment">
                {/* Office backdrop details */}
                <div className="office-window">
                  <div className="office-cityline" />
                </div>
                <div className="office-shelf" />
                <div className="office-plant" />

                {/* Candidate Proctor Video Feed */}
                <div className="proctor-cam-container">
                  <video ref={videoRef} className="proctor-video" muted playsInline />
                  <canvas ref={canvasRef} className="proctor-canvas" />
                  
                  <div className="proctor-badge">
                    <span className={`status-dot ${statusColor}`} />
                    <span>{proctorStatus}</span>
                  </div>

                  {activeWarning && (
                    <div className="proctor-hud-alert">
                      ⚠️ {activeWarning}
                    </div>
                  )}
                </div>

                {/* Full-body interviewer wrapper */}
                <div className={`interviewer-wrapper ${isSpeaking ? 'speaking' : ''}`}>
                  {/* Head */}
                  <div className="cartoon-face">
                    <div className={`cartoon-hair ${gender === 'Female' ? 'female' : 'male'}`} />
                    <div className="cartoon-eyes">
                      <div className="cartoon-eye"><div className="pupil" /></div>
                      <div className="cartoon-eye"><div className="pupil" /></div>
                    </div>
                    <div className="cartoon-blush">
                      <div className="blush-spot" />
                      <div className="blush-spot" />
                    </div>
                    <div className="cartoon-mouth" />
                  </div>
                  
                  {/* Neck */}
                  <div className="interviewer-neck" />
                  
                  {/* Torso/Suit */}
                  <div className={`interviewer-suit ${gender === 'Female' ? 'female' : 'male'}`} />
                </div>

                {/* Desk Foreground */}
                <div className="office-desk">
                  <div className="desk-laptop" />
                </div>
              </div>

              {/* Chat history logs */}
              <div className="chat-messages" style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
                {activeSession.chatHistory.map((chat, idx) => (
                  <div key={idx} className={`chat-bubble ${chat.sender === 'AI' ? 'ai' : 'candidate'}`}>
                    <strong>{chat.sender === 'AI' ? 'Interviewer' : 'You'}:</strong>
                    <p style={{ marginTop: '0.2rem', color: '#fff' }}>{chat.message}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Recording waveform indicator */}
              {isListening && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', background: 'rgba(139, 92, 246, 0.08)', borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulseGlow 1s infinite' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                    Capturing audio... Speak your answer now.
                  </span>
                  
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center', marginLeft: 'auto' }}>
                    <div style={{ width: '3px', height: '12px', background: 'var(--primary)', animation: 'float 0.8s infinite' }} />
                    <div style={{ width: '3px', height: '24px', background: 'var(--primary)', animation: 'float 0.5s infinite 0.1s' }} />
                    <div style={{ width: '3px', height: '16px', background: 'var(--primary)', animation: 'float 0.7s infinite 0.2s' }} />
                    <div style={{ width: '3px', height: '8px', background: 'var(--primary)', animation: 'float 0.6s infinite 0.3s' }} />
                  </div>
                </div>
              )}

              {/* User Voice Input control bar */}
              <div className="chat-input-bar" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    className="glass-input" 
                    style={{ flex: 1, height: '48px', paddingRight: '45px' }} 
                    placeholder={!speechSupported 
                      ? "Speech Recognition not supported in this browser. Please type here..." 
                      : isListening 
                        ? "Transcribing your response..." 
                        : "Click microphone to record, or type details here..."
                    }
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendResponse()}
                    disabled={isListening}
                  />
                  {speechSupported && (
                    <button 
                      className="btn" 
                      style={{ 
                        position: 'absolute',
                        right: '5px',
                        background: isListening ? 'red' : 'rgba(255,255,255,0.06)', 
                        border: '1px solid var(--glass-border)', 
                        color: '#fff',
                        borderRadius: '50%',
                        width: '38px',
                        height: '38px',
                        padding: 0,
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isListening ? '0 0 10px red' : 'none'
                      }} 
                      onClick={toggleListening}
                    >
                      🎙️
                    </button>
                  )}
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ height: '48px', padding: '0 1.5rem' }} 
                  onClick={handleSendResponse} 
                  disabled={isListening || !userInput.trim()}
                >
                  Submit Spoken Response
                </button>
              </div>

              {/* Final evaluation triggers */}
              <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                <button className="btn btn-accent" style={{ width: '80%' }} onClick={handleCompleteInterview} disabled={isListening}>
                  Complete Evaluation & Compile Feedback
                </button>
              </div>
            </div>
          )}

          {completedFeedback && (
            <FeedbackPanel feedback={completedFeedback} onReset={() => setCompletedFeedback(null)} />
          )}
        </div>

        {/* Informative Side Cards */}
        {!activeSession && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card">
              <h4>Proctored Fullscreen Tips</h4>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Enforced Fullscreen:</strong> Once started, you cannot switch tabs. Swiping or hitting `ESC` will exit fullscreen and **terminate the interview session immediately**.</li>
                <li><strong>Microphone Permissions:</strong> Ensure your microphone is allowed so that the transcriber works properly.</li>
              </ul>
            </div>

            <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))' }}>
              <h4>Why Did I Fail? Feedback</h4>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Proctored scores evaluate consistency and confidence levels. Read recovery tips on the dashboard after finishing the session.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
