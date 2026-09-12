# 🌌 beyond — An Existential Endless Journey

> **A Hackathon Web Game built with HTML5, CSS3, JavaScript, HTML5 Canvas & Web Audio API**  
> *"There is absolutely nothing to accomplish, yet the player keeps going."*

---

## 🎮 Game Overview

**beyond** is an intentionally useless, endless web game created for a hackathon. 

The game has:
- **No Game Over** (It is physically impossible to lose or die)
- **No time limit**
- **No levels** or level-up grind
- **No final destination**
- **No final objective**
- **No winning condition**
- **No meaningful ending**

The humor comes from the fact that the character is fully conscious of their pointless existence, breaking the fourth wall to complain when you jump excessively, while the "Useless Shop" paradoxically does the exact opposite of what it promises.

---

## ✨ Features & Architecture

### 1. 🎨 Dynamic 2D Procedural Cartoon Animation (HTML5 Canvas)
- **Two Playable Characters**: 
  - **Cute Boy** (Leo): Backwards cap, stylish jacket, animated expressions.
  - **Cute Girl** (Mia): Twin buns with pink ribbons, cozy hoodie, animated expressions.
- **11 Expressive Animation States**:
  1. `WALK` / `RUN`: Natural sinusoidal limb oscillation, hair bounce, periodic blinks.
  2. `JUMP`: Tucked knees, joyful reach.
  3. `FALL`: Windblown hair, surprised dizzy face.
  4. `INJURED_WALK`: Triggered when stubbing a toe on a rock. Lasts exactly **5 seconds** at 42% speed with a bandage and comical limping gait.
  5. `SLIP`: Stepping on a banana peel launches the character into an airborne spin and flat back landing.
  6. `RUB_BACK`: Sits up rubbing sore tailbone with comical "Ow!" expression before springing back up.
  7. `PIT_FALL`: Falls into the deep abyss with a cartoon slide whistle.
  8. `PIT_FLY_RECOVERY`: (Odd pit failures #1, #3...) Sprouts golden angel wings and a halo, peacefully ascending out of the pit to harp arpeggios!
  9. `PIT_CLIMB_RECOVERY`: (Even pit failures #2, #4...) A rope ladder drops, character climbs out hand-over-hand with exertion grunts!
  10. `SLEEP`: Encountering the special Bed obstacle allows the character to tuck in for a 2-minute restorative nap (`01:59` countdown timer with gentle snores).
  11. `STARE_PLAYER`: Spammed jump button? Character screeches to a halt, turns 90° to glare directly at you, and deadpans: *"Don't waste my energy."*

### 2. 🕳️ Dynamic Obstacles
- **Long Pit**: Gaps in the brick-and-grass platform. Jump over them, or alternate between flying and climbing out upon falling.
- **Small Rock**: Noticeably smaller than the player. Hitting it causes a 5-second limp.
- **Banana Peel**: Classic cartoon slip-and-slide hazard.
- **The Bed Event**: Special event triggered after encountering all three obstacles. The player can choose to hop in and take a 2-minute nap, or jump over it to keep running.

### 3. 🛒 The Useless Shop
Spend your collected coins on intentionally counter-productive upgrades:
- **Remove Pit (20 Coins)**: *"Congratulations! You removed pits by adding 200% more pits."*
- **Remove Banana Peel (10 Coins)**: Doubles banana peel frequency.
- **Remove Rock (5 Coins)**: Causes rocks to spawn in clusters.
- **Buy Pure Nothingness (50 Coins)**: Grants 0 grams of pristine metaphysical vacuum.
- **Take It Even Slower (15 Coins)**: Decreases character walking speed by 10%.

### 4. 🗣️ Fourth-Wall Breaking & Irritation System
- **Jump Spamming Detector**: Jumping repeatedly when there is no obstacle causes the character to freeze, turn to the screen, and complain:
  - *"Don't waste my energy."*
  - *"Why are you jumping?"*
  - *"There is literally nothing here."*
  - *"Stop."*
  - *"I'm tired."*
  - *"Was that necessary?"*
- **Touch / Poke Reaction**: Tapping/clicking directly on the character triggers irritated voice lines:
  - *"Don't touch me!"*
  - *"Stop poking me."*
  - *"What are you doing?"*
  - *"Leave me alone."*
  - *"I'm walking!"*

### 5. 🎵 Zero-Dependency Procedural Audio & Web Speech
- Synthesized Web Audio API sound effects (Jump chirp, metallic coin bell, thud, cartoon slide whistles, angel harp chords, climb rhythms, snores).
- Web Speech API vocal synthesis delivering funny spoken quotes tailored to the selected character's pitch!
- Mute/Sound toggle saved in `LocalStorage`.

### 6. ⏱️ Existential Exit Modal
Clicking the **✖** button doesn't quit immediately—it congratulates you:
> **"Thank you for wasting 08:42 of your life."**
- Complete breakdown of useless statistics (Coins collected, Pits fallen, Banana slips, Rocks bumped).
- Option to **KEEP WASTING TIME** or **EXIT JOURNEY**.

---

## 🕹️ Controls

| Control | Action |
|---|---|
| **Spacebar** / **Up Arrow** / **W** | Jump |
| **Mouse Click / Tap Canvas** | Jump |
| **Click Directly on Character** | Poke / Annoy Character |
| **Mobile Jump Button** | Jump on touchscreens |
| **🛒 Button** | Open Useless Shop |
| **🔊 Button** | Mute / Unmute Sound |
| **✖ Button** | View Time Wasted & Exit |

---

## 🚀 How to Run Locally

No build steps or npm installations needed! The game runs completely vanilla in any modern browser:

1. Double-click `index.html` to open directly in Chrome, Edge, Safari, or Firefox.
2. Alternatively, run a local server:
   ```bash
   python -m http.server 8080
   # or
   npx serve .
   ```
3. Open `http://localhost:8080` and embark on your completely meaningless journey!
