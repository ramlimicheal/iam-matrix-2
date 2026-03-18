import React from 'react';
import { X, Crown, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-in">
        
        {/* Header Image/Gradient */}
        <div className="h-32 bg-gradient-to-br from-surface to-surface-hover relative overflow-hidden flex items-center justify-center border-b border-border">
           <div className="absolute inset-0 bg-accent-purple/5" />
           <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center z-10 shadow-lg">
              <Crown className="w-8 h-8 text-accent-purple" />
           </div>
           <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
           </button>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Upgrade to Architect</h2>
          <p className="text-muted text-sm mb-8 max-w-xs mx-auto">
            Break the limits of the Free Plan. Build an unlimited reality structure.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 gap-3 mb-8 text-left max-w-sm mx-auto">
             <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover/50 border border-border">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-primary">Unlimited Matrix Affirmations</span>
             </div>
             <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover/50 border border-border">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-primary">Advanced Weaver AI (Probing Mode)</span>
             </div>
             <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover/50 border border-border">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-primary">Full Sanctum & Echo Access</span>
             </div>
          </div>

          <Button 
            variant="solid" 
            size="lg" 
            onClick={onUpgrade}
            className="w-full py-6 text-base shadow-accent/20 shadow-lg hover:shadow-accent/30"
          >
            Unlock Architect Plan ($15/mo)
          </Button>
          
          <p className="mt-4 text-xs text-muted">
            Secure payment processing. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};