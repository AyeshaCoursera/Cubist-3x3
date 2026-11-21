/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ActiveTab, Navigation } from './components/Navigation';
import { ThreeCube } from './cube/ThreeCube';
import { BottomDock } from './components/BottomDock';
import { BlogArticles } from './components/BlogArticles';
import { CombinatoricsExplorer } from './components/CombinatoricsExplorer';
import { PatternGallery } from './components/PatternGallery';
import { SpeedTimer } from './components/SpeedTimer';
import { HelpModal } from './components/HelpModal';
import { CustomCubePainter } from './components/CustomCubePainter';
import { GearAndMonetizationModal } from './components/GearAndMonetization';
import {
  applyAlgorithm,
  applyMove,
  createSolvedState,
  generateScramble,
  isCubeSolved,
  parseMoves,
} from './cube/cubeLogic';
import { solveCube } from './cube/cubeSolver';
import { CUBE_THEMES } from './cube/themes';
import { CubeState, Move, Pattern, SolverResult, ThemeConfig, ThemeName } from './types/cube';
import { cubeSound } from './audio/cubeSound';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lab');
  const [cubeState, setCubeState] = useState<CubeState>(createSolvedState());
  const [moveCount, setMoveCount] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [activeMoveQueue, setActiveMoveQueue] = useState<Move[]>([]);
  const [explodedOffset, setExplodedOffset] = useState<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [theme, setTheme] = useState<ThemeConfig>(CUBE_THEMES.classic);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isGearOpen, setIsGearOpen] = useState<boolean>(false);

  // Solver states
  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingSolve, setIsPlayingSolve] = useState<boolean>(false);
  const [activePatternId, setActivePatternId] = useState<string | null>(null);

  const hasBeenScrambledRef = useRef<boolean>(false);
  const isSolved = isCubeSolved(cubeState);

  // Re-calculate solution whenever cubeState changes
  useEffect(() => {
    if (!isSolved) {
      const res = solveCube(cubeState);
      setSolverResult(res);
      hasBeenScrambledRef.current = true;
    } else {
      setSolverResult(null);
      if (hasBeenScrambledRef.current && moveCount > 0) {
        // Celebrate solve!
        cubeSound.playSolveChime();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899'],
        });
        hasBeenScrambledRef.current = false;
      }
    }
  }, [cubeState, isSolved, moveCount]);

  // Execute a single move logically
  const handleExecuteMove = useCallback(
    (move: Move) => {
      if (isAnimating) return;
      setActiveMoveQueue([move]);
    },
    [isAnimating]
  );

  // Called when 3D Three.js finishes physically animating a turn
  const handleMoveComplete = useCallback((move: Move) => {
    setCubeState(prev => applyMove(prev, move));
    setMoveCount(c => c + 1);
  }, []);

  // Scramble the cube with official WCA moves
  const handleScramble = useCallback(() => {
    const scrambleStr = generateScramble(20);
    const moves = parseMoves(scrambleStr);
    hasBeenScrambledRef.current = true;
    setActivePatternId(null);
    setActiveMoveQueue(moves);
  }, []);

  // Reset to solved state
  const handleResetSolved = useCallback(() => {
    setCubeState(createSolvedState());
    setMoveCount(0);
    setActiveMoveQueue([]);
    setIsPlayingSolve(false);
    setActivePatternId(null);
    hasBeenScrambledRef.current = false;
  }, []);

  // Run a specific step of the solver
  const handleRunSolveStep = useCallback(
    (stepIndex: number) => {
      if (!solverResult || !solverResult.steps[stepIndex]) return;
      setCurrentStepIndex(stepIndex);
      const step = solverResult.steps[stepIndex];
      if (step.moves.length > 0) {
        setActiveMoveQueue([...step.moves]);
      }
    },
    [solverResult]
  );

  // Play / Pause solve step sequence
  const handleTogglePlaySolve = useCallback(() => {
    if (!solverResult || solverResult.steps.length === 0) return;

    if (isPlayingSolve) {
      setIsPlayingSolve(false);
      setActiveMoveQueue([]);
    } else {
      setIsPlayingSolve(true);
      const step = solverResult.steps[currentStepIndex];
      if (step && step.moves.length > 0) {
        setActiveMoveQueue([...step.moves]);
      }
    }
  }, [solverResult, isPlayingSolve, currentStepIndex]);

  // When move queue empties during solve playback
  const handleQueueEmpty = useCallback(() => {
    if (isPlayingSolve && solverResult) {
      if (currentStepIndex < solverResult.steps.length - 1) {
        const nextIdx = currentStepIndex + 1;
        setCurrentStepIndex(nextIdx);
        const nextStep = solverResult.steps[nextIdx];
        if (nextStep && nextStep.moves.length > 0) {
          setTimeout(() => {
            setActiveMoveQueue([...nextStep.moves]);
          }, 300);
        }
      } else {
        setIsPlayingSolve(false);
      }
    }
  }, [isPlayingSolve, solverResult, currentStepIndex]);

  // Apply a pattern (e.g. Superflip or Checkerboard)
  const handleApplyPattern = useCallback(
    (pattern: Pattern) => {
      setActivePatternId(pattern.id);
      // Reset to solved first, then execute pattern moves
      const freshSolved = createSolvedState();
      setCubeState(freshSolved);
      setMoveCount(0);

      const moves = parseMoves(pattern.moves);
      setActiveMoveQueue(moves);

      // If user was on pattern gallery, switch to lab to view
      setActiveTab('lab');
    },
    []
  );

  // Apply algorithm from blog articles
  const handleLoadAlgorithmFromBlog = useCallback(
    (algStr: string, _label: string) => {
      const moves = parseMoves(algStr);
      setActiveMoveQueue(moves);
      setActiveTab('lab');
    },
    []
  );

  // Apply scramble from speed timer
  const handleApplyScrambleFromTimer = useCallback(
    (scrambleStr: string) => {
      const freshSolved = createSolvedState();
      setCubeState(freshSolved);
      setMoveCount(0);
      const moves = parseMoves(scrambleStr);
      setActiveMoveQueue(moves);
      setActiveTab('lab');
    },
    []
  );

  // Apply custom painted state from user's real physical cube
  const handleApplyCustomState = useCallback((customState: CubeState) => {
    setCubeState(customState);
    setMoveCount(0);
    hasBeenScrambledRef.current = true;
    setActivePatternId(null);
    setCurrentStepIndex(0);
    setIsPlayingSolve(false);
    setActiveTab('lab');
  }, []);

  // Sound toggle
  const handleToggleSound = useCallback(() => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    cubeSound.setEnabled(nextVal);
  }, [soundEnabled]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or modal
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();
      const isShift = e.shiftKey;

      if (['U', 'D', 'L', 'R', 'F', 'B'].includes(key)) {
        e.preventDefault();
        const move = (isShift ? `${key}'` : key) as Move;
        handleExecuteMove(move);
      } else if (key === 'S' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleScramble();
      } else if (key === 'Z' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleResetSolved();
      } else if (key === ' ') {
        if (activeTab === 'lab' && solverResult) {
          e.preventDefault();
          handleTogglePlaySolve();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExecuteMove, handleScramble, handleResetSolved, handleTogglePlaySolve, activeTab, solverResult]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0f17] text-slate-100 flex flex-col font-sans select-none">
      {/* Top Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        moveCount={moveCount}
        isSolved={isSolved}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenGear={() => setIsGearOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* TAB 1: 3D LAB & SOLVER VIEW (Always rendered in background for seamless transitions) */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            activeTab === 'lab' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* 3D Three.js Viewport: 100% unobstructed center */}
          <ThreeCube
            cubeState={cubeState}
            onMoveComplete={handleMoveComplete}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            explodedOffset={explodedOffset}
            theme={theme}
            activeMoveQueue={activeMoveQueue}
            onQueueEmpty={handleQueueEmpty}
            speedMultiplier={speedMultiplier}
          />

          {/* Minimal Viewport Top Info Pill (Floating Top-Left) */}
          <div className="absolute top-3 left-4 pointer-events-none z-20 flex flex-col gap-1">
            <div className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 shadow-md">
              <span className="text-indigo-400 font-semibold">Tip:</span> Drag background to orbit &bull; Drag stickers to turn
            </div>
            {activePatternId && (
              <div className="px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-[11px] font-mono text-indigo-300 shadow-md">
                Pattern: {activePatternId}
              </div>
            )}
          </div>

          {/* Collapsible Bottom Control Dock */}
          <BottomDock
            cubeState={cubeState}
            isSolved={isSolved}
            onExecuteMove={handleExecuteMove}
            onScramble={handleScramble}
            onResetSolved={handleResetSolved}
            solverResult={solverResult}
            onRunSolveStep={handleRunSolveStep}
            currentStepIndex={currentStepIndex}
            isPlayingSolve={isPlayingSolve}
            onTogglePlaySolve={handleTogglePlaySolve}
            explodedOffset={explodedOffset}
            onExplodedChange={setExplodedOffset}
            speedMultiplier={speedMultiplier}
            onSpeedChange={setSpeedMultiplier}
            theme={theme}
            onThemeChange={thId => setTheme(CUBE_THEMES[thId])}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onOpenPaintMode={() => setActiveTab('paint')}
          />
        </div>

        {/* TAB 2: PAINT REAL CUBE & SOLVE */}
        {activeTab === 'paint' && (
          <div className="absolute inset-0 w-full h-full overflow-y-auto p-4 sm:p-6 z-20 bg-[#0c0f17]/95">
            <CustomCubePainter
              currentCubeState={cubeState}
              theme={theme}
              onApplyAndSolve={handleApplyCustomState}
              onCancel={() => setActiveTab('lab')}
            />
          </div>
        )}

        {/* TAB 3: TOOL-BASED BLOG ARTICLES & GUIDES */}
        {activeTab === 'blog' && (
          <div className="absolute inset-0 w-full h-full overflow-y-auto p-4 sm:p-6 z-20 bg-[#0c0f17]/95">
            <BlogArticles
              onLoadAlgorithm={handleLoadAlgorithmFromBlog}
              onJumpToTab={setActiveTab}
              onSetExploded={setExplodedOffset}
            />
          </div>
        )}

        {/* TAB 3: 43 QUINTILLION COMBINATORICS & GROUP THEORY */}
        {activeTab === 'math' && (
          <div className="absolute inset-0 w-full h-full overflow-y-auto p-4 sm:p-6 z-20 bg-[#0c0f17]/95">
            <div className="max-w-4xl mx-auto">
              <CombinatoricsExplorer />
            </div>
          </div>
        )}

        {/* TAB 4: PATTERN GALLERY */}
        {activeTab === 'patterns' && (
          <div className="absolute inset-0 w-full h-full overflow-y-auto p-4 sm:p-6 z-20 bg-[#0c0f17]/95">
            <PatternGallery
              onApplyPattern={handleApplyPattern}
              activePatternId={activePatternId}
            />
          </div>
        )}

        {/* TAB 5: SPEEDCUBING TIMER */}
        {activeTab === 'timer' && (
          <div className="absolute inset-0 w-full h-full overflow-y-auto p-4 sm:p-6 z-20 bg-[#0c0f17]/95 flex items-center justify-center">
            <div className="w-full">
              <SpeedTimer onApplyScrambleToCube={handleApplyScrambleFromTimer} />
            </div>
          </div>
        )}
      </main>

      {/* Persistent Semantic Footer */}
      <footer className="relative z-40 w-full bg-slate-950/95 border-t border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono">
          &copy; {new Date().getFullYear()} Cubist 3x3. All rights reserved.
        </span>
        <span>
          Designed by{' '}
          <a
            href="https://www.upwork.com/freelancers/~01340671a44db8188a"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/40 underline-offset-2 transition-colors"
          >
            Ayesha Raziq
          </a>
        </span>
      </footer>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <GearAndMonetizationModal isOpen={isGearOpen} onClose={() => setIsGearOpen(false)} />
    </div>
  );
}
