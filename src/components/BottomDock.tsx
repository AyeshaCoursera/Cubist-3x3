/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Shuffle,
  Volume2,
  VolumeX,
  Layers,
  Sparkles,
  Sliders,
  Compass,
  CheckCircle2,
  BookOpen,
  Paintbrush,
} from 'lucide-react';
import { Move, SolverResult, SolverStep, ThemeConfig, ThemeName } from '../types/cube';
import { CUBE_THEMES } from '../cube/themes';
import { FlatNetView } from './FlatNetView';
import { CubeState } from '../types/cube';
import { MOVE_DESCRIPTIONS } from '../cube/cubeLogic';

interface BottomDockProps {
  cubeState: CubeState;
  isSolved: boolean;
  onExecuteMove: (move: Move) => void;
  onScramble: () => void;
  onResetSolved: () => void;
  solverResult: SolverResult | null;
  onRunSolveStep: (stepIndex: number) => void;
  currentStepIndex: number;
  isPlayingSolve: boolean;
  onTogglePlaySolve: () => void;
  explodedOffset: number;
  onExplodedChange: (val: number) => void;
  speedMultiplier: number;
  onSpeedChange: (speed: number) => void;
  theme: ThemeConfig;
  onThemeChange: (themeId: ThemeName) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenPaintMode: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  cubeState,
  isSolved,
  onExecuteMove,
  onScramble,
  onResetSolved,
  solverResult,
  onRunSolveStep,
  currentStepIndex,
  isPlayingSolve,
  onTogglePlaySolve,
  explodedOffset,
  onExplodedChange,
  speedMultiplier,
  onSpeedChange,
  theme,
  onThemeChange,
  soundEnabled,
  onToggleSound,
  onOpenPaintMode,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'solver' | 'turns' | 'exploded' | 'themes' | 'net'>('solver');
  const [selectedMoveForInfo, setSelectedMoveForInfo] = useState<Move | null>(null);

  const moves: Move[] = ['U', "U'", 'D', "D'", 'L', "L'", 'R', "R'", 'F', "F'", 'B', "B'"];
  const currentStep: SolverStep | null =
    solverResult && solverResult.steps[currentStepIndex] ? solverResult.steps[currentStepIndex] : null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-full px-3 max-w-[940px] pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-center">
        {/* Collapse / Expand Toggle Tab */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 shadow-lg hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Show Controls &amp; Solver</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hide Dock (Zen Mode)</span>
            </>
          )}
        </button>

        {/* Dock Card */}
        {!isCollapsed && (
          <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 sm:p-4 space-y-3">
            {/* Top Toolbar: Tabs & Global Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                <button
                  onClick={() => setActiveTab('solver')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'solver'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step Solver</span>
                </button>

                <button
                  onClick={() => setActiveTab('turns')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'turns'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Face Turns</span>
                </button>

                <button
                  onClick={() => setActiveTab('exploded')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'exploded'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Exploded View</span>
                </button>

                <button
                  onClick={() => setActiveTab('themes')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'themes'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Themes</span>
                </button>

                <button
                  onClick={() => setActiveTab('net')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'net'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>2D Net</span>
                </button>
              </div>

              {/* Utility Quick Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenPaintMode}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 active:scale-95 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-500/40 shadow-sm"
                  title="Paint my real physical cube"
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>Paint Real Cube</span>
                </button>

                <button
                  onClick={onScramble}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="Generate WCA Scramble"
                >
                  <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Scramble</span>
                </button>

                <button
                  onClick={onResetSolved}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="Reset to Solved"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={onToggleSound}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                  title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: STEP SOLVER */}
            {activeTab === 'solver' && (
              <div className="space-y-3">
                {isSolved ? (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-200">
                        Cube is in a fully solved state!
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onOpenPaintMode}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Paintbrush className="w-3.5 h-3.5" />
                        <span>Paint Real Cube</span>
                      </button>
                      <button
                        onClick={onScramble}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700"
                      >
                        Scramble
                      </button>
                    </div>
                  </div>
                ) : solverResult && solverResult.steps.length > 0 ? (
                  <div className="space-y-2.5">
                    {/* Phase Header & Step Navigation */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400 font-mono">
                            {currentStep?.phase}
                          </span>
                          {currentStep?.algorithmName && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                              {currentStep.algorithmName}
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 font-mono border border-slate-700 hidden sm:inline-block">
                            Hold: Green Front, White Top
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-white mt-0.5">
                          {currentStep?.title}
                        </div>
                      </div>

                      {/* Step Player Controls */}
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          disabled={currentStepIndex <= 0}
                          onClick={() => onRunSolveStep(currentStepIndex - 1)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white transition-colors"
                          title="Previous Step"
                        >
                          <SkipBack className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={onTogglePlaySolve}
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          {isPlayingSolve ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Play Phase</span>
                            </>
                          )}
                        </button>

                        <button
                          disabled={currentStepIndex >= solverResult.steps.length - 1}
                          onClick={() => onRunSolveStep(currentStepIndex + 1)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white transition-colors"
                          title="Next Step"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Step Description & Move Sequence */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                      <p>{currentStep?.description}</p>
                      {currentStep && currentStep.moves.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex flex-wrap items-center gap-1 font-mono">
                            <span className="text-[11px] text-slate-500 uppercase mr-1">Turn Sequence:</span>
                            {currentStep.moves.map((m, mIdx) => (
                              <button
                                key={mIdx}
                                type="button"
                                onClick={() => {
                                  setSelectedMoveForInfo(m);
                                  onExecuteMove(m);
                                }}
                                onMouseEnter={() => setSelectedMoveForInfo(m)}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 border border-slate-700 font-bold transition-all shadow-sm"
                                title={MOVE_DESCRIPTIONS[m] || m}
                              >
                                {m}
                              </button>
                            ))}
                          </div>

                          {selectedMoveForInfo && (
                            <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-[11px] text-indigo-200 font-mono flex items-center justify-between gap-2 animate-fade-in">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-amber-300 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">
                                  {selectedMoveForInfo}
                                </span>
                                <span>{MOVE_DESCRIPTIONS[selectedMoveForInfo] || selectedMoveForInfo}</span>
                              </div>
                              <span className="text-[10px] text-indigo-400">Click to execute</span>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400 italic">
                        Tip: {currentStep?.explanation}
                      </p>
                    </div>

                    {/* Phase Progress Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {solverResult.steps.map((step, idx) => (
                        <button
                          key={step.id}
                          onClick={() => onRunSolveStep(idx)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors border ${
                            idx === currentStepIndex
                              ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          P{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs text-slate-400">
                    Click Scramble to test the solver algorithms.
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: FACE TURNS & SINGMASTER NOTATION */}
            {activeTab === 'turns' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Standard Singmaster Notation (Click to twist face)</span>
                  <span className="font-mono text-[11px] text-indigo-400">&apos; = Counter-Clockwise</span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                  {moves.map(m => (
                    <button
                      key={m}
                      onClick={() => onExecuteMove(m)}
                      className="py-2 rounded-lg bg-slate-950 hover:bg-slate-800 active:scale-95 text-xs font-mono font-bold text-slate-200 hover:text-white border border-slate-800 hover:border-indigo-500/50 transition-all shadow-sm"
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Slices & Cube Rotations */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500 font-mono uppercase mr-1">Slices / Axis:</span>
                  {(['M', 'E', 'S', 'x', 'y', 'z'] as Move[]).map(m => (
                    <button
                      key={m}
                      onClick={() => onExecuteMove(m)}
                      className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 active:scale-95 text-xs font-mono text-slate-300 border border-slate-800 hover:border-slate-700 transition-all"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: EXPLODED VIEW & SPEED */}
            {activeTab === 'exploded' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Exploded Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      Exploded View (Inspect Core &amp; Springs)
                    </span>
                    <span className="font-mono text-indigo-300 font-bold">
                      {Math.round(explodedOffset * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={explodedOffset}
                    onChange={e => onExplodedChange(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Assembled (0%)</span>
                    <span>Fully Dissected (100%)</span>
                  </div>
                </div>

                {/* Speed Multiplier */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Turn Animation Speed</span>
                    <span className="font-mono text-indigo-300 font-bold">{speedMultiplier}x</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[0.5, 1, 1.5, 2.5].map(spd => (
                      <button
                        key={spd}
                        onClick={() => onSpeedChange(spd)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border ${
                          speedMultiplier === spd
                            ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: THEMES */}
            {activeTab === 'themes' && (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 font-medium">
                  Select Visual Finish &amp; Color Palette
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.values(CUBE_THEMES).map(th => {
                    const isCur = theme.id === th.id;
                    return (
                      <button
                        key={th.id}
                        onClick={() => onThemeChange(th.id)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          isCur
                            ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/20'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-semibold text-white truncate">{th.name}</div>
                        <div className="flex items-center gap-1 mt-1.5">
                          {Object.values(th.colors).map((c, i) => (
                            <span
                              key={i}
                              style={{ backgroundColor: c }}
                              className="w-2.5 h-2.5 rounded-full border border-black/40"
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: 2D UNOLDED NET */}
            {activeTab === 'net' && (
              <div className="flex justify-center py-1">
                <FlatNetView cubeState={cubeState} theme={theme} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
