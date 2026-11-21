/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';

export type CubeColor = 'white' | 'yellow' | 'orange' | 'red' | 'green' | 'blue';

export const FACE_COLORS: Record<Face, CubeColor> = {
  U: 'white',
  D: 'yellow',
  L: 'orange',
  R: 'red',
  F: 'green',
  B: 'blue',
};

export const COLOR_HEX: Record<CubeColor, string> = {
  white: '#F8FAFC',
  yellow: '#FACC15',
  orange: '#FB923C',
  red: '#EF4444',
  green: '#22C55E',
  blue: '#3B82F6',
};

export type Move = 
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'L' | "L'" | 'L2'
  | 'R' | "R'" | 'R2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2'
  | 'M' | "M'" | 'M2'
  | 'E' | "E'" | 'E2'
  | 'S' | "S'" | 'S2'
  | 'x' | "x'" | 'x2'
  | 'y' | "y'" | 'y2'
  | 'z' | "z'" | 'z2';

export interface StickerCoord {
  face: Face;
  row: number; // 0 to 2
  col: number; // 0 to 2
}

/** 54 stickers: 6 faces x 9 stickers */
export type CubeFaceState = [
  [CubeColor, CubeColor, CubeColor],
  [CubeColor, CubeColor, CubeColor],
  [CubeColor, CubeColor, CubeColor]
];

export type CubeState = Record<Face, CubeFaceState>;

export interface SolverStep {
  id: string;
  phase: string;
  phaseIndex: number;
  title: string;
  description: string;
  algorithmName?: string;
  moves: Move[];
  highlightPieces?: string[];
  explanation: string;
}

export interface SolverResult {
  steps: SolverStep[];
  totalMoves: number;
  solved: boolean;
  solutionString: string;
}

export interface Pattern {
  id: string;
  name: string;
  author?: string;
  moves: string;
  description: string;
  mathSignificance?: string;
  category: 'art' | 'math' | 'symmetry';
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  category: string;
  author: string;
  publishedDate: string;
  summary: string;
  sections: ArticleSection[];
}

export interface ArticleSection {
  title: string;
  content: string[];
  interactiveType?: 'combinatorics' | 'algorithm_player' | 'exploded_view' | 'gods_number' | 'parity_tester' | 'net_explorer';
  interactiveData?: any;
}

export type ThemeName = 'classic' | 'neon' | 'pastel' | 'carbon' | 'wood-gold';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  bodyColor: string;
  roughness: number;
  metalness: number;
  colors: Record<CubeColor, string>;
}
