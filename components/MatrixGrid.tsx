import React, { useState } from 'react';
import { MatrixEntry, LifeDomain, ColumnType } from '../types';
import { Sparkles, Trash2, Plus, MoreHorizontal } from 'lucide-react';
import { WeaverAssistant } from './WeaverAssistant';
import { Button } from './Button';

interface MatrixGridProps {
  entries: MatrixEntry[];
  domains: LifeDomain[];
  onUpdateEntry: (entry: MatrixEntry) => void;
  onDeleteEntry: (id: string) => void;
  onAddEntry: (domainId: string) => void;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({ 
  entries, 
  domains, 
  onUpdateEntry,
  onDeleteEntry,
  onAddEntry
}) => {
  const [activeWeaver, setActiveWeaver] = useState<{entryId: string, col: ColumnType, currentVal: string} | null>(null);

  const handleTextChange = (id: string, field: keyof MatrixEntry, value: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      onUpdateEntry({ ...entry, [field]: value });
    }
  };

  const applyWeaverSuggestion = (text: string) => {
    if (activeWeaver) {
      const fieldMap: Record<ColumnType, keyof MatrixEntry> = {
        [ColumnType.DECLARATION]: 'declaration',
        [ColumnType.EVIDENCE]: 'evidence',
        [ColumnType.ACTION]: 'action',
        [ColumnType.GRATITUDE]: 'gratitude',
      };
      
      handleTextChange(activeWeaver.entryId, fieldMap[activeWeaver.col], text);
    }
  };

  return (
    <div className="w-full h-full pb-32">
      <div className="max-w-[1600px] mx-auto">
        {domains.map(domain => {
          const domainEntries = entries.filter(e => e.domainId === domain.id);
          
          return (
            <div key={domain.id} className="mb-12 animate-fade-in">
              {/* Domain Header */}
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className={`p-1.5 rounded-md bg-surface border border-border ${domain.color}`}>
                   {/* Icon placeholder if needed, or just color indicator */}
                   <div className={`w-3 h-3 rounded-full ${domain.color.replace('text-', 'bg-')}`} />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">{domain.name}</h2>
              </div>

              {/* Grid Container */}
              <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
                {/* Table Header - Visible on desktop */}
                <div className="hidden md:grid grid-cols-12 gap-px bg-border border-b border-border">
                  <div className="col-span-4 bg-surface px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                    Declaration <span className="opacity-50 ml-1">(I Am)</span>
                  </div>
                  <div className="col-span-3 bg-surface px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                    Evidence <span className="opacity-50 ml-1">(I Have)</span>
                  </div>
                  <div className="col-span-2 bg-surface px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                    Action <span className="opacity-50 ml-1">(I Will)</span>
                  </div>
                  <div className="col-span-2 bg-surface px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                    Gratitude <span className="opacity-50 ml-1">(I Am Grateful)</span>
                  </div>
                  <div className="col-span-1 bg-surface px-4 py-3 text-xs font-medium text-center text-muted uppercase tracking-wide">
                    ...
                  </div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-border">
                  {domainEntries.length === 0 ? (
                     <div className="p-8 text-center text-muted text-sm italic">
                        No active affirmations in this domain.
                     </div>
                  ) : (
                    domainEntries.map(entry => (
                      <div key={entry.id} className="group relative grid grid-cols-1 md:grid-cols-12 md:gap-px bg-border/40 md:bg-border transition-colors">
                        
                        {[
                          { type: ColumnType.DECLARATION, field: 'declaration' as keyof MatrixEntry, placeholder: "State your new reality...", cols: "col-span-4" },
                          { type: ColumnType.EVIDENCE, field: 'evidence' as keyof MatrixEntry, placeholder: "Proof from your past...", cols: "col-span-3" },
                          { type: ColumnType.ACTION, field: 'action' as keyof MatrixEntry, placeholder: "Today's action...", cols: "col-span-2" },
                          { type: ColumnType.GRATITUDE, field: 'gratitude' as keyof MatrixEntry, placeholder: "Feeling grateful for...", cols: "col-span-2" }
                        ].map((col, idx) => (
                          <div key={idx} className={`relative bg-background md:bg-surface group-hover:bg-surface-hover/50 transition-colors ${col.cols} p-0 focus-within:ring-1 focus-within:ring-primary focus-within:z-10`}>
                            {/* Mobile Label */}
                            <label className="md:hidden block px-4 pt-3 text-[10px] font-bold text-muted uppercase tracking-wider">{col.type}</label>
                            
                            <textarea
                              value={entry[col.field]}
                              onChange={(e) => handleTextChange(entry.id, col.field, e.target.value)}
                              placeholder={col.placeholder}
                              rows={1}
                              className="w-full h-full min-h-[50px] bg-transparent border-0 px-4 py-3 text-sm text-primary placeholder-muted/40 focus:ring-0 resize-none leading-relaxed"
                              onFocus={(e) => {
                                  e.target.style.height = 'auto';
                                  e.target.style.height = Math.max(e.target.scrollHeight, 50) + 'px';
                              }}
                              onBlur={(e) => {
                                  e.target.style.height = 'auto';
                              }}
                            />
                            
                            {/* Weaver Action Button */}
                            <button
                              onClick={() => setActiveWeaver({ entryId: entry.id, col: col.type, currentVal: entry[col.field] })}
                              className="absolute top-2 right-2 p-1.5 rounded-md text-muted opacity-0 group-hover:opacity-100 hover:text-accent hover:bg-accent/10 transition-all z-20"
                              title="Refine with Weaver AI"
                              tabIndex={-1}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* Actions Column */}
                        <div className="col-span-1 bg-background md:bg-surface group-hover:bg-surface-hover/50 flex items-center justify-center p-2">
                          <button 
                            onClick={() => onDeleteEntry(entry.id)}
                            className="p-2 rounded-md text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Footer / Add Button */}
                <div className="bg-surface-hover/30 p-2 border-t border-border">
                   <button 
                      onClick={() => onAddEntry(domain.id)}
                      className="w-full py-2 flex items-center justify-center gap-2 text-sm text-muted hover:text-primary hover:bg-surface-hover rounded-md transition-colors border border-dashed border-border hover:border-muted/30"
                   >
                      <Plus className="w-4 h-4" />
                      Add new affirmation
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeWeaver && (
        <WeaverAssistant
          onClose={() => setActiveWeaver(null)}
          contextColumn={activeWeaver.col}
          contextValue={activeWeaver.currentVal}
          onApplySuggestion={applyWeaverSuggestion}
        />
      )}
    </div>
  );
};