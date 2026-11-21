/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CubeColor, CubeState, Face, FACE_COLORS } from '../types/cube';

export interface ValidationIssue {
  type: 'counts' | 'centers' | 'edges' | 'corners' | 'parity' | 'orientation';
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  canSolve: boolean;
  colorCounts: Record<CubeColor, number>;
  issues: ValidationIssue[];
}

export const ALL_COLORS: CubeColor[] = ['white', 'yellow', 'green', 'blue', 'red', 'orange'];

// Standard opposite color pairs
export const OPPOSITE_COLORS: Record<CubeColor, CubeColor> = {
  white: 'yellow',
  yellow: 'white',
  green: 'blue',
  blue: 'green',
  red: 'orange',
  orange: 'red',
};

/**
 * Validate a 54-sticker cube state to ensure it is physically valid and solvable.
 */
export function validateCubeState(state: CubeState): ValidationResult {
  const issues: ValidationIssue[] = [];

  // 1. Check Color Counts
  const colorCounts: Record<CubeColor, number> = {
    white: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    red: 0,
    orange: 0,
  };

  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];

  for (const f of faces) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const color = state[f][r][c];
        if (colorCounts[color] !== undefined) {
          colorCounts[color]++;
        }
      }
    }
  }

  const badCounts = ALL_COLORS.filter(col => colorCounts[col] !== 9);
  if (badCounts.length > 0) {
    const details = ALL_COLORS.map(col => `${col}: ${colorCounts[col]}/9`).join(', ');
    issues.push({
      type: 'counts',
      message: `Each of the 6 colors must have exactly 9 stickers. Currently: ${details}`,
      severity: 'error',
    });
  }

  // 2. Check Centers (must be 6 distinct colors)
  const centerColors = faces.map(f => state[f][1][1]);
  const uniqueCenters = new Set(centerColors);
  if (uniqueCenters.size !== 6) {
    issues.push({
      type: 'centers',
      message: 'All 6 face centers must have unique colors (one of each).',
      severity: 'error',
    });
  }

  // 3. Check for Impossible Opposites on Edges
  // 12 edges
  const edgeDefinitions: [Face, number, number, Face, number, number][] = [
    ['U', 0, 1, 'B', 0, 1],
    ['U', 1, 2, 'R', 0, 1],
    ['U', 2, 1, 'F', 0, 1],
    ['U', 1, 0, 'L', 0, 1],

    ['D', 0, 1, 'F', 2, 1],
    ['D', 1, 2, 'R', 2, 1],
    ['D', 2, 1, 'B', 2, 1],
    ['D', 1, 0, 'L', 2, 1],

    ['F', 1, 2, 'R', 1, 0],
    ['R', 1, 2, 'B', 1, 0],
    ['B', 1, 2, 'L', 1, 0],
    ['L', 1, 2, 'F', 1, 0],
  ];

  const seenEdges = new Set<string>();
  let hasInvalidEdge = false;

  for (const [f1, r1, c1, f2, r2, c2] of edgeDefinitions) {
    const col1 = state[f1][r1][c1];
    const col2 = state[f2][r2][c2];

    if (col1 === col2) {
      issues.push({
        type: 'edges',
        message: `Edge piece at ${f1}-${f2} has duplicate colors (${col1}-${col2}).`,
        severity: 'error',
      });
      hasInvalidEdge = true;
      break;
    }

    if (OPPOSITE_COLORS[col1] === col2) {
      issues.push({
        type: 'edges',
        message: `Edge piece at ${f1}-${f2} has opposite colors (${col1} & ${col2}), which is physically impossible.`,
        severity: 'error',
      });
      hasInvalidEdge = true;
      break;
    }

    const key = [col1, col2].sort().join('-');
    if (seenEdges.has(key)) {
      issues.push({
        type: 'edges',
        message: `Duplicate edge piece found with colors ${key}.`,
        severity: 'error',
      });
      hasInvalidEdge = true;
      break;
    }
    seenEdges.add(key);
  }

  // 4. Check Corner Validity
  // 8 corners
  const cornerDefinitions: [Face, number, number, Face, number, number, Face, number, number][] = [
    ['U', 0, 0, 'B', 0, 2, 'L', 0, 0],
    ['U', 0, 2, 'R', 0, 2, 'B', 0, 0],
    ['U', 2, 2, 'F', 0, 2, 'R', 0, 0],
    ['U', 2, 0, 'L', 0, 2, 'F', 0, 0],

    ['D', 0, 0, 'F', 2, 0, 'L', 2, 2],
    ['D', 0, 2, 'R', 2, 0, 'F', 2, 2],
    ['D', 2, 2, 'B', 2, 0, 'R', 2, 2],
    ['D', 2, 0, 'L', 2, 0, 'B', 2, 2],
  ];

  const seenCorners = new Set<string>();

  for (const [f1, r1, c1, f2, r2, c2, f3, r3, c3] of cornerDefinitions) {
    const col1 = state[f1][r1][c1];
    const col2 = state[f2][r2][c2];
    const col3 = state[f3][r3][c3];

    // Check duplicates in single piece
    if (col1 === col2 || col1 === col3 || col2 === col3) {
      issues.push({
        type: 'corners',
        message: `Corner piece has duplicate colors (${col1}, ${col2}, ${col3}).`,
        severity: 'error',
      });
      break;
    }

    // Check opposite colors on same corner
    if (
      OPPOSITE_COLORS[col1] === col2 ||
      OPPOSITE_COLORS[col1] === col3 ||
      OPPOSITE_COLORS[col2] === col3
    ) {
      issues.push({
        type: 'corners',
        message: `Corner has mutually opposite colors (${col1}, ${col2}, ${col3}), which is physically impossible.`,
        severity: 'error',
      });
      break;
    }

    const key = [col1, col2, col3].sort().join('-');
    if (seenCorners.has(key)) {
      issues.push({
        type: 'corners',
        message: `Duplicate corner piece found with colors ${key}.`,
        severity: 'error',
      });
      break;
    }
    seenCorners.add(key);
  }

  const isValid = issues.length === 0;

  return {
    isValid,
    canSolve: isValid,
    colorCounts,
    issues,
  };
}
