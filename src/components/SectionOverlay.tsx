/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ActiveSection, 
  CityBuilding, 
  InteractiveModule, 
  EcosystemNode, 
  TeamMember 
} from '../types';
import { INITIAL_CITY_BUILDINGS } from '../data';
import { audio } from './AudioEngine';
import { 
  ArrowRight, 
  Rocket, 
  Zap, 
  Globe, 
  Network, 
  ChevronRight, 
  CheckCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Award,
  Instagram
} from 'lucide-react';

interface SectionOverlayProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  selectedBuilding: CityBuilding | null;
  onSelectBuilding: (building: CityBuilding | null) => void;
  hoveredNode: string | null;
  onHoverNode: (node: string | null) => void;
  cityBuildings: CityBuilding[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  allCategories: string[];
}

export const SectionOverlay: React.FC<SectionOverlayProps> = ({
  activeSection,
  onSectionChange,
  selectedBuilding,
  onSelectBuilding,
  hoveredNode,
  onHoverNode,
  cityBuildings,
  selectedCategory,
  onCategoryChange,
  allCategories,
}) => {
  // --- FORM STATES ---
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userIdea, setUserIdea] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formKey, setFormKey] = useState('');
  const [registeredCount, setRegisteredCount] = useState(1); // Pre-fill to represent scarcity (1/100)

  // --- INTERACTIVE ACTIVE TABS ---
  const [activeModuleId, setActiveModuleId] = useState<'community' | 'events' | 'mentorship' | 'startups'>('community');
  const [activeEcoNodeId, setActiveEcoNodeId] = useState<'idea' | 'build' | 'launch' | 'scale'>('idea');

  // --- TYPEWRITER HOOK ---
  const [aboutIntroText, setAboutIntroText] = useState('');
  const aboutFullText = "Anantapur is the hidden crucible of South India's next tech wave. Located strategically inside the high-velocity corridor anchoring Bangalore, Hyderabad, and Chennai, ATP is a dynamic frontier of rapid growth, deep engineering intelligence, and cost efficiency. atpstartups is the ecosystem compiler, activating absolute founders, global capital, and rapid execution networks to construct world-class enterprises out of Anantapur.";

  useEffect(() => {
    if (activeSection === 'about') {
      setAboutIntroText('');
      let index = 0;
      const interval = setInterval(() => {
        setAboutIntroText((prev) => prev + aboutFullText.charAt(index));
        index++;
        if (index >= aboutFullText.length) {
          clearInterval(interval);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [activeSection]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;

    audio.playPulse();
    audio.playSwoosh();

    // Generate futuristic Founding Member Key
    const key = `ATP-KEY-#2026-${Math.floor(Math.random() * 9000 + 1000)}`;
    setFormKey(key);
    setIsFormSubmitted(true);
    setRegisteredCount((prev) => Math.min(100, prev + 1));

    // Construct structured WhatsApp message details
    const message = `Hello atpstartups! I would like to apply to be a Foundational Builder.

• Name: ${userName}
• Email: ${userEmail}
• Concept / Core Skillset: ${userIdea || 'Not specified'}

Founding Sovereign Key: ${key}`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/916301756306?text=${encodedText}`;
    
    // Direct the user to WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCTA = (section: ActiveSection) => {
    audio.playPulse();
    audio.playSwoosh();
    onSectionChange(section);
  };

  // --- STATIC WORK MODULE DATA ---
  const modules: InteractiveModule[] = [
    {
      id: 'community',
      title: 'Founders Network',
      tagline: 'Hyper-Connected Collective Intelligence',
      description: 'A sovereign layer of 500+ ambitious developers, marketers, designers and compounders collaborating around regional hubs.',
      stat: '500+ Builders',
      metric: 'Lattice Density: 94%'
    },
    {
      id: 'events',
      title: 'Ecosystem Events',
      tagline: 'High-Resonance Detonations',
      description: 'Regional hackathons, engineering sprints, deep-tech crash courses, and closed-door venture matchmakings.',
      stat: '12+ Annual Tracks',
      metric: 'Attendee CAGR: +180%'
    },
    {
      id: 'mentorship',
      title: 'Sovereign Mentorship',
      tagline: 'Direct-Access Execution Lines',
      description: 'Zero-mumbo-jumbo guidance from battle-tested founders, lead engineers, and tactical legal architects from Bangalore & SF.',
      stat: '40+ Core Mentors',
      metric: 'Weekly Office Hours'
    },
    {
      id: 'startups',
      title: 'Launch Incubator',
      tagline: 'Rapid Seed Compilation',
      description: 'Structural development framework providing office infrastructure, cloud-credit bundles, and direct institutional funding lines.',
      stat: '15+ Core Startups',
      metric: 'Total Seed Vault: $1.2M'
    }
  ];

  // --- PIPELINE ECOSYSTEM FLOW DATA ---
  const ecoNodes: EcosystemNode[] = [
    {
      id: 'idea',
      label: '01. IDEA BUILDER',
      title: 'Problem Compilation',
      description: 'Subjecting hypothesis to rigorous regional and industrial stress-testing. Matching high-conviction insights with co-founding pairs.',
      action: 'Formulate Thesis',
      metrics: 'Idea Pool: High quality validation loops'
    },
    {
      id: 'build',
      label: '02. MVP ENGINE',
      title: 'Engineering Sprints',
      description: 'Executing minimum-viable compilers. Focus on clean architecture, lightning-fast deployment, and razor-sharp early UX.',
      action: 'Construct MVP',
      metrics: 'Incubate MVP in 60-day sprints'
    },
    {
      id: 'launch',
      label: '03. DETONATION',
      title: 'Vanguard Growth',
      description: 'Activating stealth marketing hubs to acquire the first 500 fanatic customers. Iterating feedback loops instantly.',
      action: 'Deploy Product',
      metrics: 'Stealth-to-market launching lines'
    },
    {
      id: 'scale',
      label: '04. VELOCITY CORRIDOR',
      title: 'Uncapped Expansion',
      description: 'Leveraging ATP cost efficiency to scale operating margins while unlocking seed expansion rounds from top-tier funds.',
      action: 'Raise Venture Seed',
      metrics: 'Uncapped scale pipeline'
    }
  ];

  // --- SOCIAL MOCK INSTAGRAM FEED DATA ---
  const instagramFeed = [
    {
      id: 1,
      imageGlow: 'from-orange-500/20 to-red-500/20',
      tag: '#ignition',
      date: '2 hours ago',
      title: 'Anantapur Tech Hub Phase 1 Complete 🏢',
      likes: '342',
      body: 'Stealth development lab is officially open. 50 high-speed node seats, optical fiber pipelines, and limitless coffee are standard.'
    },
    {
      id: 2,
      imageGlow: 'from-amber-500/20 to-yellow-500/20',
      tag: '#incubators',
      date: '2 days ago',
      title: 'Unlocking $1.2M Seed Pool Vault 💰',
      likes: '489',
      body: 'Thrilled to compile ATP Startups Fund I. Seed tickets between $25k to $100k ready to trigger for high-velocity builders.'
    },
    {
      id: 3,
      imageGlow: 'from-blue-500/20 to-teal-500/20',
      tag: '#hackathon',
      date: '1 week ago',
      title: 'ATP Dev-Sprint v1.0 Wrap 💻',
      likes: '512',
      body: '48 hours of pure, unadulterated TypeScript / Rust construction. 14 prototypes born, 3 transitioned directly to incubating sprints.'
    }
  ];

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-12 select-none font-sans overflow-hidden" id="ui-metaverse-overlay">
      
      {/* -------------------- MAIN OVERLAYS (MIDDLE LAYERS) -------------------- */}
      <div className="flex-1 w-full flex items-start sm:items-center relative overflow-y-auto max-h-[75vh] sm:max-h-none scrollbar-none py-12">
        <AnimatePresence mode="wait">
          
          {/* ----- 1. HERO HUB OVERLAY ----- */}
          {activeSection === 'hero' && (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-xl text-left pointer-events-auto"
            >
              {/* Regional tag */}
              <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.35em] text-orange-500 font-mono">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>The Sovereign Startup Crucible</span>
              </div>

              {/* Dynamic Title */}
              <h2 className="text-4xl sm:text-6xl tracking-tight leading-none text-white font-light uppercase mb-6">
                BUILDING <br />
                <span className="text-orange-500 font-medium font-sans filter drop-shadow-[0_0_20px_rgba(255,106,0,0.25)]">ANANTAPUR'S</span><br />
                STARTUP FUTURE
              </h2>

              <p className="text-sm font-light text-white/50 tracking-wide leading-relaxed mb-8 max-w-md">
                Unlocking unprecedented talent densification, hyper-efficient developer units, and institutional seed capital at the absolute intersection of South India's core tech corridors.
              </p>

              {/* Magnetic Interactive CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleCTA('community')}
                  className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs uppercase tracking-[0.2em] font-mono border border-orange-400/20 shadow-[0_0_25px_rgba(255,106,0,0.25)] hover:shadow-[0_0_40px_rgba(255,106,0,0.45)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Join Community</span>
                  <ArrowRight className="w-4 h-4 translate-y-[-0.5px]" />
                </button>

                <button
                  onClick={() => handleCTA('city')}
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs uppercase tracking-[0.2em] font-mono border border-white/10 hover:border-orange-500/30 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Ecosystem</span>
                  <Rocket className="w-4 h-4 text-orange-500" />
                </button>
              </div>

              {/* Live scarcity dynamic stat overlay */}
              <div className="mt-12 flex gap-8 border-t border-white/5 pt-6 text-left max-w-md font-mono">
                <div>
                  <span className="block text-2xl font-light text-white">{registeredCount}%</span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40">Founders Filled</span>
                </div>
                <div>
                  <span className="block text-2xl font-light text-orange-500">12+</span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40">Incubated Labs</span>
                </div>
                <div>
                  <span className="block text-2xl font-light text-white">$1.2M</span>
                  <span className="text-[9px] uppercase tracking-widest text-white/40">Seed Capital Pool</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ----- 2. ABOUT VISION OVERLAY ----- */}
          {activeSection === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-left pointer-events-auto"
            >
              <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.35em] text-orange-500 font-mono">
                <Award className="w-3.5 h-3.5" />
                <span>COMPILER THESIS / MISSION_Vision</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-6">
                holographic <span className="text-orange-500 font-medium">vision</span>
              </h2>

              {/* Glass container with typewritten core text */}
              <div className="p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md mb-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-orange-500 to-transparent" />
                <p className="text-sm font-mono leading-relaxed text-white/80 min-h-[140px] sm:min-h-[100px]">
                  {aboutIntroText}
                  <span className="inline-block w-1.5 h-4 bg-orange-500 ml-1 animate-pulse" />
                </p>
              </div>

              {/* Grid bento info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-lg border border-white/5 bg-white/[0.01] hover:border-orange-500/20 transition-colors duration-300">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-orange-400 mb-2">Our Mission</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    To build a modern digital technology oasis in Anantapur that spawns global-first products while anchoring capital-efficient regional operation workflows.
                  </p>
                </div>
                <div className="p-5 rounded-lg border border-white/5 bg-white/[0.01] hover:border-orange-500/20 transition-colors duration-300">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-orange-400 mb-2">Why Anantapur?</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Unbounded space scalability, massive engineering pool from local universities, and a hyper-strategic location 2.5 hours away from Bangalore airport.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ----- 3. WHAT WE DO PORTALS OVERLAY ----- */}
          {activeSection === 'what-we-do' && (
            <motion.div 
              key="what-we-do"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl w-full text-left pointer-events-auto"
            >
              <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.35em] text-orange-500 font-mono">
                <Zap className="w-3.5 h-3.5" />
                <span>ACTIVE SERVICE STREAMS</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-8">
                ecosystem <span className="text-orange-500 font-medium">portals</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Visual node tabs selector */}
                <div className="md:col-span-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        audio.playTick();
                        setActiveModuleId(mod.id);
                        onHoverNode(mod.id);
                      }}
                      className={`
                        w-full text-left px-4 py-3 rounded-md border text-[10px] sm:text-xs font-mono uppercase tracking-widest transition-all duration-300 whitespace-nowrap cursor-pointer
                        ${activeModuleId === mod.id 
                          ? 'border-orange-500/50 bg-orange-500/10 text-orange-400 shadow-[0_0_15px_rgba(255,106,0,0.15)]' 
                          : 'border-white/5 bg-white/[0.01] text-white/50 hover:text-white hover:border-white/20'
                        }
                      `}
                    >
                      {mod.title}
                    </button>
                  ))}
                </div>

                {/* Info Container with real statistics */}
                <div className="md:col-span-8 p-6 rounded-lg border border-white/10 bg-black/60 backdrop-blur-lg shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-[9px] font-mono tracking-widest text-orange-500/40">
                    PORTAL_DATA_REF_01
                  </div>

                  <AnimatePresence mode="wait">
                    {modules.map((mod) => mod.id === activeModuleId && (
                      <motion.div
                        key={mod.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[8px] font-mono tracking-wider bg-orange-500/10 border border-orange-500/20 text-orange-400 uppercase mb-4">
                          {mod.tagline}
                        </span>
                        
                        <h3 className="text-xl font-normal text-white mb-3">
                          {mod.title}
                        </h3>
                        
                        <p className="text-xs text-white/60 leading-relaxed mb-6">
                          {mod.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                          <div>
                            <span className="block text-[8px] uppercase tracking-widest text-[#00ccff] font-mono">CORE SCALE</span>
                            <span className="text-lg font-light text-white">{mod.stat}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-widest text-[#ffcc00] font-mono">EFFICIENCY METRIC</span>
                            <span className="text-xs font-mono text-white mt-1.5 block">{mod.metric}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ----- 4. ECOSYSTEM STEPS PIPELINE ----- */}
          {activeSection === 'ecosystem' && (
            <motion.div 
              key="ecosystem"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl w-full text-left pointer-events-auto"
            >
              <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.35em] text-orange-500 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>BUILDER COMPILE FLOW</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-8">
                startup <span className="text-orange-500 font-medium">pipeline</span>
              </h2>

              {/* Dynamic Flow Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                {ecoNodes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      audio.playTick();
                      setActiveEcoNodeId(n.id);
                    }}
                    className={`
                      text-left p-4 rounded-md border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[90px] cursor-pointer
                      ${activeEcoNodeId === n.id
                        ? 'border-orange-500 bg-orange-500/10 text-white'
                        : 'border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-[8px] font-mono tracking-widest uppercase block mb-1">
                      {n.label}
                    </span>
                    <span className="text-xs sm:text-sm font-normal block font-sans">
                      {n.title}
                    </span>
                    {activeEcoNodeId === n.id && (
                      <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                    )}
                  </button>
                ))}
              </div>

              {/* Floating glass summary dashboard */}
              <div className="p-6 rounded-lg border border-white/10 bg-black/60 backdrop-blur-lg shadow-2xl relative">
                <AnimatePresence mode="wait">
                  {ecoNodes.map((n) => n.id === activeEcoNodeId && (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-orange-500 mb-3">
                        COMPILATION_STAGE // {n.title.toUpperCase()}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-white/80 mb-6 max-w-xl">
                        {n.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4.5 h-4.5 text-orange-500" />
                          <span className="text-xs font-mono text-white/60 tracking-wider uppercase">
                            Target Threshold: <span className="text-white">{n.metrics}</span>
                          </span>
                        </div>

                        <button 
                          onClick={() => handleCTA('community')}
                          className="flex items-center gap-1.5 px-4 py-2 border border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/15 text-orange-400 hover:text-white rounded text-[10px] font-mono tracking-widest uppercase cursor-pointer transition-colors duration-300 sm:self-start"
                        >
                          <span>{n.action}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ----- 5. FUTURISTIC STARTUP CITY MAP ----- */}
          {activeSection === 'city' && (
            <motion.div 
              key="city"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl w-full text-left pointer-events-auto flex flex-col justify-start max-h-[85vh] sm:max-h-[500px]"
            >
              <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-[0.35em] text-orange-500 font-mono">
                <Globe className="w-3.5 h-3.5" />
                <span>ANANTAPUR 3D GEO-GRID MAP</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-light text-white uppercase tracking-tight mb-4">
                startup <span className="text-orange-500 font-medium">city map</span>
              </h2>

              <p className="text-xs text-white/40 tracking-wider mb-4">
                Hover or select incubated entities in Anantapur's cyber-physical development zone below. Glass skyscrapers representing teams and capitalization metrics.
              </p>

              {/* Futuristic Category Filters */}
              <div className="mb-4">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#ff6a00] block mb-2">
                  // SECTOR GEO-GEAR FILTER — ACTIVE_SECTOR [{selectedCategory === 'all' ? 'ALL_SECTORS' : selectedCategory.toUpperCase()}]
                </span>
                <div className="flex flex-wrap gap-1.5 p-1.5 rounded-lg bg-white/[0.02] border border-white/5 max-h-[110px] overflow-y-auto scrollbar-none">
                  {allCategories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    const count = cat === 'all' 
                      ? INITIAL_CITY_BUILDINGS.length
                      : INITIAL_CITY_BUILDINGS.filter(b => b.category === cat).length;
                    
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          audio.playTick();
                          onCategoryChange(cat);
                        }}
                        className={`
                          px-2.5 py-1.5 rounded text-[10px] font-mono tracking-wide transition-all duration-300 border cursor-pointer flex items-center gap-2
                          ${isActive 
                            ? 'bg-orange-500/20 border-orange-500/60 text-orange-400 font-semibold shadow-[0_0_10px_rgba(249,115,22,0.15)]' 
                            : 'bg-black/40 border-white/5 text-white/40 hover:text-white/80 hover:border-white/10'
                          }
                        `}
                      >
                        <span className="uppercase">{cat === 'all' ? 'All Sectors' : cat}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-orange-500/30 text-orange-200' : 'bg-white/5 text-white/40'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* List of select buildings */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 overflow-y-auto max-h-[220px] scrollbar-thin pr-2 mb-4">
                {cityBuildings.map((bld) => (
                  <button
                    key={bld.id}
                    onClick={() => {
                      audio.playPulse();
                      onSelectBuilding(bld);
                    }}
                    className={`
                      text-left p-3 rounded-md border text-xs transition-all duration-300 cursor-pointer flex justify-between items-center relative overflow-hidden group
                      ${selectedBuilding?.id === bld.id
                        ? 'border-orange-500 bg-orange-500/10 text-white'
                        : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-white/60 hover:text-white'
                      }
                    `}
                  >
                    <div className="relative z-10">
                      <span className="font-semibold block">{bld.name}</span>
                      <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 group-hover:text-orange-400 transition-colors">
                        {bld.category}
                      </span>
                    </div>
                    {bld.isComingSoon ? (
                      <span className="text-[7px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 uppercase relative z-10 scale-90">
                        Coming soon
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono text-orange-500 relative z-10">
                        {bld.growth}% GLOW
                      </span>
                    )}

                    {/* Edge accent line */}
                    <div 
                      className="absolute left-0 top-0 w-[2px] h-full transition-all duration-300"
                      style={{ backgroundColor: bld.color }}
                    />
                  </button>
                ))}
              </div>

              {/* Selected building inspection drawer */}
              <AnimatePresence mode="wait">
                {selectedBuilding && (
                  <motion.div
                    key={selectedBuilding.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-5 rounded-lg border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                  >
                    {/* Color bar indicator */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-[2px]" 
                      style={{ backgroundColor: selectedBuilding.color }}
                    />

                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-normal text-white">{selectedBuilding.name}</h3>
                        <p className="text-[9px] font-mono uppercase tracking-widest text-white/40">
                          {selectedBuilding.category} // FOUNDER: {selectedBuilding.founder.toUpperCase()}
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          audio.playTick();
                          onSelectBuilding(null);
                        }}
                        className="text-[10px] font-mono tracking-widest text-[#ca1111] hover:text-red-400 bg-red-950/20 px-2 py-1 rounded cursor-pointer transition-colors"
                      >
                        CLOSE_X
                      </button>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed mb-4 font-mono">
                      "{selectedBuilding.tagline}" — {selectedBuilding.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5" style={{ color: selectedBuilding.color }} />
                        <span className="text-[9px] font-mono text-white/50 uppercase">Capital Growth Level</span>
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${selectedBuilding.growth}%`,
                            backgroundColor: selectedBuilding.color,
                            boxShadow: `0 0 10px ${selectedBuilding.color}`
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ----- 6. COMMUNITY / FOUNDING MEMBERS FORM ----- */}
          {activeSection === 'community' && (
            <motion.div 
              key="community"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl w-full text-left pointer-events-auto"
            >
              <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.35em] text-orange-500 font-mono">
                <Network className="w-3.5 h-3.5" />
                <span>THE SWELLING NETWORK SCARCITY</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-light text-white uppercase tracking-tight mb-4">
                founding <span className="text-orange-500 font-medium">network</span>
              </h2>

              <p className="text-xs text-white/50 leading-relaxed tracking-wide mb-6">
                We are reserving exactly <span className="text-orange-400 font-semibold font-mono">100 slots</span> in the founding builder registry. Members receive early allocations to seed hackathons, structural advisory, and shared co-working nodes in Anantapur.
              </p>

              {/* Progress counter */}
              <div className="flex justify-between items-center mb-6 font-mono text-xs">
                <span className="text-white/40 uppercase tracking-widest">FOUNDER SEATS: FILLED</span>
                <span className="text-orange-500 font-semibold">
                  {registeredCount} / 100 SEATS
                </span>
              </div>

              {/* Direct interactive application container */}
              <div className="p-6 rounded-lg border border-white/10 bg-black/60 backdrop-blur-lg shadow-2xl relative">
                
                <AnimatePresence mode="wait">
                  {!isFormSubmitted ? (
                    <motion.form 
                      key="founding-form"
                      onSubmit={handleFormSubmit}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#00ccff] mb-4">
                        COMPILE_FOUNDING_CREDENTIALS
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-mono tracking-widest text-white/40 uppercase mb-2">Builder Name</label>
                            <input 
                              type="text" 
                              required
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              placeholder="e.g., Harsha Vardhan"
                              className="w-full bg-white/[0.02] border border-white/10 text-xs text-white font-mono rounded px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-white/[0.04] transition-all duration-300"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-mono tracking-widest text-white/40 uppercase mb-2">Secure Link (Email)</label>
                            <input 
                              type="email" 
                              required
                              value={userEmail}
                              onChange={(e) => setUserEmail(e.target.value)}
                              placeholder="builder@domain.com"
                              className="w-full bg-white/[0.02] border border-white/10 text-xs text-white font-mono rounded px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-white/[0.04] transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono tracking-widest text-white/40 uppercase mb-2">Describe Your Concept / Core Skillset</label>
                          <textarea 
                            rows={3}
                            value={userIdea}
                            onChange={(e) => setUserIdea(e.target.value)}
                            placeholder="Building high-speed developer compilers..."
                            className="w-full bg-white/[0.02] border border-white/10 text-xs text-white font-mono rounded px-4 py-3 focus:outline-none focus:border-orange-500 focus:bg-white/[0.04] transition-all duration-300 resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,106,0,0.15)] transition-all duration-300 border border-orange-400/20 hover:border-orange-300/40 relative overflow-hidden cursor-pointer"
                      >
                        Become Foundational Builder
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="founding-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <div className="w-12 h-12 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-6 h-6 text-orange-500" />
                      </div>

                      <h3 className="text-xl font-normal text-white mb-2 uppercase">Creds Authenticated</h3>
                      <p className="text-xs text-white/60 mb-6 font-mono leading-relaxed max-w-sm mx-auto">
                        Welcome to atpstartups, <span className="text-orange-400 font-semibold">{userName}</span>. Your slot is compiled on our founding registry.
                      </p>

                      <div className="p-4 rounded border border-orange-500/20 bg-orange-500/5 max-w-xs mx-auto mb-6">
                        <span className="block text-[8px] uppercase tracking-widest font-mono text-white/40 mb-1">SOVEREIGN SECRET SIGN-IN KEYID</span>
                        <span className="block text-sm font-mono font-bold tracking-wider text-orange-500 animate-pulse">{formKey}</span>
                      </div>

                      <button
                        onClick={() => {
                          audio.playTick();
                          setIsFormSubmitted(false);
                          setUserName('');
                          setUserEmail('');
                          setUserIdea('');
                        }}
                        className="text-[10px] font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors cursor-pointer"
                      >
                        Register another builder
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ----- 7. SOCIAL / PHONE MOCK FEED OVERLAY ----- */}
          {activeSection === 'social' && (
            <motion.div 
              key="social"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl w-full text-left pointer-events-auto flex flex-col justify-start"
            >
              <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-[0.35em] text-orange-500 font-mono">
                <Instagram className="w-3.5 h-3.5" />
                <span>@atpstartups INTEL DISPATCH</span>
              </div>

              <h2 className="text-2.5xl sm:text-4xl font-light text-white uppercase tracking-tight mb-4">
                live <span className="text-orange-500 font-medium font-sans">dispatch feed</span>
              </h2>

              <p className="text-xs text-white/40 tracking-wider mb-4">
                Streaming live progress loops directly from Anantapur's incubation nodes. Auto-aggregating social intelligence and telemetry updates.
              </p>

              <div className="mb-6">
                <a 
                  href="https://www.instagram.com/atpstartups?igsh=NHJvamRudmd3ejIw" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#e91e63] to-orange-500 hover:from-[#d81b60] hover:to-orange-600 text-[10px] text-white font-mono uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#e91e63]/10"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Open @atpstartups on Instagram</span>
                </a>
              </div>

              {/* Feed lists representing scrolling Instagram feeds */}
              <div 
                className="space-y-4 overflow-y-auto max-h-[300px] scrollbar-thin pr-2"
                id="social-feed-flow"
              >
                {instagramFeed.map((post) => (
                  <a 
                    key={post.id}
                    href="https://www.instagram.com/atpstartups?igsh=NHJvamRudmd3ejIw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-5 rounded-lg border border-white/5 bg-white/[0.01] hover:border-orange-500/20 hover:bg-white/[0.03] transition-all duration-300 relative group overflow-hidden"
                  >
                    {/* Glowing highlight sphere */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${post.imageGlow} blur-[60px] opacity-40 pointer-events-none`} />

                    <div className="flex justify-between items-center mb-3 text-[10px] font-mono tracking-wider">
                      <span className="text-orange-500 uppercase font-semibold">{post.tag}</span>
                      <span className="text-white/30">{post.date}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-white mb-2 leading-snug group-hover:text-orange-400 transition-colors duration-300">
                      {post.title}
                    </h3>
                    
                    <p className="text-xs text-white/60 leading-relaxed font-mono">
                      {post.body}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[9px] font-mono text-white/30 uppercase">
                      <span className="group-hover:text-white/40 transition-colors duration-300">Click to view post</span>
                      <span className="text-[#e91e63] font-semibold">{post.likes} Interaction cores</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
