/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, MousePointer, Keyboard, HelpCircle, BookOpen } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>Interactive Guide &amp; Controls</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* 3D Mouse & Touch Interaction */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-xs uppercase tracking-wider font-mono">
              <MousePointer className="w-4 h-4 text-indigo-400" />
              3D Viewport Navigation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="font-bold text-slate-200">Orbit Camera:</span>
                <p className="text-slate-400 mt-1">
                  Click &amp; drag anywhere on the dark background to orbit the 3D cube in all 3 axes.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="font-bold text-slate-200">Twist Any Face:</span>
                <p className="text-slate-400 mt-1">
                  Click and drag directly on any colored sticker in the direction you want to turn it!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="font-bold text-slate-200">Zoom &amp; Pan:</span>
                <p className="text-slate-400 mt-1">
                  Mouse wheel or pinch on mobile to zoom. Right-click drag to pan the camera.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="font-bold text-slate-200">Exploded View:</span>
                <p className="text-slate-400 mt-1">
                  Slide the Exploded slider in the dock to push cubies outward and inspect internal screws and springs.
                </p>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-xs uppercase tracking-wider font-mono">
              <Keyboard className="w-4 h-4 text-amber-400" />
              Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Clockwise Turns:</span>
                <span className="text-amber-300 font-bold">U, D, L, R, F, B</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Counter-Clockwise:</span>
                <span className="text-amber-300 font-bold">Shift + Key</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Scramble:</span>
                <span className="text-indigo-300 font-bold">S</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Reset Solved:</span>
                <span className="text-indigo-300 font-bold">Z</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Toggle Dock (Zen):</span>
                <span className="text-emerald-300 font-bold">H</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Timer Start/Stop:</span>
                <span className="text-emerald-300 font-bold">Spacebar</span>
              </div>
            </div>
          </div>

          {/* Quick Solver Cheat Sheet */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-xs uppercase tracking-wider font-mono">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              CFOP &amp; Layer-By-Layer Methodology
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <li><strong>Phase 1: White Cross</strong> &mdash; Align 4 white petals to matching side centers.</li>
              <li><strong>Phase 2: First Layer Corners</strong> &mdash; Sexy Move: <code className="text-amber-300">R U R&apos; U&apos;</code></li>
              <li><strong>Phase 3: Middle Layer (F2L)</strong> &mdash; Right: <code className="text-amber-300">U R U&apos; R&apos; U&apos; F&apos; U F</code></li>
              <li><strong>Phase 4: Yellow Cross (OLL)</strong> &mdash; FUR-URF: <code className="text-amber-300">F R U R&apos; U&apos; F&apos;</code></li>
              <li><strong>Phase 5: Yellow Top Face (OLL)</strong> &mdash; Sune: <code className="text-amber-300">R U R&apos; U R U2 R&apos;</code></li>
              <li><strong>Phase 6: Permute Corners (PLL)</strong> &mdash; Headlights: <code className="text-amber-300">R&apos; F R&apos; B2 R F&apos; R&apos; B2 R2</code></li>
              <li><strong>Phase 7: Permute Edges (PLL)</strong> &mdash; U-Perm: <code className="text-amber-300">R U&apos; R U R U R U&apos; R&apos; U&apos; R2</code></li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
          >
            Got it, let&apos;s cube!
          </button>
        </div>
      </div>
    </div>
  );
};
