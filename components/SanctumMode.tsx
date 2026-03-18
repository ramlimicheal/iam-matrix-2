import React, { useEffect, useState, useRef } from 'react';
import { MatrixEntry } from '../types';
import { X, Volume2, VolumeX, Headphones } from 'lucide-react';
import { Button } from './Button';

interface SanctumModeProps {
  entries: MatrixEntry[];
  onExit: () => void;
}

export const SanctumMode: React.FC<SanctumModeProps> = ({ entries, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false); // Controls fade in/out of text
  const [bgImage, setBgImage] = useState('');
  
  // Audio State
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Cycle entries
  useEffect(() => {
    if (entries.length === 0) return;

    // Initial Load
    updateBackground();
    setVisible(true);

    const intervalId = setInterval(() => {
      setVisible(false); // Fade out

      setTimeout(() => {
        // Change content after fade out
        setCurrentIndex((prev) => (prev + 1) % entries.length);
        updateBackground();
        setVisible(true); // Fade in
      }, 1000); 

    }, 8000); // 8 seconds per slide

    return () => clearInterval(intervalId);
  }, [entries.length]);

  // Audio Cleanup
  useEffect(() => {
    return () => {
      stopBinauralBeat();
    };
  }, []);

  // Handle Sound Toggle
  useEffect(() => {
    if (soundEnabled) {
      startBinauralBeat();
    } else {
      stopBinauralBeat();
    }
  }, [soundEnabled]);

  const updateBackground = () => {
    const seed = Math.floor(Math.random() * 1000);
    setBgImage(`https://picsum.photos/seed/${seed}/1920/1080?grayscale&blur=2`);
  };

  const startBinauralBeat = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.1;
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;

      // Binaural Beat: 200Hz (L) & 205Hz (R) = 5Hz Theta
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 200;

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 205;

      const panner1 = ctx.createStereoPanner();
      panner1.pan.value = -1;

      const panner2 = ctx.createStereoPanner();
      panner2.pan.value = 1;

      osc1.connect(panner1).connect(gainNode);
      osc2.connect(panner2).connect(gainNode);

      osc1.start();
      osc2.start();

      oscillatorsRef.current = [osc1, osc2];

    } catch (e) {
      console.error("Audio initialization failed", e);
      setSoundEnabled(false);
    }
  };

  const stopBinauralBeat = () => {
    oscillatorsRef.current.forEach(osc => osc.stop());
    oscillatorsRef.current = [];
    if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
    }
  };

  if (entries.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center text-primary">
        <div className="text-center">
          <p className="mb-4 text-muted">The Matrix is empty.</p>
          <Button onClick={onExit}>Return to Grid</Button>
        </div>
      </div>
    );
  }

  const currentEntry = entries[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] opacity-30"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

      {/* Controls */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        {soundEnabled && (
            <div className="hidden md:flex items-center gap-2 text-accent animate-pulse text-xs tracking-widest uppercase">
                <Headphones className="w-4 h-4" />
                <span>Binaural Theta Active</span>
            </div>
        )}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-3 rounded-full backdrop-blur-md transition-colors ${soundEnabled ? 'bg-accent/20 text-accent' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
          title="Toggle Binaural Audio"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button 
          onClick={onExit}
          className="p-3 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-5xl px-8 text-center transition-all duration-1000 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* The Declaration */}
        <h1 className="font-serif text-3xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 mb-16 tracking-wide leading-tight drop-shadow-2xl">
          {currentEntry.declaration}
        </h1>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mt-8 pt-8 border-t border-white/10">
          
          <div className="space-y-3 opacity-90">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Evidence</span>
            <p className="text-gray-300 font-light text-lg leading-relaxed">"{currentEntry.evidence}"</p>
          </div>

          <div className="space-y-3 opacity-90">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent-purple font-bold">Action</span>
            <p className="text-gray-300 font-light text-lg leading-relaxed">I will {currentEntry.action.toLowerCase()}</p>
          </div>

          <div className="space-y-3 opacity-90">
            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold">Gratitude</span>
            <p className="text-gray-300 font-light text-lg leading-relaxed">{currentEntry.gratitude}</p>
          </div>

        </div>
      </div>

      {/* Progress */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
        {entries.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-12 bg-white' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>

    </div>
  );
};