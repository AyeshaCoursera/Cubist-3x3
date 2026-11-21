/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Play, CheckCircle2, ChevronRight, Layers, Award, Clock, ArrowRight } from 'lucide-react';
import { Article } from '../types/cube';
import { ActiveTab } from './Navigation';

interface BlogArticlesProps {
  onLoadAlgorithm: (moves: string, label: string) => void;
  onJumpToTab: (tab: ActiveTab) => void;
  onSetExploded: (offset: number) => void;
}

export const ARTICLES: Article[] = [
  {
    id: 'combinatorics-universe',
    title: 'The 43 Quintillion Universe: Why the Cube is so Vast Yet so Small',
    subtitle: 'Breaking down the group theory, permutation parity, and the 12 cosmic orbits of the 3x3x3.',
    readTime: '6 min read',
    category: 'Group Theory & Math',
    author: 'Mathematical Sciences Review',
    publishedDate: 'Visual Explainer',
    summary: 'A deep-dive into how 26 mechanical cubies yield 43,252,003,274,489,856,000 states, why disassembling the cube creates 11 impossible parallel universes, and how God\'s Number limits any solve to just 20 turns.',
    sections: [
      {
        title: '1. The Illusion of 54 Independent Stickers',
        content: [
          'To an untrained observer, a Rubik\'s Cube looks like 54 colored stickers that can move anywhere. If that were true, there would be 54! / (9!⁶) ≈ 1.01 × 10³⁸ configurations.',
          'In reality, stickers are not independent. They are permanently welded to 26 rigid plastic cubies: 6 fixed centers with 1 sticker, 12 edges with 2 stickers, and 8 corners with 3 stickers. The centers never move relative to each other—white is always opposite yellow, green opposite blue, and red opposite orange in the standard Western color scheme.'
        ],
        interactiveType: 'exploded_view',
      },
      {
        title: '2. The Permutations: 8! Corners and 12! Edges',
        content: [
          'The 8 corner cubies can be placed into 8 distinct corner slots, yielding 8! = 40,320 spatial permutations.',
          'Similarly, the 12 edge cubies can occupy any of the 12 edge slots, yielding 12! = 479,001,600 permutations.',
          'Multiplied together: 40,320 × 479,001,600 ≈ 1.93 × 10¹³ piece arrangements.'
        ]
      },
      {
        title: '3. The Orientations & The Invariant Laws of Physics',
        content: [
          'Each of the 8 corners can be twisted into 3 rotational orientations. However, the twist of the first 7 corners mathematically dictates the orientation of the final 8th corner: ∑ twists ≡ 0 (mod 3). Thus, we multiply by 3⁷ = 2,187.',
          'Each of the 12 edges can be either in normal orientation or flipped. The sum of edge flips must be even: ∑ flips ≡ 0 (mod 2). Thus, we multiply by 2¹¹ = 2,048.',
          'Finally, the Parity Law states that corners and edges cannot be swapped independently with an odd permutation. Swapping two pieces requires an odd permutation, so we must divide the whole total by 2.'
        ],
        interactiveType: 'combinatorics',
      },
      {
        title: '4. The 11 Phantom Universes (The 1/12 Law)',
        content: [
          'If you take a flathead screwdriver, pop open your cube, and assemble it randomly, the laws of permutation parity, corner twist conservation, and edge flip conservation are broken.',
          'Because 3 × 2 × 2 = 12, there are 12 mutually inaccessible orbits in the physical configuration space. Only 1 of those 12 orbits is solvable through legal face turns. You have an 8.33% chance of assembling a solvable cube!'
        ],
        interactiveType: 'parity_tester',
      }
    ]
  },
  {
    id: 'layer-by-layer-mastery',
    title: 'Cracking the 3x3: The Layer Architecture (CFOP & Beginner)',
    subtitle: 'From the Daisy to the U-Perm: the algorithms, geometric commutators, and fingertricks.',
    readTime: '8 min read',
    category: 'Algorithms & Tutorial',
    author: 'Speedcubing Academy',
    publishedDate: 'Interactive Guide',
    summary: 'The systematic 7-step Layer-by-Layer solution method explained visually with interactive algorithm testers for the Sexy Move, Sune, and T-Perm.',
    sections: [
      {
        title: '1. Phase 1: The White Cross (Bottom Foundation)',
        content: [
          'Most beginners begin by forming a "Daisy" (4 white edges around the yellow center), then rotating each petal 180° down into the white face to match side center colors.',
          'Speedcubers bypass the daisy, solving the cross directly on the bottom (D face) in 8 moves or fewer using inspection time.'
        ],
        interactiveType: 'algorithm_player',
        interactiveData: {
          alg: "D R' F D' R2",
          label: 'Cross Insertion Example',
          desc: 'Inserts white edges while preserving existing alignments.'
        }
      },
      {
        title: '2. The Fundamental "Sexy Move" Trigger (R U R\' U\')',
        content: [
          'If you only memorize one sequence in all of cubing, make it this: R U R\' U\'. Nicknamed the "Sexy Move" for its effortless ergonomics, this 4-move trigger is an order-6 commutator.',
          'Repeat it 6 times in succession on a solved cube, and the cube magically returns to 100% solved! Repeat it once or twice with a corner above its slot, and it slides the corner straight down into the first layer.'
        ],
        interactiveType: 'algorithm_player',
        interactiveData: {
          alg: "R U R' U' R U R' U' R U R' U' R U R' U' R U R' U' R U R' U'",
          label: 'Sexy Move Cycle (x6)',
          desc: 'Applies R U R\' U\' six times, demonstrating group periodicity.'
        }
      },
      {
        title: '3. Second Layer Conjugates (F2L)',
        content: [
          'To insert an edge into the middle layer between two solved centers without wrecking the white bottom layer, we use the conjugate pair algorithm: U R U\' R\' U\' F\' U F.',
          'Notice how the first 4 moves (U R U\' R\') pair up the corner and edge in the top layer, while the second 4 moves (U\' F\' U F) seat the pair into the slot.'
        ],
        interactiveType: 'algorithm_player',
        interactiveData: {
          alg: "U R U' R' U' F' U F",
          label: 'F2L Right Insertion',
          desc: 'Pairs and docks the middle layer edge.'
        }
      },
      {
        title: '4. The Sune & Anti-Sune (OLL Corners)',
        content: [
          'Discovered in Sweden in the early 1980s by Sune Gustafsson, the Sune (R U R\' U R U2 R\') twists three yellow corners clockwise while holding one corner intact.',
          'It is one of the fastest, most satisfying algorithms in competitive speedcubing, executed in under 0.4 seconds by world-class cubers.'
        ],
        interactiveType: 'algorithm_player',
        interactiveData: {
          alg: "R U R' U R U2 R'",
          label: 'The Sune (OLL 27)',
          desc: 'Twists 3 top corners clockwise while preserving edges.'
        }
      }
    ]
  },
  {
    id: 'gods-number',
    title: 'God\'s Number: The 30-Year Mathematical Search for 20 Moves',
    subtitle: 'How 35 CPU-years of Google supercomputers proved every cube is solvable in 20 moves or less.',
    readTime: '5 min read',
    category: 'Computer Science',
    author: 'Algorithms & Discrete Math',
    publishedDate: 'Historical Essay',
    summary: 'The thrilling story of how mathematicians and computer scientists bounded the diameter of the Cayley graph of the Rubik\'s group, culminating in the 2010 proof of God\'s Number = 20.',
    sections: [
      {
        title: '1. The Cayley Graph Diameter',
        content: [
          'If we represent every one of the 43 quintillion states as a vertex in a colossal graph, and connect two vertices with an edge if they differ by a single quarter or half turn (Half Turn Metric, HTM), what is the graph\'s diameter?',
          'That diameter is known as God\'s Number: the maximum number of moves an omniscient solver would ever need to solve the worst possible scramble.'
        ]
      },
      {
        title: '2. The Superflip Breakthrough (1995)',
        content: [
          'In 1995, mathematician Michael Reid proved that "The Superflip"—a state where all corners are solved, but all 12 edges are flipped—requires AT LEAST 20 moves. This established a lower bound: God\'s Number ≥ 20.',
          'For 15 years, researchers chipped away at the upper bound: 52 (Morwen Thistlethwaite, 1981), 42 (Hanns Dimca, 1992), 29 (Michael Reid, 1995), 26 (Radu Hermel, 2007).'
        ],
        interactiveType: 'algorithm_player',
        interactiveData: {
          alg: "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
          label: 'Load The Superflip',
          desc: 'The historic 20-move minimal state discovered by Michael Reid.'
        }
      },
      {
        title: '3. The Final Proof (July 2010)',
        content: [
          'Tomas Rokicki, Herbert Kociemba, Morley Davidson, and John Dethridge partitioned the 43 quintillion states into 2,217,091,320 cosets of a subgroup H.',
          'Using symmetries, they reduced the search space and computed the distance using idle computing time donated by Google (approx 35 CPU years), proving once and for all: EVERY position can be solved in 20 moves or less!'
        ]
      }
    ]
  }
];

export const BlogArticles: React.FC<BlogArticlesProps> = ({
  onLoadAlgorithm,
  onJumpToTab,
  onSetExploded,
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(ARTICLES[0].id);

  const currentArticle = ARTICLES.find(a => a.id === selectedArticleId) || ARTICLES[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Article Selector Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ARTICLES.map(art => {
          const isActive = art.id === selectedArticleId;
          return (
            <button
              key={art.id}
              onClick={() => setSelectedArticleId(art.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{art.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Article Content */}
      <article className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-8">
        {/* Article Header */}
        <header className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-semibold">
              {currentArticle.category}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {currentArticle.readTime}
            </span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-400">{currentArticle.publishedDate}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {currentArticle.title}
          </h1>

          <p className="text-base text-slate-300 leading-relaxed font-normal">
            {currentArticle.subtitle}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs text-slate-300 font-mono italic">
            Summary: {currentArticle.summary}
          </div>
        </header>

        {/* Article Sections */}
        <div className="space-y-8 text-slate-200">
          {currentArticle.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="text-indigo-400 font-mono text-sm">{sIdx + 1}.</span>
                {section.title}
              </h2>

              <div className="space-y-3 text-sm leading-relaxed text-slate-300">
                {section.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Embedded Interactive Tool Widget */}
              {section.interactiveType === 'algorithm_player' && section.interactiveData && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
                      <Play className="w-3.5 h-3.5" />
                      Interactive Algorithm Sandbox
                    </div>
                    <div className="text-sm font-bold text-white">
                      {section.interactiveData.label}
                    </div>
                    <div className="font-mono text-xs text-amber-300 mt-0.5">
                      {section.interactiveData.alg}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {section.interactiveData.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onLoadAlgorithm(section.interactiveData.alg, section.interactiveData.label)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run in 3D Viewport</span>
                  </button>
                </div>
              )}

              {section.interactiveType === 'exploded_view' && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      Speedcube Mechanism Inspection
                    </div>
                    <p className="text-xs text-slate-400">
                      Explore the internal 6-axis spider core and spring-loaded screw tensions.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSetExploded(0.55)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium transition-colors"
                    >
                      Explode 50%
                    </button>
                    <button
                      onClick={() => onSetExploded(0)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      Assemble
                    </button>
                  </div>
                </div>
              )}

              {section.interactiveType === 'combinatorics' && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-indigo-300">
                      Open 43 Quintillion Interactive Explorer
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Adjust parity constraints and test cosmic scale analogies.
                    </p>
                  </div>
                  <button
                    onClick={() => onJumpToTab('math')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <span>Launch Math Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </section>
          ))}
        </div>
      </article>

      {/* AEO & GEO Quick Answer Knowledge Base */}
      <section
        aria-label="Frequently Asked Questions about 3x3 Rubik's Cube Algorithms and Possibilities"
        className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-lg space-y-5"
      >
        <div className="border-b border-slate-800 pb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Quick Answers &amp; Mathematical Reference
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            Frequently Asked Questions (3x3 Solver &amp; Combinatorics)
          </h2>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <dt className="font-bold text-white text-sm">
              How many possibilities does a 3x3 Rubik&apos;s Cube have?
            </dt>
            <dd className="text-slate-300 leading-relaxed">
              A standard 3x3x3 Rubik&apos;s Cube has exactly <strong className="text-amber-300">43,252,003,274,489,856,000</strong> (43.25 quintillion) legal positions, computed as <span className="font-mono text-indigo-300">(8! &times; 3⁷ &times; 12! &times; 2¹¹) / 2</span>.
            </dd>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <dt className="font-bold text-white text-sm">
              What is God&apos;s Number for a 3x3 Rubik&apos;s Cube?
            </dt>
            <dd className="text-slate-300 leading-relaxed">
              God&apos;s Number is <strong className="text-emerald-300">20 moves</strong> in the Half-Turn Metric (HTM), proven in July 2010 by Rokicki, Kociemba, Davidson, and Dethridge using Google compute clusters.
            </dd>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <dt className="font-bold text-white text-sm">
              Why can a disassembled Rubik&apos;s Cube be unsolvable?
            </dt>
            <dd className="text-slate-300 leading-relaxed">
              Physical disassembly ignores corner twist (mod 3), edge flip (mod 2), and permutation parity. This creates 12 isolated orbits, meaning only <strong className="text-indigo-300">1 in 12 (8.33%)</strong> random assemblies is solvable.
            </dd>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <dt className="font-bold text-white text-sm">
              Can I solve my real physical Rubik&apos;s Cube with Cubist?
            </dt>
            <dd className="text-slate-300 leading-relaxed">
              Yes. Open the <strong className="text-emerald-300">Paint &amp; Solve</strong> tab, click each cell on the 54-sticker net to mirror your real cube, verify solvability, and follow the 7-phase 3D animated steps.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
};
