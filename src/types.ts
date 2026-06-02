/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveSection =
  | 'loading'
  | 'hero'
  | 'about'
  | 'what-we-do'
  | 'ecosystem'
  | 'city'
  | 'community'
  | 'social';

export interface CityBuilding {
  id: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  founder: string;
  growth: number; // 1-100 (determines glow intensity)
  isComingSoon: boolean;
  gridX: number;
  gridZ: number;
  height: number;
  color: string;
}

export interface InteractiveModule {
  id: 'community' | 'events' | 'mentorship' | 'startups';
  title: string;
  tagline: string;
  description: string;
  stat: string;
  metric: string;
}

export interface EcosystemNode {
  id: 'idea' | 'build' | 'launch' | 'scale';
  label: string;
  title: string;
  description: string;
  action: string;
  metrics: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  glowColor: string;
}
