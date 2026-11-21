/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Play, Info, Check } from 'lucide-react';
import { PATTERNS } from '../cube/patterns';
import { Pattern } from '../types/cube';

interface PatternGalleryProps {
  onApplyPattern: (pattern: Pattern) => void;
  activePatternId?: string | null;
}

export const PatternGallery: React.FC<PatternGalleryProps> = ({
  onApplyPattern,
  activePatternId,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/60 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Group Commutators &amp; Mathematical Art
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            The Algorithmic Pattern Gallery
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Each symmetrical pattern is reached by applying cyclic group commutators and conjugacy classes. Click any pattern to animate and render it directly on the 3D cube.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PATTERNS.map(pattern => {
          const isActive = activePatternId === pattern.id;

          return (
            <div
              key={pattern.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{pattern.name}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/30 text-indigo-300 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </h3>
                    {pattern.author && (
                      <span className="text-xs text-slate-400 font-mono">By {pattern.author}</span>
                    )}
                  </div>

                  <span className="text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono bg-slate-800 text-slate-300">
                    {pattern.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {pattern.description}
                </p>

                {pattern.mathSignificance && (
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{pattern.mathSignificance}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="font-mono text-xs text-amber-300 truncate max-w-xs" title={pattern.moves}>
                  {pattern.moves}
                </div>

                <button
                  onClick={() => onApplyPattern(pattern)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Animate</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
