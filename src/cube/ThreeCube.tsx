/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { cubeSound } from '../audio/cubeSound';
import { CubeColor, CubeFaceState, CubeState, Face, Move, ThemeConfig } from '../types/cube';
import { CUBE_THEMES } from './themes';

interface ThreeCubeProps {
  cubeState: CubeState;
  onMoveComplete: (move: Move) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  explodedOffset: number; // 0 to 1
  theme: ThemeConfig;
  activeMoveQueue: Move[];
  onQueueEmpty?: () => void;
  speedMultiplier: number;
}

interface CubieData {
  mesh: THREE.Group;
  initialPos: THREE.Vector3; // -1, 0, 1
  currentPos: THREE.Vector3;
  stickers: { [key in Face]?: THREE.Mesh };
}

export const ThreeCube: React.FC<ThreeCubeProps> = ({
  cubeState,
  onMoveComplete,
  isAnimating,
  setIsAnimating,
  explodedOffset,
  theme,
  activeMoveQueue,
  onQueueEmpty,
  speedMultiplier,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const cubeGroupRef = useRef<THREE.Group>(new THREE.Group());
  const pivotGroupRef = useRef<THREE.Group>(new THREE.Group());
  const coreMeshRef = useRef<THREE.Group | null>(null);
  const cubiesRef = useRef<CubieData[]>([]);

  // State refs for animation loops and queues
  const currentAnimatingMoveRef = useRef<Move | null>(null);
  const moveQueueRef = useRef<Move[]>([]);
  const isAnimatingRef = useRef(false);
  const animationProgressRef = useRef(0);
  const animationTargetAngleRef = useRef(0);
  const animationAxisRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, 0));
  const activeCubiesInTurnRef = useRef<CubieData[]>([]);
  const baseSpeedRef = useRef(speedMultiplier);

  // Drag interaction refs
  const isPointerDownRef = useRef(false);
  const pointerStartPosRef = useRef(new THREE.Vector2());
  const hoveredStickerRef = useRef<{ cubie: CubieData; face: Face } | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerCoordRef = useRef(new THREE.Vector2());

  baseSpeedRef.current = speedMultiplier;

  // Sync incoming move queue
  useEffect(() => {
    if (activeMoveQueue.length > 0) {
      moveQueueRef.current = [...activeMoveQueue];
      triggerNextMoveInQueue();
    }
  }, [activeMoveQueue]);

  // Update exploded distance
  useEffect(() => {
    cubiesRef.current.forEach(c => {
      const dir = c.currentPos.clone().normalize();
      const distance = 1.05 + explodedOffset * 1.6;
      c.mesh.position.set(
        c.currentPos.x * distance,
        c.currentPos.y * distance,
        c.currentPos.z * distance
      );
    });

    if (coreMeshRef.current) {
      coreMeshRef.current.visible = explodedOffset > 0.05;
      const coreScale = 1 + explodedOffset * 0.2;
      coreMeshRef.current.scale.set(coreScale, coreScale, coreScale);
    }
  }, [explodedOffset]);

  // Update theme materials
  useEffect(() => {
    updateStickerMaterials(theme, cubeState);
  }, [theme, cubeState]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0c0f17');
    scene.fog = new THREE.FogExp2('#0c0f17', 0.04);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(4.8, 3.8, 5.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.rotateSpeed = 0.85;
    controlsRef.current = controls;

    // RoomEnvironment reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point lighting
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.8);
    keyLight.position.set(6, 9, 7);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      const d = 5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
    }
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight('#cbd5e1', '#0f172a', 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#60a5fa', 1.4);
    rimLight.position.set(-6, -4, -6);
    scene.add(rimLight);

    // Contact shadow plane on the floor
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const gradient = sCtx.createRadialGradient(64, 64, 5, 64, 64, 60);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.6;
    scene.add(shadowMesh);

    // Build the 3x3 Rubik's cube hierarchy
    const cubeGroup = cubeGroupRef.current;
    scene.add(cubeGroup);
    scene.add(pivotGroupRef.current);

    buildCubeGeometry(cubeGroup, theme);

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function renderLoop() {
      const delta = clock.getDelta();

      // Handle ongoing move animation
      if (isAnimatingRef.current && currentAnimatingMoveRef.current) {
        const turnSpeed = 9.0 * baseSpeedRef.current;
        const step = turnSpeed * delta;
        animationProgressRef.current += step;

        if (animationProgressRef.current >= Math.abs(animationTargetAngleRef.current)) {
          // Snap to exact target
          pivotGroupRef.current.setRotationFromAxisAngle(
            animationAxisRef.current,
            animationTargetAngleRef.current
          );

          // Finalize rotation: re-parent cubies to main cubeGroup and update logical coords
          finalizeTurn(currentAnimatingMoveRef.current);
          isAnimatingRef.current = false;
          setIsAnimating(false);
          currentAnimatingMoveRef.current = null;

          // Next in queue
          if (moveQueueRef.current.length > 0) {
            triggerNextMoveInQueue();
          } else if (onQueueEmpty) {
            onQueueEmpty();
          }
        } else {
          // Interpolate
          const currentAngle = THREE.MathUtils.lerp(
            0,
            animationTargetAngleRef.current,
            animationProgressRef.current / Math.abs(animationTargetAngleRef.current)
          );
          pivotGroupRef.current.setRotationFromAxisAngle(animationAxisRef.current, currentAngle);
        }
      }

      controls.update();
      renderer.render(scene, camera);

      frameId = requestAnimationFrame(renderLoop);
    }

    frameId = requestAnimationFrame(renderLoop);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Build the 26 Cubies + Core Spider
  const buildCubeGeometry = (parentGroup: THREE.Group, currentTheme: ThemeConfig) => {
    // Clear existing
    while (parentGroup.children.length > 0) {
      parentGroup.remove(parentGroup.children[0]);
    }
    cubiesRef.current = [];

    // Internal Core Spider (Spherical core + 6 axle posts)
    const coreGroup = new THREE.Group();
    const coreSphereGeo = new THREE.SphereGeometry(0.7, 24, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: '#3f3f46',
      metalness: 0.65,
      roughness: 0.25,
    });
    const coreSphere = new THREE.Mesh(coreSphereGeo, coreMat);
    coreGroup.add(coreSphere);

    // 6 Axles extending to center cubies
    const axleGeo = new THREE.CylinderGeometry(0.14, 0.14, 1.4, 16);
    const axleAxes = [
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1),
    ];

    axleAxes.forEach(ax => {
      const axle = new THREE.Mesh(axleGeo, coreMat);
      axle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ax);
      axle.position.copy(ax.clone().multiplyScalar(0.7));
      coreGroup.add(axle);
    });

    coreGroup.visible = false;
    coreMeshRef.current = coreGroup;
    parentGroup.add(coreGroup);

    // Beveled cubie box geometry
    const cubieSize = 0.96;
    const bodyGeo = createRoundedBoxGeometry(cubieSize, cubieSize, cubieSize, 0.08, 3);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: currentTheme.bodyColor,
      roughness: currentTheme.roughness,
      metalness: currentTheme.metalness,
    });

    // Sticker geometry (slightly offset plane with rounded sticker look)
    const stickerSize = 0.82;
    const stickerGeo = new THREE.PlaneGeometry(stickerSize, stickerSize);

    // Loop through 27 coordinates (-1, 0, 1) except (0,0,0)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue; // center core

          const cubieGroup = new THREE.Group();
          const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
          bodyMesh.castShadow = true;
          bodyMesh.receiveShadow = true;
          cubieGroup.add(bodyMesh);

          const stickers: { [key in Face]?: THREE.Mesh } = {};

          // Helper to create sticker on a face
          const addSticker = (face: Face, rotX: number, rotY: number, pos: THREE.Vector3) => {
            const stMat = new THREE.MeshStandardMaterial({
              color: '#ffffff',
              roughness: 0.18,
              metalness: 0.05,
              polygonOffset: true,
              polygonOffsetFactor: -1,
              polygonOffsetUnits: -1,
            });
            const stMesh = new THREE.Mesh(stickerGeo, stMat);
            stMesh.rotation.set(rotX, rotY, 0);
            stMesh.position.copy(pos);
            stMesh.userData = { face, x, y, z };
            cubieGroup.add(stMesh);
            stickers[face] = stMesh;
          };

          const offset = cubieSize / 2 + 0.003;

          // Top Face (U, y = +1)
          if (y === 1) addSticker('U', -Math.PI / 2, 0, new THREE.Vector3(0, offset, 0));
          // Down Face (D, y = -1)
          if (y === -1) addSticker('D', Math.PI / 2, 0, new THREE.Vector3(0, -offset, 0));
          // Front Face (F, z = +1)
          if (z === 1) addSticker('F', 0, 0, new THREE.Vector3(0, 0, offset));
          // Back Face (B, z = -1)
          if (z === -1) addSticker('B', 0, Math.PI, new THREE.Vector3(0, 0, -offset));
          // Right Face (R, x = +1)
          if (x === 1) addSticker('R', 0, Math.PI / 2, new THREE.Vector3(offset, 0, 0));
          // Left Face (L, x = -1)
          if (x === -1) addSticker('L', 0, -Math.PI / 2, new THREE.Vector3(-offset, 0, 0));

          const initialPos = new THREE.Vector3(x, y, z);
          cubieGroup.position.copy(initialPos.clone().multiplyScalar(1.05));
          parentGroup.add(cubieGroup);

          cubiesRef.current.push({
            mesh: cubieGroup,
            initialPos,
            currentPos: initialPos.clone(),
            stickers,
          });
        }
      }
    }
  };

  // Helper to create rounded beveled cubie box
  const createRoundedBoxGeometry = (
    width: number,
    height: number,
    depth: number,
    radius: number,
    smoothness: number
  ) => {
    const shape = new THREE.Shape();
    const eps = 0.00001;
    const radiusMinusEps = radius - eps;

    // 2D rounded rectangle
    const w = width / 2;
    const h = height / 2;
    shape.moveTo(-w + radius, -h);
    shape.lineTo(w - radius, -h);
    shape.quadraticCurveTo(w, -h, w, -h + radius);
    shape.lineTo(w, h - radius);
    shape.quadraticCurveTo(w, h, w - radius, h);
    shape.lineTo(-w + radius, h);
    shape.quadraticCurveTo(-w, h, -w, h - radius);
    shape.lineTo(-w, -h + radius);
    shape.quadraticCurveTo(-w, -h, -w + radius, -h);

    const extrudeSettings = {
      steps: 1,
      depth: depth - radius * 2,
      bevelEnabled: true,
      bevelSegments: smoothness,
      steps2: 1,
      bevelSize: radiusMinusEps,
      bevelThickness: radius,
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  };

  // Sync sticker colors from logical CubeState to 3D meshes
  const updateStickerMaterials = (curTheme: ThemeConfig, st: CubeState) => {
    // Face sticker coordinate mapping:
    // U (y=1): row = z+1, col = x+1  (top-down view)
    // D (y=-1): row = -z+1, col = x+1
    // F (z=1): row = -y+1, col = x+1
    // B (z=-1): row = -y+1, col = -x+1
    // R (x=1): row = -y+1, col = -z+1
    // L (x=-1): row = -y+1, col = z+1

    cubiesRef.current.forEach(cubie => {
      const { x, y, z } = cubie.currentPos;

      // U Face
      if (y === 1 && cubie.stickers.U) {
        const row = z + 1;
        const col = x + 1;
        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
          const colorName = st.U[row][col];
          const mat = cubie.stickers.U.material as THREE.MeshStandardMaterial;
          mat.color.set(curTheme.colors[colorName]);
        }
      }

      // D Face
      if (y === -1 && cubie.stickers.D) {
        const row = 1 - z;
        const col = x + 1;
        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
          const colorName = st.D[row][col];
          const mat = cubie.stickers.D.material as THREE.MeshStandardMaterial;
          mat.color.set(curTheme.colors[colorName]);
        }
      }

      // F Face
      if (z === 1 && cubie.stickers.F) {
        const row = 1 - y;
        const col = x + 1;
        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
          const colorName = st.F[row][col];
          const mat = cubie.stickers.F.material as THREE.MeshStandardMaterial;
          mat.color.set(curTheme.colors[colorName]);
        }
      }

      // B Face
      if (z === -1 && cubie.stickers.B) {
        const row = 1 - y;
        const col = 1 - x;
        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
          const colorName = st.B[row][col];
          const mat = cubie.stickers.B.material as THREE.MeshStandardMaterial;
          mat.color.set(curTheme.colors[colorName]);
        }
      }

      // R Face
      if (x === 1 && cubie.stickers.R) {
        const row = 1 - y;
        const col = 1 - z;
        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
          const colorName = st.R[row][col];
          const mat = cubie.stickers.R.material as THREE.MeshStandardMaterial;
          mat.color.set(curTheme.colors[colorName]);
        }
      }

      // L Face
      if (x === -1 && cubie.stickers.L) {
        const row = 1 - y;
        const col = z + 1;
        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
          const colorName = st.L[row][col];
          const mat = cubie.stickers.L.material as THREE.MeshStandardMaterial;
          mat.color.set(curTheme.colors[colorName]);
        }
      }
    });
  };

  // Turn Execution Logic
  const triggerNextMoveInQueue = () => {
    if (isAnimatingRef.current || moveQueueRef.current.length === 0) return;

    const move = moveQueueRef.current.shift()!;
    startMoveAnimation(move);
  };

  const startMoveAnimation = (move: Move) => {
    isAnimatingRef.current = true;
    setIsAnimating(true);
    currentAnimatingMoveRef.current = move;
    animationProgressRef.current = 0;

    // Play click sound
    cubeSound.playClick();

    // Determine axis, layer filter, and angle
    let axis = new THREE.Vector3();
    let angle = -Math.PI / 2; // clockwise default
    let filterFn: (pos: THREE.Vector3) => boolean = () => false;

    // Angle modifier
    if (move.endsWith("'")) {
      angle = Math.PI / 2;
    } else if (move.endsWith('2')) {
      angle = -Math.PI;
    }

    const baseMove = move[0] as Face | 'M' | 'E' | 'S' | 'x' | 'y' | 'z';

    switch (baseMove) {
      case 'U':
        axis.set(0, 1, 0);
        filterFn = pos => pos.y > 0.5;
        angle = -angle; // U clockwise is negative Y rotation
        break;
      case 'D':
        axis.set(0, 1, 0);
        filterFn = pos => pos.y < -0.5;
        break;
      case 'R':
        axis.set(1, 0, 0);
        filterFn = pos => pos.x > 0.5;
        angle = -angle;
        break;
      case 'L':
        axis.set(1, 0, 0);
        filterFn = pos => pos.x < -0.5;
        break;
      case 'F':
        axis.set(0, 0, 1);
        filterFn = pos => pos.z > 0.5;
        angle = -angle;
        break;
      case 'B':
        axis.set(0, 0, 1);
        filterFn = pos => pos.z < -0.5;
        break;
      case 'M':
        axis.set(1, 0, 0);
        filterFn = pos => Math.abs(pos.x) < 0.5;
        break;
      case 'E':
        axis.set(0, 1, 0);
        filterFn = pos => Math.abs(pos.y) < 0.5;
        break;
      case 'S':
        axis.set(0, 0, 1);
        filterFn = pos => Math.abs(pos.z) < 0.5;
        angle = -angle;
        break;
      case 'y':
        axis.set(0, 1, 0);
        filterFn = () => true;
        angle = -angle;
        break;
      case 'x':
        axis.set(1, 0, 0);
        filterFn = () => true;
        angle = -angle;
        break;
      case 'z':
        axis.set(0, 0, 1);
        filterFn = () => true;
        angle = -angle;
        break;
    }

    animationAxisRef.current = axis;
    animationTargetAngleRef.current = angle;

    // Attach active cubies to pivotGroup
    const pivot = pivotGroupRef.current;
    pivot.rotation.set(0, 0, 0);
    pivot.position.set(0, 0, 0);

    const activeCubies: CubieData[] = [];
    cubiesRef.current.forEach(c => {
      if (filterFn(c.currentPos)) {
        activeCubies.push(c);
        pivot.attach(c.mesh);
      }
    });
    activeCubiesInTurnRef.current = activeCubies;
  };

  const finalizeTurn = (move: Move) => {
    const pivot = pivotGroupRef.current;
    const cubeGroup = cubeGroupRef.current;
    const activeCubies = activeCubiesInTurnRef.current;

    // Reattach cubies to main cubeGroup with updated world transforms
    activeCubies.forEach(c => {
      cubeGroup.attach(c.mesh);
      // Update logical currentPos coordinates by rounding
      const worldPos = c.mesh.position;
      const dist = 1.05 + explodedOffset * 1.6;
      c.currentPos.set(
        Math.round(worldPos.x / dist),
        Math.round(worldPos.y / dist),
        Math.round(worldPos.z / dist)
      );
    });

    pivot.rotation.set(0, 0, 0);
    onMoveComplete(move);
  };

  // Direct 3D Face Drag Interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    pointerStartPosRef.current.set(e.clientX, e.clientY);

    // Raycast to check if on a sticker
    if (!rendererRef.current || !cameraRef.current) return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    pointerCoordRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerCoordRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(pointerCoordRef.current, cameraRef.current);
    const stickerMeshes: THREE.Mesh[] = [];
    cubiesRef.current.forEach(c => {
      Object.values(c.stickers).forEach(st => {
        if (st) stickerMeshes.push(st);
      });
    });

    const intersects = raycasterRef.current.intersectObjects(stickerMeshes, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      const face = hit.userData.face as Face;
      const matchedCubie = cubiesRef.current.find(c => c.stickers[face] === hit);
      if (matchedCubie) {
        hoveredStickerRef.current = { cubie: matchedCubie, face };
      }
    } else {
      hoveredStickerRef.current = null;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    const dx = e.clientX - pointerStartPosRef.current.x;
    const dy = e.clientY - pointerStartPosRef.current.y;
    const dist = Math.hypot(dx, dy);

    // If dragged significantly on a sticker, interpret face twist
    if (dist > 35 && hoveredStickerRef.current && !isAnimatingRef.current) {
      const { face } = hoveredStickerRef.current;
      const isHorizontal = Math.abs(dx) > Math.abs(dy);

      let triggeredMove: Move | null = null;
      if (face === 'U') {
        triggeredMove = isHorizontal ? (dx > 0 ? "U'" : 'U') : dy > 0 ? 'F' : "F'";
      } else if (face === 'D') {
        triggeredMove = isHorizontal ? (dx > 0 ? 'D' : "D'") : dy > 0 ? "F'" : 'F';
      } else if (face === 'F') {
        triggeredMove = isHorizontal ? (dx > 0 ? "U'" : 'U') : dy > 0 ? 'R' : "R'";
      } else if (face === 'R') {
        triggeredMove = isHorizontal ? (dx > 0 ? 'B' : "B'") : dy > 0 ? "R'" : 'R';
      } else if (face === 'L') {
        triggeredMove = isHorizontal ? (dx > 0 ? 'F' : "F'") : dy > 0 ? 'L' : "L'";
      } else if (face === 'B') {
        triggeredMove = isHorizontal ? (dx > 0 ? 'U' : "U'") : dy > 0 ? "R'" : 'R';
      }

      if (triggeredMove) {
        startMoveAnimation(triggeredMove);
      }
    }
    hoveredStickerRef.current = null;
  };

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none outline-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    />
  );
};
