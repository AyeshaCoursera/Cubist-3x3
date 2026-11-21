/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CubeColor, CubeFaceState, CubeState, Face, FACE_COLORS, Move } from '../types/cube';

export function createSolvedState(): CubeState {
  const state: Partial<CubeState> = {};
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];

  for (const f of faces) {
    const col = FACE_COLORS[f];
    state[f] = [
      [col, col, col],
      [col, col, col],
      [col, col, col],
    ] as CubeFaceState;
  }

  return state as CubeState;
}

export function cloneCubeState(state: CubeState): CubeState {
  const copy: Partial<CubeState> = {};
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  for (const f of faces) {
    copy[f] = [
      [...state[f][0]],
      [...state[f][1]],
      [...state[f][2]],
    ] as CubeFaceState;
  }
  return copy as CubeState;
}

export function isCubeSolved(state: CubeState): boolean {
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  for (const f of faces) {
    const centerColor = state[f][1][1];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (state[f][r][c] !== centerColor) return false;
      }
    }
  }
  return true;
}

// Rotate a 3x3 matrix 90 degrees clockwise
function rotateFaceCW(face: CubeFaceState): CubeFaceState {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ];
}

// Rotate a 3x3 matrix 90 degrees counter-clockwise
function rotateFaceCCW(face: CubeFaceState): CubeFaceState {
  return [
    [face[0][2], face[1][2], face[2][2]],
    [face[0][1], face[1][1], face[2][1]],
    [face[0][0], face[1][0], face[2][0]],
  ];
}

// Rotate 180 degrees
function rotateFace180(face: CubeFaceState): CubeFaceState {
  return rotateFaceCW(rotateFaceCW(face));
}

/**
 * Apply a single basic face rotation to the logical cube state
 */
export function applyMove(state: CubeState, move: Move): CubeState {
  const s = cloneCubeState(state);

  switch (move) {
    case 'U': {
      s.U = rotateFaceCW(s.U);
      const b0 = [...s.B[0]];
      const r0 = [...s.R[0]];
      const f0 = [...s.F[0]];
      const l0 = [...s.L[0]];
      s.F[0] = [r0[0], r0[1], r0[2]];
      s.L[0] = [f0[0], f0[1], f0[2]];
      s.B[0] = [l0[0], l0[1], l0[2]];
      s.R[0] = [b0[0], b0[1], b0[2]];
      break;
    }
    case "U'": {
      s.U = rotateFaceCCW(s.U);
      const b0 = [...s.B[0]];
      const r0 = [...s.R[0]];
      const f0 = [...s.F[0]];
      const l0 = [...s.L[0]];
      s.F[0] = [l0[0], l0[1], l0[2]];
      s.R[0] = [f0[0], f0[1], f0[2]];
      s.B[0] = [r0[0], r0[1], r0[2]];
      s.L[0] = [b0[0], b0[1], b0[2]];
      break;
    }
    case 'U2': {
      applyMove(s, 'U');
      applyMove(s, 'U');
      break;
    }

    case 'D': {
      s.D = rotateFaceCW(s.D);
      const f2 = [...s.F[2]];
      const r2 = [...s.R[2]];
      const b2 = [...s.B[2]];
      const l2 = [...s.L[2]];
      s.F[2] = [l2[0], l2[1], l2[2]];
      s.R[2] = [f2[0], f2[1], f2[2]];
      s.B[2] = [r2[0], r2[1], r2[2]];
      s.L[2] = [b2[0], b2[1], b2[2]];
      break;
    }
    case "D'": {
      s.D = rotateFaceCCW(s.D);
      const f2 = [...s.F[2]];
      const r2 = [...s.R[2]];
      const b2 = [...s.B[2]];
      const l2 = [...s.L[2]];
      s.F[2] = [r2[0], r2[1], r2[2]];
      s.L[2] = [f2[0], f2[1], f2[2]];
      s.B[2] = [l2[0], l2[1], l2[2]];
      s.R[2] = [b2[0], b2[1], b2[2]];
      break;
    }
    case 'D2': {
      applyMove(s, 'D');
      applyMove(s, 'D');
      break;
    }

    case 'R': {
      s.R = rotateFaceCW(s.R);
      const uCol2 = [s.U[0][2], s.U[1][2], s.U[2][2]];
      const fCol2 = [s.F[0][2], s.F[1][2], s.F[2][2]];
      const dCol2 = [s.D[0][2], s.D[1][2], s.D[2][2]];
      const bCol0 = [s.B[0][0], s.B[1][0], s.B[2][0]];

      s.U[0][2] = fCol2[0];
      s.U[1][2] = fCol2[1];
      s.U[2][2] = fCol2[2];

      s.B[0][0] = dCol2[2];
      s.B[1][0] = dCol2[1];
      s.B[2][0] = dCol2[0];

      s.D[0][2] = bCol0[2];
      s.D[1][2] = bCol0[1];
      s.D[2][2] = bCol0[0];

      s.F[0][2] = uCol2[0];
      s.F[1][2] = uCol2[1];
      s.F[2][2] = uCol2[2];
      break;
    }
    case "R'": {
      s.R = rotateFaceCCW(s.R);
      const uCol2 = [s.U[0][2], s.U[1][2], s.U[2][2]];
      const fCol2 = [s.F[0][2], s.F[1][2], s.F[2][2]];
      const dCol2 = [s.D[0][2], s.D[1][2], s.D[2][2]];
      const bCol0 = [s.B[0][0], s.B[1][0], s.B[2][0]];

      s.U[0][2] = bCol0[2];
      s.U[1][2] = bCol0[1];
      s.U[2][2] = bCol0[0];

      s.F[0][2] = uCol2[0];
      s.F[1][2] = uCol2[1];
      s.F[2][2] = uCol2[2];

      s.D[0][2] = fCol2[0];
      s.D[1][2] = fCol2[1];
      s.D[2][2] = fCol2[2];

      s.B[0][0] = dCol2[2];
      s.B[1][0] = dCol2[1];
      s.B[2][0] = dCol2[0];
      break;
    }
    case 'R2': {
      applyMove(s, 'R');
      applyMove(s, 'R');
      break;
    }

    case 'L': {
      s.L = rotateFaceCW(s.L);
      const uCol0 = [s.U[0][0], s.U[1][0], s.U[2][0]];
      const fCol0 = [s.F[0][0], s.F[1][0], s.F[2][0]];
      const dCol0 = [s.D[0][0], s.D[1][0], s.D[2][0]];
      const bCol2 = [s.B[0][2], s.B[1][2], s.B[2][2]];

      s.U[0][0] = bCol2[2];
      s.U[1][0] = bCol2[1];
      s.U[2][0] = bCol2[0];

      s.F[0][0] = uCol0[0];
      s.F[1][0] = uCol0[1];
      s.F[2][0] = uCol0[2];

      s.D[0][0] = fCol0[0];
      s.D[1][0] = fCol0[1];
      s.D[2][0] = fCol0[2];

      s.B[0][2] = dCol0[2];
      s.B[1][2] = dCol0[1];
      s.B[2][2] = dCol0[0];
      break;
    }
    case "L'": {
      s.L = rotateFaceCCW(s.L);
      const uCol0 = [s.U[0][0], s.U[1][0], s.U[2][0]];
      const fCol0 = [s.F[0][0], s.F[1][0], s.F[2][0]];
      const dCol0 = [s.D[0][0], s.D[1][0], s.D[2][0]];
      const bCol2 = [s.B[0][2], s.B[1][2], s.B[2][2]];

      s.U[0][0] = fCol0[0];
      s.U[1][0] = fCol0[1];
      s.U[2][0] = fCol0[2];

      s.B[0][2] = uCol0[2];
      s.B[1][2] = uCol0[1];
      s.B[2][2] = uCol0[0];

      s.D[0][0] = bCol2[2];
      s.D[1][0] = bCol2[1];
      s.D[2][0] = bCol2[0];

      s.F[0][0] = dCol0[0];
      s.F[1][0] = dCol0[1];
      s.F[2][0] = dCol0[2];
      break;
    }
    case 'L2': {
      applyMove(s, 'L');
      applyMove(s, 'L');
      break;
    }

    case 'F': {
      s.F = rotateFaceCW(s.F);
      const uRow2 = [...s.U[2]];
      const rCol0 = [s.R[0][0], s.R[1][0], s.R[2][0]];
      const dRow0 = [...s.D[0]];
      const lCol2 = [s.L[0][2], s.L[1][2], s.L[2][2]];

      s.U[2][0] = lCol2[2];
      s.U[2][1] = lCol2[1];
      s.U[2][2] = lCol2[0];

      s.R[0][0] = uRow2[0];
      s.R[1][0] = uRow2[1];
      s.R[2][0] = uRow2[2];

      s.D[0][0] = rCol0[2];
      s.D[0][1] = rCol0[1];
      s.D[0][2] = rCol0[0];

      s.L[0][2] = dRow0[0];
      s.L[1][2] = dRow0[1];
      s.L[2][2] = dRow0[2];
      break;
    }
    case "F'": {
      s.F = rotateFaceCCW(s.F);
      const uRow2 = [...s.U[2]];
      const rCol0 = [s.R[0][0], s.R[1][0], s.R[2][0]];
      const dRow0 = [...s.D[0]];
      const lCol2 = [s.L[0][2], s.L[1][2], s.L[2][2]];

      s.U[2][0] = rCol0[0];
      s.U[2][1] = rCol0[1];
      s.U[2][2] = rCol0[2];

      s.L[0][2] = uRow2[2];
      s.L[1][2] = uRow2[1];
      s.L[2][2] = uRow2[0];

      s.D[0][0] = lCol2[0];
      s.D[0][1] = lCol2[1];
      s.D[0][2] = lCol2[2];

      s.R[0][0] = dRow0[2];
      s.R[1][0] = dRow0[1];
      s.R[2][0] = dRow0[0];
      break;
    }
    case 'F2': {
      applyMove(s, 'F');
      applyMove(s, 'F');
      break;
    }

    case 'B': {
      s.B = rotateFaceCW(s.B);
      const uRow0 = [...s.U[0]];
      const rCol2 = [s.R[0][2], s.R[1][2], s.R[2][2]];
      const dRow2 = [...s.D[2]];
      const lCol0 = [s.L[0][0], s.L[1][0], s.L[2][0]];

      s.U[0][0] = rCol2[0];
      s.U[0][1] = rCol2[1];
      s.U[0][2] = rCol2[2];

      s.L[0][0] = uRow0[2];
      s.L[1][0] = uRow0[1];
      s.L[2][0] = uRow0[0];

      s.D[2][0] = lCol0[0];
      s.D[2][1] = lCol0[1];
      s.D[2][2] = lCol0[2];

      s.R[0][2] = dRow2[2];
      s.R[1][2] = dRow2[1];
      s.R[2][2] = dRow2[0];
      break;
    }
    case "B'": {
      s.B = rotateFaceCCW(s.B);
      const uRow0 = [...s.U[0]];
      const rCol2 = [s.R[0][2], s.R[1][2], s.R[2][2]];
      const dRow2 = [...s.D[2]];
      const lCol0 = [s.L[0][0], s.L[1][0], s.L[2][0]];

      s.U[0][0] = lCol0[2];
      s.U[0][1] = lCol0[1];
      s.U[0][2] = lCol0[0];

      s.R[0][2] = uRow0[0];
      s.R[1][2] = uRow0[1];
      s.R[2][2] = uRow0[2];

      s.D[2][0] = rCol2[0];
      s.D[2][1] = rCol2[1];
      s.D[2][2] = rCol2[2];

      s.L[0][0] = dRow2[2];
      s.L[1][0] = dRow2[1];
      s.L[2][0] = dRow2[0];
      break;
    }
    case 'B2': {
      applyMove(s, 'B');
      applyMove(s, 'B');
      break;
    }

    // Slice moves
    case 'M': {
      // M is in the same direction as L (down on F)
      const uCol1 = [s.U[0][1], s.U[1][1], s.U[2][1]];
      const fCol1 = [s.F[0][1], s.F[1][1], s.F[2][1]];
      const dCol1 = [s.D[0][1], s.D[1][1], s.D[2][1]];
      const bCol1 = [s.B[0][1], s.B[1][1], s.B[2][1]];

      s.U[0][1] = bCol1[2];
      s.U[1][1] = bCol1[1];
      s.U[2][1] = bCol1[0];

      s.F[0][1] = uCol1[0];
      s.F[1][1] = uCol1[1];
      s.F[2][1] = uCol1[2];

      s.D[0][1] = fCol1[0];
      s.D[1][1] = fCol1[1];
      s.D[2][1] = fCol1[2];

      s.B[0][1] = dCol1[2];
      s.B[1][1] = dCol1[1];
      s.B[2][1] = dCol1[0];
      break;
    }
    case "M'": {
      applyMove(s, 'M');
      applyMove(s, 'M');
      applyMove(s, 'M');
      break;
    }
    case 'M2': {
      applyMove(s, 'M');
      applyMove(s, 'M');
      break;
    }

    case 'E': {
      // E is parallel to D
      const f1 = [...s.F[1]];
      const r1 = [...s.R[1]];
      const b1 = [...s.B[1]];
      const l1 = [...s.L[1]];
      s.F[1] = [l1[0], l1[1], l1[2]];
      s.R[1] = [f1[0], f1[1], f1[2]];
      s.B[1] = [r1[0], r1[1], r1[2]];
      s.L[1] = [b1[0], b1[1], b1[2]];
      break;
    }
    case "E'": {
      applyMove(s, 'E');
      applyMove(s, 'E');
      applyMove(s, 'E');
      break;
    }
    case 'E2': {
      applyMove(s, 'E');
      applyMove(s, 'E');
      break;
    }

    case 'S': {
      // S turns with F
      const uRow1 = [...s.U[1]];
      const rCol1 = [s.R[0][1], s.R[1][1], s.R[2][1]];
      const dRow1 = [...s.D[1]];
      const lCol1 = [s.L[0][1], s.L[1][1], s.L[2][1]];

      s.U[1][0] = lCol1[2];
      s.U[1][1] = lCol1[1];
      s.U[1][2] = lCol1[0];

      s.R[0][1] = uRow1[0];
      s.R[1][1] = uRow1[1];
      s.R[2][1] = uRow1[2];

      s.D[1][0] = rCol1[2];
      s.D[1][1] = rCol1[1];
      s.D[1][2] = rCol1[0];

      s.L[0][1] = dRow1[0];
      s.L[1][1] = dRow1[1];
      s.L[2][1] = dRow1[2];
      break;
    }
    case "S'": {
      applyMove(s, 'S');
      applyMove(s, 'S');
      applyMove(s, 'S');
      break;
    }
    case 'S2': {
      applyMove(s, 'S');
      applyMove(s, 'S');
      break;
    }

    // Whole cube rotations
    case 'y': {
      // y rotates cube clockwise around Y-axis (like U, but whole cube)
      applyMove(s, 'U');
      applyMove(s, "E'");
      applyMove(s, "D'");
      break;
    }
    case "y'": {
      applyMove(s, "U'");
      applyMove(s, 'E');
      applyMove(s, 'D');
      break;
    }
    case 'y2': {
      applyMove(s, 'y');
      applyMove(s, 'y');
      break;
    }

    case 'x': {
      // x rotates whole cube around X-axis (like R)
      applyMove(s, 'R');
      applyMove(s, "M'");
      applyMove(s, "L'");
      break;
    }
    case "x'": {
      applyMove(s, "R'");
      applyMove(s, 'M');
      applyMove(s, 'L');
      break;
    }
    case 'x2': {
      applyMove(s, 'x');
      applyMove(s, 'x');
      break;
    }

    case 'z': {
      // z rotates whole cube around Z-axis (like F)
      applyMove(s, 'F');
      applyMove(s, 'S');
      applyMove(s, "B'");
      break;
    }
    case "z'": {
      applyMove(s, "F'");
      applyMove(s, "S'");
      applyMove(s, 'B');
      break;
    }
    case 'z2': {
      applyMove(s, 'z');
      applyMove(s, 'z');
      break;
    }
  }

  return s;
}

/**
 * Apply a sequence of moves (e.g. "R U R' U'") to a state
 */
export function applyAlgorithm(state: CubeState, algorithm: string): CubeState {
  const moves = parseMoves(algorithm);
  let current = cloneCubeState(state);
  for (const m of moves) {
    current = applyMove(current, m);
  }
  return current;
}

/**
 * Parse a string notation like "R U R' U' F2" into Move[]
 */
export function parseMoves(alg: string): Move[] {
  if (!alg) return [];
  const tokens = alg.trim().replace(/\s+/g, ' ').split(' ');
  const valid = new Set<string>([
    'U', "U'", 'U2',
    'D', "D'", 'D2',
    'L', "L'", 'L2',
    'R', "R'", 'R2',
    'F', "F'", 'F2',
    'B', "B'", 'B2',
    'M', "M'", 'M2',
    'E', "E'", 'E2',
    'S', "S'", 'S2',
    'x', "x'", 'x2',
    'y', "y'", 'y2',
    'z', "z'", 'z2'
  ]);

  return tokens.filter(t => valid.has(t)) as Move[];
}

/**
 * Invert a move: U -> U', U' -> U, U2 -> U2
 */
export function invertMove(move: Move): Move {
  if (move.endsWith("'")) return move.slice(0, -1) as Move;
  if (move.endsWith('2')) return move;
  return `${move}'` as Move;
}

/**
 * Invert a sequence of moves
 */
export function invertAlgorithm(moves: Move[]): Move[] {
  return [...moves].reverse().map(invertMove);
}

export const MOVE_DESCRIPTIONS: Record<string, string> = {
  U: 'Turn TOP face 90° Clockwise (to the left)',
  "U'": 'Turn TOP face 90° Counter-Clockwise (to the right)',
  U2: 'Turn TOP face 180° (double turn)',
  D: 'Turn BOTTOM face 90° Clockwise',
  "D'": 'Turn BOTTOM face 90° Counter-Clockwise',
  D2: 'Turn BOTTOM face 180°',
  R: 'Turn RIGHT face 90° Clockwise (away / up)',
  "R'": 'Turn RIGHT face 90° Counter-Clockwise (towards you / down)',
  R2: 'Turn RIGHT face 180°',
  L: 'Turn LEFT face 90° Clockwise (towards you / down)',
  "L'": 'Turn LEFT face 90° Counter-Clockwise (away / up)',
  L2: 'Turn LEFT face 180°',
  F: 'Turn FRONT face 90° Clockwise',
  "F'": 'Turn FRONT face 90° Counter-Clockwise',
  F2: 'Turn FRONT face 180°',
  B: 'Turn BACK face 90° Clockwise',
  "B'": 'Turn BACK face 90° Counter-Clockwise',
  B2: 'Turn BACK face 180°',
  M: 'Turn MIDDLE slice 90° downward',
  "M'": 'Turn MIDDLE slice 90° upward',
  M2: 'Turn MIDDLE slice 180°',
};

/**
 * Generate official standard WCA scramble (20-25 moves)
 * Ensures no consecutive moves on the same face or conflicting parallel faces
 */
export function generateScramble(length: number = 22): string {
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  const modifiers = ['', "'", '2'];
  const scrambleMoves: string[] = [];

  const oppositeFaces: Record<Face, Face> = {
    U: 'D', D: 'U',
    L: 'R', R: 'L',
    F: 'B', B: 'F'
  };

  let lastFace: Face | null = null;
  let secondLastFace: Face | null = null;

  for (let i = 0; i < length; i++) {
    let chosenFace: Face;
    do {
      chosenFace = faces[Math.floor(Math.random() * faces.length)];
    } while (
      chosenFace === lastFace ||
      (secondLastFace === chosenFace && oppositeFaces[chosenFace] === lastFace)
    );

    const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
    scrambleMoves.push(`${chosenFace}${mod}`);

    secondLastFace = lastFace;
    lastFace = chosenFace;
  }

  return scrambleMoves.join(' ');
}
