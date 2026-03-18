import React, { useState } from 'react';
import { generateWeaverSuggestion } from '../services/geminiService';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { Button } from './Button';
import { ColumnType } from '../types';

interface WeaverAssistantProps {
  onClose: () => void;
  contextColumn?: ColumnType;
  contextValue?: string;
  onApplySuggestion?: (text: string) => void;
}

export const WeaverAssistant: React.FC<WeaverAssistantProps> = ({ 
  onClose, 
  contextColumn, 
  contextValue,
  onApplySuggestion
}) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    const context = contextColumn 
      ? `The user is focused on the '${contextColumn}' column. Current input: "${contextValue}".`
      : "The user is in general planning mode.";
      
    const result = await generateWeaverSuggestion(context, query);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-slide-in">
        
        {/* Clean Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
               <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-primary text-sm">Weaver AI</h3>
              <p className="text-xs text-muted">Architect Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-background/50 min-h-[300px]">
          {!response ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-10">
              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-muted">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="max-w-xs space-y-2">
                <p className="text-primary font-medium">How can I help you build?</p>
                {contextColumn && (
                  <p className="text-xs text-muted">
                    Currently focusing on <span className="text-accent">{contextColumn}</span>. Ask me to refine your statement or recall evidence.
                  </p>
                )}
              </div>
              
              {/* Quick Prompts */}
              <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                 <button onClick={() => setQuery("Make this stronger and more present tense.")} className="text-xs border border-border rounded-full px-3 py-1 text-muted hover:text-primary hover:border-muted transition-colors">
                    Make it stronger
                 </button>
                 <button onClick={() => setQuery("Give me an example of evidence for this.")} className="text-xs border border-border rounded-full px-3 py-1 text-muted hover:text-primary hover:border-muted transition-colors">
                    Find Evidence
                 </button>
                 <button onClick={() => setQuery("Suggest a micro-action I can do today.")} className="text-xs border border-border rounded-full px-3 py-1 text-muted hover:text-primary hover:border-muted transition-colors">
                    Suggest Action
                 </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
               {/* User Query Bubble (Implied) */}
               
               {/* AI Response Bubble */}
               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center text-accent mt-1">
                      <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-3">
                      <div className="bg-surface border border-border rounded-lg rounded-tl-none p-4 text-sm text-primary leading-relaxed shadow-sm">
                         {response}
                      </div>
                      
                      {onApplySuggestion && (
                        <div className="flex gap-2">
                             <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    const match = response.match(/"([^"]+)"/);
                                    onApplySuggestion(match ? match[1] : response);
                                    onClose();
                                }}
                              >
                                Insert Suggestion
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setResponse(null)}>
                                Ask something else
                              </Button>
                        </div>
                      )}
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-surface">
          <div className="relative">
            <input
              type="text"
              className="w-full bg-surface-hover border border-border text-primary rounded-lg pl-4 pr-12 py-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none placeholder-muted"
              placeholder={contextColumn ? `Ask about your ${contextColumn}...` : "Message The Weaver..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button 
              onClick={handleAsk}
              disabled={!query.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-accent hover:bg-accent/10 rounded-md transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};