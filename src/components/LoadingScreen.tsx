/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Power, Volume2, VolumeX } from 'lucide-react';
import { audio } from './AudioEngine';

interface LoadingScreenProps {
  onEnter: (mute: boolean) => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [isMuteSelected, setIsMuteSelected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate high-end immersive assets loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const handleEnterClick = () => {
    // Play SFX upon click
    audio.setMute(isMuteSelected);
    audio.init();
    audio.playPulse();
    audio.playSwoosh();
    onEnter(isMuteSelected);
  };

  const toggleLocalMute = () => {
    setIsMuteSelected(!isMuteSelected);
    audio.playTick();
  };

  return (
    <div className="fixed inset-0 bg-[#030303] flex flex-col justify-center items-center z-50 overflow-hidden font-sans" id="loading-universe-screen">
      {/* Background Star Lines / Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff6a000d_1px,transparent_1px),linear-gradient(to_bottom,#ff6a000d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      {/* Pulsing Concentric Glowing Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-orange-500/10 rounded-full animate-ping [animation-duration:4s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-orange-500/20 rounded-full animate-pulse [animation-duration:2.5s]" />

      <div className="flex flex-col items-center justify-center max-w-lg w-full px-6 z-10 text-center select-none">
        
        {/* Upper Brand / Region Coordinate Tagline */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-2 mb-10 text-[10px] uppercase tracking-[0.35em] text-orange-500/60 font-mono"
        >
          <span>REGION_LAT: 14.6819° N</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse duration-1000" />
          <span>ANANTAPUR_GRID</span>
        </motion.div>

        {/* 3D Portal Central Glowing Particle */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-12">
          {progress < 100 ? (
            // Glowing Orange Portal energy loader
            <motion.div 
              style={{ scale: 0.2 + (progress / 100) * 0.8 }}
              className="absolute w-24 h-24 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full blur-[35px] opacity-80"
            />
          ) : (
            // Interactive high-end glass logo portal
            <motion.div 
              initial={{ scale: 0.8, rotate: -45 }}
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [-45, -40, -45],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-28 h-28 bg-gradient-to-br from-orange-500/10 to-orange-500/0 border border-orange-500/30 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(255,106,0,0.15)] flex items-center justify-center cursor-pointer group"
            >
              {/* Internal neon wire circles */}
              <div className="absolute inset-2 border border-orange-500/15 rounded-xl group-hover:border-orange-500/45 transition-colors duration-500" />
              <Rocket className="w-12 h-12 text-orange-500 drop-shadow-[0_0_15px_rgba(255,106,0,0.5)] transform rotate-45 group-hover:scale-110 transition-transform duration-300" />
            </motion.div>
          )}

          {/* Core particle */}
          <div className="absolute w-4 h-4 bg-white rounded-full blur-[2px] shadow-[0_0_20px_#fff]" />
        </div>

        {/* Brand Name Header */}
        <h1 className="text-4xl sm:text-5xl tracking-[0.25em] font-light text-white mb-2 uppercase font-sans">
          atp<span className="text-orange-500 font-medium">startups</span>
        </h1>
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-8">
          Anantapur Startup Ecosystem Engine
        </p>

        {/* Linear Progress Bar */}
        <AnimatePresence mode="wait">
          {!isLoaded ? (
            <motion.div 
              key="loader"
              exit={{ opacity: 0, height: 0 }}
              className="w-full flex flex-col items-center mb-6"
            >
              <div className="w-56 h-[2px] bg-orange-950/40 rounded-full overflow-hidden relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-600 to-amber-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[9px] font-mono tracking-[0.2em] text-orange-500/70 mt-2">
                RESONATING_CORE {progress}%
              </span>
            </motion.div>
          ) : (
            <motion.div 
              key="enter-action"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              {/* Ambient Synth Sound Toggle */}
              <button 
                onClick={toggleLocalMute}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500/40 text-[10px] text-orange-500/80 tracking-[0.15em] uppercase font-mono transition-all duration-300 cursor-pointer"
              >
                {!isMuteSelected ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>Ambient Synth Active</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Sound Track Muted</span>
                  </>
                )}
              </button>

              {/* Enter Button CTA */}
              <motion.button
                onClick={handleEnterClick}
                whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(255,106,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-mono text-xs uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(255,106,0,0.15)] transition-all duration-300 border border-orange-400/20 hover:border-orange-300/40 relative group overflow-hidden cursor-pointer mt-2"
              >
                {/* Magnetic Hover Flare */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                
                <Power className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-500" />
                <span>Enter Startup Metaverse</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Portal Grid Footer info */}
      <div className="absolute bottom-6 flex justify-between w-full px-8 text-[9px] font-mono text-white/20 uppercase tracking-widest z-10">
        <span>© 2026 ATPSTARTUPS</span>
        <span>BUILDING THE FUTURE FROM INDIA</span>
      </div>
    </div>
  );
};
