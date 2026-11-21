/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Paintbrush,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  Info,
  Check,
  ShieldCheck,
  Palette,
} from 'lucide-react';
import { CubeColor, CubeState, Face, ThemeConfig } from '../types/cube';
import { ALL_COLORS, validateCubeState } from '../cube/cubeValidator';
import { cloneCubeState, createSolvedState } from '../cube/cubeLogic';

interface CustomCubePainterProps {
  currentCubeState: CubeState;
  theme: ThemeConfig;
  onApplyAndSolve: (customState: CubeState) => void;
  onCancel: () => void;
}

const COLOR_NAMES: Record<CubeColor, string> = {
  white: 'White',
  yellow: 'Yellow',
  green: 'Green',
  blue: 'Blue',
  red: 'Red',
  orange: 'Orange',
};

export const CustomCubePainter: React.FC<CustomCubePainterProps> = ({
  currentCubeState,
  theme,
  onApplyAndSolve,
  onCancel,
}) => {
  const [editingState, setEditingState] = useState<CubeState>(() => cloneCubeState(currentCubeState));
  const [selectedColor, setSelectedColor] = useState<CubeColor>('white');

  // Real-time validation
  const validation = validateCubeState(editingState);

  // Paint a single cell
  const handleCellClick = (face: Face, r: number, c: number) => {
    // If center piece (r=1, c=1), warn or allow changing center
    setEditingState(prev => {
      const copy = cloneCubeState(prev);
      copy[face][r][c] = selectedColor;
      return copy;
    });
  };

  // Quick action: Fill entire face
  const handleFillFace = (face: Face) => {
    setEditingState(prev => {
      const copy = cloneCubeState(prev);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          copy[face][r][c] = selectedColor;
        }
      }
      return copy;
    });
  };

  // Reset to solved state
  const handleResetToSolved = () => {
    setEditingState(createSolvedState());
  };

  // Render a 3x3 face for the unfolded 2D painter
  const renderFace = (face: Face, label: string) => {
    const grid = editingState[face];
    const centerColor = grid[1][1];

    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-between w-full px-1 mb-1 text-[11px] font-mono text-slate-400">
          <span className="font-bold text-slate-200">
            {label} ({face})
          </span>
          <button
            type="button"
            onClick={() => handleFillFace(face)}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors"
            title={`Fill entire ${label} with ${selectedColor}`}
          >
            Fill Face
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-md">
          {grid.map((row, rIdx) =>
            row.map((col, cIdx) => {
              const isCenter = rIdx === 1 && cIdx === 1;
              const bg = theme.colors[col] || '#ffffff';

              return (
                <button
                  key={`${face}-${rIdx}-${cIdx}`}
                  type="button"
                  onClick={() => handleCellClick(face, rIdx, cIdx)}
                  style={{ backgroundColor: bg }}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg border-2 transition-all relative flex items-center justify-center shadow-sm ${
                    isCenter
                      ? 'border-indigo-400 ring-2 ring-indigo-500/30 font-bold text-black/60'
                      : 'border-black/40 hover:scale-105 active:scale-95 hover:brightness-110'
                  }`}
                  title={`${label} [${rIdx + 1}, ${cIdx + 1}] — Click to paint with ${selectedColor}`}
                >
                  {isCenter && (
                    <span className="text-[10px] font-mono uppercase bg-black/40 text-white px-1 rounded">
                      Ctr
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/60 border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold mb-2">
              <Paintbrush className="w-3.5 h-3.5" />
              Physical Cube Input &amp; Solver
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Paint Your Real Rubik&apos;s Cube
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Hold your physical cube with <strong className="text-emerald-400">Green facing you</strong> and <strong className="text-slate-100">White on top</strong>. Select a color below and click each cell to match your real cube&apos;s current colors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToSolved}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Solved</span>
            </button>
          </div>
        </div>
      </div>

      {/* Color Palette Selector Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <span className="flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-400" />
            Pick Brush Color:
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            Active Brush: <strong className="text-white uppercase">{COLOR_NAMES[selectedColor]}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          {ALL_COLORS.map(color => {
            const isSelected = selectedColor === color;
            const count = validation.colorCounts[color] || 0;
            const isCountCorrect = count === 9;
            const bg = theme.colors[color];

            return (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 border-indigo-400 bg-indigo-950/50 shadow-md'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div
                  style={{ backgroundColor: bg }}
                  className="w-7 h-7 rounded-lg border border-black/30 shadow-sm shrink-0 flex items-center justify-center"
                >
                  {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                </div>

                <div className="text-left">
                  <div className="text-xs font-bold text-white capitalize">{COLOR_NAMES[color]}</div>
                  <div
                    className={`text-[11px] font-mono ${
                      isCountCorrect
                        ? 'text-emerald-400 font-medium'
                        : count > 9
                        ? 'text-rose-400 font-bold'
                        : 'text-amber-400'
                    }`}
                  >
                    {count}/9 stickers
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2D Unfolded Interactive Cube Net */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
        <div className="text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 mb-2">
            Orientation: U=White (Top) &bull; F=Green (Front) &bull; R=Red (Right) &bull; D=Yellow (Bottom)
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 py-2">
          {/* Top: U face */}
          <div className="flex justify-center">
            {renderFace('U', 'Up')}
          </div>

          {/* Middle: L, F, R, B */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3">
            {renderFace('L', 'Left')}
            {renderFace('F', 'Front')}
            {renderFace('R', 'Right')}
            {renderFace('B', 'Back')}
          </div>

          {/* Bottom: D face */}
          <div className="flex justify-center">
            {renderFace('D', 'Down')}
          </div>
        </div>
      </div>

      {/* Validation Status & Solve Launch */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {validation.isValid ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">
                    Valid &amp; Physically Solvable State Verified!
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold text-amber-300">
                    Configuration Requires Correction
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-400">
              {validation.isValid
                ? 'All 54 stickers conform to 3x3 permutation laws. Ready to generate step-by-step guidance.'
                : 'Check the sticker count indicators above to ensure exactly 9 stickers per color.'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onCancel}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
            >
              Cancel
            </button>

            <button
              disabled={!validation.isValid}
              onClick={() => onApplyAndSolve(editingState)}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30 active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Solve My Real Cube in 3D</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Validation Issues Diagnostic List */}
        {!validation.isValid && validation.issues.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5 text-xs text-amber-200">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Diagnostic Feedback:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
              {validation.issues.map((iss, idx) => (
                <li key={idx}>{iss.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
