/**
 * BEYOND — An Existential Endless Web Game
 * 
 * Core Concept: Intentionally useless, endless, delightfully funny.
 * Features:
 * - 0% Game Over, 0% Winning, 100% Pointless.
 * - Procedural 2D vector cartoon characters (Boy "Leo" & Girl "Mia") with 11 distinct animation states.
 * - Dynamic parallax background with multi-layer terrain.
 * - Dynamic obstacles: Long Pit (alternating fly vs climb recovery), Small Rock (5s limp),
 *   Banana Peel (slip & back rub), and Bed Event (choice to sleep 2 mins or jump over).
 * - Coins with particle effects & LocalStorage persistence.
 * - The Useless Shop: buying items actually increases hazard frequency!
 * - Useless Player Action detector (jump spam stare-down) & Poke irritation detector ("Don't touch me!").
 * - Web Audio API procedural sound synthesizer + Web Speech API vocal comedy.
 * - Existential Exit Modal calculating exact time wasted.
 */

(() => {
  'use strict';

  // =========================================================================
  // AUDIO & VOICE SYNTHESIZER (Web Audio API & Web Speech API)
  // =========================================================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('beyond_muted') === 'true';
      this.speechSynth = window.speechSynthesis || null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('beyond_muted', this.muted);
      return this.muted;
    }

    playJump() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch (e) { /* ignore */ }
    }

    playCoin() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        osc2.frequency.setValueAtTime(1975.53, now + 0.08); // B6

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now + 0.08);
        osc1.stop(now + 0.36);
        osc2.stop(now + 0.36);
      } catch (e) { /* ignore */ }
    }

    playRockBump() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      } catch (e) { /* ignore */ }
    }

    playBananaSlip() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        // Classic cartoon slide whistle up then drop
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(750, now + 0.15);
        osc.frequency.linearRampToValueAtTime(220, now + 0.32);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.36);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      } catch (e) { /* ignore */ }
    }

    playPitFall() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.55);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.58);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      } catch (e) { /* ignore */ }
    }

    playAngelFly() {
      if (this.muted || !this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major harp arpeggio
        notes.forEach((freq, idx) => {
          const now = this.ctx.currentTime + idx * 0.09;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.005, now + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.42);
        });
      } catch (e) { /* ignore */ }
    }

    playClimb() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      } catch (e) { /* ignore */ }
    }

    playSnore() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.5);
        osc.frequency.linearRampToValueAtTime(80, now + 1.0);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.5);
        gain.gain.linearRampToValueAtTime(0.01, now + 1.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.05);
      } catch (e) { /* ignore */ }
    }

    playClick() {
      if (this.muted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.055);
      } catch (e) { /* ignore */ }
    }

    getVoiceForCharacter(charType) {
      if (!this.speechSynth) return null;
      try {
        const voices = this.speechSynth.getVoices() || [];
        if (!voices || voices.length === 0) return null;

        const isGirl = charType === 'girl';
        const femaleKeywords = ['female', 'girl', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'fiona', 'catherine', 'hazel', 'susan', 'jenny', 'aria', 'ava', 'allison', 'helena', 'ioana', 'laura'];
        const maleKeywords = ['male', 'boy', 'man', 'david', 'george', 'mark', 'james', 'guy', 'richard', 'alex', 'daniel', 'tom', 'christopher', 'eric', 'brian', 'reed'];

        const targetKeywords = isGirl ? femaleKeywords : maleKeywords;

        // 1. Try finding an English voice matching target keywords
        let match = voices.find(v => {
          const name = (v.name || '').toLowerCase();
          const lang = (v.lang || '').toLowerCase();
          const isEnglish = lang.startsWith('en') || !lang;
          return isEnglish && targetKeywords.some(kw => name.includes(kw));
        });

        // 2. Try any language voice matching target keywords
        if (!match) {
          match = voices.find(v => {
            const name = (v.name || '').toLowerCase();
            return targetKeywords.some(kw => name.includes(kw));
          });
        }

        // 3. Fallback: avoid opposing gender keywords
        if (!match) {
          const avoidKeywords = isGirl ? maleKeywords : femaleKeywords;
          match = voices.find(v => {
            const name = (v.name || '').toLowerCase();
            const lang = (v.lang || '').toLowerCase();
            return lang.startsWith('en') && !avoidKeywords.some(kw => name.includes(kw));
          });
        }

        // 4. Default fallback: any English or first voice
        if (!match) {
          match = voices.find(v => (v.lang || '').toLowerCase().startsWith('en')) || voices[0] || null;
        }

        return match;
      } catch (e) {
        return null;
      }
    }

    speak(text, charType = 'boy') {
      if (this.muted || !this.speechSynth) return;
      try {
        // Cancel previous pending utterances safely
        this.speechSynth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const isGirl = charType === 'girl';

        const voice = this.getVoiceForCharacter(charType);
        if (voice) {
          utterance.voice = voice;
        }

        utterance.rate = 1.05;
        utterance.pitch = isGirl ? 1.45 : 0.95;
        utterance.volume = 0.95;

        this.speechSynth.speak(utterance);
      } catch (e) { /* ignore safely */ }
    }
  }

  // =========================================================================
  // DATA STORAGE MANAGER
  // =========================================================================
  class StorageManager {
    static getCoins() {
      return parseInt(localStorage.getItem('beyond_coins') || '0', 10);
    }
    static setCoins(val) {
      localStorage.setItem('beyond_coins', Math.max(0, val));
    }
    static addCoins(val) {
      const current = this.getCoins();
      this.setCoins(current + val);
      return current + val;
    }
    static getCharacter() {
      return localStorage.getItem('beyond_character') || 'boy';
    }
    static setCharacter(char) {
      localStorage.setItem('beyond_character', char);
    }
    static getTotalTime() {
      return parseInt(localStorage.getItem('beyond_total_time') || '0', 10);
    }
    static addTotalTime(seconds) {
      const current = this.getTotalTime();
      localStorage.setItem('beyond_total_time', current + seconds);
    }
  }

  // =========================================================================
  // CHARACTER RENDERER & ARTICULATION
  // Draws high-detail vector cartoon Boy & Girl with 11 distinct states
  // =========================================================================
  class CharacterRenderer {
    static draw(ctx, charType, state, animTime, x, y, scale = 1, options = {}) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      // Offset so character's feet bottom (local y=44) rests exactly on the platform ground y=0
      ctx.translate(0, -44);

      const isGirl = charType === 'girl';
      const t = animTime;

      // Color Palette definition
      const colors = {
        skin: isGirl ? '#f2c39b' : '#d79a68',
        skinShade: isGirl ? '#d99b70' : '#b9784e',
        hair: isGirl ? '#4b2f24' : '#3f2a22', // Simple dark hair
        hairAcc: isGirl ? '#e76d5a' : '#7b4d35', // Hair clip / sandal accent
        shirt: isGirl ? '#e77a62' : '#e8e0c8',
        pants: isGirl ? '#f2c39b' : '#efe6cc',
        shoes: '#8a5b3e',
        shoeTrim: isGirl ? '#d7a24b' : '#6d432f',
        blush: 'rgba(218, 111, 90, 0.20)',
        eye: '#0f172a'
      };

      // State Specific Offsets & Angles
      let bodyBob = 0;
      let bodyTilt = 0;
      let leftArmAngle = 0;
      let rightArmAngle = 0;
      let leftLegAngle = 0;
      let rightLegAngle = 0;
      let faceDir = 1; // 1 = facing right, 0 = facing player (deadpan stare)
      let eyesClosed = false;
      let expression = 'normal'; // 'normal', 'smile', 'stare', 'hurt', 'dizzy', 'sleep'

      // Natural blink cycle (every ~3.5 seconds for 120ms)
      if (Math.sin(t * 1.8) > 0.96) {
        eyesClosed = true;
      }

      switch (state) {
        case 'WALK':
        default: {
          const stride = Math.sin(t * 10);
          bodyBob = Math.abs(Math.sin(t * 10)) * -6;
          bodyTilt = 0.05;
          leftLegAngle = stride * 0.55;
          rightLegAngle = -stride * 0.55;
          leftArmAngle = -stride * 0.5;
          rightArmAngle = stride * 0.5;
          expression = 'smile';
          break;
        }

        case 'JUMP': {
          bodyBob = -10;
          bodyTilt = -0.1;
          leftLegAngle = 0.45;
          rightLegAngle = 0.25;
          leftArmAngle = -1.2;
          rightArmAngle = -1.1;
          expression = 'smile';
          break;
        }

        case 'FALL': {
          bodyBob = 0;
          bodyTilt = 0.15;
          leftLegAngle = -0.3;
          rightLegAngle = -0.4;
          leftArmAngle = -1.5;
          rightArmAngle = -1.6;
          expression = 'dizzy';
          break;
        }

        case 'INJURED_WALK': {
          // Slow limping cycle
          const limp = Math.sin(t * 5);
          bodyBob = (limp > 0 ? -2 : 4);
          bodyTilt = 0.12;
          leftLegAngle = limp * 0.25;
          rightLegAngle = -limp * 0.1 - 0.2; // dragging injured leg
          leftArmAngle = 0.2;
          rightArmAngle = -0.4;
          expression = 'hurt';
          break;
        }

        case 'SLIP': {
          // Flying horizontally backwards
          bodyBob = -15;
          bodyTilt = -1.1;
          leftLegAngle = -1.0;
          rightLegAngle = -0.8;
          leftArmAngle = -1.8;
          rightArmAngle = -1.4;
          expression = 'dizzy';
          break;
        }

        case 'RUB_BACK': {
          // Sitting on ground
          bodyBob = 18;
          bodyTilt = 0.3;
          leftLegAngle = 1.3;
          rightLegAngle = 1.2;
          leftArmAngle = 0.6; // hand resting on ground
          rightArmAngle = 1.4; // hand reaching behind back to rub
          expression = 'hurt';
          break;
        }

        case 'PIT_FALL': {
          bodyBob = 0;
          bodyTilt = 0.2;
          leftLegAngle = -0.2;
          rightLegAngle = -0.2;
          leftArmAngle = -2.2;
          rightArmAngle = -2.2;
          expression = 'dizzy';
          break;
        }

        case 'PIT_FLY_RECOVERY': {
          // Floating up serenely with wings
          bodyBob = Math.sin(t * 8) * 4;
          bodyTilt = 0;
          leftLegAngle = 0.15;
          rightLegAngle = -0.15;
          leftArmAngle = -0.6;
          rightArmAngle = 0.6;
          expression = 'smile';
          eyesClosed = true; // peaceful bliss
          break;
        }

        case 'PIT_CLIMB_RECOVERY': {
          // Climbing ladder hand over hand
          const climbCycle = Math.sin(t * 12);
          bodyBob = Math.abs(climbCycle) * 3;
          leftArmAngle = -2.2 + climbCycle * 0.8;
          rightArmAngle = -2.2 - climbCycle * 0.8;
          leftLegAngle = climbCycle * 0.4;
          rightLegAngle = -climbCycle * 0.4;
          expression = 'hurt'; // exertion
          break;
        }

        case 'STARE_PLAYER': {
          // Turned 90 deg directly facing player! Deadpan judgment
          faceDir = 0;
          bodyBob = 0;
          bodyTilt = 0;
          leftArmAngle = 0.2;
          rightArmAngle = -0.2;
          leftLegAngle = 0;
          rightLegAngle = 0;
          expression = 'stare';
          break;
        }

        case 'SLEEP': {
          // Tucked in bed
          bodyBob = Math.sin(t * 2) * 2; // breathing
          expression = 'sleep';
          eyesClosed = true;
          break;
        }
      }

      // --- SHADOW (unless in air or pit) ---
      if (state !== 'PIT_FALL' && state !== 'PIT_FLY_RECOVERY' && state !== 'SLEEP') {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        const shadowWidth = state === 'JUMP' ? 36 : 48;
        const shadowAlpha = state === 'JUMP' ? 0.12 : 0.22;
        ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        ctx.ellipse(0, 48, shadowWidth, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // If sleeping, the bed is rendered by the environment, but character head and nightcap show
      if (state === 'SLEEP') {
        CharacterRenderer.drawSleepingHead(ctx, colors, isGirl, t);
        ctx.restore();
        return;
      }

      // --- SPECIAL EFFECTS (WINGS / LADDER / BANDAGE) ---
      if (state === 'PIT_FLY_RECOVERY') {
        CharacterRenderer.drawAngelWings(ctx, t);
      } else if (state === 'PIT_CLIMB_RECOVERY') {
        CharacterRenderer.drawRopeLadder(ctx, t);
      }

      // Apply Body Transforms
      ctx.translate(0, bodyBob);
      ctx.rotate(bodyTilt);

      // --- LEGS ---
      // Left Leg (Behind)
      ctx.save();
      ctx.translate(-6, 22);
      ctx.rotate(leftLegAngle);
      ctx.fillStyle = colors.pants;
      ctx.fillRect(-4, 0, 8, 14);
      // Shoe
      ctx.fillStyle = colors.shoes;
      ctx.beginPath();
      ctx.roundRect(-5, 14, 13, 8, [3, 5, 2, 2]);
      ctx.fill();
      ctx.fillStyle = colors.shoeTrim;
      ctx.fillRect(-5, 19, 13, 3);
      ctx.restore();

      // Right Leg (Front)
      ctx.save();
      ctx.translate(6, 22);
      ctx.rotate(rightLegAngle);
      ctx.fillStyle = colors.pants;
      ctx.fillRect(-4, 0, 8, 14);
      // Injured bandage if in INJURED_WALK state
      if (state === 'INJURED_WALK') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-5, 7, 10, 5);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 8); ctx.lineTo(0, 11);
        ctx.moveTo(-2, 9.5); ctx.lineTo(2, 9.5);
        ctx.stroke();
      }
      // Shoe
      ctx.fillStyle = colors.shoes;
      ctx.beginPath();
      ctx.roundRect(-5, 14, 13, 8, [3, 5, 2, 2]);
      ctx.fill();
      ctx.fillStyle = colors.shoeTrim;
      ctx.fillRect(-5, 19, 13, 3);
      ctx.restore();

      // --- TORSO / CLOTHING ---
      ctx.save();
      ctx.fillStyle = colors.shirt;
      ctx.beginPath();
      ctx.roundRect(-14, 2, 28, 22, [8, 8, 4, 4]);
      ctx.fill();

      if (isGirl) {
        // Slightly flared simple frock/skirt
        ctx.fillStyle = '#e77a62';
        ctx.beginPath();
        ctx.moveTo(-14, 13); ctx.lineTo(14, 13); ctx.lineTo(18, 26); ctx.lineTo(-18, 26);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f2d79a';
        ctx.fillRect(-17, 24, 34, 2);
      } else {
        // Mundu/dhoti fold line
        ctx.fillStyle = '#d1c5a8';
        ctx.fillRect(-14, 20, 28, 4);
      }

      // Simple Kerala-style clothing
      if (isGirl) {
        // Small frock collar and waist line
        ctx.strokeStyle = '#b65a4a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-7, 5); ctx.lineTo(0, 10); ctx.lineTo(7, 5);
        ctx.moveTo(-12, 19); ctx.lineTo(12, 19);
        ctx.stroke();
      } else {
        // Plain half-sleeve shirt seam
        ctx.strokeStyle = '#b6a98b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 4); ctx.lineTo(0, 23);
        ctx.stroke();
      }
      ctx.restore();

      // --- ARMS ---
      // Left Arm (Behind)
      ctx.save();
      ctx.translate(-12, 6);
      ctx.rotate(leftArmAngle);
      ctx.fillStyle = colors.shirt;
      ctx.fillRect(-3, 0, 6, 12);
      ctx.fillStyle = colors.skin;
      ctx.beginPath();
      ctx.arc(0, 14, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right Arm (Front)
      ctx.save();
      ctx.translate(12, 6);
      ctx.rotate(rightArmAngle);
      ctx.fillStyle = colors.shirt;
      ctx.fillRect(-3, 0, 6, 12);
      ctx.fillStyle = colors.skin;
      ctx.beginPath();
      ctx.arc(0, 14, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- HEAD & FACE ---
      ctx.save();
      ctx.translate(0, -14);

      // Neck
      ctx.fillStyle = colors.skinShade;
      ctx.fillRect(-4, 12, 8, 5);

      // Head Base
      ctx.fillStyle = colors.skin;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // Blush
      ctx.fillStyle = colors.blush;
      ctx.beginPath();
      ctx.arc(-9, 4, 4.5, 0, Math.PI * 2);
      ctx.arc(9, 4, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // FACIAL EXPRESSIONS & EYES
      if (faceDir === 0) {
        // DEADPAN STARE DIRECTLY AT PLAYER (4th wall break)
        ctx.fillStyle = colors.eye;
        // Narrowed judgmental eyes
        ctx.fillRect(-10, -3, 6, 3);
        ctx.fillRect(4, -3, 6, 3);
        // Eyebrows furrowed
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-11, -7); ctx.lineTo(-4, -5);
        ctx.moveTo(11, -7); ctx.lineTo(4, -5);
        ctx.stroke();
        // Flat line mouth
        ctx.beginPath();
        ctx.moveTo(-5, 6); ctx.lineTo(5, 6);
        ctx.stroke();
      } else if (eyesClosed) {
        // Happy squint / sleeping / blinking
        ctx.strokeStyle = colors.eye;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-6, -1, 4, 0, Math.PI);
        ctx.arc(6, -1, 4, 0, Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 5, 4, 0, Math.PI);
        ctx.stroke();
      } else if (expression === 'dizzy') {
        // Spiral / X eyes
        ctx.strokeStyle = colors.eye;
        ctx.lineWidth = 2;
        // X eyes
        ctx.beginPath();
        ctx.moveTo(-9, -4); ctx.lineTo(-3, 2);
        ctx.moveTo(-3, -4); ctx.lineTo(-9, 2);
        ctx.moveTo(3, -4); ctx.lineTo(9, 2);
        ctx.moveTo(9, -4); ctx.lineTo(3, 2);
        ctx.stroke();
        // Wobbly mouth
        ctx.beginPath();
        ctx.arc(0, 6, 4, 0, Math.PI * 2);
        ctx.stroke();
      } else if (expression === 'hurt') {
        // Wincing eyes
        ctx.strokeStyle = colors.eye;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-9, -1); ctx.lineTo(-4, -4);
        ctx.moveTo(-9, -1); ctx.lineTo(-4, 2);
        ctx.moveTo(9, -1); ctx.lineTo(4, -4);
        ctx.moveTo(9, -1); ctx.lineTo(4, 2);
        ctx.stroke();
        // Wavy mouth
        ctx.beginPath();
        ctx.moveTo(-5, 7);
        ctx.quadraticCurveTo(-2, 4, 0, 7);
        ctx.quadraticCurveTo(2, 10, 5, 7);
        ctx.stroke();

        // Comic sweat droplet popping off head
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(14, -12 + Math.sin(t * 10) * 3, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Big cute cartoon eyes
        ctx.fillStyle = colors.eye;
        ctx.beginPath();
        ctx.arc(-5, -1, 4, 0, Math.PI * 2);
        ctx.arc(7, -1, 4, 0, Math.PI * 2);
        ctx.fill();
        // Eye highlights (sparkles)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-6, -2, 1.5, 0, Math.PI * 2);
        ctx.arc(6, -2, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Cute smiling mouth
        ctx.strokeStyle = colors.eye;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(1, 4, 4, 0.1, Math.PI - 0.1);
        ctx.stroke();
      }

      // --- HAIR & HEADWEAR ---
      if (isGirl) {
        // Simple old-fashioned hair with a small side clip
        ctx.fillStyle = colors.hair;
        ctx.beginPath();
        ctx.arc(0, -6, 19, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-18, -7, 6, 17);
        ctx.fillRect(12, -7, 6, 17);
        ctx.fillStyle = colors.hairAcc;
        ctx.fillRect(10, -13, 8, 4);
        ctx.fillRect(14, -15, 4, 7);
      } else {
        // Simple old-school side-parted hair; no cap
        ctx.fillStyle = colors.hair;
        ctx.beginPath();
        ctx.arc(0, -6, 19, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-18, -7, 7, 10);
        ctx.fillRect(11, -7, 7, 8);
      }

      ctx.restore(); // end head
      ctx.restore(); // end character root
    }

    static drawAngelWings(ctx, t) {
      ctx.save();
      const wingFlap = Math.sin(t * 16) * 0.3;
      // Halo
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, -36, 18, 6, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Left Wing
      ctx.save();
      ctx.translate(-14, 0);
      ctx.rotate(-0.4 + wingFlap);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-26, -30, -34, -10);
      ctx.quadraticCurveTo(-24, 0, 0, 10);
      ctx.fill();
      ctx.restore();

      // Right Wing
      ctx.save();
      ctx.translate(14, 0);
      ctx.rotate(0.4 - wingFlap);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(26, -30, 34, -10);
      ctx.quadraticCurveTo(24, 0, 0, 10);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    static drawRopeLadder(ctx, t) {
      ctx.save();
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 3;
      // Two rope lines extending downwards from platform
      ctx.beginPath();
      ctx.moveTo(-16, -100); ctx.lineTo(-16, 100);
      ctx.moveTo(16, -100); ctx.lineTo(16, 100);
      ctx.stroke();

      // Wooden rungs
      ctx.fillStyle = '#b45309';
      for (let ry = -90; ry <= 90; ry += 24) {
        ctx.fillRect(-18, ry, 36, 6);
      }
      ctx.restore();
    }

    static drawSleepingHead(ctx, colors, isGirl, t) {
      // Head peeking out from pillow
      ctx.save();
      ctx.translate(0, 10);

      // Fluffy Pillow
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-30, -10, 60, 32, 12);
      ctx.fill();

      // Sleeping Head
      ctx.fillStyle = colors.skin;
      ctx.beginPath();
      ctx.arc(0, 4, 16, 0, Math.PI * 2);
      ctx.fill();

      // Sleeping Closed Eyes & Peaceful Smile
      ctx.strokeStyle = colors.eye;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-6, 2, 4, 0, Math.PI);
      ctx.arc(6, 2, 4, 0, Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 8, 3, 0, Math.PI);
      ctx.stroke();

      // Cute Nightcap
      ctx.fillStyle = isGirl ? '#ec4899' : '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(0, -18);
      ctx.lineTo(26, -10);
      ctx.fill();
      // Nightcap fluffy pompom
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(28, -10, 5, 0, Math.PI * 2);
      ctx.fill();

      // Floating Zzz letters
      const zOffset = (t * 2) % 3;
      ctx.fillStyle = '#a5b4fc';
      ctx.font = 'bold 16px Fredoka, sans-serif';
      ctx.fillText('z', 15 + zOffset * 8, -20 - zOffset * 15);

      ctx.restore();
    }
  }

  // =========================================================================
  // PARALLAX WORLD & ENVIRONMENT
  // Rich cartoon platformer landscape: sky, clouds, hills, trees, brick platform
  // =========================================================================
  class World {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.cameraX = 0;
      this.platformY = 0; // set dynamically on resize
      this.time = 0;

      // Seed decorative background elements
      this.clouds = [];
      for (let i = 0; i < 10; i++) {
        this.clouds.push({
          x: i * 220 + Math.random() * 80,
          y: 40 + Math.random() * 120,
          size: 0.7 + Math.random() * 0.8,
          speed: 0.15 + Math.random() * 0.2
        });
      }

      this.trees = [];
      for (let i = 0; i < 15; i++) {
        this.trees.push({
          x: i * 180 + Math.random() * 60,
          type: Math.random() > 0.5 ? 'pine' : 'round',
          height: 50 + Math.random() * 30,
          color: Math.random() > 0.5 ? '#10b981' : '#059669'
        });
      }
    }

    resize(width, height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.platformY = Math.floor(height * 0.75);
    }

    update(dt, speed) {
      this.time += dt;
      this.cameraX += speed * dt;
    }

    render(pits = []) {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const camX = this.cameraX;
      const platY = this.platformY;

      // 1. SKY GRADIENT (Day with rich twilight touch)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, platY);
      skyGrad.addColorStop(0, '#82cbed');
      skyGrad.addColorStop(0.5, '#a8ddf2');
      skyGrad.addColorStop(1, '#d7efe9');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, platY);

      // 2. CELESTIAL SUN / MOON GLOW
      ctx.save();
      const sunX = w * 0.75;
      const sunY = 90;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 160);
      sunGlow.addColorStop(0, 'rgba(255, 231, 137, 0.85)');
      sunGlow.addColorStop(0.3, 'rgba(255, 211, 89, 0.35)');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 160, 0, Math.PI * 2);
      ctx.fill();

      // Sun core
      ctx.fillStyle = '#ffe89a';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. MOVING CLOUDS (Layer 0)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      this.clouds.forEach(c => {
        const cx = ((c.x - camX * c.speed) % (w + 300)) - 150;
        const finalX = cx < -150 ? cx + w + 300 : cx;
        ctx.beginPath();
        ctx.arc(finalX, c.y, 25 * c.size, 0, Math.PI * 2);
        ctx.arc(finalX + 22 * c.size, c.y - 10 * c.size, 32 * c.size, 0, Math.PI * 2);
        ctx.arc(finalX + 50 * c.size, c.y, 24 * c.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. DISTANT ROLLING MOUNTAINS (Layer 1: Speed 0.15)
      ctx.fillStyle = '#86b99b';
      ctx.beginPath();
      ctx.moveTo(0, platY);
      for (let x = 0; x <= w + 60; x += 40) {
        const worldX = x + camX * 0.15;
        const my = platY - 140 - Math.sin(worldX * 0.003) * 60 - Math.cos(worldX * 0.007) * 35;
        ctx.lineTo(x, my);
      }
      ctx.lineTo(w, platY);
      ctx.closePath();
      ctx.fill();

      // 5. MIDGROUND HILLS & VEGETATION (Layer 2: Speed 0.35)
      ctx.fillStyle = '#5f9f5e';
      ctx.beginPath();
      ctx.moveTo(0, platY);
      for (let x = 0; x <= w + 40; x += 30) {
        const worldX = x + camX * 0.35;
        const hy = platY - 70 - Math.sin(worldX * 0.008) * 30;
        ctx.lineTo(x, hy);
      }
      ctx.lineTo(w, platY);
      ctx.closePath();
      ctx.fill();

      // Distant whimsical trees
      this.trees.forEach(t => {
        const tx = ((t.x - camX * 0.45) % (w + 200)) - 100;
        const finalTx = tx < -100 ? tx + w + 200 : tx;
        ctx.fillStyle = '#7b5439';
        ctx.fillRect(finalTx - 3, platY - t.height, 6, t.height);
        ctx.fillStyle = t.color;
        ctx.beginPath();
        if (t.type === 'pine') {
          ctx.moveTo(finalTx, platY - t.height - 35);
          ctx.lineTo(finalTx - 16, platY - t.height + 5);
          ctx.lineTo(finalTx + 16, platY - t.height + 5);
        } else {
          ctx.arc(finalTx, platY - t.height - 12, 18, 0, Math.PI * 2);
        }
        ctx.fill();
      });

      // 6. MAIN PLATFORM (Speed 1.0)
      // Platform is a rich cartoon brick path with thick emerald grass on top
      this.renderPlatformWithPits(platY, w, h, camX, pits);
    }

    renderPlatformWithPits(platY, w, h, camX, pits) {
      const ctx = this.ctx;
      const tileSize = 48;
      const startX = -(camX % tileSize);

      // Below platform fill (dark soil)
      ctx.fillStyle = '#9b6242';
      ctx.fillRect(0, platY, w, h - platY);

      // Iterate through horizontal columns
      for (let x = startX - tileSize; x < w + tileSize; x += tileSize) {
        const worldX = x + camX;

        // Check if this worldX falls inside any active long pit
        let inPit = false;
        for (const pit of pits) {
          if (worldX >= pit.x && worldX <= pit.x + pit.width) {
            inPit = true;
            break;
          }
        }

        if (inPit) {
          // Draw pit chasm depth glow
          ctx.fillStyle = '#3f4234';
          ctx.fillRect(x, platY, tileSize + 1, h - platY);
          // Dark gradient shadow in pit
          const pitShadow = ctx.createLinearGradient(0, platY, 0, platY + 120);
          pitShadow.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
          pitShadow.addColorStop(1, 'transparent');
          ctx.fillStyle = pitShadow;
          ctx.fillRect(x, platY, tileSize + 1, 120);
          continue;
        }

        // Draw Platform Ground (Brick texture)
        const row = 0;
        ctx.fillStyle = '#a96c48';
        ctx.fillRect(x, platY, tileSize, tileSize);
        ctx.fillStyle = '#b97850';
        ctx.fillRect(x + 2, platY + 2, tileSize - 4, tileSize - 4);

        // Deeper subterranean layers
        ctx.fillStyle = '#85543d';
        ctx.fillRect(x, platY + tileSize, tileSize, h - (platY + tileSize));

        // Lush Emerald Grass Topping
        ctx.fillStyle = '#68b84c';
        ctx.fillRect(x, platY, tileSize + 1, 14);

        // Grass blades / fringe
        ctx.fillStyle = '#8bd45d';
        for (let bx = 0; bx < tileSize; bx += 10) {
          ctx.beginPath();
          ctx.moveTo(x + bx, platY + 14);
          ctx.lineTo(x + bx + 5, platY + 18);
          ctx.lineTo(x + bx + 10, platY + 14);
          ctx.fill();
        }

        // Small decorative flowers randomly
        if (Math.abs(Math.sin(worldX * 0.05)) > 0.85) {
          ctx.fillStyle = '#df6e55';
          ctx.beginPath();
          ctx.arc(x + 18, platY - 4, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffd34e';
          ctx.beginPath();
          ctx.arc(x + 18, platY - 4, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // =========================================================================
  // COIN & PARTICLE SYSTEM
  // =========================================================================
  class ParticleSystem {
    constructor() {
      this.particles = [];
    }

    spawnCoinSparkle(x, y) {
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3.5;
        this.particles.push({
          type: 'sparkle',
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          color: Math.random() > 0.3 ? '#facc15' : '#ffffff',
          size: 2 + Math.random() * 3,
          life: 0.6,
          maxLife: 0.6
        });
      }
    }

    spawnFloatingText(x, y, text, color = '#facc15') {
      this.particles.push({
        type: 'text',
        x, y,
        vx: 0,
        vy: -1.2,
        text,
        color,
        life: 0.9,
        maxLife: 0.9
      });
    }

    spawnImpactStars(x, y) {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        this.particles.push({
          type: 'star',
          x, y,
          vx: Math.cos(angle) * 2.5,
          vy: Math.sin(angle) * 2.5 - 1,
          size: 4 + Math.random() * 3,
          life: 0.7,
          maxLife: 0.7
        });
      }
    }

    spawnDustPuff(x, y) {
      for (let i = 0; i < 5; i++) {
        this.particles.push({
          type: 'dust',
          x, y,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 1.5,
          size: 3 + Math.random() * 4,
          life: 0.4,
          maxLife: 0.4
        });
      }
    }

    update(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        p.x += (p.vx || 0) * 60 * dt;
        p.y += (p.vy || 0) * 60 * dt;

        if (p.type === 'sparkle' || p.type === 'star') {
          p.vy += 0.08; // gravity
        }

        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    render(ctx) {
      ctx.save();
      for (const p of this.particles) {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;

        if (p.type === 'text') {
          ctx.font = 'bold 18px Fredoka, sans-serif';
          ctx.fillStyle = p.color;
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.6)';
          ctx.shadowBlur = 4;
          ctx.fillText(p.text, p.x, p.y);
        } else if (p.type === 'sparkle') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'star') {
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'dust') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + (1 - alpha)), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }

  // =========================================================================
  // OBSTACLES & COIN MANAGER
  // Dynamic generation for Pit, Rock, Banana, Bed, and Coins
  // =========================================================================
  class ObstacleManager {
    constructor() {
      this.obstacles = [];
      this.coins = [];
      this.nextSpawnX = 600;

      // Tracking encounters for the Bed event
      this.encounteredPit = false;
      this.encounteredRock = false;
      this.encounteredBanana = false;
      this.bedSpawned = false;

      // Shop Chaos tracking (adding extra hazards on purchase)
      this.pitChaos = 0;
      this.bananaChaos = 0;
      this.rockChaos = 0;
      this.forcedQueue = [];
      this.pitMultiplier = 1.0;
      this.bananaMultiplier = 1.0;
      this.rockMultiplier = 1.0;
    }

    reset() {
      this.obstacles = [];
      this.coins = [];
      this.nextSpawnX = 600;
      this.encounteredPit = false;
      this.encounteredRock = false;
      this.encounteredBanana = false;
      this.bedSpawned = false;
      this.forcedQueue = [];
    }

    update(cameraX, viewportWidth, platformY) {
      // Spawn new obstacles ahead of the camera
      while (this.nextSpawnX < cameraX + viewportWidth + 800) {
        this.spawnNextObstacle(platformY);
      }

      // Cleanup old obstacles behind camera
      this.obstacles = this.obstacles.filter(o => o.x + (o.width || 100) > cameraX - 200);
      this.coins = this.coins.filter(c => c.x > cameraX - 200);
    }

    spawnNextObstacle(platformY) {
      // Check if Bed should spawn: Player has encountered pit, rock, and banana!
      const readyForBed = this.encounteredPit && this.encounteredRock && this.encounteredBanana && !this.bedSpawned;

      if (readyForBed) {
        this.bedSpawned = true;
        this.obstacles.push({
          type: 'bed',
          x: this.nextSpawnX + 250,
          y: platformY - 48,
          width: 90,
          height: 48,
          resolved: false
        });
        this.nextSpawnX += 850; // generous gap after bed
        return;
      }

      let chosenType = null;
      if (this.forcedQueue.length > 0) {
        chosenType = this.forcedQueue.shift();
      } else {
        const pool = [];
        for (let i = 0; i < Math.round(3 * this.pitMultiplier); i++) pool.push('pit');
        for (let i = 0; i < Math.round(3 * this.rockMultiplier); i++) pool.push('rock');
        for (let i = 0; i < Math.round(3 * this.bananaMultiplier); i++) pool.push('banana');
        chosenType = pool[Math.floor(Math.random() * pool.length)];
      }

      if (chosenType === 'pit') {
        const pitWidth = 160 + Math.random() * 35; // 160px - 195px real visible obstacle
        this.obstacles.push({
          type: 'pit',
          x: this.nextSpawnX,
          y: platformY,
          width: pitWidth,
          height: 300,
          resolved: false
        });
        this.nextSpawnX += pitWidth + 420 + Math.random() * 120;
      } else if (chosenType === 'rock') {
        // Rock: 50px wide x 32px high, bottom sits exactly on running platform
        this.obstacles.push({
          type: 'rock',
          x: this.nextSpawnX,
          y: platformY - 32,
          width: 50,
          height: 32,
          resolved: false
        });
        this.nextSpawnX += 420 + Math.random() * 120;
      } else if (chosenType === 'banana') {
        // Banana: 42px wide x 22px high, bottom sits exactly on running platform
        this.obstacles.push({
          type: 'banana',
          x: this.nextSpawnX,
          y: platformY - 22,
          width: 42,
          height: 22,
          resolved: false
        });
        this.nextSpawnX += 390 + Math.random() * 120;
      }

      // Scatter floating coins in the safe region ahead
      this.spawnCoinsInRegion(this.nextSpawnX - 250, platformY);
    }

    spawnCoinsInRegion(startX, platformY) {
      const count = 1 + Math.floor(Math.random() * 3);
      const elevated = Math.random() > 0.4;
      for (let i = 0; i < count; i++) {
        const coinX = startX + i * 45;
        // Avoid placing coins inside pit chasms
        const overPit = this.obstacles.some(o => o.type === 'pit' && coinX >= o.x - 20 && coinX <= o.x + o.width + 20);
        if (!overPit) {
          this.coins.push({
            x: coinX,
            y: elevated ? platformY - 80 - Math.sin((i / count) * Math.PI) * 40 : platformY - 32,
            collected: false,
            animOffset: Math.random() * Math.PI * 2
          });
        }
      }
    }

    render(ctx, cameraX, platformY, time) {
      // 1. Render Obstacles
      for (const obs of this.obstacles) {
        const screenX = obs.x - cameraX;

        if (obs.type === 'rock') {
          this.renderRock(ctx, screenX, obs.y);
        } else if (obs.type === 'banana') {
          this.renderBanana(ctx, screenX, obs.y);
        } else if (obs.type === 'bed') {
          this.renderBed(ctx, screenX, obs.y, time);
        }
        // Pit chasms are handled by the World platform renderer!
      }

      // 2. Render Coins
      for (const coin of this.coins) {
        if (coin.collected) continue;
        const screenX = coin.x - cameraX;
        const floatY = coin.y + Math.sin(time * 6 + coin.animOffset) * 4;
        this.renderCoin(ctx, screenX, floatY, time);
      }
    }

    renderRock(ctx, x, y) {
      ctx.save();
      // Rock: width 50, height 32. Bottom sits on platform.
      const rx = x + 25;
      const ry = y + 18;

      // Base shadow on platform
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(rx, y + 32, 24, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rock body
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(rx, ry, 24, 14, -0.05, 0, Math.PI * 2);
      ctx.fill();

      // Rock lighter face
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(rx - 3, ry - 3, 19, 10, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Highlight crest
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.ellipse(rx - 6, ry - 6, 11, 4.5, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Crack lines
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(rx + 5, ry - 5);
      ctx.lineTo(rx + 11, ry + 2);
      ctx.lineTo(rx + 8, ry + 8);
      ctx.stroke();

      // Lush green moss tufts on top
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(rx - 8, y + 6, 5, 0, Math.PI * 2);
      ctx.arc(rx, y + 8, 4.5, 0, Math.PI * 2);
      ctx.arc(rx + 9, y + 10, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    renderBanana(ctx, x, y) {
      ctx.save();
      // Banana peel: width 42, height 22. Bottom sits on platform.
      const bx = x + 21;
      const by = y + 14;

      // Soft shadow on platform
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(bx, y + 22, 20, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Central arched stalk
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(x + 5, y + 20);
      ctx.quadraticCurveTo(x + 21, y + 1, x + 37, y + 20);
      ctx.quadraticCurveTo(x + 21, y + 11, x + 5, y + 20);
      ctx.fill();

      // Splayed skin flaps
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(x + 2, y + 21);
      ctx.quadraticCurveTo(x + 11, y + 10, x + 21, y + 18);
      ctx.lineTo(x + 4, y + 22);
      ctx.moveTo(x + 40, y + 21);
      ctx.quadraticCurveTo(x + 31, y + 10, x + 21, y + 18);
      ctx.lineTo(x + 38, y + 22);
      ctx.fill();

      // Brown stem tip
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(x + 21, y + 3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    renderBed(ctx, x, y, time) {
      ctx.save();
      // Four poster / cute cartoon wooden bed
      // Bed wooden frame & headboard
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x, y - 22, 10, 50); // Headboard post
      ctx.fillRect(x + 80, y, 8, 28); // Footboard post
      ctx.fillRect(x, y + 18, 88, 10); // Frame

      // Mattress
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x + 8, y + 8, 74, 12);

      // Fluffy Pillow
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x + 10, y - 2, 22, 14, 4);
      ctx.fill();

      // Cozy patterned blanket
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.roundRect(x + 28, y + 2, 54, 18, [6, 2, 2, 2]);
      ctx.fill();

      // Blanket stripes
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(x + 38, y + 2, 8, 18);
      ctx.fillRect(x + 58, y + 2, 8, 18);

      // Cute Sleep invitation tag floating over bed
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      const bob = Math.sin(time * 4) * 3;
      ctx.fillText('🛏️ Nap Here or Jump!', x + 45, y - 30 + bob);

      ctx.restore();
    }

    renderCoin(ctx, x, y, time) {
      ctx.save();
      // 3D Spinning coin effect
      const spinScale = Math.cos(time * 8);
      ctx.translate(x, y);
      ctx.scale(Math.abs(spinScale), 1);

      // Coin outer rim
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();

      // Coin inner face
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      // Coin star emblem
      ctx.fillStyle = '#ca8a04';
      ctx.font = 'bold 11px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', 0, 0);

      ctx.restore();
    }
  }

  // =========================================================================
  // MAIN GAME ENGINE & CONTROLLER
  // =========================================================================
  class GameEngine {
    constructor() {
      // DOM Elements
      this.appContainer = document.getElementById('appContainer');
      this.homeScreen = document.getElementById('homeScreen');
      this.gameScreen = document.getElementById('gameScreen');
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');

      // Home Previews
      this.previewBoyCanvas = document.getElementById('previewBoyCanvas');
      this.previewGirlCanvas = document.getElementById('previewGirlCanvas');
      this.cardBoy = document.getElementById('cardBoy');
      this.cardGirl = document.getElementById('cardGirl');
      this.btnStart = document.getElementById('btnStart');

      // HUD Elements
      this.hudCoinCount = document.getElementById('hudCoinCount');
      this.hudCoinBadge = document.getElementById('hudCoinBadge');
      this.hudPlayTime = document.getElementById('hudPlayTime');
      this.btnOpenShop = document.getElementById('btnOpenShop');
      this.btnToggleSound = document.getElementById('btnToggleSound');
      this.soundIcon = document.getElementById('soundIcon');
      this.btnCloseGame = document.getElementById('btnCloseGame');
      this.btnMobileJump = document.getElementById('btnMobileJump');

      // Speech Bubble & Modals
      this.speechBubble = document.getElementById('characterSpeechBubble');
      this.bubbleContent = document.getElementById('bubbleContent');
      this.bedSleepOverlay = document.getElementById('bedSleepOverlay');
      this.sleepTimerDisplay = document.getElementById('sleepTimerDisplay');
      this.sleepTitle = document.getElementById('sleepTitle');
      this.btnWakeUp = document.getElementById('btnWakeUp');
      this.bedChoicePrompt = document.getElementById('bedChoicePrompt');
      this.btnBedSleep = document.getElementById('btnBedSleep');
      this.btnBedJump = document.getElementById('btnBedJump');
      this.shopModal = document.getElementById('shopModal');
      this.shopWalletCoins = document.getElementById('shopWalletCoins');
      this.btnCloseShop = document.getElementById('btnCloseShop');
      this.pitChaosTag = document.getElementById('pitChaosTag');
      this.bananaChaosTag = document.getElementById('bananaChaosTag');
      this.rockChaosTag = document.getElementById('rockChaosTag');
      this.exitModal = document.getElementById('exitModal');
      this.exitTimeWasted = document.getElementById('exitTimeWasted');
      this.btnKeepWasting = document.getElementById('btnKeepWasting');
      this.btnConfirmExit = document.getElementById('btnConfirmExit');
      this.toastContainer = document.getElementById('toastContainer');

      // Stats Elements in Exit Modal
      this.statCoins = document.getElementById('statCoins');
      this.statPits = document.getElementById('statPits');
      this.statSlips = document.getElementById('statSlips');
      this.statBumps = document.getElementById('statBumps');

      // Systems
      this.sound = new SoundEngine();
      this.world = new World(this.canvas);
      this.obstacles = new ObstacleManager();
      this.particles = new ParticleSystem();

      // State Variables
      this.selectedCharacter = StorageManager.getCharacter();
      this.coins = StorageManager.getCoins();
      this.sessionPlayTime = 0; // in seconds
      this.gameState = 'HOME'; // 'HOME', 'PLAYING', 'SLEEPING', 'SHOP', 'EXIT_MODAL'
      this.lastTime = performance.now();

      // Character Dynamics
      this.charX = 180;
      this.charY = 0;
      this.charVY = 0;
      this.charScale = 1.35;
      this.baseSpeed = 220; // px/sec forward
      this.currentSpeed = this.baseSpeed;
      this.gravity = 1400; // px/sec^2
      this.jumpForce = -560; // initial jump impulse
      this.isGrounded = true;

      // Character Animation & State Machine
      this.charAnimState = 'WALK';
      this.charAnimTimer = 0;
      this.stateTimer = 0; // countdown for timed states (injured 5s, stare 2s, etc.)

      // Alternating Pit Failure Tracker
      this.pitFailureCount = 0; // odd = flying out, even = climbing out
      this.activePit = null;

      // Bed event choice state
      this.activeBed = null;
      this.bedPromptActive = false;

      // Stats counters for funny exit modal
      this.stats = {
        coinsCollected: 0,
        pitsFallen: 0,
        bananaSlips: 0,
        rocksBumped: 0
      };

      // Useless Player Action Detectors
      this.jumpTimes = []; // timestamps of recent jumps
      this.pokeCount = 0;
      this.lastPokeTime = 0;
      this.isStaringAtPlayer = false;

      // Sleep Timer (2 mins = 120 seconds)
      this.sleepSecondsRemaining = 120;
      this.sleepInterval = null;

      // Touch / pointer interaction tracking
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.touchStartTime = 0;

      // Initialize
      this.initEventListeners();
      this.initCharacterSelection();
      this.updateHud();
      this.updateSoundButtonUI();
      this.onResize();

      // Start Master Animation Loop
      requestAnimationFrame(time => this.gameLoop(time));
    }

    onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.world.resize(w, h);
      if (this.isGrounded && this.charAnimState !== 'PIT_FALL' && this.charAnimState !== 'PIT_FLY_RECOVERY' && this.charAnimState !== 'PIT_CLIMB_RECOVERY') {
        this.charY = this.world.platformY;
      }
    }

    initCharacterSelection() {
      if (this.selectedCharacter === 'girl') {
        this.cardGirl.classList.add('selected');
        this.cardBoy.classList.remove('selected');
      } else {
        this.cardBoy.classList.add('selected');
        this.cardGirl.classList.remove('selected');
      }

      this.cardBoy.addEventListener('click', () => {
        this.sound.init();
        this.sound.playClick();
        this.selectedCharacter = 'boy';
        StorageManager.setCharacter('boy');
        this.cardBoy.classList.add('selected');
        this.cardGirl.classList.remove('selected');
      });

      this.cardGirl.addEventListener('click', () => {
        this.sound.init();
        this.sound.playClick();
        this.selectedCharacter = 'girl';
        StorageManager.setCharacter('girl');
        this.cardGirl.classList.add('selected');
        this.cardBoy.classList.remove('selected');
      });
    }

    initEventListeners() {
      window.addEventListener('resize', () => this.onResize());

      // Start Button
      this.btnStart.addEventListener('click', () => {
        this.sound.init();
        this.sound.playClick();
        this.startGame();
      });

      // Jump via Keyboard: Space, ArrowUp, KeyW
      window.addEventListener('keydown', e => {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          this.handlePlayerJumpAction();
        }
      });

      // Mobile Jump Button
      this.btnMobileJump.addEventListener('touchstart', e => {
        e.preventDefault();
        this.handlePlayerJumpAction();
      }, { passive: false });

      this.btnMobileJump.addEventListener('click', e => {
        e.preventDefault();
        this.handlePlayerJumpAction();
      });

      // Pointer events for Canvas: tap to jump, tap character to poke, upward swipe to jump
      this.canvas.addEventListener('pointerdown', e => {
        if (this.gameState !== 'PLAYING') return;
        this.touchStartX = e.clientX;
        this.touchStartY = e.clientY;
        this.touchStartTime = performance.now();
      });

      this.canvas.addEventListener('pointerup', e => {
        if (this.gameState !== 'PLAYING') return;
        const dx = e.clientX - this.touchStartX;
        const dy = e.clientY - this.touchStartY;
        const dist = Math.hypot(dx, dy);

        // 1. Check for upward swipe -> Jump!
        if (dy < -35 && Math.abs(dy) > Math.abs(dx) * 0.7) {
          this.handlePlayerJumpAction();
          return;
        }

        // 2. Ignore horizontal drags (pure auto-runner)
        if (dist >= 25) {
          return;
        }

        // 3. Short tap / click: check if clicked on character (Poke) or general jump
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const charBox = {
          x: this.charX - 32,
          y: this.charY - 75,
          w: 64,
          h: 75
        };

        if (clickX >= charBox.x && clickX <= charBox.x + charBox.w &&
            clickY >= charBox.y && clickY <= charBox.y + charBox.h) {
          this.handleCharacterPoke();
        } else {
          this.handlePlayerJumpAction();
        }
      });

      // Bed Choice Prompt Buttons
      if (this.btnBedSleep) {
        this.btnBedSleep.addEventListener('click', () => {
          this.sound.playClick();
          this.hideBedChoice();
          if (this.activeBed) this.activeBed.resolved = true;
          this.startSleeping();
        });
      }

      if (this.btnBedJump) {
        this.btnBedJump.addEventListener('click', () => {
          this.sound.playClick();
          this.hideBedChoice();
          if (this.activeBed) this.activeBed.resolved = true;
          this.handlePlayerJumpAction();
        });
      }

      // Sound Toggle
      this.btnToggleSound.addEventListener('click', () => {
        this.sound.init();
        const isMuted = this.sound.toggleMute();
        this.updateSoundButtonUI();
        this.showToast(isMuted ? '🔇 Sound Muted' : '🔊 Sound Unmuted');
      });

      // Useless Shop
      this.btnOpenShop.addEventListener('click', () => {
        this.sound.init();
        this.sound.playClick();
        this.openShop();
      });
      this.btnCloseShop.addEventListener('click', () => {
        this.sound.playClick();
        this.closeShop();
      });

      // Shop Buy Buttons
      const buyBtns = document.querySelectorAll('.btn-buy');
      buyBtns.forEach(btn => {
        btn.addEventListener('click', e => {
          const item = e.target.getAttribute('data-item');
          const price = parseInt(e.target.getAttribute('data-price'), 10);
          this.buyShopItem(item, price);
        });
      });

      // Close / Exit Game
      this.btnCloseGame.addEventListener('click', () => {
        this.sound.init();
        this.sound.playClick();
        this.openExitModal();
      });

      this.btnKeepWasting.addEventListener('click', () => {
        this.sound.playClick();
        this.closeExitModal();
        this.showToast('Wise choice. Nothing awaits!');
      });

      this.btnConfirmExit.addEventListener('click', () => {
        this.sound.playClick();
        this.returnToHome();
      });

      // Wake Up Early Button in Sleep Modal
      this.btnWakeUp.addEventListener('click', () => {
        this.sound.playClick();
        this.wakeUpFromSleep();
      });
    }

    updateSoundButtonUI() {
      if (this.sound.muted) {
        this.soundIcon.textContent = '🔇';
      } else {
        this.soundIcon.textContent = '🔊';
      }
    }

    startGame() {
      this.gameState = 'PLAYING';
      this.sessionPlayTime = 0;
      this.world.cameraX = 0;
      this.world.time = 0;
      this.charX = 180;
      this.charY = this.world.platformY;
      this.charVY = 0;
      this.isGrounded = true;
      this.charAnimState = 'WALK';
      this.charAnimTimer = 0;
      this.isStaringAtPlayer = false;
      this.stateTimer = 0;
      this.currentSpeed = this.baseSpeed;
      this.lastTime = performance.now();
      this.jumpTimes = [];
      this.pokeCount = 0;
      this.activePit = null;
      this.activeBed = null;
      this.bedPromptActive = false;
      this.hideSpeechBubble();
      this.hideBedChoice();
      if (this.sleepInterval) clearInterval(this.sleepInterval);
      this.bedSleepOverlay.classList.add('hidden');
      this.particles.particles = [];
      this.obstacles.reset();

      // Screen Transition
      this.homeScreen.classList.remove('active');
      this.gameScreen.classList.add('active');

      this.showToast('🕹️ SPACE / ↑ / SWIPE UP / JUMP');
    }

    returnToHome() {
      this.closeExitModal();
      this.gameState = 'HOME';
      this.hideSpeechBubble();
      this.hideBedChoice();
      if (this.sleepInterval) clearInterval(this.sleepInterval);
      this.bedSleepOverlay.classList.add('hidden');
      this.isStaringAtPlayer = false;
      this.stateTimer = 0;
      this.currentSpeed = this.baseSpeed;
      this.gameScreen.classList.remove('active');
      this.homeScreen.classList.add('active');
    }

    // =======================================================================
    // PLAYER JUMP ACTION & USELESS ACTION DETECTOR
    // =======================================================================
    handlePlayerJumpAction() {
      if (this.gameState !== 'PLAYING') return;

      // Cannot jump while recovering from pit or sleeping
      if (this.charAnimState === 'PIT_FALL' ||
          this.charAnimState === 'PIT_FLY_RECOVERY' || this.charAnimState === 'PIT_CLIMB_RECOVERY' ||
          this.charAnimState === 'SLEEP') {
        return;
      }

      // Check if there is an obstacle within safety range ahead or behind (within 600px ahead, 100px behind)
      const obstacleAhead = this.obstacles.obstacles.some(o => {
        if (o.resolved) return false;
        const dist = o.x - (this.world.cameraX + this.charX);
        return dist > -100 && dist < 600;
      });

      // Track jump timestamps to detect spamming ONLY when there are clearly NO obstacles
      const now = performance.now();
      this.jumpTimes.push(now);
      this.jumpTimes = this.jumpTimes.filter(t => now - t < 3500);

      // ONLY trigger useless reaction if NO obstacle is nearby AND player spammed 5+ times in 3.5 seconds
      if (!obstacleAhead && this.jumpTimes.length >= 5) {
        this.triggerUselessActionStare();
        this.jumpTimes = [];
        return;
      }

      // If currently staring from useless action, jump immediately breaks the stare and returns control
      if (this.isStaringAtPlayer) {
        this.isStaringAtPlayer = false;
        this.hideSpeechBubble();
      }

      // Perform actual jump if grounded
      if (this.isGrounded) {
        this.isGrounded = false;
        this.charVY = this.jumpForce;
        this.charAnimState = 'JUMP';
        this.sound.playJump();
        this.particles.spawnDustPuff(this.charX, this.charY);
      }
    }

    triggerUselessActionStare() {
      this.isStaringAtPlayer = true;
      this.charAnimState = 'STARE_PLAYER';
      this.stateTimer = 2.0; // Stare for ~2 seconds

      // No extra dialogue here. The character simply gives the player a silent stare.
      this.hideSpeechBubble();
    }

    // =======================================================================
    // TOUCH / POKING IRRITATION REACTION
    // =======================================================================
    handleCharacterPoke() {
      const now = performance.now();
      if (now - this.lastPokeTime < 2500) {
        this.pokeCount++;
      } else {
        this.pokeCount = 1;
      }
      this.lastPokeTime = now;

      if (this.pokeCount >= 2) {
        const reaction = "Don't touch me!";
        this.showSpeechBubble(reaction);
        this.sound.speak(reaction, this.selectedCharacter);
        this.particles.spawnImpactStars(this.charX, this.charY - 50);
        this.pokeCount = 0;
      } else {
        this.showSpeechBubble("Hey!");
        this.sound.playClick();
      }
    }

    showSpeechBubble(text) {
      this.bubbleContent.textContent = text;
      this.speechBubble.classList.remove('hidden');
      this.updateSpeechBubblePosition();

      clearTimeout(this.bubbleTimeout);
      this.bubbleTimeout = setTimeout(() => {
        this.hideSpeechBubble();
      }, 2600);
    }

    hideSpeechBubble() {
      this.speechBubble.classList.add('hidden');
    }

    updateSpeechBubblePosition() {
      if (this.speechBubble.classList.contains('hidden')) return;
      this.speechBubble.style.left = `${this.charX}px`;
      this.speechBubble.style.top = `${this.charY - 70}px`;
    }

    // =======================================================================
    // OBSTACLE COLLISION HANDLERS & FUNNY RECOVERIES
    // =======================================================================
    checkCollisions(dt) {
      const charWorldX = this.world.cameraX + this.charX;
      const charBottom = this.charY;

      // 1. COIN COLLECTION
      for (const coin of this.obstacles.coins) {
        if (coin.collected) continue;
        const dx = coin.x - charWorldX;
        const dy = coin.y - (this.charY - 26);
        const dist = Math.hypot(dx, dy);

        if (dist < 32) {
          coin.collected = true;
          this.coins++;
          this.stats.coinsCollected++;
          StorageManager.setCoins(this.coins);
          this.updateHud();
          this.sound.playCoin();
          this.particles.spawnCoinSparkle(this.charX, this.charY - 30);
          this.particles.spawnFloatingText(this.charX, this.charY - 45, '+1');
        }
      }

      // 2. OBSTACLE INTERACTIONS
      for (const obs of this.obstacles.obstacles) {
        // Pit Check: Falling into a pit
        if (obs.type === 'pit') {
          const pitStart = obs.x;
          const pitEnd = obs.x + obs.width;

          // Mark encountered so bed can spawn (even when jumping over)
          if (charWorldX >= pitStart - 20 && charWorldX <= pitEnd + 20) {
            this.obstacles.encounteredPit = true;
          }

          // Only fall if character is at or near platform level (not mid-jump high above)
          if (charWorldX >= pitStart + 20 && charWorldX <= pitEnd - 20) {
            const jumpedOver = this.charY < this.world.platformY - 40; // character is high enough
            if (!jumpedOver &&
                charBottom >= this.world.platformY - 8 &&
                this.charAnimState !== 'PIT_FALL' &&
                this.charAnimState !== 'PIT_FLY_RECOVERY' &&
                this.charAnimState !== 'PIT_CLIMB_RECOVERY') {
              this.handlePitFall(obs);
            }
          }
          continue;
        }

        // Bed Approach Check (Player MUST choose: Sleep vs Jump Over)
        if (obs.type === 'bed') {
          if (!obs.resolved && this.charAnimState !== 'SLEEP') {
            // Show prompt when bed is 250px ahead (not 300 — closer so player can react)
            if (charWorldX >= obs.x - 250 && charWorldX <= obs.x + obs.width + 50) {
              this.showBedChoice(obs);
            }
            // If player jumped over the bed while airborne and above the bed
            if (!this.isGrounded && this.charY < obs.y - 5 && charWorldX > obs.x + 20 && charWorldX < obs.x + obs.width + 80) {
              obs.resolved = true;
              this.hideBedChoice();
              this.showToast('nalla orakkam varunnu!');
            }
            // If player ran past the bed without choosing sleep (dismiss without sleeping)
            if (charWorldX > obs.x + obs.width + 70) {
              obs.resolved = true;
              this.hideBedChoice();
            }
          }
          continue;
        }

        if (obs.resolved) continue;

        // Rock Collision: width 50, height 32, y = platformY - 32
        if (obs.type === 'rock') {
          this.obstacles.encounteredRock = true;
          const charLeft = charWorldX - 14;
          const charRight = charWorldX + 14;
          // Only collide if character is close to ground level (not jumping over)
          // obs.y = platformY - 32, so character must be below platformY - 32 + 8 = platformY - 24
          const onGround = charBottom >= obs.y + 8; // feet are at or below top of rock
          if (charRight >= obs.x + 6 && charLeft <= obs.x + 44 && onGround) {
            this.handleRockHit(obs);
          }
          continue;
        }

        // Banana Peel Collision: width 42, height 22, y = platformY - 22
        if (obs.type === 'banana') {
          this.obstacles.encounteredBanana = true;
          const charLeft = charWorldX - 12;
          const charRight = charWorldX + 12;
          // Only slip if character's feet are near/at ground level (not jumping clearly over)
          // obs.y = platformY - 22; character must be at platformY - 22 + threshold
          const footNearBanana = charBottom >= obs.y + 10; // character touching banana level
          if (charRight >= obs.x + 4 && charLeft <= obs.x + 38 && footNearBanana) {
            this.handleBananaSlip(obs);
          }
          continue;
        }
      }
    }

    showBedChoice(bed) {
      if (this.bedPromptActive || this.gameState !== 'PLAYING') return;
      this.bedPromptActive = true;
      this.activeBed = bed;
      if (this.bedChoicePrompt) {
        this.bedChoicePrompt.classList.remove('hidden');
      }
    }

    hideBedChoice() {
      this.bedPromptActive = false;
      this.activeBed = null;
      if (this.bedChoicePrompt) {
        this.bedChoicePrompt.classList.add('hidden');
      }
    }

    // Long Pit Failure: Reliable state machine, alternating fly vs climb
    handlePitFall(pit) {
      if (pit.resolved) return;
      pit.resolved = true;
      this.activePit = pit;
      this.pitFailureCount++;
      this.stats.pitsFallen++;
      this.charAnimState = 'PIT_FALL';
      this.sound.playPitFall();

      // Drop character below platform
      this.charVY = 200; // initial downward velocity; gravity will accelerate it
      this.isGrounded = false;
    }

    // Small Rock Impact: 5-second limping walk with reduced speed
    handleRockHit(rock) {
      rock.resolved = true;
      this.stats.rocksBumped++;
      this.sound.playRockBump();
      this.particles.spawnImpactStars(this.charX, this.charY - 20);

      // Trigger 5-second injured limp
      this.charAnimState = 'INJURED_WALK';
      this.stateTimer = 5.0; // exactly ~5 seconds
      this.currentSpeed = this.baseSpeed * 0.42; // speed decreases significantly

     
    }

    // Banana Peel Impact: Slip, fall flat on back, rub back, stand up
    handleBananaSlip(banana) {
      banana.resolved = true;
      this.stats.bananaSlips++;
      this.sound.playBananaSlip();
      this.particles.spawnImpactStars(this.charX, this.charY - 10);

      // 1. Slip & airborne flip
      this.charAnimState = 'SLIP';
      this.charVY = -180;
      this.currentSpeed = this.baseSpeed * 0.2;

      // 2. Land on back and rub back
      setTimeout(() => {
        this.charAnimState = 'RUB_BACK';
        this.currentSpeed = 0;
        this.showToast('ente nadu poyeee..');
      }, 600);

      setTimeout(() => {
        this.charAnimState = 'WALK';
        this.currentSpeed = this.baseSpeed;
        this.charVY = 0;
        this.isGrounded = true;
        this.sound.playJump();
      }, 2200);
    }

    startSleeping() {
      this.gameState = 'SLEEPING';
      this.charAnimState = 'SLEEP';
      this.currentSpeed = 0;
      this.sleepSecondsRemaining = 120; // 2 minutes countdown
      this.sound.playSnore();

      const charName = this.selectedCharacter === 'girl' ? 'Moly' : 'Booban';
      this.sleepTitle.textContent = `${charName} is sleeping...`;
      this.bedSleepOverlay.classList.remove('hidden');

      this.updateSleepTimerDisplay();

      if (this.sleepInterval) clearInterval(this.sleepInterval);
      this.sleepInterval = setInterval(() => {
        this.sleepSecondsRemaining--;
        this.updateSleepTimerDisplay();

        if (this.sleepSecondsRemaining % 8 === 0) {
          this.sound.playSnore();
        }

        if (this.sleepSecondsRemaining <= 0) {
          this.wakeUpFromSleep();
        }
      }, 1000);
    }

    updateSleepTimerDisplay() {
      const m = Math.floor(this.sleepSecondsRemaining / 60);
      const s = this.sleepSecondsRemaining % 60;
      this.sleepTimerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    wakeUpFromSleep() {
      if (this.sleepInterval) clearInterval(this.sleepInterval);
      this.bedSleepOverlay.classList.add('hidden');
      this.gameState = 'PLAYING';
      this.charAnimState = 'WALK';
      this.currentSpeed = this.baseSpeed;
      this.sound.playJump();
      this.showToast('☀️ Yawn... Refreshed and continuing the endless walk!');
    }

    // =======================================================================
    // pettikada (Ironic purchases)
    // =======================================================================
    openShop() {
      this.gameState = 'SHOP';
      this.updateShopUI();
      this.shopModal.classList.remove('hidden');
    }

    closeShop() {
      this.shopModal.classList.add('hidden');
      this.gameState = 'PLAYING';
    }

    updateShopUI() {
      if (this.shopWalletCoins) {
        this.shopWalletCoins.textContent = `${this.coins} 🪙`;
      }
      if (this.pitChaosTag) {
        this.pitChaosTag.textContent = `Pit Chaos: +${this.obstacles.pitChaos}`;
      }
      if (this.bananaChaosTag) {
        this.bananaChaosTag.textContent = `Banana Chaos: +${this.obstacles.bananaChaos}`;
      }
      if (this.rockChaosTag) {
        this.rockChaosTag.textContent = `Rock Chaos: +${this.obstacles.rockChaos}`;
      }
    }

    buyShopItem(item, price) {
      if (this.coins < price) {
        this.showToast(`❌ Need ${price} coins! (You only have ${this.coins})`);
        return;
      }

      this.coins -= price;
      StorageManager.setCoins(this.coins);
      this.updateHud();
      this.updateShopUI();
      this.sound.playCoin();

      switch (item) {
        case 'remove_pit':
          this.obstacles.pitChaos += 2;
          this.obstacles.forcedQueue.push('pit', 'pit');
          this.updateShopUI();
          this.showToast('🕳️ PIT REMOVED!\nUnfortunately, 2 more appeared.');
          break;

        case 'remove_banana':
          this.obstacles.bananaChaos += 3;
          this.obstacles.forcedQueue.push('banana', 'banana', 'banana');
          this.updateShopUI();
          this.showToast('🍌 BANANA PEEL REMOVED!\nUnfortunately, 3 more appeared.');
          break;

        case 'remove_rock':
          this.obstacles.rockChaos += 3;
          this.obstacles.forcedQueue.push('rock', 'rock', 'rock');
          this.updateShopUI();
          this.showToast('🪨 ROCK REMOVED!\nUnfortunately, 3 more appeared.');
          break;

        case 'buy_nothing':
          this.showToast('💨 Thank you. You received 0 grams of pure, unadulterated vacuum.');
          break;

        case 'speed_down':
          this.baseSpeed = Math.max(120, this.baseSpeed * 0.9);
          this.currentSpeed = this.baseSpeed;
          this.showToast('🦥 Speed decreased by 10%. Enjoy reaching nowhere even slower.');
          break;
      }
    }

    // =======================================================================
    // EXIT CONFIRMATION MODAL & EXISTENTIAL STATS
    // =======================================================================
    openExitModal() {
      this.gameState = 'EXIT_MODAL';
      const m = Math.floor(this.sessionPlayTime / 60);
      const s = Math.floor(this.sessionPlayTime % 60);
      const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

      this.exitTimeWasted.textContent = timeStr;
      this.statCoins.textContent = this.stats.coinsCollected;
      this.statPits.textContent = this.stats.pitsFallen;
      this.statSlips.textContent = this.stats.bananaSlips;
      this.statBumps.textContent = this.stats.rocksBumped;

      this.exitModal.classList.remove('hidden');
    }

    closeExitModal() {
      this.exitModal.classList.add('hidden');
      this.gameState = 'PLAYING';
    }

    // =======================================================================
    // HUD & TOAST HELPERS
    // =======================================================================
    updateHud() {
      this.hudCoinCount.textContent = this.coins;
      this.hudCoinBadge.classList.remove('bump');
      void this.hudCoinBadge.offsetWidth;
      this.hudCoinBadge.classList.add('bump');

      const m = Math.floor(this.sessionPlayTime / 60);
      const s = Math.floor(this.sessionPlayTime % 60);
      this.hudPlayTime.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      this.toastContainer.appendChild(toast);
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 4200);
    }

    // =======================================================================
    // MASTER ANIMATION & SIMULATION LOOP
    // =======================================================================
    gameLoop(timestamp) {
      const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
      this.lastTime = timestamp;

      // Update previews on home screen if active
      if (this.gameState === 'HOME') {
        this.renderHomePreviews(timestamp / 1000);
      }

      if (this.gameState === 'PLAYING') {
        // Track play time
        this.sessionPlayTime += dt;
        const m = Math.floor(this.sessionPlayTime / 60);
        const s = Math.floor(this.sessionPlayTime % 60);
        this.hudPlayTime.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        // Character animation time
        this.charAnimTimer += dt;

        // Timed states countdown (injured walk, stare down)
        if (this.stateTimer > 0) {
          this.stateTimer -= dt;
          if (this.stateTimer <= 0) {
            if (this.charAnimState === 'INJURED_WALK') {
              this.charAnimState = 'WALK';
              this.currentSpeed = this.baseSpeed;
            } else if (this.charAnimState === 'STARE_PLAYER') {
              this.isStaringAtPlayer = false;
              this.charAnimState = 'WALK';
              this.hideSpeechBubble();
            }
          }
        }

        // Horizontal movement (world scrolls forward unless staring or down)
        let forwardSpeed = this.currentSpeed;
        if (this.isStaringAtPlayer) {
          forwardSpeed = 0;
        } else if (this.charAnimState === 'PIT_FALL') {
          forwardSpeed = this.baseSpeed * 0.4;
        } else if (this.charAnimState === 'PIT_FLY_RECOVERY' || this.charAnimState === 'PIT_CLIMB_RECOVERY') {
          forwardSpeed = this.baseSpeed * 1.1; // safely carries forward past the chasm
        }

        this.world.update(dt, forwardSpeed);
        this.obstacles.update(this.world.cameraX, this.canvas.width, this.world.platformY);

        // Physics: Vertical motion
        if (!this.isGrounded) {
          this.charY += this.charVY * dt;

          if (this.charAnimState === 'PIT_FALL') {
            // Apply gravity while falling into pit
            this.charVY += this.gravity * dt;
            // Clamp falling depth at platformY + 80 and initiate recovery
            if (this.charY >= this.world.platformY + 80) {
              this.charY = this.world.platformY + 80;
              this.charVY = -280; // strong upward ascension velocity for recovery

              // Ensure character is horizontally past the pit edge before landing
              if (this.activePit) {
                const minSafeX = this.activePit.x + this.activePit.width + 40;
                if ((this.world.cameraX + this.charX) < minSafeX) {
                  this.world.cameraX = minSafeX - this.charX;
                }
              }

              if (this.pitFailureCount % 2 === 1) {
                this.charAnimState = 'PIT_FLY_RECOVERY';
                this.sound.playAngelFly();
                this.showToast('nooki kalikanda mandaa');
                
              } else {
                this.charAnimState = 'PIT_CLIMB_RECOVERY';
                this.sound.playClimb();
                this.showToast(' havuu rakshapetuu!');
              }
            }
          } else if (this.charAnimState === 'PIT_FLY_RECOVERY' || this.charAnimState === 'PIT_CLIMB_RECOVERY') {
            // Once reached platform height, land safely!
            if (this.charY <= this.world.platformY) {
              this.charY = this.world.platformY;
              this.charVY = 0;
              this.isGrounded = true;
              this.charAnimState = 'WALK';
              this.activePit = null;
              this.currentSpeed = this.baseSpeed;
              this.particles.spawnDustPuff(this.charX, this.charY);
            }
          } else {
            // Normal jump gravity
            this.charVY += this.gravity * dt;

            // Landing on the platform
            if (this.charY >= this.world.platformY) {
              this.charY = this.world.platformY;
              this.charVY = 0;
              this.isGrounded = true;
              if (this.charAnimState === 'JUMP' || this.charAnimState === 'FALL') {
                this.charAnimState = 'WALK';
                this.particles.spawnDustPuff(this.charX, this.charY);
              }
            } else if (this.charVY > 50 && this.charAnimState === 'JUMP') {
              this.charAnimState = 'FALL';
            }
          }
        }

        // Particle system & speech bubble anchoring
        this.particles.update(dt);
        this.updateSpeechBubblePosition();

        // Collisions
        this.checkCollisions(dt);
      }

      // Render Game World
      if (this.gameState !== 'HOME') {
        const activePits = this.obstacles.obstacles.filter(o => o.type === 'pit');
        this.world.render(activePits);
        this.obstacles.render(this.ctx, this.world.cameraX, this.world.platformY, timestamp / 1000);

        // Render Character
        CharacterRenderer.draw(
          this.ctx,
          this.selectedCharacter,
          this.charAnimState,
          this.charAnimTimer,
          this.charX,
          this.charY,
          this.charScale
        );

        this.particles.render(this.ctx);
      }

      requestAnimationFrame(time => this.gameLoop(time));
    }

    // Previews on Home Screen cards
    renderHomePreviews(t) {
      if (this.previewBoyCanvas) {
        const ctxBoy = this.previewBoyCanvas.getContext('2d');
        ctxBoy.clearRect(0, 0, 130, 150);
        CharacterRenderer.draw(ctxBoy, 'boy', 'WALK', t, 65, 132, 1.35);
      }
      if (this.previewGirlCanvas) {
        const ctxGirl = this.previewGirlCanvas.getContext('2d');
        ctxGirl.clearRect(0, 0, 130, 150);
        CharacterRenderer.draw(ctxGirl, 'girl', 'WALK', t, 65, 132, 1.35);
      }
    }
  }

  // Launch when DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new GameEngine();
  });
})();
