/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Timer, RefreshCw, Trophy, Play, CheckCircle2, RotateCcw } from 'lucide-react';
import { generateScramble } from '../cube/cubeLogic';
import { cubeSound } from '../audio/cubeSound';

interface SpeedTimerProps {
  onApplyScrambleToCube: (scramble: string) => void;
}

export const SpeedTimer: React.FC<SpeedTimerProps> = ({ onApplyScrambleToCube }) => {
  const [scramble, setScramble] = useState<string>(generateScramble());
  const [timerState, setTimerState] = useState<'idle' | 'holding' | 'ready' | 'running' | 'finished'>('idle');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [history, setHistory] = useState<{ id: string; time: number; scramble: string }[]>([]);

  const holdTimeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // New Scramble
  const handleNewScramble = () => {
    const s = generateScramble();
    setScramble(s);
  };

  // Keyboard handlers for spacebar timer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      if (e.repeat) return;

      if (timerState === 'running') {
        stopTimer();
      } else if (timerState === 'idle' || timerState === 'finished') {
        setTimerState('holding');
        holdTimeoutRef.current = window.setTimeout(() => {
          setTimerState('ready');
          cubeSound.playClick(1.5);
        }, 350);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;

      if (timerState === 'ready') {
        startTimer();
      } else if (timerState === 'holding') {
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        setTimerState('idle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [timerState]);

  const startTimer = () => {
    startTimeRef.current = performance.now();
    setTimerState('running');

    const update = () => {
      const now = performance.now();
      setElapsedTime(now - startTimeRef.current);
      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);
  };

  const stopTimer = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    const finalTime = performance.now() - startTimeRef.current;
    setElapsedTime(finalTime);
    setTimerState('finished');
    cubeSound.playSnap();

    // Add to history
    setHistory(prev => [
      { id: Date.now().toString(), time: finalTime, scramble },
      ...prev,
    ]);

    // Next scramble
    setScramble(generateScramble());
  };

  // Formatter: mm:ss.ms
  const formatTime = (ms: number) => {
    const totalSec = ms / 1000;
    const minutes = Math.floor(totalSec / 60);
    const seconds = Math.floor(totalSec % 60);
    const millis = Math.floor((ms % 1000) / 10);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
    }
    return `${seconds}.${millis.toString().padStart(2, '0')}`;
  };

  // Calculate Personal Best (PB) and Ao5
  const times = history.map(h => h.time);
  const pb = times.length > 0 ? Math.min(...times) : null;

  const calculateAo5 = () => {
    if (times.length < 5) return null;
    const last5 = [...times.slice(0, 5)].sort((a, b) => a - b);
    // Drop fastest and slowest, average middle 3
    const middle3 = last5.slice(1, 4);
    return middle3.reduce((a, b) => a + b, 0) / 3;
  };

  const ao5 = calculateAo5();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Scramble Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Timer className="w-3.5 h-3.5" />
            Official WCA 3x3 Scramble
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onApplyScrambleToCube(scramble)}
              className="px-2.5 py-1 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-medium transition-colors"
            >
              Load on 3D Cube
            </button>
            <button
              onClick={handleNewScramble}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Next scramble"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="font-mono text-base sm:text-lg font-bold text-slate-100 tracking-wider select-all py-1">
          {scramble}
        </div>
      </div>

      {/* Big Timer Display */}
      <div
        className={`p-10 rounded-3xl border text-center transition-all cursor-pointer select-none ${
          timerState === 'ready'
            ? 'bg-emerald-950/40 border-emerald-500 shadow-2xl shadow-emerald-500/20'
            : timerState === 'holding'
            ? 'bg-amber-950/40 border-amber-500 shadow-2xl shadow-amber-500/20'
            : timerState === 'running'
            ? 'bg-indigo-950/30 border-indigo-500 shadow-xl'
            : 'bg-slate-900/90 border-slate-800'
        }`}
        onPointerDown={() => {
          if (timerState === 'running') {
            stopTimer();
          } else if (timerState === 'idle' || timerState === 'finished') {
            setTimerState('holding');
            holdTimeoutRef.current = window.setTimeout(() => {
              setTimerState('ready');
            }, 350);
          }
        }}
        onPointerUp={() => {
          if (timerState === 'ready') {
            startTimer();
          } else if (timerState === 'holding') {
            if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
            setTimerState('idle');
          }
        }}
      >
        <div
          className={`font-mono font-black text-6xl sm:text-8xl tracking-tight transition-colors ${
            timerState === 'ready'
              ? 'text-emerald-400'
              : timerState === 'holding'
              ? 'text-amber-400'
              : timerState === 'running'
              ? 'text-white'
              : 'text-slate-100'
          }`}
        >
          {formatTime(elapsedTime)}
        </div>

        <div className="mt-4 text-xs font-mono text-slate-400 uppercase tracking-widest">
          {timerState === 'ready'
            ? 'Release Spacebar or Touch to Start!'
            : timerState === 'holding'
            ? 'Hold ready...'
            : timerState === 'running'
            ? 'Press Space or Tap Screen to Stop'
            : 'Hold Spacebar or Tap & Hold to Arm Timer'}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Best (PB)</div>
          <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">
            {pb !== null ? formatTime(pb) : '--:--'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Average of 5 (Ao5)</div>
          <div className="text-lg font-bold font-mono text-indigo-300 mt-0.5">
            {ao5 !== null ? formatTime(ao5) : '--:--'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Solves Count</div>
          <div className="text-lg font-bold font-mono text-slate-100 mt-0.5">
            {history.length}
          </div>
        </div>
      </div>

      {/* Solve History */}
      {history.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
            <span>Session Solve Log</span>
            <button
              onClick={() => setHistory([])}
              className="text-[11px] text-slate-500 hover:text-rose-400 font-mono transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {history.map((h, i) => (
              <div
                key={h.id}
                className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 font-mono"
              >
                <span className="text-slate-500">#{history.length - i}</span>
                <span className="font-bold text-slate-100">{formatTime(h.time)}</span>
                <span className="text-[10px] text-slate-400 truncate max-w-xs">{h.scramble}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
