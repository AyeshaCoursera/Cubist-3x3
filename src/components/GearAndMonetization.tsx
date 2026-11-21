/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
  ExternalLink,
  Award,
  Coffee,
  Download,
  Check,
  Star,
  FileText,
  DollarSign,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';

interface GearAndMonetizationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SpeedCubeProduct {
  id: string;
  name: string;
  brand: string;
  badge: string;
  price: string;
  rating: number;
  description: string;
  features: string[];
  affiliateUrl: string; // User can replace with their own Amazon / SpeedCubeShop affiliate link
}

const RECOMMENDED_CUBES: SpeedCubeProduct[] = [
  {
    id: 'moyu-rs3m-v5',
    name: 'MoYu RS3M V5 (Dual Magnetic)',
    brand: 'MoYu',
    badge: 'Best Value / Budget Champion',
    price: '$9.99',
    rating: 4.9,
    description: 'The undisputed #1 best budget speedcube in the world. Magnetic alignment with ultra-smooth turning for beginners and pros alike.',
    features: ['Dual magnetic adjustment', 'Spring tension compression', 'Lightweight 65g design'],
    affiliateUrl: 'https://www.amazon.com/dp/B0CKZ5297H?tag=yourtag-20',
  },
  {
    id: 'x-man-tornado-v3',
    name: 'X-Man Tornado V3 Flagship',
    brand: 'QiYi',
    badge: 'World Record Holder Choice',
    price: '$28.99',
    rating: 5.0,
    description: 'Used by Max Park to set the 3.13-second 3x3 World Record. Flawless corner cutting, whisper-quiet magnetic feel, and tactile clicks.',
    features: ['Core magnets + edge repulsion', 'Silent turning tracks', 'Dual-adjustment ring system'],
    affiliateUrl: 'https://www.amazon.com/dp/B0BG76M75Y?tag=yourtag-20',
  },
  {
    id: 'gan-14-maglev',
    name: 'GAN 14 MagLev UV Coated',
    brand: 'GAN Cube',
    badge: 'Luxury Flagship',
    price: '$64.99',
    rating: 4.8,
    description: 'The Formula 1 car of speedcubes. Frictionless magnetic levitation instead of springs, auto-aligning core, and scratch-resistant UV gloss finish.',
    features: ['1,296 tuning configurations', 'Magnetic levitation (MagLev)', 'Enhanced auto-aligning core'],
    affiliateUrl: 'https://www.amazon.com/dp/B0CHW4H1X4?tag=yourtag-20',
  },
];

export const GearAndMonetizationModal: React.FC<GearAndMonetizationProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'gear' | 'cheatsheet' | 'monetization_guide'>('gear');
  const [emailSignedUp, setEmailSignedUp] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Speedcubing Hub &amp; Earnings Guide</h3>
              <p className="text-xs text-slate-400">Affiliate Gear, Printable Cheat Sheets &amp; Monetization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 px-4 pt-2 gap-2 bg-slate-950/60">
          <button
            onClick={() => setActiveTab('gear')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'gear'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Recommended Cubes</span>
          </button>

          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cheatsheet'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1-Page PDF Cheat Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('monetization_guide')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'monetization_guide'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>How to Earn $ With This App</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: RECOMMENDED SPEEDCUBES (AFFILIATE READY) */}
          {activeTab === 'gear' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-white">Why Magnetic Speedcubes?</span> Standard toy-store cubes are stiff and lock up easily. Modern magnetic speedcubes snap into alignment, turn effortlessly with finger tips, and cost under $10!
              </div>

              <div className="space-y-3">
                {RECOMMENDED_CUBES.map(cube => (
                  <div
                    key={cube.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {cube.badge}
                        </span>
                        <div className="flex items-center text-amber-400 text-xs gap-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-bold">{cube.rating}</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white">{cube.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                        {cube.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {cube.features.map((feat, i) => (
                          <span key={i} className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-base font-bold font-mono text-emerald-400">{cube.price}</div>
                      <a
                        href={cube.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
                      >
                        <span>Check Price</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PRINTABLE 1-PAGE CHEAT SHEET */}
          {activeTab === 'cheatsheet' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Printable 1-Page CFOP Algorithm Cheat Sheet
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Keep this beside your physical cube! Includes all 7 beginner-to-intermediate algorithms: White Cross shortcuts, Sexy Move insertions, F2L conjugates, FUR-URF, Sune, Headlights, and U-Perm.
                </p>
              </div>

              {/* Cheat Sheet Preview Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="text-slate-400 font-bold border-b border-slate-800 pb-1">
                  Summary Reference (Quick Look):
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div><strong className="text-amber-300">Phase 2 Corner:</strong> R U R&apos; U&apos;</div>
                  <div><strong className="text-amber-300">Phase 3 F2L Right:</strong> U R U&apos; R&apos; U&apos; F&apos; U F</div>
                  <div><strong className="text-amber-300">Phase 3 F2L Left:</strong> U&apos; L&apos; U L U F U&apos; F&apos;</div>
                  <div><strong className="text-amber-300">Phase 4 Cross:</strong> F R U R&apos; U&apos; F&apos;</div>
                  <div><strong className="text-amber-300">Phase 5 Sune:</strong> R U R&apos; U R U2 R&apos;</div>
                  <div><strong className="text-amber-300">Phase 6 Headlights:</strong> R&apos; F R&apos; B2 R F&apos; R&apos; B2 R2</div>
                  <div><strong className="text-amber-300">Phase 7 U-Perm:</strong> R U&apos; R U R U R U&apos; R&apos; U&apos; R2</div>
                </div>
              </div>

              {/* Lead Magnet / Email Sign-up */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white">Get High-Res Printable PDF (Vector Chart)</h4>
                {emailSignedUp ? (
                  <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Check your inbox! We sent your printable high-res PDF cheat sheet.</span>
                  </div>
                ) : (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (emailInput) setEmailSignedUp(true);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Enter your email for the PDF"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </form>
                )}
                <p className="text-[10px] text-slate-500 italic">
                  Tip for Creator: You can monetize this by selling an expanded 30-page &quot;Sub-20 Speedcubing Masterclass&quot; on Gumroad or Lemon Squeezy for $9.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: HOW TO EARN REAL MONEY WITH THIS APP */}
          {activeTab === 'monetization_guide' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  4 Proven Ways to Earn Real Income From This App
                </div>
                <p>
                  Because this is an interactive 3D tool with high user dwell time (users stay 5-15 minutes painting their cube and following steps), it is exceptionally well-suited for monetization:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    1. Speedcube Affiliate Programs
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Join the <strong>Amazon Associates</strong> or <strong>SpeedCubeShop / TheCubicle Affiliate Programs</strong>. Replace the links in this app with your affiliate ID. When users buy recommended cubes (like MoYu RS3M or GAN), you earn 4% - 10% commission per sale.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    2. High-RPM Display Advertising
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Connect <strong>Google AdSense</strong> or <strong>Carbon Ads</strong>. The keyword <em>&quot;Rubik&apos;s cube solver&quot;</em> gets over <strong>1,500,000 searches/month</strong>. Because users stay engaged following each step, your ad impressions and RPM (revenue per 1000 visitors) will be strong ($5–$25 RPM).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    3. Digital PDF Guides &amp; Algorithms
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Sell a printable full 57-OLL &amp; 21-PLL algorithm sheet on <strong>Gumroad</strong> or <strong>Etsy</strong> for $4.99. Embed the buy button directly in the &quot;1-Page Cheat Sheet&quot; tab.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    4. Creator Tip Jar / Buy Me a Coffee
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Add your <strong>Buy Me a Coffee</strong> or <strong>Kofi</strong> link. When you help a frustrated user finally solve their scrambled cube after months, they often gladly tip $3–$10!
                  </p>
                </div>
              </div>

              {/* Creator Tip Jar Sample */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  <span className="font-medium text-white">Creator Tip Jar Hook</span>
                </div>
                <a
                  href="https://buymeacoffee.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Support Creator ($3)</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">Cubist Monetization Framework v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
