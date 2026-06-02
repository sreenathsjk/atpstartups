/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ActiveSection } from '../types';
import { audio } from './AudioEngine';
import { 
  Compass, 
  Layers, 
  MapPin, 
  Users, 
  Building2, 
  Activity, 
  Instagram,
  Volume2,
  VolumeX
} from 'lucide-react';

interface OrbNavigationProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  isMuted: boolean;
  onToggleMute: () => void;
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
}) => {
  const [hoveredNode, setHoveredNode] = useState<ActiveSection | null>(null);

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
      {/* Sound System & Global Header Coordinates */}
      <div className="fixed top-6 left-6 right-6 flex justify-end items-center z-40 select-none font-mono">

        <div className="flex items-center gap-6">
          <span className="text-[10px] text-white/30 tracking-[0.2em] hidden sm:inline-block">
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
