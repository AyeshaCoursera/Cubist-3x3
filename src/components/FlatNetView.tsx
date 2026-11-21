/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CubeColor, CubeState, Face, ThemeConfig } from '../types/cube';

interface FlatNetViewProps {
  cubeState: CubeState;
  theme: ThemeConfig;
  onStickerClick?: (face: Face, row: number, col: number) => void;
  selectedColor?: CubeColor;
}

export const FlatNetView: React.FC<FlatNetViewProps> = ({
  cubeState,
  theme,
  onStickerClick,
}) => {
  const renderFaceGrid = (face: Face, label: string) => {
    const grid = cubeState[face];

    return (
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 mb-1">
          {label} ({face})
        </span>
        <div className="grid grid-cols-3 gap-0.5 bg-slate-900/90 p-1 rounded-md border border-slate-700/60 shadow-inner">
          {grid.map((row, rIdx) =>
            row.map((col, cIdx) => {
              const bg = theme.colors[col] || '#ffffff';
              return (
                <button
                  key={`${face}-${rIdx}-${cIdx}`}
                  type="button"
                  onClick={() => onStickerClick && onStickerClick(face, rIdx, cIdx)}
                  style={{ backgroundColor: bg }}
                  className="w-5 h-5 rounded-[3px] border border-black/30 hover:brightness-110 active:scale-95 transition-all shadow-sm"
                  title={`${face} [${rIdx}, ${cIdx}]: ${col}`}
                />
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800 text-xs font-medium text-slate-300">
        <span>Unfolded Net View (54 Stickers)</span>
        <span className="text-[10px] text-slate-500 font-mono">Live Mirror</span>
      </div>

      <div className="flex flex-col items-center gap-1.5 py-1">
        {/* Top: U face */}
        <div className="flex justify-center">
          {renderFaceGrid('U', 'Up / White')}
        </div>

        {/* Middle: L, F, R, B */}
        <div className="flex items-center gap-2">
          {renderFaceGrid('L', 'Left')}
          {renderFaceGrid('F', 'Front')}
          {renderFaceGrid('R', 'Right')}
          {renderFaceGrid('B', 'Back')}
        </div>

        {/* Bottom: D face */}
        <div className="flex justify-center">
          {renderFaceGrid('D', 'Down / Yellow')}
        </div>
      </div>
    </div>
  );
};
