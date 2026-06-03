/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CityBuilding } from '../types';
import { audio } from './AudioEngine';
import { 
  X, 
  User, 
  Send, 
  Check, 
  Sparkles, 
  Network, 
  MessageSquare,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Zap,
  Tag,
  Activity
} from 'lucide-react';

interface StartupHoverCardProps {
  building: CityBuilding | null;
  onClose: () => void;
}

export const getTechStack = (category: string): string[] => {
  switch (category) {
    case 'Deep Tech & AI':
      return ['PyTorch', 'Rust', 'CUDA', 'Wasm', 'TensorRT'];
    case 'Robotics & Logistics':
      return ['ROS2', 'C++', 'Go', 'gRPC', 'RTOS'];
    case 'Climate & Agritech':
      return ['LoRaWAN', 'Python', 'Arduino', 'NATS', 'InfluxDB'];
    case 'Clean Energy':
      return ['SCADA', 'Elixir', 'TimescaleDB', 'MQTT', 'Rust'];
    case 'Fintech & Web3':
      return ['Solidity', 'TypeScript', 'Ethers.js', 'Go', 'gRPC'];
    case 'SaaS & Dev Tools':
      return ['TypeScript', 'Next.js', 'Tailwind', 'PostgreSQL', 'Vite'];
    case 'AR/VR & Education':
      return ['Three.js', 'C#', 'WebXR', 'React Three Fiber'];
    case 'Cybersecurity':
      return ['Wasm', 'Rust', 'eBPF', 'Kernel Shield'];
    default:
      return ['TypeScript', 'React', 'NodeJS', 'Tailwind'];
  }
};

export const StartupHoverCard: React.FC<StartupHoverCardProps> = ({
  building,
  onClose,
}) => {
  const [connectStep, setConnectStep] = useState<'idle' | 'form' | 'transmitting' | 'success'>('idle');
  const [senderContact, setSenderContact] = useState('');
  const [senderMessage, setSenderMessage] = useState('');

  if (!building) return null;

  const techTags = building.tags || getTechStack(building.category);

  const handleConnectClick = () => {
    audio.playPulse();
    setConnectStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderContact) return;

    audio.playPulse();
    setConnectStep('transmitting');

    setTimeout(() => {
      audio.playSwoosh();
      setConnectStep('success');
      
      // WhatsApp dynamic link integration
      const waMsg = `Hello atpstartups! I checked out ${building.name} on the Map. I would love to connect with founder ${building.founder}.
      
• Sender: ${senderContact}
• Pitch/Message: ${senderMessage || 'Establish secure channel'}`;
      
      const targetUrl = `https://wa.me/916301756306?text=${encodeURIComponent(waMsg)}`;
      
      // Open in standard tab to proceed directly
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }, 1500);
  };

  const handleClose = () => {
    audio.playTick();
    setConnectStep('idle');
    setSenderContact('');
    setSenderMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 160 }}
          className="relative w-full max-w-2xl bg-black/95 border border-white/10 rounded-2xl shadow-[0_15px_60px_rgba(0,0,0,0.85)] overflow-hidden font-mono text-left select-none pointer-events-auto flex flex-col max-h-[90vh]"
          id={`startup-hover-card-${building.id}`}
        >
          {/* Color stripe banner mapping */}
          <div className="h-2 w-full shrink-0" style={{ backgroundColor: building.color }} />

          {/* Diagonal tech corner lines */}
          <div className="absolute top-2 left-0 w-3 h-3 border-t border-l pointer-events-none" style={{ borderColor: building.color }} />
          <div className="absolute top-2 right-0 w-3 h-3 border-t border-r pointer-events-none" style={{ borderColor: building.color }} />

          {/* Scrollable container */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-5 scrollbar-thin flex-1">
            
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[8px] border font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-white/5 text-white/50" style={{ borderColor: `${building.color}45` }}>
                    {building.category}
                  </span>
                  {!building.isComingSoon && (
                    <span className="text-[8px] border border-orange-500/20 px-2 py-0.5 rounded bg-orange-500/5 text-orange-400 font-bold uppercase tracking-wider flex items-center gap-0.5 animate-pulse">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>INCUBATED NODE</span>
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wider leading-snug mt-2">{building.name}</h3>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">// INSTANCE ID: {building.id.toUpperCase()}</p>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer shrink-0 border border-white/5"
                title="Close details screen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <hr className="border-white/5" />

            {/* Dynamic Interactive Flow Segment */}
            {connectStep === 'idle' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Founder Identity & Status */}
                <div className="md:col-span-5 space-y-4">
                  {/* Founder Image Display */}
                  <div className="relative rounded-xl overflow-hidden border border-white/10 group aspect-square/portrait max-h-[220px] md:max-h-none flex items-center justify-center bg-white/[0.02]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-70" />
                    {building.founderImage ? (
                      <img 
                        src={building.founderImage} 
                        alt={building.founder} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-center p-3 text-white/30 space-y-2">
                        <User className="w-10 h-10 mx-auto" />
                        <span className="text-[8px] tracking-widest block uppercase">DECENTRALIZED NODE</span>
                      </div>
                    )}
                    
                    {/* Floating Info */}
                    <div className="absolute bottom-3 left-3 right-3 z-20 text-left">
                      <span className="text-[7px] text-white/40 uppercase tracking-[0.2em] block">FOUNDER / ARCHITECT</span>
                      <span className="text-sm font-bold text-white tracking-wide block leading-tight">{building.founder}</span>
                    </div>

                    {/* Verified badge */}
                    {building.founder !== 'TBD' && (
                      <span className="absolute top-3 right-3 z-20 text-[7px] border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-0.5 backdrop-blur-md">
                        <Network className="w-2.5 h-2.5" />
                        <span>VERIFIED</span>
                      </span>
                    )}
                  </div>

                  {/* Growth Rate Segment */}
                  {!building.isComingSoon && (
                    <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 space-y-2.5">
                      <div className="flex justify-between items-center text-[9px] text-white/40 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" style={{ color: building.color }} /> GROWTH MOMENTUM</span>
                        <span style={{ color: building.color }} className="font-bold">{building.growth}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ 
                            width: `${building.growth}%`, 
                            backgroundColor: building.color,
                            boxShadow: `0 0 10px ${building.color}`
                          }} 
                        />
                      </div>
                    </div>
                  )}

                  {/* Tech stack box */}
                  <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3.5 space-y-2.5">
                    <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-[0.2em] block">// COMPILED SYSTEM STACK</span>
                    <div className="flex flex-wrap gap-1.5">
                      {techTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono tracking-wider px-2 py-0.5 rounded bg-white/[0.02] border border-white/5 text-white/70 hover:border-white/20 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: In-Depth Startup attributes & Idea */}
                <div className="md:col-span-7 space-y-4">
                  {/* Startup Big Idea Statement */}
                  {building.idea && (
                    <div className="bg-orange-500/[0.02] border border-orange-500/10 rounded-xl p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 text-white/5 pointer-events-none">
                        <Lightbulb className="w-16 h-16 rotate-12" />
                      </div>
                      <span className="text-[7.5px] text-orange-400 font-bold tracking-[0.2em] uppercase block mb-1.5">// STARTUP CORE IDEA</span>
                      <p className="text-white text-xs sm:text-sm font-medium leading-relaxed font-sans">
                        "{building.idea}"
                      </p>
                    </div>
                  )}

                  {/* Defined Problem State */}
                  {building.problem && (
                    <div className="bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl p-3.5 transition-colors">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="text-[7.5px] text-white/40 font-bold tracking-[0.18em] uppercase block">THE CRITICAL SYSTEM PROBLEM</span>
                      </div>
                      <p className="text-[10.5px] text-white/60 leading-relaxed">
                        {building.problem}
                      </p>
                    </div>
                  )}

                  {/* Programmatic Solution */}
                  {building.solution && (
                    <div className="bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl p-3.5 transition-colors">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-[7.5px] text-white/40 font-bold tracking-[0.18em] uppercase block">THE AUTOMATED SOLUTION</span>
                      </div>
                      <p className="text-[10.5px] text-white/60 leading-relaxed">
                        {building.solution}
                      </p>
                    </div>
                  )}

                  {/* General detailed description fallback */}
                  {!building.problem && (
                    <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4">
                      <span className="text-[7.5px] text-white/40 font-bold tracking-[0.18em] uppercase block mb-1.5">// DETAILED ATTRIBUTES</span>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        {building.longDescription || building.description}
                      </p>
                    </div>
                  )}

                  {/* Operational Metrics Segment */}
                  {building.metricsDetail && building.metricsDetail.length > 0 && (
                    <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-[0.2em] block">OPERATIONAL TELEMETRY METRICS</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5 pt-1">
                        {building.metricsDetail.map((metric, i) => (
                          <div key={i} className="text-left bg-black p-2.5 rounded border border-white/5">
                            <span className="text-[7px] text-white/30 uppercase tracking-wider block leading-tight mb-1 truncate" title={metric.label}>
                              {metric.label}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-white block tracking-wider truncate">
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connect CTA Button */}
                  <div className="pt-2">
                    {building.founder !== 'TBD' ? (
                      <button
                        onClick={handleConnectClick}
                        className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-mono text-xs uppercase tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(255,106,0,0.2)] hover:shadow-[0_0_30px_rgba(255,106,0,0.35)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Transmission Signal to Founder</span>
                      </button>
                    ) : (
                      <div className="w-full text-center py-2.5 text-[9px] text-white/20 border border-white/5 bg-white/[0.01] rounded-lg uppercase tracking-widest">
                        PENDING FOUNDER PROTOCOL HOSTING...
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* Connect step Form view */}
            {connectStep === 'form' && (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleFormSubmit}
                className="space-y-4 py-2 max-w-lg mx-auto"
              >
                <div className="text-center pb-2">
                  <span className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.3em] block mb-1">// INITIATE CONNECT PROTOCOL</span>
                  <p className="text-[10px] text-white/50 font-mono">Establish a point-to-point secure channel with {building.founder}.</p>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono tracking-widest text-white/50 uppercase">Your Contact Channel (Email or WhatsApp Number)</label>
                  <input 
                    type="text"
                    required
                    value={senderContact}
                    onChange={(e) => setSenderContact(e.target.value)}
                    placeholder="e.g. sreenath.k@domain.co"
                    className="w-full bg-white/[0.02] border border-white/10 text-xs text-white font-mono rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-orange-500 focus:bg-white/[0.04] transition-all duration-350"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono tracking-widest text-white/50 uppercase">Transmission Pitch (Explain what you bring, or request a slot)</label>
                  <textarea 
                    rows={4}
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="Provide a brief explanation of why you want to connect..."
                    className="w-full bg-white/[0.02] border border-white/10 text-xs text-white font-mono rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-orange-500 focus:bg-white/[0.04] transition-all duration-350 resize-none font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playTick();
                      setConnectStep('idle');
                    }}
                    className="px-4 py-3 border border-white/10 hover:bg-white/5 text-white/70 hover:text-white rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-mono text-[10px] uppercase tracking-[0.2em] font-bold transition-all shadow-[0_0_20px_rgba(255,106,0,0.2)] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Signal</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* Connect step Transmitting feedback state */}
            {connectStep === 'transmitting' && (
              <div className="py-12 text-center space-y-4">
                <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-orange-500/10 rounded-full" />
                  <div className="absolute inset-0 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-[0.25em] block leading-none animate-pulse">COMPILING BEAM TELEMETRY</span>
                  <span className="text-[8px] text-white/30 uppercase tracking-widest block">Bridging direct end-point registers...</span>
                </div>
              </div>
            )}

            {/* Connect step Success feedback state */}
            {connectStep === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-5 max-w-md mx-auto"
              >
                <div className="w-12 h-12 rounded-full bg-[#00ff66]/15 border border-[#00ff66]/35 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-[#00ff66]" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-sm font-bold text-white uppercase tracking-widest block">CONNECTION COMPILED</span>
                  <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                    Routing compiled successfully. Forwarding secure channel credentials directly over the WhatsApp secure protocol loop.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConnectStep('idle')}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-orange-400 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer"
                >
                  Return to Details Overview
                </button>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
