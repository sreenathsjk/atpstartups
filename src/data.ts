/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CityBuilding } from './types';

export const INITIAL_CITY_BUILDINGS: CityBuilding[] = [
  {
    id: 'bld-atoz',
    name: 'AtoZ ServiceHub',
    tagline: 'On-Demand Hyperlocal Services',
    category: 'SaaS & Consumer Tech',
    founder: 'Kummara Sreenath',
    description: 'An advanced service providers network designed to connect users with vetted local service professionals in minutes, streamlining real-time delivery.',
    growth: 94,
    isComingSoon: false,
    gridX: -0.5,
    gridZ: 2.2,
    height: 2.8,
    color: '#ffcc00', // Neon Golden Yellow
    founderImage: 'https://lh3.googleusercontent.com/d/1gmPwRB_wniE2EwT2NMKr8Ou48NwqRds1=w600-h600-c',
    idea: 'A service providers app, that helps to get their required providers in time within minutes of their required service.',
    problem: 'Sourcing reliable, vetted handyman, medical, utility, or technical professionals in tier-2 cities is plagued by opaque brokers, high markups, and long offline delays.',
    solution: 'A real-time hyper-local matchmaking server matching customers to certified technicians available within a tight 3km cell map within minutes.',
    longDescription: 'AtoZ ServiceHub compiles the chaotic fragmented local service market into an on-demand, algorithmic infrastructure. Empowering micro-professionals to offer their technical skills directly, customer requests are routed, verified, and settled with zero intermediate fat. A true service provider engine designed to fuel hyper-efficient services on the go.',
    tags: ['SaaS', 'On-Demand', 'Hyperlocal', 'Geospatial Match', 'Automatic Routing', 'Instant Settlement'],
    metricsDetail: [
      { label: 'MEDIAN RESPONSE TIME', value: '3.4 Minutes' },
      { label: 'VETTED SERVICE PROVIDERS', value: '940+ Pros' },
      { label: 'SUCCESSFUL SERVICE MATCHES', value: '18,500+' }
    ]
  },
  {
    id: 'bld-core',
    name: 'ATP Core Lab',
    tagline: 'Deep AI & Kernel Optimizers',
    category: 'Deep Tech & AI',
    founder: 'Nagesh Bandi',
    description: 'Constructing high-performance logical models and system-level compilers to deploy generative code systems natively on local edges.',
    growth: 88,
    isComingSoon: false,
    gridX: -1.8,
    gridZ: 1.8,
    height: 3.6,
    color: '#ff6a00', // Neon Orange
    founderImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800',
    idea: 'Bypassing massive cloud latency by optimizing deep learning LLM compilers to fit and run natively on raw hardware registers and edge systems.',
    problem: 'Industrial systems requiring real-time autonomous diagnostics cannot afford roundtrip latency to global servers, plus they operate under strict bandwidth constraints.',
    solution: 'Next-gen LLM optimization pipeline that strips redundant parameters and outputs self-contained C++ binaries targeting ARM, CUDA, and Apple Silicon directly.',
    longDescription: 'ATP Core Lab designs system-level compilers and optimization adapters that transform multi-billion parameter neural nodes into lightweight, lightning-fast firmware agents. Operates at extreme low power parameters without sacrificing diagnostic accuracy.',
    tags: ['Deep Tech', 'AI compilers', 'Edge AI', 'Optimization', 'ARM Dev', 'Pruning Models'],
    metricsDetail: [
      { label: 'COMPILATION SPEED', value: '7.2M tok/sec' },
      { label: 'RAM MEMORY REDUCTION', value: '82% Compaction' },
      { label: 'EDGE AGENTS DEPLOYED', value: '4,500+ Units' }
    ]
  },
  {
    id: 'bld-logistics',
    name: 'Corridor Autonomous',
    tagline: 'The Bangalore-ATP Transit Stack',
    category: 'Robotics & Logistics',
    founder: 'Priya Anant',
    description: 'Developing autonomous route telemetry systems specifically calibrated for heavy logistic transit corridors spanning South Indian tech capitals.',
    growth: 72,
    isComingSoon: false,
    gridX: 1.8,
    gridZ: -1.8,
    height: 2.2,
    color: '#00ccff', // Cyber Blue
    founderImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800',
    idea: 'Equipping freight carriers with lightweight computer vision nodes and connected highway transponders to create safe, semi-autonomous logistics convoys.',
    problem: 'The high-volume logistics corridors linking Bangalore to northern hubs suffer from extreme congestion, safety hazards, and unpredictable fuel expenditure.',
    solution: 'A cloud-coordinated platoon telemetry framework where led trucks broadcast real-time braking, acceleration, and navigational decisions to trailing units.',
    longDescription: 'Corridor Autonomous is building the physical and digital rails for South Indian transit grids. By instrumenting commercial freighters with sensory hardware, we reduce aerodynamic drag, minimize transit collision risks, and ensure predictive scheduled arrivals.',
    tags: ['Autonomous Tech', 'Connected Platoon', 'Computer Vision', 'Telemetry API', 'Smart Transit', 'Logistics Node'],
    metricsDetail: [
      { label: 'FUEL MILEAGE INCREASE', value: '18.4% Saved' },
      { label: 'CONVOY LATENCY INDEX', value: '<25ms Echo' },
      { label: 'ACTIVE CARRIER TRUCKS', value: '120+ Fleet' }
    ]
  },
  {
    id: 'bld-agri',
    name: 'Silicon AgriNode',
    tagline: 'Microclimatic Irrigation Compilers',
    category: 'Climate & Agritech',
    founder: 'Rami Reddy',
    description: 'Synthesizing IoT wind-patterns and soil telemetry data to automate drip arrays across semi-arid terrains, reducing water spend by massive margins.',
    growth: 65,
    isComingSoon: false,
    gridX: -3.2,
    gridZ: -3.2,
    height: 1.8,
    color: '#00ff66', // Laser Green
    founderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    idea: 'Integrating real-time ambient soil moisture data with predictive local microclimate wind simulations to execute precision agricultural watering routines.',
    problem: 'Farming in the drought-prone Rayalaseema belt suffers from unscientific irrigation practices, exhausting precious water reserves and causing crop stress.',
    solution: 'Mesh-networking local sensory probes with cloud forecasting, driving automated valves that irrigate soil only during optimal microclimatic windows.',
    longDescription: 'Silicon AgriNode is a hardware-plus-software agritech suite designed for water-scarce terrains. Our LoRaWAN-enabled ground probes analyze transpiration trends, ensuring crops receive exactly what they need while safeguarding underground aquifers.',
    tags: ['IoT Sensors', 'LoRaWAN Mesh', 'Drip automation', 'Agritech Code', 'Resource Compilers', 'Drought tech'],
    metricsDetail: [
      { label: 'AQUIFER WATER SAVED', value: '38.5% Absolute' },
      { label: 'CROP YIELD ACCELERATION', value: '22% Gain' },
      { label: 'INSTRUMENTED FARM ACRES', value: '1,200+ Acres' }
    ]
  },
  {
    id: 'bld-wind',
    name: 'Rayalaseema WindGrid',
    tagline: 'Generative Wind Core Sinks',
    category: 'Clean Energy',
    founder: 'Soma Sekhar',
    description: 'Architecting algorithmic dispatch engines to capture and channel energy surges from wind corridor tunnels of Rayalaseema into national grid nodes.',
    growth: 92,
    isComingSoon: false,
    gridX: 3.2,
    gridZ: 3.2,
    height: 3.0,
    color: '#ffa500', // Amber
    founderImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=800',
    idea: 'Applying millisecond-level prediction algorithms to heavy wind turbines to dynamically match instantaneous spikes in clean energy power with smart grid demands.',
    problem: 'Renewable and wind wind energy is highly volatile; grid operators often curtail power spikes because traditional grids cannot adapt fast enough.',
    solution: 'High-speed battery storage controllers paired with machine learning dispatch loops that buffer energy waves and release them smoothly to the state grid.',
    longDescription: 'Rayalaseema WindGrid balances and matches massive clean energy output. Our custom routing logic acts as a stabilization layer between natural wind surges and utility grids, preventing waste and ensuring regional energy self-reliance.',
    tags: ['Clean Energy', 'Smart Grid Link', 'Machine Learning', 'Energy Dispatch', 'Battery Storage', 'MQTT SCADA'],
    metricsDetail: [
      { label: 'CURTAILMENT ELIMINATED', value: '98% Recovered' },
      { label: 'CONNECTED CAPACITY', value: '340 MW Grid' },
      { label: 'ANNUAL REDUCED CO2', value: '14,000 Tons' }
    ]
  },
  {
    id: 'bld-fin',
    name: 'Stealth FinCore',
    tagline: 'Global Ledger Settlement Nodes',
    category: 'Fintech & Web3',
    founder: 'Vikram Gupta',
    description: 'Deploying robust cryptographic settlement routes enabling rural micro-enterprises to collect international payouts instantly with low basis points.',
    growth: 81,
    isComingSoon: false,
    gridX: 3.5,
    gridZ: -1.2,
    height: 3.2,
    color: '#ff00ff', // Cyber Pink
    founderImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600&h=800',
    idea: 'Fusing stablecoins with local payment routes to bypass international wire fees, delivering cash straight to merchant checkouts.',
    problem: 'Rural artisans, weavers, and exporters face immense transaction costs (up to 8-12%) and multi-day clearing delays when acquiring foreign currency transfers.',
    solution: 'Frictionless layer-2 blockchain bridge connected to instant UPI protocols, automating compliance and distributing immediate local currency funds.',
    longDescription: 'Stealth FinCore normalizes global business transactions for small-scale local builders. By utilizing distributed Ledger tech, we compress global payout barriers into microsecond micro-actions, charging near-zero processing overhead.',
    tags: ['Fintech Core', 'Layer 2 Bridge', 'Cryptographic ledgers', 'UPI Settlement', 'B2B Payments', 'Artisan Rails'],
    metricsDetail: [
      { label: 'AVERAGE SETTLE SPEED', value: '4.2 Seconds' },
      { label: 'TRANSACTION COST', value: '0.15% Margin' },
      { label: 'EXPORTER USERBASE', value: '640+ Business Nodes' }
    ]
  },
  {
    id: 'bld-devs',
    name: 'HyperScale Devs',
    tagline: 'AI Orchestrated Tech Factories',
    category: 'SaaS & Dev Tools',
    founder: 'Amulya K.',
    description: 'Structuring remote developer sandboxes backed by automated AI copilots, allowing top global scaleouts to assemble engineering teams at light speed.',
    growth: 95,
    isComingSoon: false,
    gridX: 1.2,
    gridZ: 1.2,
    height: 4.4,
    color: '#ffffff', // Cyber White
    founderImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=800',
    idea: 'Combining high-speed cloud devspaces with AI agents that manage PR pipelines, code testing, and scaffolding boilerplate out of the box.',
    problem: 'Starting a new technical project is weighed down by workspace setup friction, continuous testing bottlenecks, and slow onboarding tracks.',
    solution: 'An instant, containerized build browser environment that uses stateful AI agents to onboard, test, and ship features based on high-level instructions.',
    longDescription: 'HyperScale Devs reinvents how software is constructed. By coupling high-tier local talent with advanced generative frameworks, we create self-documenting, supercharged developers capable of handling massive backlogs with ease.',
    tags: ['Dev Tools', 'Cloud Sandboxes', 'AI Autonomous Coding', 'GitOps integration', 'TS Compiler', 'Rapid Prototyping'],
    metricsDetail: [
      { label: 'ONBOARDING LATENCY', value: '9.0 Seconds' },
      { label: 'AI COPILOT UTILITY', value: '40% PR coverage' },
      { label: 'ACTIVE SANDBOXES', value: '12,200+ Nodes' }
    ]
  },
  {
    id: 'bld-edtech',
    name: 'Anantaya XR',
    tagline: 'Spatial Immersive Classrooms',
    category: 'AR/VR & Education',
    founder: 'Dr. Girish Lal',
    description: 'Broadcasting low-bandwidth WebXR mechanical simulations to technical colleges to elevate vocational competency matrices in heavy assembly.',
    growth: 58,
    isComingSoon: false,
    gridX: -3.8,
    gridZ: 1.2,
    height: 1.9,
    color: '#ff3300', // Hot Red
    founderImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800',
    idea: 'Constructing extremely lightweight, highly interactive spatial mechanical simulations accessible on ultra-cheap VR devices and modern smart screens.',
    problem: 'Technical students face a heavy gap in hands-on equipment training because physical industrial assets are incredibly expensive and dangerous to interact with.',
    solution: 'Streaming compressed physics simulations via WebGL/WebXR to low-spec headsets, providing step-by-step guidance for complex industrial tasks.',
    longDescription: 'Anantaya XR democratizes mastery of advanced machinery. From engine overhauls to green grid repair, we host and render digital twins of intricate components in the browser, providing tactile learning without the heavy hardware overhead.',
    tags: ['WebXR Spatial', 'Three.js Twins', 'Low-Bandwidth Stream', 'Vocational Training', 'Mechanical Simulation'],
    metricsDetail: [
      { label: 'LAB COMPETENCY RATING', value: '+45% Increase' },
      { label: 'AVERAGE BANDWIDTH USE', value: '1.2 MB/Min' },
      { label: 'IMMERSED STUDENTS', value: '14,000+ Enrolled' }
    ]
  },
  {
    id: 'bld-cyber',
    name: 'Aegis Hash',
    tagline: 'Dynamic Firmware Encryptors',
    category: 'Cybersecurity',
    founder: 'Karthik S.',
    description: 'Providing dynamic polymorphic shields to protect critical industrial telemetry grids and power dispatch nodes from zero-day vectors.',
    growth: 76,
    isComingSoon: false,
    gridX: -1.2,
    gridZ: -1.2,
    height: 2.6,
    color: '#ca1111', // Crimson Red
    founderImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600&h=800',
    idea: 'Securing mission-critical IoT devices by generating continuously morphing cryptographic firmwares that disrupt any malicious exploit strategies.',
    problem: 'Traditional industrial routers, wind turbine sensors, and telemetry controllers are rarely updated, leaving them vulnerable to zero-day hijacking.',
    solution: 'Running light cryptographic shields compile-time at the kernel level, creating randomly shuffling binary layouts that render targeted memory injection exploits useless.',
    longDescription: 'Aegis Hash hardens the cyber security parameters of critical national infra. By layering eBPF networks and cryptographic binary rotation, we defend connected endpoints against high-intensity hacking campaigns.',
    tags: ['Cybersecurity', 'eBPF Shield', 'Polymorphic Firmware', 'Zero-Day Shield', 'Industrial IoT Sec', 'Rust Kernel'],
    metricsDetail: [
      { label: 'EXPLOIT ARREST INDEX', value: '99.98% Guard' },
      { label: 'DOCKER OVERHEAD LATENCY', value: '<2 microseconds' },
      { label: 'PROTECTED SUBSTATIONS', value: '88 High-V Energy' }
    ]
  },
  // ----- COMING SOON STEALS -----
  {
    id: 'bld-soon-health',
    name: 'TeleHealth Orbit',
    tagline: 'Satellite Low-Latency Diagnostics',
    category: 'Healthtech',
    founder: 'TBD',
    description: 'Preparing to launch modular low-orbit satellite receptor dishes connecting nomadic regions with direct AI surgical advice.',
    growth: 0,
    isComingSoon: true,
    gridX: 2.0,
    gridZ: 4.0,
    height: 1.2,
    color: '#555555', // Muted Gray
  },
  {
    id: 'bld-soon-foundry',
    name: 'Robotic Foundry',
    tagline: 'Autonomous Heavy Metal Sinks',
    category: 'Smart Manufacturing',
    founder: 'TBD',
    description: 'Architecting fully automated, zero-carbon precision casting foundries powered by green grid reserves.',
    growth: 0,
    isComingSoon: true,
    gridX: -2.0,
    gridZ: -4.0,
    height: 1.4,
    color: '#555555',
  },
  {
    id: 'bld-soon-quantum',
    name: 'ATP Quantum Nodes',
    tagline: 'Cryogenic Josephson Compilers',
    category: 'Quantum Computing',
    founder: 'TBD',
    description: 'Coordinating blueprints for local cryogenic computing chambers enabling instant cryptography modeling.',
    growth: 0,
    isComingSoon: true,
    gridX: 4.0,
    gridZ: 4.0,
    height: 1.1,
    color: '#555555',
  },
  {
    id: 'bld-soon-space',
    name: 'SpaceJet Aero',
    tagline: 'Atmospheric Drag Compressors',
    category: 'Aerospace',
    founder: 'TBD',
    description: 'Developing high-altitude wing surfaces designed to reduce frictional index of low orbit communication probes.',
    growth: 0,
    isComingSoon: true,
    gridX: -4.0,
    gridZ: -4.0,
    height: 1.5,
    color: '#555555',
  }
];
