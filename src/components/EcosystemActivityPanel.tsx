/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CityBuilding } from '../types';
import { INITIAL_CITY_BUILDINGS } from '../data';
import { audio } from './AudioEngine';
import { 
  TrendingUp, 
  Activity, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Compass, 
  CheckCircle 
} from 'lucide-react';

interface EcosystemActivityPanelProps {
  selectedBuilding: CityBuilding | null;
  onSelectBuilding: (building: CityBuilding | null) => void;
  activeSection: string;
}

export const EcosystemActivityPanel: React.FC<EcosystemActivityPanelProps> = ({
  selectedBuilding,
  onSelectBuilding,
  activeSection,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'velocity' | 'nodes'>('velocity');

  // Real-time rolling index simulation
  const [rollingIndex, setRollingIndex] = useState(84.7);
  const [history, setHistory] = useState<number[]>([
    72, 75, 71, 78, 82, 80, 85, 83, 89, 87, 85, 88, 86, 91, 84.7
  ]);

  // Rolling event logs telemetry simulation
  const [logs, setLogs] = useState<string[]>([
    '[INIT] SEED POOL DETONATION CORE ONLINE',
    '[SYNC] GEO-MESH SIGNAL ROUTING SETTLED',
    '[CORE] COMPILE OK IN 60-DAY SPRINT'
  ]);

  const logIndexRef = useRef(0);
  const telemetryLogs = useMemo(() => [
    'ATP LABS // SEED KERNEL OPTIMIZATION SUCCESS',
    'AUTONOMOUS ROUTE // TRANSIT DATA STREAM SETTLED',
    'SILICON AGRINODE // telemetry automated drip triggered',
    'WINDGRID // RAYALASEEMA surplus dispatch routed',
    'STEALTH FINCORE // SOVEREIGN LEDGER micro payouts compiled',
    'HYPERSCALE DEVS // AI orchestrated dev factory active',
    'ANANTAYA XR // spatial WebXR low-latency streaming active',
    'AEGISHASH // FIRMWARE PROTECTION COMPILING OK'
  ], []);

  // Update dynamic activity history simulating realistic ticks
  useEffect(() => {
    const updateTick = setInterval(() => {
      // Simulate slight variance in the ecosystem index
      setRollingIndex((prev) => {
        const drift = Math.random() * 4 - 1.85; // positive bias
        const nextVal = Math.max(65, Math.min(99.5, Number((prev + drift).toFixed(1))));
        
        setHistory((prevHistory) => {
          const updated = [...prevHistory.slice(1), nextVal];
          return updated;
        });

        return nextVal;
      });

      // Periodically append high-tech logs matching ecosystem activity
      if (Math.random() > 0.4) {
        const randomLog = telemetryLogs[logIndexRef.current % telemetryLogs.length];
        logIndexRef.current += 1;
        
        const timestamp = new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        setLogs((prevLogs) => [
          `[${timestamp}] ${randomLog}`,
          ...prevLogs.slice(0, 3)
        ]);
      }
    }, 4000);

    return () => clearInterval(updateTick);
  }, [telemetryLogs]);

  // Filter list of active core buildings
  const activeStartups = useMemo(() => {
    return INITIAL_CITY_BUILDINGS.filter(b => !b.isComingSoon).slice(0, 4);
  }, []);

  // Generate smooth SVG coordinates inside dimensions W=280, H=50 for Sparkline
  const sparklinePoints = useMemo(() => {
    const minVal = Math.min(...history) - 2;
    const maxVal = Math.max(...history) + 2;
    const spread = maxVal - minVal || 1;
    const width = 280;
    const height = 48;

    const points = history.map((val, i) => {
      const x = (i / (history.length - 1)) * (width - 16) + 8;
      const y = height - ((val - minVal) / spread) * (height - 12) - 6;
      return { x, y, val };
    });

    const pathString = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaString = points.length > 0 
      ? `${pathString} L ${points[points.length - 1].x.toFixed(1)} 50 L ${points[0].x.toFixed(1)} 50 Z`
      : '';

    return { pathString, areaString, points };
  }, [history]);

  // Play subtle sound feedback when interactive items occur
  const handlePanelToggle = () => {
    audio.playTick();
    setIsMinimized(!isMinimized);
  };

  const handleSelectStartup = (bld: CityBuilding) => {
    audio.playPulse();
    onSelectBuilding(bld);
  };

  return (
    <div className="fixed bottom-24 left-6 sm:bottom-10 sm:left-10 z-[45] font-mono pointer-events-auto select-none" id="ecosystem-activity-hud">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* Minimized Micro Indicator Node */
          <motion.button
            key="minimized-hud"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handlePanelToggle}
            className="flex items-center gap-3 px-4 py-2 bg-black/90 border border-orange-500/30 rounded-xl hover:border-orange-500/60 shadow-[0_4px_20px_rgba(255,106,0,0.15)] cursor-pointer group"
          >
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </div>
            
            <div className="text-[10px] tracking-wider text-white text-left uppercase flex flex-col">
              <span className="text-[8px] text-white/40 block leading-none">ECO-PULSE</span>
              <span className="font-semibold text-orange-400 font-sans group-hover:text-orange-300 transition-colors">
                INDEX {rollingIndex}%
              </span>
            </div>
            <Maximize2 className="w-3 h-3 text-white/30 group-hover:text-white transition-colors" />
          </motion.button>
        ) : (
          /* Expandable Interactive Dashboard */
          <motion.div
            key="expanded-hud"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-72 sm:w-[310px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl relative overflow-hidden"
          >
            {/* Tech line accents */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-orange-500/50" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-orange-500/50" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-orange-500/50" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-orange-500/50" />

            {/* Header controls */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">Ecosystem Velocity</span>
              </div>
              <button
                onClick={handlePanelToggle}
                className="p-1 rounded-sm hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
                title="Minimize telemetries"
              >
                <Minimize2 className="w-3 h-3" />
              </button>
            </div>

            {/* Internal Navigation Tabs */}
            <div className="flex border-b border-white/5 text-[8.5px] tracking-widest text-center">
              <button
                onClick={() => {
                  audio.playTick();
                  setActiveTab('velocity');
                }}
                className={`flex-1 py-1.5 border-r border-white/5 uppercase font-medium transition-all cursor-pointer ${
                  activeTab === 'velocity' ? 'text-orange-400 bg-orange-500/[0.02]' : 'text-white/40 hover:text-white/70'
                }`}
              >
                ACTIVITY GROWTH
              </button>
              <button
                onClick={() => {
                  audio.playTick();
                  setActiveTab('nodes');
                }}
                className={`flex-1 py-1.5 uppercase font-medium transition-all cursor-pointer ${
                  activeTab === 'nodes' ? 'text-cyan-400 bg-cyan-500/[0.02]' : 'text-white/40 hover:text-white/70'
                }`}
              >
                ACTIVE COMPILERS
              </button>
            </div>

            <div className="p-3.5 space-y-3">
              {activeTab === 'velocity' ? (
                <>
                  {/* Master Growth Velocity metric */}
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <span className="text-[20px] font-sans font-light tracking-tight text-white">{rollingIndex}%</span>
                      <span className="text-[8px] text-white/40 uppercase tracking-widest block font-mono">SOVEREIGN NETWORK COMPILATION RATE</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-orange-500 bg-orange-500/5 border border-orange-500/20 px-1.5 py-0.5 rounded text-[8px] tracking-wider uppercase font-semibold">
                      <TrendingUp className="w-2.5 h-2.5" />
                      <span>LIVE TELEM</span>
                    </div>
                  </div>

                  {/* Pristine Native React Sparkline with dynamic colors */}
                  <div className="h-14 relative bg-black/40 rounded border border-white/5 overflow-hidden flex items-end">
                    {/* SVG sparkline graph */}
                    <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 280 48" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="hudSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#ff6a00" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Guide lines */}
                      <line x1="0" y1="12" x2="280" y2="12" stroke="white" strokeWidth="0.5" strokeOpacity="0.05" />
                      <line x1="0" y1="24" x2="280" y2="24" stroke="white" strokeWidth="0.5" strokeOpacity="0.05" />
                      <line x1="0" y1="36" x2="280" y2="36" stroke="white" strokeWidth="0.5" strokeOpacity="0.05" strokeDasharray="2 2" />

                      {/* Line gradient fill */}
                      {sparklinePoints.areaString && (
                        <path d={sparklinePoints.areaString} fill="url(#hudSparklineGrad)" className="transition-all duration-300 ease-in-out" />
                      )}

                      {/* Main Sparkline Path */}
                      <path
                        d={sparklinePoints.pathString}
                        fill="none"
                        stroke="#ff6a00"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300 ease-in-out"
                      />

                      {/* Pulsing Marker Node on current end point */}
                      {sparklinePoints.points.length > 0 && (
                        <g>
                          <circle
                            cx={sparklinePoints.points[sparklinePoints.points.length - 1].x}
                            cy={sparklinePoints.points[sparklinePoints.points.length - 1].y}
                            r="4"
                            fill="#ff6a00"
                            className="animate-ping"
                            style={{ transformOrigin: `${sparklinePoints.points[sparklinePoints.points.length - 1].x}px ${sparklinePoints.points[sparklinePoints.points.length - 1].y}px` }}
                          />
                          <circle
                            cx={sparklinePoints.points[sparklinePoints.points.length - 1].x}
                            cy={sparklinePoints.points[sparklinePoints.points.length - 1].y}
                            r="2.5"
                            fill="#ffffff"
                          />
                        </g>
                      )}
                    </svg>

                    {/* Left & Right sparkline labels */}
                    <div className="absolute top-1 left-2 text-[6.5px] uppercase text-white/30 tracking-widest font-mono select-none">
                      v: {Math.min(...history)} MIN
                    </div>
                    <div className="absolute top-1 right-2 text-[6.5px] uppercase text-white/30 tracking-widest font-mono select-none">
                      v: {Math.max(...history)} PEAK
                    </div>
                  </div>

                  {/* Mini Log Tickers section */}
                  <div className="bg-white/[0.02] border border-white/5 rounded p-1.5 space-y-1">
                    <span className="text-[7.5px] text-white/30 uppercase tracking-[0.2em] font-bold block">// DISPATCH_STREAM: ACTIVE</span>
                    <div className="space-y-0.5 max-h-[48px] overflow-hidden">
                      <AnimatePresence initial={false}>
                        {logs.map((logStr, i) => (
                          <motion.p
                            key={logStr}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[7px] text-white/50 leading-normal line-clamp-1 font-mono uppercase tracking-wide"
                          >
                            <span className="text-orange-500/60 font-semibold">{i === 0 ? '▶' : '•'}</span> {logStr}
                          </motion.p>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </>
              ) : (
                /* COMPILER NODES SECTION */
                <div className="space-y-2 py-0.5">
                  <span className="text-[7.5px] text-white/30 uppercase tracking-[0.25em] font-bold block">// PRIMARY NODES: STABILITY RATING</span>
                  
                  <div className="space-y-1.5">
                    {activeStartups.map((startup) => {
                      const isSelected = selectedBuilding?.id === startup.id;
                      return (
                        <div
                          key={startup.id}
                          onClick={() => handleSelectStartup(startup)}
                          className={`flex items-center justify-between p-1.5 rounded border transition-all duration-300 cursor-pointer ${
                            isSelected 
                              ? 'bg-cyan-500/15 border-cyan-500/50' 
                              : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {/* Color bar mapping */}
                            <div className="w-[3px] h-6 rounded-full" style={{ backgroundColor: startup.color }} />
                            <div className="text-left">
                              <span className="text-[9px] text-white font-medium block leading-none">{startup.name}</span>
                              <span className="text-[7px] text-white/40 block leading-tight uppercase tracking-wider">{startup.category}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Decorative mini-line drawing simulation representing trend */}
                            <svg className="w-10 h-4" viewBox="0 0 40 16">
                              <polyline
                                fill="none"
                                stroke={startup.color}
                                strokeWidth="1.2"
                                points={`0,${15 - (startup.growth / 10)} 10,8 20,${12 - (startup.growth / 15)} 30,5 40,${14 - (startup.growth / 8)}`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="text-[9.5px] font-sans font-medium" style={{ color: startup.color }}>
                              {startup.growth}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Telemetry Footer */}
            <div className="px-3.5 py-1.5 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[7.5px] text-white/30 tracking-wider">
              <span className="uppercase">COMPILER: LATTICE_DENSITY_78%</span>
              <span className="font-semibold text-[#00ff66]">ACTIVE_NODE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
