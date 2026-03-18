import React, { useState, useEffect } from 'react';
import { INITIAL_DOMAINS, INITIAL_ENTRIES } from './constants';
import { MatrixEntry } from './types';
import { MatrixGrid } from './components/MatrixGrid';
import { SanctumMode } from './components/SanctumMode';
import { UpgradeModal } from './components/UpgradeModal';
import { LayoutGrid, Eye, Zap, Shield, Crown } from 'lucide-react';
import { Button } from './components/Button';

const MAX_FREE_ENTRIES = 5;

const App: React.FC = () => {
  const [entries, setEntries] = useState<MatrixEntry[]>(() => {
    const saved = localStorage.getItem('matrix_entries');
    return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
  });

  const [mode, setMode] = useState<'grid' | 'sanctum'>('grid');
  const [isPremium, setIsPremium] = useState<boolean>(() => {
     return localStorage.getItem('matrix_premium') === 'true';
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('matrix_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('matrix_premium', String(isPremium));
  }, [isPremium]);

  const handleUpdateEntry = (updatedEntry: MatrixEntry) => {
    setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleAddEntry = (domainId: string) => {
    if (!isPremium && entries.length >= MAX_FREE_ENTRIES) {
        setShowUpgradeModal(true);
        return;
    }

    const newEntry: MatrixEntry = {
      id: crypto.randomUUID(),
      domainId,
      declaration: '',
      evidence: '',
      action: '',
      gratitude: ''
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const handleUpgrade = () => {
      setTimeout(() => {
          setIsPremium(true);
          setShowUpgradeModal(false);
          alert("Welcome, Architect. The Matrix is now fully unlocked.");
      }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-primary font-sans selection:bg-accent/30 selection:text-white">
      
      {/* Header - Neat & Minimal */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40">
        <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between px-6">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center shadow-sm">
               <div className="w-3 h-3 bg-primary rounded-full" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-wide text-primary leading-none">MATRIX</h1>
              <p className="text-[10px] text-muted font-medium tracking-[0.2em] uppercase">Architect</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
              <button 
                onClick={() => setMode('grid')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted hover:text-primary'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Grid</span>
              </button>
              <button 
                onClick={() => setMode('sanctum')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'sanctum' ? 'bg-background shadow-sm text-primary' : 'text-muted hover:text-primary'}`}
              >
                <Eye className="w-4 h-4" />
                <span>Sanctum</span>
              </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            
            {/* Status / Upgrade */}
            {!isPremium ? (
                 <button 
                    onClick={() => setShowUpgradeModal(true)} 
                    className="hidden md:flex items-center gap-2 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20"
                 >
                    <Zap className="w-3 h-3" />
                    {entries.length}/{MAX_FREE_ENTRIES} Active
                 </button>
            ) : (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-bold uppercase tracking-wider">
                    <Crown className="w-3 h-3" />
                    Architect
                </div>
            )}
            
            <div className="h-4 w-px bg-border hidden md:block" />
            
            <button 
                className="text-muted hover:text-primary transition-colors"
                title="Echo Chamber (Extension)"
            >
                <Shield className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="pt-24 px-4 md:px-6 h-screen overflow-hidden flex flex-col">
        {mode === 'grid' ? (
          <div className="h-full overflow-y-auto">
             <div className="max-w-[1600px] mx-auto mb-8 flex items-end justify-between">
                <div>
                   <h2 className="text-2xl font-bold text-primary">Your Matrix</h2>
                   <p className="text-muted mt-1 text-sm">Design the blueprint of your new reality.</p>
                </div>
                {/* Mobile Upgrade Button */}
                {!isPremium && (
                   <Button size="sm" variant="accent" onClick={() => setShowUpgradeModal(true)} className="md:hidden">
                      Upgrade Plan
                   </Button>
                )}
             </div>
             
             <MatrixGrid 
                entries={entries} 
                domains={INITIAL_DOMAINS} 
                onUpdateEntry={handleUpdateEntry}
                onDeleteEntry={handleDeleteEntry}
                onAddEntry={handleAddEntry}
             />
          </div>
        ) : (
          <div className="fixed inset-0 top-0 pt-0 z-50">
             <SanctumMode 
                entries={entries.filter(e => e.declaration.trim() !== '')} 
                onExit={() => setMode('grid')} 
             />
          </div>
        )}
      </main>

      {showUpgradeModal && (
        <UpgradeModal 
            onClose={() => setShowUpgradeModal(false)}
            onUpgrade={handleUpgrade}
        />
      )}

    </div>
  );
};

export default App;