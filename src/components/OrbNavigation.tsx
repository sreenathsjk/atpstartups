/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveSection, CityBuilding } from '../types';
import { INITIAL_CITY_BUILDINGS } from '../data';
import { audio } from './AudioEngine';
import { DailyBriefingTicker } from './DailyBriefingTicker';
import { 
  Compass, 
  Layers, 
  MapPin, 
  Users, 
  Building2, 
  Activity, 
  Instagram,
  Volume2,
  VolumeX,
  Search,
  X
} from 'lucide-react';

interface OrbNavigationProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onSelectBuilding?: (building: CityBuilding | null) => void;
  onCategoryChange?: (category: string) => void;
}

interface NavNode {
  id: ActiveSection;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<any>;
  glowColor: string;
}

export const OrbNavigation: React.FC<OrbNavigationProps> = ({
  activeSection,
  onSectionChange,
  isMuted,
  onToggleMute,
  onSelectBuilding,
  onCategoryChange,
}) => {
  const [hoveredNode, setHoveredNode] = useState<ActiveSection | null>(null);
  
  // Search HUD States
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cleanQuery = searchQuery.trim().toLowerCase();

  // Extract unique sectors
  const ALL_SECTORS = Array.from(new Set(INITIAL_CITY_BUILDINGS.map(b => b.category)));

  // Filter systems
  const matchingStartups = cleanQuery === '' 
    ? [] 
    : INITIAL_CITY_BUILDINGS.filter(b => 
        b.name.toLowerCase().includes(cleanQuery) || 
        b.tagline.toLowerCase().includes(cleanQuery)
      );

  const matchingSectors = cleanQuery === '' 
    ? [] 
    : ALL_SECTORS.filter(sec => sec.toLowerCase().includes(cleanQuery));

  const matchingFounders = cleanQuery === '' 
    ? [] 
    : INITIAL_CITY_BUILDINGS.filter(b => 
        b.founder.toLowerCase() !== 'tbd' && 
        b.founder.toLowerCase().includes(cleanQuery)
      );

  const totalResultsCount = matchingStartups.length + matchingSectors.length + matchingFounders.length;

  // Nav actions
  const handleSelectStartup = (bld: CityBuilding) => {
    audio.playPulse();
    onSectionChange('city');
    onCategoryChange?.('all');
    setTimeout(() => {
      onSelectBuilding?.(bld);
    }, 100);
    setSearchQuery('');
    setIsFocused(false);
  };

  const handleSelectSector = (sector: string) => {
    audio.playPulse();
    onSectionChange('city');
    onCategoryChange?.(sector);
    onSelectBuilding?.(null);
    setSearchQuery('');
    setIsFocused(false);
  };

  const handleSelectFounder = (bld: CityBuilding) => {
    audio.playPulse();
    onSectionChange('city');
    onCategoryChange?.('all');
    setTimeout(() => {
      onSelectBuilding?.(bld);
    }, 100);
    setSearchQuery('');
    setIsFocused(false);
  };

  // Static shortcuts for empty query search overlay
  const quickSuggestions = [
    { type: 'startup', label: 'ATP Core Lab', bld: INITIAL_CITY_BUILDINGS.find(b => b.id === 'bld-core') },
    { type: 'sector', label: 'Deep Tech & AI', value: 'Deep Tech & AI' },
    { type: 'founder', label: 'Priya Anant', bld: INITIAL_CITY_BUILDINGS.find(b => b.founder === 'Priya Anant') }
  ];

  const navNodes: NavNode[] = [
    { id: 'hero', label: 'Ecosystem Core', shortLabel: 'Core', icon: Compass, glowColor: 'rgba(255, 106, 0, 0.5)' },
    { id: 'about', label: 'Holographic Vision', shortLabel: 'Vision', icon: Layers, glowColor: 'rgba(255, 182, 0, 0.5)' },
    { id: 'what-we-do', label: 'Ecosystem Portals', shortLabel: 'Focus', icon: Activity, glowColor: 'rgba(255, 51, 0, 0.5)' },
    { id: 'ecosystem', label: 'Startup Pipeline', shortLabel: 'Flow', icon: Building2, glowColor: 'rgba(0, 204, 255, 0.5)' },
    { id: 'city', label: 'Anantapur City 3D', shortLabel: 'City map', icon: MapPin, glowColor: 'rgba(255, 106, 0, 0.6)' },
    { id: 'community', label: 'Founders Network', shortLabel: 'Network', icon: Users, glowColor: 'rgba(100, 255, 0, 0.5)' },
    { id: 'social', label: 'Instagram Portal', shortLabel: 'Feed', icon: Instagram, glowColor: 'rgba(233, 30, 99, 0.5)' },
  ];

  const handleNodeClick = (nodeId: ActiveSection) => {
    if (nodeId === activeSection) return;
    audio.playPulse();
    audio.playSwoosh();
    onSectionChange(nodeId);
  };

  const handleNodeHover = (nodeId: ActiveSection | null) => {
    setHoveredNode(nodeId);
    if (nodeId) {
      audio.playTick();
    }
  };

  return (
    <>
      {/* Sound System & Global Header Coordinates & Custom Live Search */}
      <div className="fixed top-6 left-6 right-6 flex items-start justify-between gap-4 z-40 select-none font-mono pointer-events-none">
        
        {/* Core Search HUD Integration (Left/Center biased) */}
        <div ref={searchRef} className="relative flex flex-col pointer-events-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  audio.playTick();
                }
              }}
              onFocus={() => setIsFocused(true)}
              placeholder="SEARCH CORE NETWORK..."
              className="bg-black/60 border border-white/10 text-[10px] tracking-widest text-white placeholder-white/30 rounded-full pl-9 pr-9 py-2 w-48 sm:w-64 focus:w-56 sm:focus:w-80 focus:bg-black/90 focus:border-orange-500/50 focus:shadow-[0_0_15px_rgba(255,106,0,0.15)] outline-none transition-all duration-300"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  audio.playTick();
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3 text-white/40 hover:text-white" />
              </button>
            )}
          </div>

          {/* Search Dropdown Panel */}
          <AnimatePresence>
            {isFocused && (searchQuery || quickSuggestions.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-11 left-0 w-64 sm:w-80 max-h-[350px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl p-2.5 overflow-y-auto scrollbar-thin z-[100]"
                id="hud-search-dropdown"
              >
                {/* Header status bar */}
                <div className="flex justify-between items-center px-1.5 pb-1.5 mb-1.5 border-b border-white/5 text-[8px] font-bold text-white/30 tracking-[0.25em] uppercase">
                  <span>{searchQuery ? 'SEARCH RESULTS' : 'QUICK SHORTCUTS'}</span>
                  {searchQuery && (
                    <span className="text-orange-500 font-semibold">
                      {totalResultsCount} FOUND
                    </span>
                  )}
                </div>

                {/* Empty / Suggestions state */}
                {!searchQuery && (
                  <div className="space-y-1.5 py-1">
                    <p className="text-[8px] text-white/30 uppercase tracking-widest px-1.5 mb-1">SOVEREIGN RECOMMENDATIONS:</p>
                    {quickSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (suggestion.type === 'startup' && suggestion.bld) {
                            handleSelectStartup(suggestion.bld);
                          } else if (suggestion.type === 'sector' && suggestion.value) {
                            handleSelectSector(suggestion.value);
                          } else if (suggestion.type === 'founder' && suggestion.bld) {
                            handleSelectFounder(suggestion.bld);
                          }
                        }}
                        className="w-full flex justify-between items-center text-left py-1.5 px-2 rounded hover:bg-white/5 text-[9px] text-white/70 hover:text-orange-400 transition-all cursor-pointer group"
                      >
                        <span className="font-semibold text-[10px]">{suggestion.label}</span>
                        <span className={`text-[7px] border uppercase px-1 py-0.5 rounded ${
                          suggestion.type === 'startup' ? 'border-orange-500/20 bg-orange-500/5 text-orange-400' :
                          suggestion.type === 'sector' ? 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400' :
                          'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                        }`}>
                          {suggestion.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Matches layout */}
                {searchQuery && totalResultsCount === 0 && (
                  <div className="py-6 text-center text-[10px] text-white/40 tracking-wider">
                    NO COMPATIBLE ENTITIES FOUND
                  </div>
                )}

                {searchQuery && totalResultsCount > 0 && (
                  <div className="space-y-3.5 py-1">
                    {/* Startup segment matches */}
                    {matchingStartups.length > 0 && (
                      <div>
                        <div className="text-[7.5px] font-bold text-orange-500/70 tracking-[0.2em] uppercase px-1.5 mb-1 font-mono">
                          // STARTUPS
                        </div>
                        <div className="space-y-0.5">
                          {matchingStartups.map(bld => (
                            <button
                              key={bld.id}
                              onClick={() => handleSelectStartup(bld)}
                              className="w-full flex justify-between items-center text-left py-1.5 px-2 rounded hover:bg-white/5 text-[10px] text-white/80 hover:text-orange-400 transition-all cursor-pointer group"
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold">{bld.name}</span>
                                <span className="text-[8px] text-white/40 group-hover:text-white/60 line-clamp-1">{bld.tagline}</span>
                              </div>
                              <span className="text-[7px] border border-orange-500/20 px-1 py-0.5 rounded bg-orange-500/5 text-orange-500 ml-2 shrink-0">
                                ENTER
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sector matches */}
                    {matchingSectors.length > 0 && (
                      <div>
                        <div className="text-[7.5px] font-bold text-cyan-400/70 tracking-[0.2em] uppercase px-1.5 mb-1 font-mono">
                          // SECTORS
                        </div>
                        <div className="space-y-0.5">
                          {matchingSectors.map(sec => (
                            <button
                              key={sec}
                              onClick={() => handleSelectSector(sec)}
                              className="w-full flex justify-between items-center text-left py-1.5 px-2 rounded hover:bg-white/5 text-[10px] text-white/80 hover:text-cyan-400 transition-all cursor-pointer group"
                            >
                              <span>{sec}</span>
                              <span className="text-[7px] border border-cyan-500/20 px-1 py-0.5 rounded bg-cyan-500/5 text-cyan-400 ml-2 shrink-0">
                                FILTER
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Founder matches */}
                    {matchingFounders.length > 0 && (
                      <div>
                        <div className="text-[7.5px] font-bold text-emerald-400/70 tracking-[0.2em] uppercase px-1.5 mb-1 font-mono">
                          // FOUNDERS
                        </div>
                        <div className="space-y-0.5">
                          {matchingFounders.map(bld => (
                            <button
                              key={bld.id}
                              onClick={() => handleSelectFounder(bld)}
                              className="w-full flex justify-between items-center text-left py-1.5 px-2 rounded hover:bg-white/5 text-[10px] text-white/80 hover:text-emerald-400 transition-all cursor-pointer group"
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold">{bld.founder}</span>
                                <span className="text-[8px] text-white/40 group-hover:text-white/60">{bld.name}</span>
                              </div>
                              <span className="text-[7px] border border-emerald-500/20 px-1 py-0.5 rounded bg-emerald-500/5 text-emerald-400 ml-2 shrink-0">
                                VIEW
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center-aligned Dynamic Earth-grounded Tech News Telemetry */}
        <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-xl mx-4 pointer-events-auto">
          <DailyBriefingTicker />
        </div>

        {/* HUD Sound & Settings (Right-aligned, interactive) */}
        <div className="flex items-center gap-6 pointer-events-auto">
          <span className="text-[10px] text-white/30 tracking-[0.2em] hidden md:inline-block">
            LAT: 14.6819° N / LONG: 77.6006° E
          </span>
          
          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              audio.playTick();
              onToggleMute();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-[10px] text-white/70 tracking-widest uppercase transition-all duration-300 cursor-pointer"
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3 text-orange-500" />
                <span className="hidden xs:inline">Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 text-white/40" />
                <span className="hidden xs:inline text-white/40">Sound Off</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Futuristic Floating Command Dock (Bottom Center) */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 px-4 select-none">
        <div 
          className="relative flex items-center justify-between gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] max-w-2xl w-full"
          id="metaverse-dock"
        >
          {/* Inner sliding background light indicator */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(255,106,0,0.08),transparent)] pointer-events-none" />

          {navNodes.map((node) => {
            const isActive = activeSection === node.id;
            const isHovered = hoveredNode === node.id;
            const IconComponent = node.icon;

            return (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => handleNodeHover(node.id)}
                onMouseLeave={() => handleNodeHover(null)}
                className="relative flex flex-col items-center flex-1 py-1.5 sm:py-2 px-1 focus:outline-none cursor-pointer group"
                aria-label={node.label}
              >
                {/* Visual Orb node */}
                <div 
                  className={`
                    relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500
                    ${isActive 
                      ? 'border border-orange-500 bg-orange-500/10 shadow-[0_0_20px_rgba(255,106,0,0.3)]' 
                      : 'border border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.04]'
                    }
                  `}
                  style={{
                    boxShadow: isActive ? `0 0 15px ${node.glowColor}` : isHovered ? `0 0 10px ${node.glowColor}` : ''
                  }}
                >
                  <IconComponent 
                    className={`
                      w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-300
                      ${isActive ? 'text-orange-500 scale-110' : 'text-white/60 group-hover:text-white group-hover:scale-105'}
                    `} 
                  />

                  {/* Top connector thread */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ff6a00]"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </div>

                {/* Micro Subtitle Text showing section categories */}
                <span className={`
                  text-[8px] sm:text-[9px] font-mono tracking-widest mt-1.5 uppercase transition-colors duration-300 hidden md:block
                  ${isActive ? 'text-orange-500 font-semibold' : 'text-white/40 group-hover:text-white/80'}
                `}>
                  {node.shortLabel}
                </span>

                {/* Elegant hover title bubble */}
                <span className="absolute bottom-16 px-3 py-1 rounded-md bg-black/90 border border-white/10 text-[9px] font-mono tracking-wider uppercase text-orange-400 opacity-0 pointer-events-none scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 whitespace-nowrap shadow-xl">
                  {node.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
