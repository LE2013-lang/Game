# 🏰 Shadow Realm Runner — Game Design Document

## Overview

| Field          | Detail                                      |
| -------------- | ------------------------------------------- |
| **Title**      | Shadow Realm Runner                         |
| **Genre**      | Endless Runner                              |
| **Theme**      | Dark Fantasy                                |
| **Engine**     | Phaser 3 (CDN, no build step)               |
| **Hosting**    | GitHub Pages (static HTML/JS/CSS)           |
| **Platform**   | Desktop & Mobile browsers                   |
| **Complexity** | Advanced                                    |

---

## 1. Concept

The player controls a **phantom knight** sprinting through an ever-shifting dark fantasy realm. The world procedurally generates three distinct biomes — **Cursed Forest**, **Dragon's Keep**, and **Abyssal Ruins** — each with unique obstacles, enemies, and visual styles. The knight must dodge, jump, slide, and unleash magical abilities to survive as long as possible while collecting souls and unlocking power-ups.

---

## 2. Core Mechanics

### 2.1 Movement

| Action        | Input (Desktop)   | Input (Mobile)     |
| ------------- | ----------------- | ------------------ |
| **Jump**      | `Space` / `W` / `↑` | Swipe Up / Tap     |
| **Double Jump**| Press jump mid-air | Swipe Up mid-air  |
| **Slide**     | `S` / `↓`          | Swipe Down         |
| **Dash**      | `Shift` / `D`      | Double-tap right   |
| **Ability**   | `E` / `Q`          | Ability button     |

### 2.2 Lane System (3 Lanes)

- The runner moves across **3 horizontal lanes** (left, center, right).
- Swipe left/right (mobile) or `A`/`D` or `←`/`→` (desktop) to switch lanes.

### 2.3 Speed Progression

- Base speed increases every **500m** by 5%.
- Max speed cap at **2.5× base speed**.
- Speed temporarily resets after revive.

---

## 3. Biomes & Level Progression

The world cycles through biomes as the player progresses. Each biome lasts ~1000m before transitioning.

### 3.1 Cursed Forest (0–1000m)

- **Visual**: Twisted trees, fog, moonlit paths, floating fireflies.
- **Obstacles**: Fallen logs, thorn walls, swamp pits.
- **Enemies**: Shadow wolves (ground), cursed ravens (air).
- **Color Palette**: Deep greens, purples, silver moonlight.

### 3.2 Dragon's Keep (1000–2000m)

- **Visual**: Crumbling castle walls, lava streams, dragon silhouettes.
- **Obstacles**: Fireballs, collapsing bridges, swinging chains.
- **Enemies**: Fire imps (ground), baby dragons (air).
- **Color Palette**: Reds, oranges, dark stone grey.

### 3.3 Abyssal Ruins (2000–3000m)

- **Visual**: Floating platforms, void rifts, ancient runes.
- **Obstacles**: Void portals, crumbling rune bridges, gravity inversions.
- **Enemies**: Wraiths (phase in/out), void sentinels.
- **Color Palette**: Deep blues, blacks, glowing cyan runes.

> After 3000m the cycle repeats with increased difficulty (faster speed, denser obstacles, stronger enemies).

---

## 4. Collectibles & Currency

| Item              | Description                                         | Use                        |
| ----------------- | --------------------------------------------------- | -------------------------- |
| **Soul Shards**   | Common currency, scattered along paths              | Shop purchases             |
| **Rune Crystals** | Rare, appear every ~500m or from enemy kills        | Upgrade power-ups          |
| **Health Potions** | Restores 1 HP; rare spawn                          | Instant heal               |
| **Magnet Orb**    | Attracts nearby collectibles for 10s                | Temporary pickup boost     |
| **Shield Aura**   | Absorbs one hit                                     | Temporary invincibility    |

---

## 5. Power-Up System

### 5.1 Active Abilities (equip 1 at a time)

| Ability           | Effect                                    | Cooldown |
| ----------------- | ----------------------------------------- | -------- |
| **Phantom Dash**  | Phase through obstacles for 3s            | 20s      |
| **Soul Burst**    | Destroy all enemies on screen             | 30s      |
| **Time Warp**     | Slow game speed by 50% for 5s            | 25s      |
| **Dark Shield**   | Block next 3 hits                         | 35s      |

### 5.2 Passive Upgrades (persistent, purchased in shop)

| Upgrade             | Levels | Effect per Level                     |
| ------------------- | ------ | ------------------------------------ |
| **Soul Magnet**     | 5      | +10% pickup radius                  |
| **Swift Feet**      | 5      | +5% base speed                      |
| **Iron Will**       | 3      | +1 max HP (base: 3)                 |
| **Lucky Star**      | 5      | +5% rare drop chance                |
| **Second Wind**     | 3      | +1 free revive per run              |
| **Rune Mastery**    | 5      | -5% ability cooldown                |

---

## 6. Progression & Save System

### 6.1 Local Save (localStorage)

```json
{
  "highScore": 12450,
  "totalSouls": 8320,
  "runeCrystals": 42,
  "upgrades": {
    "soulMagnet": 3,
    "swiftFeet": 2,
    "ironWill": 1,
    "luckyStar": 0,
    "secondWind": 1,
    "runeMastery": 2
  },
  "equippedAbility": "phantomDash",
  "unlockedSkins": ["default", "crimsonKnight"],
  "selectedSkin": "default",
  "achievements": ["first_1000m", "wolf_slayer_10"],
  "settings": {
    "musicVolume": 0.7,
    "sfxVolume": 0.8,
    "screenShake": true
  },
  "stats": {
    "totalRuns": 87,
    "totalDistance": 142000,
    "totalEnemiesKilled": 312
  }
}
```

### 6.2 Milestone Unlocks

| Distance  | Unlock                          |
| --------- | ------------------------------- |
| 1,000m    | Ability slot unlocked           |
| 5,000m    | Crimson Knight skin             |
| 10,000m   | Void Walker skin                |
| 25,000m   | Dragon Lord skin                |
| 50,000m   | Legendary Aura effect           |

---

## 7. Achievements

| Achievement          | Condition                       | Reward           |
| -------------------- | ------------------------------- | ---------------- |
| **First Steps**      | Complete first run              | 100 Souls        |
| **Forest Survivor**  | Reach 1,000m                   | 250 Souls        |
| **Dragon Slayer**    | Reach 2,000m                   | 500 Souls        |
| **Void Walker**      | Reach 3,000m                   | 1,000 Souls      |
| **Wolf Slayer**      | Kill 10 shadow wolves           | 200 Souls        |
| **Untouchable**      | Run 500m without taking damage  | 1 Rune Crystal   |
| **Soul Collector**   | Collect 10,000 total souls      | Exclusive trail   |
| **Speed Demon**      | Reach max speed                 | 500 Souls        |
| **Shopaholic**       | Buy 10 upgrades                 | 1 Rune Crystal   |
| **Immortal**         | Use 3 revives in a single run   | 300 Souls        |

---

## 8. UI / Screens

### 8.1 Screen Flow

```
[Title Screen] → [Main Menu]
                    ├── [Play] → [Game] → [Game Over] → [Main Menu]
                    ├── [Shop / Upgrades]
                    ├── [Skins]
                    ├── [Achievements]
                    ├── [Leaderboard (Local)]
                    └── [Settings]
```

### 8.2 HUD (In-Game)

```
┌─────────────────────────────────────────────┐
│  ❤❤❤        ⚡ Phantom Dash [Ready]         │
│  Distance: 1,247m         Souls: 342        │
│                                             │
│                                             │
│              [GAME AREA]                    │
│                                             │
│                                             │
│  Speed: 1.4x              Best: 3,201m     │
└─────────────────────────────────────────────┘
```

### 8.3 Game Over Screen

- Final distance, souls earned, enemies killed
- "New High Score!" banner (if applicable)
- Buttons: **Revive** (if available) | **Shop** | **Retry** | **Menu**

---

## 9. Audio

| Type              | Description                                    |
| ----------------- | ---------------------------------------------- |
| **BGM – Forest**  | Mysterious ambient, soft strings                |
| **BGM – Castle**  | Intense drums, brass fanfare                    |
| **BGM – Abyss**   | Ethereal choir, deep bass drones                |
| **SFX – Jump**    | Whoosh with metallic clink                      |
| **SFX – Slide**   | Gravel scrape                                   |
| **SFX – Collect** | Magical chime                                   |
| **SFX – Hit**     | Impact + pain grunt                             |
| **SFX – Death**   | Dramatic orchestral sting                       |
| **SFX – Ability** | Unique per ability (whoosh, explosion, etc.)    |

> Audio will use royalty-free assets or procedurally generated tones initially.

---

## 10. Technical Architecture

### 10.1 Project Structure

```
/
├── index.html              # Entry point
├── css/
│   └── style.css           # UI styling, menus, HUD
├── js/
│   ├── main.js             # Phaser config & game bootstrap
│   ├── scenes/
│   │   ├── BootScene.js    # Asset preloading
│   │   ├── MenuScene.js    # Main menu
│   │   ├── GameScene.js    # Core gameplay loop
│   │   ├── GameOverScene.js# Game over screen
│   │   ├── ShopScene.js    # Upgrades & shop
│   │   └── SettingsScene.js# Settings
│   ├── entities/
│   │   ├── Player.js       # Knight controller
│   │   ├── Obstacle.js     # Obstacle base class
│   │   └── Enemy.js        # Enemy base class
│   ├── systems/
│   │   ├── WorldGenerator.js   # Procedural level generation
│   │   ├── BiomeManager.js     # Biome transitions
│   │   ├── PowerUpManager.js   # Ability & power-up logic
│   │   ├── SaveManager.js      # localStorage persistence
│   │   ├── AchievementManager.js # Achievement tracking
│   │   └── AudioManager.js     # Sound management
│   └── config/
│       ├── constants.js    # Game constants & tuning values
│       └── upgrades.js     # Upgrade definitions & costs
├── assets/
│   ├── sprites/            # Character, obstacle, enemy sprites
│   ├── backgrounds/        # Parallax backgrounds per biome
│   ├── ui/                 # Buttons, icons, frames
│   └── audio/              # Music & SFX files
└── README.md               # Setup & deployment instructions
```

### 10.2 Phaser 3 Setup

```html
<!-- index.html -->
<script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
```

- **Renderer**: WebGL with Canvas fallback
- **Physics**: Arcade Physics (lightweight, sufficient for endless runner)
- **Resolution**: 800×600 base, responsive scaling via `Phaser.Scale.FIT`

### 10.3 Procedural Generation

- Obstacle patterns stored as templates with difficulty ratings.
- `WorldGenerator` selects patterns based on current difficulty tier.
- Object pooling used for obstacles, enemies, and collectibles to minimize GC.

### 10.4 Performance Targets

| Metric    | Target   |
| --------- | -------- |
| FPS       | 60fps    |
| Load time | < 3s     |
| Bundle    | < 2MB    |

---

## 11. GitHub Pages Deployment

```bash
# 1. Create repository
git init
git remote add origin https://github.com/<username>/shadow-realm-runner.git

# 2. Push code
git add .
git commit -m "Initial release"
git push -u origin main

# 3. Enable GitHub Pages
# Settings → Pages → Source: Deploy from branch → main → / (root)
```

**Live URL**: `https://<username>.github.io/shadow-realm-runner/`

---

## 12. Development Roadmap

### Phase 1 — Core (MVP)
- [ ] Project scaffolding & Phaser config
- [ ] Player movement (jump, slide, lane switch)
- [ ] Basic obstacle generation (Cursed Forest only)
- [ ] Collision detection & health system
- [ ] Soul shard collection
- [ ] Distance tracking & game over flow
- [ ] Basic HUD

### Phase 2 — Content & Biomes
- [ ] Dragon's Keep & Abyssal Ruins biomes
- [ ] Biome transition system
- [ ] Enemy types per biome
- [ ] Parallax scrolling backgrounds
- [ ] Speed progression system

### Phase 3 — Progression
- [ ] Save/load system (localStorage)
- [ ] Shop & passive upgrade system
- [ ] Active ability system
- [ ] Skin unlocks
- [ ] Achievement system

### Phase 4 — Polish
- [ ] Audio integration (BGM + SFX)
- [ ] Particle effects (souls, abilities, death)
- [ ] Screen shake & juice effects
- [ ] Mobile touch controls & responsive UI
- [ ] Settings menu (volume, effects toggle)

### Phase 5 — Launch
- [ ] Performance optimization & testing
- [ ] GitHub Pages deployment
- [ ] README with screenshots & play link
- [ ] Bug fixes & balancing

---

## 13. Art Style Reference

- **Character**: Silhouette-style knight with glowing accents (similar to *Limbo* meets *Hollow Knight*)
- **Environment**: Layered parallax with painterly dark backgrounds
- **Effects**: Glowing particles, light trails, magical runes
- **UI**: Gothic-inspired frames, serif fonts, parchment textures

---

*Ready to build? Start with Phase 1 and iterate!*
