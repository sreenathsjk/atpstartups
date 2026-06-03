/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from './AudioEngine';
import { Radio, ExternalLink, RefreshCw } from 'lucide-react';

interface BriefingItem {
  headline: string;
  summary: string;
  source: string;
  link?: string;
}

export const DailyBriefingTicker: React.FC = () => {
  const [briefings, setBriefings] = useState<BriefingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBriefingData = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Server responded with an error');
      }
      const data = await response.json();
      if (data && data.briefings && data.briefings.length > 0) {
        setBriefings(data.briefings);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Failed to fetch daily briefing telemetry:', err);
      // Failsafe offline state
      setBriefings([
        {
          headline: 'ATP GATEWAY HUB REPORTED ACTIVE AND NOMINAL',
          summary: 'Global server matrix establishes synchronous telemetry loops with local Anantapur incubation centers.',
          source: 'System Pulse'
        },
        {
          headline: 'RAYALASEEMA WINDGRID INTRODUCES CORPS LOAD SHIFTERS',
          summary: 'Integrated load balancing software completes 40-day run at Penukonda grid cells.',
          source: 'WindGrid Operations'
        }
      ]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBriefingData();
  }, []);

  // Set up slide rotation
  useEffect(() => {
    if (briefings.length <= 1 || isLoading) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % briefings.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [briefings, isLoading]);

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playTick();
    fetchBriefingData();
  };

  const handleHeadlineClick = () => {
    audio.playPulse();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-1.5 px-3 bg-black/40 border border-white/5 rounded-full text-[8px] text-white/30 tracking-widest font-mono uppercase">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500/40 animate-pulse" />
        <span>SYNCING NEWS TELEMETRY...</span>
      </div>
    );
  }

  const currentItem = briefings[currentIndex] || {
    headline: 'ECOSYSTEM ONLINE',
    summary: 'Active monitor of startups compiled correctly.',
    source: 'Diagnostics'
  };

  return (
    <div 
      className="flex items-center gap-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/10 hover:border-orange-500/30 rounded-full py-1.5 pl-3.5 pr-2 w-full transition-all duration-300 pointer-events-auto select-none"
      id="daily-briefing-ticker"
    >
      {/* Live Flashing Pulse Badge */}
      <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full shrink-0 text-[7px] text-orange-400 font-bold uppercase tracking-[0.2em] relative overflow-hidden">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping absolute left-2" />
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-0.5 shrink-0" />
        <span>LIVE BRIEFING</span>
      </div>

      {/* The scrolling slider panel */}
      <div className="flex-1 overflow-hidden h-4.5 relative text-left min-w-0 flex items-center pr-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', damping: 15, stiffness: 120 }}
            className="absolute left-0 right-0 flex items-center gap-2.5 min-w-0"
          >
            {/* The actual headline text */}
            <p className="text-[9px] font-bold text-white tracking-widest truncate max-w-[260px] md:max-w-[400px] uppercase font-mono">
              {currentItem.headline}
            </p>

            {/* Separator */}
            <span className="text-white/20 text-[8px] shrink-0">//</span>

            {/* Concise summary content */}
            <p className="text-[8px] text-white/50 tracking-wider truncate hidden md:block shrink-1 font-mono">
              {currentItem.summary}
            </p>

            {/* News Platform/Publisher source indicator */}
            {currentItem.source && (
              <span className="text-[7px] text-orange-400/70 border border-orange-500/10 bg-orange-500/[0.02] px-1 py-0.2 rounded font-semibold shrink-0 uppercase tracking-widest">
                {currentItem.source}
              </span>
            )}

            {/* Interactive Link redirect if provided */}
            {currentItem.link && (
              <a 
                href={currentItem.link}
                target="_blank"
                rel="noreferrer"
                onClick={handleHeadlineClick}
                className="text-white/35 hover:text-orange-400 shrink-0 p-0.5 transition-colors"
                title="View original coverage"
              >
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Ticker Action Controls */}
      <div className="flex items-center shrink-0 pl-1 border-l border-white/5">
        <button
          onClick={handleRefresh}
          className={`p-1 rounded-full hover:bg-white/5 text-white/30 hover:text-white transition-colors cursor-pointer ${
            isRefreshing ? 'animate-spin text-orange-400' : ''
          }`}
          title="Refresh grounding headlines"
        >
          <RefreshCw className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};
