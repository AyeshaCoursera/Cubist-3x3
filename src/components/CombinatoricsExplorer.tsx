/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calculator, Globe, Sparkles, AlertCircle, Compass, Zap } from 'lucide-react';

export const CombinatoricsExplorer: React.FC = () => {
  const [cornerOrientationIgnored, setCornerOrientationIgnored] = useState(false);
  const [edgeOrientationIgnored, setEdgeOrientationIgnored] = useState(false);
  const [parityConstraintIgnored, setParityConstraintIgnored] = useState(false);

  // BigInt calculation for 43 quintillion
  const fact8 = BigInt(40320);
  const cornerOri = cornerOrientationIgnored ? BigInt(6561) : BigInt(2187); // 3^8 vs 3^7
  const fact12 = BigInt(479001600);
  const edgeOri = edgeOrientationIgnored ? BigInt(4096) : BigInt(2048); // 2^12 vs 2^11
  const parityDivisor = parityConstraintIgnored ? BigInt(1) : BigInt(2);

  const calculatedTotal = (fact8 * cornerOri * fact12 * edgeOri) / parityDivisor;
  const standardTotal = BigInt('4325200327448985600');
  const ratio = Number(calculatedTotal) / Number(standardTotal);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-purple-950/40 border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5" />
              Combinatorics &amp; Group Theory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              43,252,003,274,489,856,000
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Forty-three quintillion, two hundred fifty-two quadrillion possibilities.
              Every legal twist is an element of the Rubik&apos;s Cube group <span className="font-mono text-indigo-300">G</span>, a subgroup of the symmetric group <span className="font-mono text-indigo-300">S₄₈</span>.
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs uppercase font-mono tracking-wider text-indigo-400">Current Computed States</span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
              {calculatedTotal.toLocaleString()}
            </span>
            {ratio !== 1 && (
              <span className="text-xs text-rose-400 font-mono mt-0.5">
                ({ratio}x standard legal states &mdash; contains illegal orbits!)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Factor Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Factor 1: Corner Permutations */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>8 Corners Position</span>
            <span className="text-indigo-400 font-bold">8!</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">40,320</div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            The 8 corner cubies can be permuted into any of 8! distinct slots in 3D space.
          </p>
        </div>

        {/* Factor 2: Corner Orientations */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>Corner Orientations</span>
            <span className="text-indigo-400 font-bold">3⁷</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">2,187</div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Each corner has 3 possible twists. The first 7 can twist freely; the 8th is determined by orientation law (mod 3 sum = 0).
          </p>
        </div>

        {/* Factor 3: Edge Permutations */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>12 Edges Position</span>
            <span className="text-indigo-400 font-bold">12!</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">479,001,600</div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            The 12 edge cubies can be arranged in 12! different topological locations along the cube frame.
          </p>
        </div>

        {/* Factor 4: Edge Orientations */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>Edge Orientations</span>
            <span className="text-indigo-400 font-bold">2¹¹</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">2,048</div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Each edge can be normal or flipped (2 orientations). The 12th edge orientation is locked by the first 11 (mod 2 sum = 0).
          </p>
        </div>
      </div>

      {/* The Parity & The 1/12 Law Explorer */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-amber-400" />
          The Law of Disassembly: Why only 1 in 12 Random Cubes is Solvable
        </h3>
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          If you peel off the stickers or take a screwdriver to physically pry apart the 26 cubies and reassemble them at random, you create one of <span className="font-mono text-amber-300">519,024,039,293,878,272,000</span> (519 quintillion) physical states.
          However, because cube twists are even permutations that preserve parity and twist invariants, the universe of physical states is divided into <strong className="text-white">12 isolated orbits</strong>. You only have an <strong>8.33% (1 in 12)</strong> chance of ending up in the solvable orbit!
        </p>

        {/* Interactive Orbit Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-950 transition-colors">
            <input
              type="checkbox"
              checked={cornerOrientationIgnored}
              onChange={e => setCornerOrientationIgnored(e.target.checked)}
              className="mt-1 accent-indigo-500 rounded"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">Illegal Corner Twist (1/3)</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pry a single corner and twist it 120°. The cube cannot be solved without twisting it back.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-950 transition-colors">
            <input
              type="checkbox"
              checked={edgeOrientationIgnored}
              onChange={e => setEdgeOrientationIgnored(e.target.checked)}
              className="mt-1 accent-indigo-500 rounded"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">Illegal Edge Flip (1/2)</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Flip exactly one edge piece in place. No valid sequence of moves can ever flip a single edge.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:bg-slate-950 transition-colors">
            <input
              type="checkbox"
              checked={parityConstraintIgnored}
              onChange={e => setParityConstraintIgnored(e.target.checked)}
              className="mt-1 accent-indigo-500 rounded"
            />
            <div>
              <div className="text-xs font-semibold text-slate-200">Permutation Parity (1/2)</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Swap only two pieces (e.g. two edges or two corners). Every face quarter-turn is an even permutation.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Mind-Bending Physical Analogies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-2">
            <Globe className="w-4 h-4" />
            Planetary Blanket
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If you had 43 quintillion standard 57mm cubes, they would cover the entire surface area of Earth (both land and oceans) in a continuous solid layer <strong className="text-indigo-200">275 cubes deep</strong>!
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-2">
            <Sparkles className="w-4 h-4" />
            Age of the Universe
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Turning the cube at <strong className="text-amber-200">1 move per second</strong> since the Big Bang (13.8 billion years) would only cycle through <span className="font-mono">4.35 × 10¹⁷</span> states &mdash; less than <strong>0.000000001%</strong> of all configurations.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-2">
            <Zap className="w-4 h-4" />
            God&apos;s Number: 20
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Despite 43 quintillion states, the maximum distance from any scrambled position to solved is exactly <strong className="text-emerald-300">20 moves</strong> (Half Turn Metric), proved in July 2010 by Rokicki et al.
          </p>
        </div>
      </div>
    </div>
  );
};
