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
import { INITIAL_CITY_BUILDINGS } from './data';
import { audio } from './components/AudioEngine';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('loading');
  const [isMuted, setIsMuted] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<CityBuilding | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleEnterEcosystem = (muteSelected: boolean) => {
    setIsMuted(muteSelected);
    setActiveSection('hero');
  };

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section);
    // Clear building selection when moving away from city map to keep UI clean
    if (section !== 'city') {
      setSelectedBuilding(null);
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
          />
        </>
      )}

      {/* Decorative cyber corner indicators */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10 pointer-events-none hidden sm:block" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/10 pointer-events-none hidden sm:block" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10 pointer-events-none hidden sm:block" />

    </div>
  );
}

