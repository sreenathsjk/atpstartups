/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = true; // Default to muted to conform with browser auto-play policies and UX
  private currentChordIndex = 0;
  private loopIntervalId: any = null;
  private isMusicPlaying: boolean = false;

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.startAmbientHum();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (!this.ctx) {
      if (!mute) {
        this.init();
      }
      return;
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.masterGain) {
      const targetGain = mute ? 0 : 0.18;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.15);
    }
  }

  getMute(): boolean {
    return this.isMuted;
  }

  private startAmbientHum() {
    if (!this.ctx || !this.masterGain) return;
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    const playStartupTheme = () => {
      if (!this.ctx || !this.masterGain) return;

      const time = this.ctx.currentTime;
      const chordDuration = 7.0; // 7 seconds per progression card

      // Beautiful Inspiring Tech Startup Chords (A Min 9 -> F Maj 9 -> C Maj 7/9 -> G 6/9)
      const chords = [
        [110.00, 220.00, 261.63, 329.63, 392.00, 493.88], // Am9
        [87.31, 174.61, 220.00, 261.63, 329.63, 392.00],  // FMaj9
        [130.81, 196.00, 246.94, 293.66, 329.63, 493.88], // Cmaj9
        [98.00, 196.00, 246.94, 293.66, 329.63, 440.00]   // G6/9
      ];

      const activeChord = chords[this.currentChordIndex];
      this.currentChordIndex = (this.currentChordIndex + 1) % chords.length;

      // Resonant Lowpass filter to create a warm premium analog synthesizer feeling
      const synthFilter = this.ctx.createBiquadFilter();
      synthFilter.type = 'lowpass';
      synthFilter.frequency.setValueAtTime(450, time);
      // Gentle warm filter sweeps
      synthFilter.frequency.exponentialRampToValueAtTime(750, time + chordDuration / 2);
      synthFilter.frequency.exponentialRampToValueAtTime(450, time + chordDuration);
      synthFilter.Q.setValueAtTime(2.0, time);
      synthFilter.connect(this.masterGain);

      // Create beautiful polyphonic detuned voices for the pad chord
      activeChord.forEach((freq, idx) => {
        if (!this.ctx) return;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const voiceGainNode = this.ctx.createGain();

        // Warm detuning & chorus effect
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, time);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 1.004 + 0.15, time);

        // Soft, gorgeous linear envelope layout
        voiceGainNode.gain.setValueAtTime(0, time);
        // Base notes get slightly more grounding weight, high accents remain airy
        const maxGain = idx === 0 ? 0.05 : 0.03;
        voiceGainNode.gain.linearRampToValueAtTime(maxGain, time + 2.0); // 2s soft attack to ambient glory
        voiceGainNode.gain.setValueAtTime(maxGain, time + chordDuration - 2.5);
        voiceGainNode.gain.linearRampToValueAtTime(0, time + chordDuration); // 2.5s smooth release

        osc1.connect(voiceGainNode);
        osc2.connect(voiceGainNode);
        voiceGainNode.connect(synthFilter);

        osc1.start(time);
        osc2.start(time);

        osc1.stop(time + chordDuration);
        osc2.stop(time + chordDuration);
      });

      // Schedule Sparky Minimalist Tech chime/arpeggio note periodically
      const playSparkleChime = (chimeDelaySec: number, pitchCoeff: number) => {
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const chimeTime = this.ctx.currentTime + chimeDelaySec;

        const randomBaseFreq = activeChord[Math.floor(Math.random() * (activeChord.length - 2)) + 2];
        const chimeFreq = randomBaseFreq * pitchCoeff;

        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const delayGain = this.ctx.createGain();
        const delay = this.ctx.createDelay();

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(chimeFreq, chimeTime);

        chimeGain.gain.setValueAtTime(0, chimeTime);
        chimeGain.gain.linearRampToValueAtTime(0.006, chimeTime + 0.02);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeTime + 1.2);

        // Dynamic echo track
        delay.delayTime.setValueAtTime(0.25, chimeTime);
        delayGain.gain.setValueAtTime(0.002, chimeTime);
        delayGain.gain.exponentialRampToValueAtTime(0.0001, chimeTime + 1.5);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.masterGain);

        chimeGain.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(this.masterGain);

        chimeOsc.start(chimeTime);
        chimeOsc.stop(chimeTime + 1.8);
      };

      // Play elegant bells
      playSparkleChime(0.2, 2.0);
      playSparkleChime(1.8, 2.0);
      playSparkleChime(3.5, 4.0);
      playSparkleChime(5.2, 2.0);
    };

    // Trigger immediately
    playStartupTheme();

    // Loop interval
    this.loopIntervalId = setInterval(() => {
      if (!this.isMuted) {
        playStartupTheme();
      }
    }, 7000);
  }

  // Hover tick: ultra high precision soft tick sound
  playTick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, this.ctx.currentTime); // high frequency tick

      gain.gain.setValueAtTime(0.012, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch (e) {
      // Ignored
    }
  }

  // Click SFX: energy core pulse sound
  playPulse() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const time = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Sweeping frequency
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, time);
      osc.frequency.exponentialRampToValueAtTime(120, time + 0.15);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, time);
      filter.frequency.exponentialRampToValueAtTime(150, time + 0.15);
      filter.Q.setValueAtTime(5, time);

      // Amplitude envelope
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(time + 0.25);
    } catch (e) {
      // Ignored
    }
  }

  // Portal swoosh: deep wind / cyber port transition
  playSwoosh() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const time = this.ctx.currentTime;
      const duration = 0.8;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, time);
      osc.frequency.exponentialRampToValueAtTime(450, time + duration / 2);
      osc.frequency.exponentialRampToValueAtTime(50, time + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, time);
      filter.frequency.exponentialRampToValueAtTime(1800, time + duration / 2);
      filter.frequency.exponentialRampToValueAtTime(100, time + duration);
      filter.Q.setValueAtTime(3, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.05, time + duration / 2);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(time + duration + 0.1);
    } catch (e) {
      // Ignored
    }
  }
}

export const audio = new AudioEngine();
