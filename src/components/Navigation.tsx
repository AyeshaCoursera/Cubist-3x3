/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box, BookOpen, Calculator, Sparkles, Timer, HelpCircle, CheckCircle2, ShoppingBag } from 'lucide-react';

export type ActiveTab = 'lab' | 'paint' | 'blog' | 'math' | 'patterns' | 'timer';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  moveCount: number;
  isSolved: boolean;
  onOpenHelp: () => void;
  onOpenGear: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  moveCount,
  isSolved,
  onOpenHelp,
  onOpenGear,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 border-b border-slate-800/80 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Spec Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-amber-400 flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Box className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-mono">
                  CUBIST<span className="text-indigo-400">.3x3</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Visual Solver &amp; Blog
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/90 overflow-x-auto scrollbar-none">
          <button
            onClick={() => onTabChange('lab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'lab'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Solver Lab</span>
          </button>

          <button
            onClick={() => onTabChange('paint')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'paint'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Paint &amp; Solve</span>
          </button>

          <button
            onClick={() => onTabChange('blog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'blog'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Articles &amp; Guide</span>
          </button>

          <button
            onClick={() => onTabChange('math')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'math'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>43 Quintillion</span>
          </button>

          <button
            onClick={() => onTabChange('patterns')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'patterns'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patterns</span>
          </button>

          <button
            onClick={() => onTabChange('timer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timer'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Speed Timer</span>
          </button>
        </nav>

        {/* Status Indicators & Help */}
        <div className="flex items-center gap-2">
          {/* Static Solved Badge (No pulsating dot!) */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
              isSolved
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/30'
            }`}
          >
            {isSolved ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Solved</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Scrambled</span>
              </>
            )}
          </div>

          {/* Move Counter */}
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-slate-500 text-[10px] uppercase mr-1">Turns:</span>
            <span className="font-bold text-white">{moveCount}</span>
          </div>

          {/* Gear, Shop & Monetization Hub */}
          <button
            onClick={onOpenGear}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Recommended Speedcubes, Cheat Sheet & Earnings Hub"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Gear &amp; Shop</span>
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Interactive Controls & Keyboard Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
