/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ActiveSection, CityBuilding } from '../types';
import { audio } from './AudioEngine';

interface ThreeCanvasProps {
  activeSection: ActiveSection;
  onSelectBuilding: (building: CityBuilding) => void;
  hoveredNode: string | null;
  selectedCityBuildings: CityBuilding[];
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  activeSection,
  onSelectBuilding,
  hoveredNode,
  selectedCityBuildings,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  // States to communicate interaction back
  const [activeBuildingIndex, setActiveBuildingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Fast-path pre-flight context validation
    try {
      const testCanvas = document.createElement('canvas');
      const testGl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!testGl) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    try {
      const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // --- SCENE & FOG ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030303');
    scene.fog = new THREE.FogExp2('#030303', 0.035);

    // --- CAMERA ---
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    // Initial camera position (loading state)
    camera.position.set(0, 0, 30);

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight('#ff5500', 0.05);
    scene.add(ambientLight);

    const mainOrangeLight = new THREE.PointLight('#ff6a00', 12, 40);
    mainOrangeLight.position.set(0, 2, 8);
    scene.add(mainOrangeLight);

    const secondaryAmberLight = new THREE.PointLight('#ffa500', 6, 25);
    secondaryAmberLight.position.set(-8, -4, 5);
    scene.add(secondaryAmberLight);

    const blueGlowLight = new THREE.PointLight('#00a2ff', 8, 30);
    blueGlowLight.position.set(8, 6, 4);
    scene.add(blueGlowLight);

    // Direct lighting for specular reflections
    const dirLight = new THREE.DirectionalLight('#ffffff', 0.8);
    dirLight.position.set(5, 15, 10);
    scene.add(dirLight);

    // --- DYNAMIC STAR PARTICLE SYSTEM ---
    const starsCount = 1500;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      // Scatter in a large sphere/box
      const r = 25 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starsPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starsPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starsPositions[i + 2] = r * Math.cos(phi);

      // Color variation (Neon Orange to Deep Blue to Warm Amber to Cyber White)
      const colorRand = Math.random();
      if (colorRand > 0.7) {
        // Neon Orange
        starsColors[i] = 1.0;
        starsColors[i + 1] = 0.41;
        starsColors[i + 2] = 0.0;
      } else if (colorRand > 0.4) {
        // Futuristic Amber
        starsColors[i] = 1.0;
        starsColors[i + 1] = 0.7;
        starsColors[i + 2] = 0.1;
      } else if (colorRand > 0.2) {
        // Deep Space Cyber Blue
        starsColors[i] = 0.11;
        starsColors[i + 1] = 0.55;
        starsColors[i + 2] = 1.0;
      } else {
        // Ice White
        starsColors[i] = 0.9;
        starsColors[i + 1] = 0.95;
        starsColors[i + 2] = 1.0;
      }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const starParticles = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starParticles);

    // --- CURSOR LIGHT STREAM / TRACKER ---
    const cursorLight = new THREE.PointLight('#ff6a00', 4, 15);
    scene.add(cursorLight);

    // --- 1. HERO GROUP: Glass-morphic ATP Rocket Logo ---
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // Central Glass ATP Rocket-inspired core geometry
    // Upper cone
    const topConeGeo = new THREE.ConeGeometry(1.6, 2.5, 4, 1, false);
    // Lower cylinder representing body
    const bodyCylinderGeo = new THREE.CylinderGeometry(1.6, 1.2, 2.2, 4);
    // Assemble composite Rocket Geometry
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#ff6a00',
      transparent: true,
      opacity: 0.25,
      transmission: 0.9,
      roughness: 0.1,
      metalness: 0.1,
      thickness: 1.5,
      clearcoat: 1.0,
      ior: 1.6,
      side: THREE.DoubleSide,
    });

    const topCone = new THREE.Mesh(topConeGeo, glassMat);
    topCone.position.y = 1.25;

    const bodyCylinder = new THREE.Mesh(bodyCylinderGeo, glassMat);
    bodyCylinder.position.y = -1.1;

    const logoInnerGroup = new THREE.Group();
    logoInnerGroup.add(topCone);
    logoInnerGroup.add(bodyCylinder);

    // Add booster wings (rocket fins)
    const finGeo = new THREE.BoxGeometry(0.3, 1.4, 1.5);
    const finL = new THREE.Mesh(finGeo, glassMat);
    finL.position.set(-1.6, -1.8, 0);
    finL.rotation.z = Math.PI / 6;

    const finR = new THREE.Mesh(finGeo, glassMat);
    finR.position.set(1.6, -1.8, 0);
    finR.rotation.z = -Math.PI / 6;

    logoInnerGroup.add(finL);
    logoInnerGroup.add(finR);

    // Scaling tweak to give "elongated sleek spacecraft profile"
    logoInnerGroup.scale.set(1, 1.2, 1);
    heroGroup.add(logoInnerGroup);

    // Core Energetic Reactor (Interior pulsing light ball)
    const reactorGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const reactorMat = new THREE.MeshBasicMaterial({
      color: '#ff4500',
      wireframe: true,
    });
    const reactorMesh = new THREE.Mesh(reactorGeo, reactorMat);
    reactorMesh.position.y = -0.2;
    heroGroup.add(reactorMesh);

    // Concentric glowing navigation rings
    const ringGeo1 = new THREE.RingGeometry(3.5, 3.6, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: '#ff7700',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const orbitalRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    orbitalRing1.rotation.x = Math.PI / 2.5;
    heroGroup.add(orbitalRing1);

    const ringGeo2 = new THREE.RingGeometry(4.8, 4.85, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: '#00ccff',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const orbitalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    orbitalRing2.rotation.x = -Math.PI / 3;
    orbitalRing2.rotation.y = Math.PI / 6;
    heroGroup.add(orbitalRing2);

    // --- 2. ABOUT GROUP: Holographic spinning planet sphere ---
    const aboutGroup = new THREE.Group();
    aboutGroup.position.set(-15, 0, -2);
    scene.add(aboutGroup);

    // Futuristic concentric wireframe spheres
    const innerSphereGeo = new THREE.IcosahedronGeometry(2.4, 2);
    const innerSphereMat = new THREE.MeshBasicMaterial({
      color: '#ff6a00',
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    aboutGroup.add(innerSphere);

    const outerSphereGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const outerSphereMat = new THREE.MeshBasicMaterial({
      color: '#ffd000',
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const outerSphere = new THREE.Mesh(outerSphereGeo, outerSphereMat);
    aboutGroup.add(outerSphere);

    // Floating data grid below it
    const aboutGrid = new THREE.GridHelper(8, 16, '#ff6a00', '#221100');
    aboutGrid.position.y = -3.5;
    aboutGrid.material.transparent = true;
    aboutGrid.material.opacity = 0.25;
    aboutGroup.add(aboutGrid);


    // --- 3. WHAT WE DO GROUP: Pulsing Interactive Modules ---
    const workGroup = new THREE.Group();
    workGroup.position.set(15, 0, -2);
    scene.add(workGroup);

    // Node 1: Community (Knot geometry)
    const knotGeo = new THREE.TorusKnotGeometry(1.0, 0.35, 64, 8);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: '#ff6a00',
      roughness: 0.2,
      metalness: 0.8,
      emissive: '#220800',
      clearcoat: 1.0,
    });
    const communityMesh = new THREE.Mesh(knotGeo, knotMat);
    communityMesh.position.set(-3.5, 2.5, 0);
    workGroup.add(communityMesh);

    // Node 2: Events (Expanding wave cylinders)
    const eventGroup = new THREE.Group();
    eventGroup.position.set(3.5, 2.5, 0);
    workGroup.add(eventGroup);

    const ringCount = 3;
    const eventRings: THREE.Mesh[] = [];
    const eventRingMat = new THREE.MeshBasicMaterial({
      color: '#00ccff',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    for (let r = 0; r < ringCount; r++) {
      const eRingGeo = new THREE.RingGeometry(0.2 + r * 0.5, 0.25 + r * 0.5, 32);
      const eRing = new THREE.Mesh(eRingGeo, eventRingMat);
      eRing.rotation.x = Math.PI / 2.2;
      eventGroup.add(eRing);
      eventRings.push(eRing);
    }

    // Node 3: Mentorship (Double Helix Lines)
    const mentorshipGroup = new THREE.Group();
    mentorshipGroup.position.set(-3.5, -2.5, 0);
    workGroup.add(mentorshipGroup);

    const curvePoints1: THREE.Vector3[] = [];
    const curvePoints2: THREE.Vector3[] = [];
    for (let h = 0; h < 50; h++) {
      const angle = (h / 50) * Math.PI * 6;
      const y = (h / 50) * 3 - 1.5;
      curvePoints1.push(new THREE.Vector3(Math.cos(angle) * 0.8, y, Math.sin(angle) * 0.8));
      curvePoints2.push(new THREE.Vector3(Math.cos(angle + Math.PI) * 0.8, y, Math.sin(angle + Math.PI) * 0.8));
    }
    const helixGeo1 = new THREE.BufferGeometry().setFromPoints(curvePoints1);
    const helixGeo2 = new THREE.BufferGeometry().setFromPoints(curvePoints2);
    const helixMat = new THREE.LineBasicMaterial({ color: '#ffb300', linewidth: 2 });
    const helixLine1 = new THREE.Line(helixGeo1, helixMat);
    const helixLine2 = new THREE.Line(helixGeo2, helixMat);
    mentorshipGroup.add(helixLine1);
    mentorshipGroup.add(helixLine2);

    // Node 4: Startups (Interlocking holographic cubes)
    const cubeGroup = new THREE.Group();
    cubeGroup.position.set(3.5, -2.5, 0);
    workGroup.add(cubeGroup);

    const outerCubeGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const outerCubeMat = new THREE.MeshPhysicalMaterial({
      color: '#ff3300',
      transparent: true,
      opacity: 0.15,
      transmission: 0.8,
      roughness: 0.2,
      thickness: 0.8,
    });
    const outerCube = new THREE.Mesh(outerCubeGeo, outerCubeMat);
    cubeGroup.add(outerCube);

    const innerCubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const innerCubeMat = new THREE.MeshBasicMaterial({
      color: '#ff6a00',
      wireframe: true,
    });
    const innerCube = new THREE.Mesh(innerCubeGeo, innerCubeMat);
    cubeGroup.add(innerCube);


    // --- 4. ECOSYSTEM FLOW GROUP: Idea to Scale Pipeline ---
    const ecoGroup = new THREE.Group();
    ecoGroup.position.set(0, -15, -2);
    scene.add(ecoGroup);

    // Nodes representing: Idea (0), Build (1), Launch (2), Scale (3)
    const nodePositions = [
      new THREE.Vector3(-6, 0, 0),
      new THREE.Vector3(-2, 1.2, 0),
      new THREE.Vector3(2, -0.5, 0),
      new THREE.Vector3(6, 1.5, 0),
    ];

    const ecoNodes: THREE.Mesh[] = [];
    const ecoNodeGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const ecoNodeMatBase = new THREE.MeshPhysicalMaterial({
      color: '#3a3a3a',
      roughness: 0.4,
      metalness: 0.8,
      clearcoat: 1.0,
    });

    nodePositions.forEach((pos, idx) => {
      // Different active emissions for steps
      const nodeMat = ecoNodeMatBase.clone();
      nodeMat.emissive = new THREE.Color(idx === 0 ? '#ff5500' : idx === 1 ? '#ff9900' : idx === 2 ? '#00b3ff' : '#00ff66');
      nodeMat.emissiveIntensity = 0.4;
      
      const nodeMesh = new THREE.Mesh(ecoNodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      ecoGroup.add(nodeMesh);
      ecoNodes.push(nodeMesh);

      // Add a nice outer wireframe bubble to each node
      const outerBubbleGeo = new THREE.SphereGeometry(1.1, 8, 8);
      const outerBubbleMat = new THREE.MeshBasicMaterial({
        color: nodeMat.emissive.getHex(),
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const outerBubble = new THREE.Mesh(outerBubbleGeo, outerBubbleMat);
      outerBubble.position.copy(pos);
      ecoGroup.add(outerBubble);
    });

    // Draw splines / paths between eco nodes and shoot lights!
    const splineCurve = new THREE.CatmullRomCurve3(nodePositions);
    const splineGeo = new THREE.BufferGeometry().setFromPoints(splineCurve.getPoints(50));
    const splineMat = new THREE.LineBasicMaterial({
      color: '#ff6a00',
      transparent: true,
      opacity: 0.18,
    });
    
    const ecoLine = new THREE.Line(splineGeo, splineMat);
    ecoGroup.add(ecoLine);

    // Energized Flow Particles traveling between nodes
    const pulseParticleGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const pulseParticleMat = new THREE.MeshBasicMaterial({ color: '#ff6a00' });
    const pulseParticles: Array<{ mesh: THREE.Mesh; progress: number; speed: number }> = [];

    for (let p = 0; p < 3; p++) {
      const pMesh = new THREE.Mesh(pulseParticleGeo, pulseParticleMat);
      ecoGroup.add(pMesh);
      pulseParticles.push({
        mesh: pMesh,
        progress: p * 0.33,
        speed: 0.005 + Math.random() * 0.003,
      });
    }


    // --- 5. STARTUP CITY GROUP: Anantapur futuristic cityscape! ---
    const cityGroup = new THREE.Group();
    cityGroup.position.set(-15, -15, -15);
    scene.add(cityGroup);

    // Create isometric floor grid
    const cityFloorGrid = new THREE.GridHelper(16, 16, '#ff6a00', '#151515');
    cityFloorGrid.position.y = -2;
    cityFloorGrid.material.transparent = true;
    cityFloorGrid.material.opacity = 0.22;
    cityGroup.add(cityFloorGrid);

    // Construct 12 high-fidelity modular buildings
    const buildingMeshes: THREE.Mesh[] = [];
    const buildingEdges: THREE.LineSegments[] = [];

    selectedCityBuildings.forEach((bld) => {
      // Heights vary based on growth status or definition
      const bHeight = bld.height;
      const bGeo = new THREE.BoxGeometry(0.9, bHeight, 0.9);
      
      // Premium emissive glassmorphic building blocks
      const bMat = new THREE.MeshPhysicalMaterial({
        color: bld.color,
        transparent: true,
        opacity: 0.35,
        transmission: 0.8,
        roughness: 0.15,
        metalness: 0.1,
        thickness: bHeight * 0.5,
        emissive: bld.color,
        emissiveIntensity: bld.isComingSoon ? 0.05 : (bld.growth / 100) * 0.6,
      });

      const bMesh = new THREE.Mesh(bGeo, bMat);
      // Position on the grid translated from data
      bMesh.position.set(bld.gridX, -2 + bHeight / 2, bld.gridZ);
      cityGroup.add(bMesh);
      buildingMeshes.push(bMesh);

      // Neon Outlines (Sleek cyber skyscraper styling)
      const edgeGeo = new THREE.EdgesGeometry(bGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: bld.color,
        transparent: true,
        opacity: bld.isComingSoon ? 0.2 : 0.8,
      });
      const bEdge = new THREE.LineSegments(edgeGeo, edgeMat);
      bEdge.position.copy(bMesh.position);
      cityGroup.add(bEdge);
      buildingEdges.push(bEdge);
    });


    // --- 6. COMMUNITY LATTICE GROUP: Social neural network ---
    const commGroup = new THREE.Group();
    commGroup.position.set(12, 12, -15);
    scene.add(commGroup);

    const commParticlesCount = 30;
    const commPoints: THREE.Vector3[] = [];
    const commNodeGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const commNodeMat = new THREE.MeshBasicMaterial({ color: '#00ccff' });

    for (let c = 0; c < commParticlesCount; c++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 1.5 + Math.random() * 3.5;
      const p = new THREE.Vector3(
        dist * Math.sin(phi) * Math.cos(theta),
        dist * Math.sin(phi) * Math.sin(theta),
        dist * Math.cos(phi)
      );
      commPoints.push(p);

      // Node mesh
      const cMesh = new THREE.Mesh(commNodeGeo, commNodeMat);
      cMesh.position.copy(p);
      commGroup.add(cMesh);
    }

    // Connect nodes selectively with lines to represent network connectivity
    const linePairs: THREE.Vector3[] = [];
    for (let c = 0; c < commParticlesCount; c++) {
      // connect to nearest 2 neighbors
      const p1 = commPoints[c];
      const sorted = [...commPoints]
        .map((p, i) => ({ dist: p1.distanceTo(p), index: i, point: p }))
        .filter((item) => item.index !== c)
        .sort((a, b) => a.dist - b.dist);

      for (let j = 0; j < Math.min(2, sorted.length); j++) {
        linePairs.push(p1);
        linePairs.push(sorted[j].point);
      }
    }

    const commLinesGeo = new THREE.BufferGeometry().setFromPoints(linePairs);
    const commLinesMat = new THREE.LineBasicMaterial({
      color: '#ff6a00',
      transparent: true,
      opacity: 0.25,
    });
    const commLines = new THREE.LineSegments(commLinesGeo, commLinesMat);
    commGroup.add(commLines);


    // --- 7. SOCIAL PORTAL: Futuristic glassmorphic device mockup ---
    const socialGroup = new THREE.Group();
    socialGroup.position.set(0, 15, -2);
    scene.add(socialGroup);

    const phoneFrameGeo = new THREE.BoxGeometry(3.0, 5.8, 0.25);
    const phoneFrameMat = new THREE.MeshPhysicalMaterial({
      color: '#111111',
      roughness: 0.1,
      metalness: 0.9,
      transmission: 0.4,
      transparent: true,
      opacity: 0.8,
      thickness: 0.2,
      clearcoat: 1.0,
    });
    const phoneFrame = new THREE.Mesh(phoneFrameGeo, phoneFrameMat);
    socialGroup.add(phoneFrame);

    // Neon phone border glow
    const phoneEdgesGeo = new THREE.EdgesGeometry(phoneFrameGeo);
    const phoneEdgesMat = new THREE.LineBasicMaterial({ color: '#ff6a00', transparent: true, opacity: 0.8 });
    const phoneGlow = new THREE.LineSegments(phoneEdgesGeo, phoneEdgesMat);
    socialGroup.add(phoneGlow);

    const screenGeo = new THREE.PlaneGeometry(2.8, 5.5);
    const screenMat = new THREE.MeshBasicMaterial({
      color: '#3a1300',
      transparent: true,
      opacity: 0.35,
    });
    const phoneScreen = new THREE.Mesh(screenGeo, screenMat);
    phoneScreen.position.z = 0.13;
    socialGroup.add(phoneScreen);


    // --- TARGET CAMERA CONFIG FOR INTERPOLATION ---
    const targetCamPos = new THREE.Vector3(0, 0, 30);
    const targetCamLook = new THREE.Vector3(0, 0, 0);

    // Speed of camera sweeping (increased slightly for extremely slick response)
    const lerpSpeed = 0.05;

    // Set cursor interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- MAIN ANIMATION / RENDER TILE LOOP ---
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // --- 1. SMOOTH PORTAL ZOOM & CAMERA SWEEP ---
      switch (activeSection) {
        case 'loading':
          targetCamPos.set(0, 0, 10);
          targetCamLook.set(0, 0, 0);
          break;
        case 'hero':
          targetCamPos.set(0, 0.5, 12);
          targetCamLook.set(0, 0, 0);
          break;
        case 'about':
          targetCamPos.set(-15, 0.5, 7.5);
          targetCamLook.set(-15, 0, -2);
          break;
        case 'what-we-do':
          targetCamPos.set(15, 0.5, 8);
          targetCamLook.set(15, 0, -2);
          break;
        case 'ecosystem':
          targetCamPos.set(0, -15, 8.5);
          targetCamLook.set(0, -15, -2);
          break;
        case 'city':
          // Slightly angled isometric camera position over the city grid
          targetCamPos.set(-15 + 7, -15 + 8, -15 + 9);
          targetCamLook.set(-15, -15, -15);
          break;
        case 'community':
          targetCamPos.set(12, 12, -7.5);
          targetCamLook.set(12, 12, -15);
          break;
        case 'social':
          targetCamPos.set(0, 15, 7.5);
          targetCamLook.set(0, 15, -2);
          break;
      }

      // Smooth mouse parallax offset
      mouseX = THREE.MathUtils.lerp(mouseX, targetMouseX, 0.05);
      mouseY = THREE.MathUtils.lerp(mouseY, targetMouseY, 0.05);
      
      // Calculate dynamic camera offsets using mouse input
      const currentTargetPos = targetCamPos.clone();
      currentTargetPos.x += mouseX * 2.2;
      currentTargetPos.y += mouseY * 1.8;

      camera.position.lerp(currentTargetPos, lerpSpeed);

      // Smooth lookAt target blending
      const lookVector = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position),
        targetCamLook,
        lerpSpeed
      );
      camera.lookAt(lookVector);

      // --- 2. ROTATIONS & DYNAMIC LIGHT PULSES ---
      // Rotate space particles
      starParticles.rotation.y = elapsedTime * 0.015;
      starParticles.rotation.x = elapsedTime * 0.005;

      // Pulse main glowing reactor/light orbits
      if (mainOrangeLight) {
        mainOrangeLight.intensity = 10 + Math.sin(elapsedTime * 3) * 3;
      }

      // Cursor light tracking
      cursorLight.position.set(mouseX * 15, mouseY * 15, 5);

      // Hero logo animation
      heroGroup.rotation.y = elapsedTime * 0.45;
      reactorMesh.scale.setScalar(1 + Math.sin(elapsedTime * 6) * 0.15);
      orbitalRing1.rotation.z = elapsedTime * 0.8;
      orbitalRing2.rotation.z = -elapsedTime * 0.5;

      // About core rotation
      aboutGroup.rotation.y = elapsedTime * 0.25;
      innerSphere.rotation.x = elapsedTime * 0.1;
      outerSphere.rotation.z = -elapsedTime * 0.05;

      // What we do custom node animations
      communityMesh.rotation.y = elapsedTime * 0.6;
      communityMesh.rotation.x = elapsedTime * 0.3;
      
      eventRings.forEach((ring, idx) => {
        const scaleVal = 1 + ((elapsedTime * 0.8 + idx * 0.33) % 1.0) * 1.8;
        ring.scale.set(scaleVal, scaleVal, 1);
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1.0 - (scaleVal - 1) / 1.8);
      });

      helixLine1.rotation.y = elapsedTime * 1.2;
      helixLine2.rotation.y = elapsedTime * 1.2;

      cubeGroup.rotation.x = elapsedTime * 0.4;
      cubeGroup.rotation.y = elapsedTime * 0.3;
      innerCube.rotation.y = -elapsedTime * 0.8;

      // Ecosystem energy bullets shooting
      pulseParticles.forEach((particle) => {
        particle.progress += particle.speed;
        if (particle.progress > 1.0) particle.progress = 0;
        
        const pt = splineCurve.getPointAt(particle.progress);
        particle.mesh.position.copy(pt);
      });

      // City light animations
      cityGroup.rotation.y = Math.sin(elapsedTime * 0.05) * 0.08;
      buildingMeshes.forEach((mesh, index) => {
        const bl = selectedCityBuildings[index];
        if (!bl) return;
        if (mesh.material && 'emissiveIntensity' in mesh.material) {
          const material = mesh.material as THREE.MeshPhysicalMaterial;
          if (bl.isComingSoon) {
            material.emissiveIntensity = 0.08 + Math.sin(elapsedTime * 2 + index) * 0.05;
          } else {
            material.emissiveIntensity = ((bl.growth / 100) * 0.55) + Math.sin(elapsedTime * 4 + index * 1.5) * 0.15;
          }
        }
      });

      // Community neural nodes
      commGroup.rotation.y = elapsedTime * 0.12;

      // Social Phone floating float
      socialGroup.position.y = 15 + Math.sin(elapsedTime * 1.5) * 0.3;
      socialGroup.rotation.y = mouseX * 0.45;
      socialGroup.rotation.x = mouseY * 0.22;

      // Direct loop render call
      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE LISTENER ---
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- TEARDOWN CLEANUP ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose materials/geometries
      starsGeometry.dispose();
      starsMaterial.dispose();
      topConeGeo.dispose();
      bodyCylinderGeo.dispose();
      glassMat.dispose();
      reactorGeo.dispose();
      reactorMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      innerSphereGeo.dispose();
      innerSphereMat.dispose();
      outerSphereGeo.dispose();
      outerSphereMat.dispose();
      aboutGrid.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      eventRingMat.dispose();
      eventRings.forEach(r => r.geometry.dispose());
      helixGeo1.dispose();
      helixGeo2.dispose();
      helixMat.dispose();
      outerCubeGeo.dispose();
      outerCubeMat.dispose();
      innerCubeGeo.dispose();
      innerCubeMat.dispose();
      ecoNodeGeo.dispose();
      ecoNodeMatBase.dispose();
      pulseParticleGeo.dispose();
      pulseParticleMat.dispose();
      cityFloorGrid.dispose();
      buildingMeshes.forEach(m => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) {
          m.material.forEach(mat => mat.dispose());
        } else {
          m.material.dispose();
        }
      });
      buildingEdges.forEach(e => e.geometry.dispose());
      commNodeGeo.dispose();
      commNodeMat.dispose();
      commLinesGeo.dispose();
      commLinesMat.dispose();
      phoneFrameGeo.dispose();
      phoneFrameMat.dispose();
      phoneEdgesGeo.dispose();
      phoneEdgesMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();

      renderer.dispose();
    };
    } catch (error) {
      console.warn("WebGL initialization failed or context went inactive:", error);
      setHasWebGL(false);
    }
  }, [activeSection, selectedCityBuildings]);

  if (!hasWebGL) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#030303] overflow-hidden flex flex-col justify-center items-center" id="three-canvas-fallback">
        {/* Modern Cyber Starfield Fallback (Non-WebGL friendly) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,106,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,106,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#030303_100%)] pointer-events-none opacity-90 mix-blend-multiply" />
        
        {/* Ambient atmospheric lighting blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-blue-600/5 blur-[90px] rounded-full pointer-events-none" />

        {/* Dynamic flickering cosmic star grids */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse [animation-duration:3s]" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-amber-400 rounded-full animate-ping [animation-duration:5s]" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-duration:4s]" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping [animation-duration:6s]" />
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-pulse [animation-duration:3.5s]" />
          <div className="absolute top-1/2 left-1/5 w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse [animation-duration:4.5s]" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden" id="three-canvas-root">
      <canvas ref={canvasRef} className="w-full h-full block" id="3d-interactive-viewport" />
    </div>
  );
};
