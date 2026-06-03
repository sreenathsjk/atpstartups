/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveSection, CityBuilding } from './types';
import { ThreeCanvas } from './components/ThreeCanvas';
import { LoadingScreen } from './components/LoadingScreen';
import { OrbNavigation } from './components/OrbNavigation';
import { SectionOverlay } from './components/SectionOverlay';
import { StartupHoverCard } from './components/StartupHoverCard';
import { INITIAL_CITY_BUILDINGS } from './data';
import { audio } from './components/AudioEngine';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('loading');
  const [isMuted, setIsMuted] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<CityBuilding | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const isExitingRef = React.useRef(false);
  const activeSectionRef = React.useRef<ActiveSection>('loading');

  React.useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  React.useEffect(() => {
    // Standard replacement of the landing layout entry
    window.history.replaceState({ section: 'loading' }, '', window.location.hash || '');

    const handlePopState = (event: PopStateEvent) => {
      if (isExitingRef.current) return;

      const state = event.state;
      if (state && state.section) {
        const targetSection = state.section as ActiveSection;

        if (targetSection === 'loading') {
          // Navigating back from 'hero' (main) back to landing 'loading' state
          setShowExitConfirm(true);
          // Keep a virtual entry on history state stack so back button doesn't trigger again
          window.history.pushState({ section: 'hero' }, '', '#hero');
          setActiveSection('hero');
        } else {
          setActiveSection(targetSection);
          if (targetSection !== 'city') {
            setSelectedBuilding(null);
          }
        }
      } else {
        // Null state triggers full back confirm behavior
        setShowExitConfirm(true);
        window.history.pushState({ section: 'hero' }, '', '#hero');
        setActiveSection('hero');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleEnterEcosystem = (muteSelected: boolean) => {
    setIsMuted(muteSelected);
    setActiveSection('hero');
    window.history.pushState({ section: 'hero' }, '', '#hero');
  };

  const handleSectionChange = (section: ActiveSection, pushToHistory = true) => {
    if (section === activeSection) return;
    setActiveSection(section);
    // Clear building selection when moving away from city map to keep UI clean
    if (section !== 'city') {
      setSelectedBuilding(null);
    }
    if (pushToHistory && section !== 'loading') {
      window.history.pushState({ section }, '', `#${section}`);
    }
  };

  const toggleSoundMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audio.setMute(nextMute);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Auto-deselect building if its category is filtered out
    if (selectedBuilding && category !== 'all' && selectedBuilding.category !== category) {
      setSelectedBuilding(null);
    }
  };

  // Dynamically compile categories based on INITIAL_CITY_BUILDINGS
  const allCategories = ['all', ...Array.from(new Set(INITIAL_CITY_BUILDINGS.map(b => b.category)))];

  const filteredCityBuildings = selectedCategory === 'all'
    ? INITIAL_CITY_BUILDINGS
    : INITIAL_CITY_BUILDINGS.filter(bld => bld.category === selectedCategory);

  return (
    <div className="relative w-screen h-screen bg-[#030303] text-white overflow-hidden font-sans select-none" id="atp-world-container">
      
      {/* 3D Immersive WebGL viewport container */}
      <ThreeCanvas 
        activeSection={activeSection}
        onSelectBuilding={setSelectedBuilding}
        selectedCityBuildings={filteredCityBuildings}
        hoveredNode={hoveredNode}
      />

      {/* Futuristic Vignette / Cinematic Shading */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#030303_100%)] pointer-events-none opacity-85 mix-blend-multiply" />
      
      {/* Subtle outer borders simulating high-end tech monitor layout */}
      <div className="absolute inset-0 border border-white/5 pointer-events-none z-10 m-3 rounded-lg" />
      <div className="absolute inset-0 border border-orange-500/5 pointer-events-none z-10 m-4 rounded-md" />

      {/* App Entrance Screen */}
      <AnimatePresence>
        {activeSection === 'loading' && (
          <LoadingScreen onEnter={handleEnterEcosystem} />
        )}
      </AnimatePresence>

      {/* Main Core HUD Interfaces */}
      {activeSection !== 'loading' && (
        <>
          {/* Section Overlay Contents */}
          <SectionOverlay 
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            selectedBuilding={selectedBuilding}
            onSelectBuilding={setSelectedBuilding}
            hoveredNode={hoveredNode}
            onHoverNode={setHoveredNode}
            cityBuildings={filteredCityBuildings}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            allCategories={allCategories}
          />

          {/* Persistent Commands/Nodes Dock */}
          <OrbNavigation 
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isMuted={isMuted}
            onToggleMute={toggleSoundMute}
            onSelectBuilding={setSelectedBuilding}
            onCategoryChange={handleCategoryChange}
          />


          {/* Interactive Profile Hover Card for selected building */}
          <StartupHoverCard 
            building={selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
          />
        </>
      )}

      {/* Decorative cyber corner indicators */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10 pointer-events-none hidden sm:block" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/10 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10 pointer-events-none hidden sm:block" />

      {/* Cybernetic Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative max-w-sm w-full bg-[#0d0d0d] border border-orange-500/30 rounded-xl p-6 md:p-8 shadow-[0_0_50px_rgba(255,106,0,0.15)] text-center font-sans overflow-hidden"
            >
              {/* Corner tech indicators */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-500/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-500/50" />

              {/* Glowing decorative border line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

              {/* Security Key Lock Cyber Icon */}
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/35 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>

              <h3 className="text-md font-mono font-bold tracking-widest text-orange-500 uppercase mb-2">
                TERMINATE SESSION?
              </h3>
              
              <p className="text-xs text-white/70 leading-relaxed mb-6 font-mono uppercase tracking-wide">
                Warning: You are attempting to sever the holographic connection to ATP Startups. Confirm disconnect?
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    audio.playTick();
                    setShowExitConfirm(false);
                  }}
                  className="flex-1 py-2 px-4 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer text-white"
                >
                  STAY
                </button>
                
                <button
                  onClick={() => {
                    audio.playPulse();
                    isExitingRef.current = true;
                    setShowExitConfirm(false);
                    // Standard frame exit or fallback navigation back
                    window.close();
                    setTimeout(() => {
                      window.history.go(-2);
                    }, 50);
                  }}
                  className="flex-1 py-2 px-4 rounded-md border border-orange-500/40 bg-orange-500/20 hover:bg-orange-500/35 text-[10px] font-mono tracking-widest uppercase text-orange-400 font-bold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(255,106,0,0.1)] hover:shadow-[0_0_20px_rgba(255,106,0,0.2)]"
                >
                  DISCONNECT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

