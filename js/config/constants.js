// ============================================================
// Shadow Realm Runner - Game Configuration
// ============================================================

const CONFIG = {
    // Display
    WIDTH: 800,
    HEIGHT: 600,

    // Lane system — Y positions where player feet touch the platform
    LANES: [230, 370, 510],
    LANE_SWITCH_DURATION: 140,   // ms
    DEFAULT_LANE: 1,             // start in middle lane

    // Player
    PLAYER_X: 130,
    PLAYER_WIDTH: 40,
    PLAYER_HEIGHT: 60,
    PLAYER_SLIDE_HEIGHT: 24,
    JUMP_VELOCITY: -620,
    DOUBLE_JUMP_VELOCITY: -520,
    GRAVITY: 1800,
    MAX_HP: 3,
    INVINCIBILITY_DURATION: 1500,  // ms
    SLIDE_DURATION: 550,           // ms

    // Speed & distance
    BASE_SPEED: 320,               // px / s
    SPEED_INCREMENT: 0.05,         // 5 % per tier
    SPEED_TIER_DISTANCE: 500,      // every 500 m
    MAX_SPEED_MULTIPLIER: 2.5,
    PIXELS_PER_METER: 10,

    // Level milestones
    LEVELS: [
        { level: 1, distance: 2500, speedScale: 1.0, label: 'Cursed Forest' },
        { level: 2, distance: 3000, speedScale: 1.3, label: 'Dragon\'s Keep' },
        { level: 3, distance: 5000, speedScale: 1.5, label: 'Shadow Citadel' },
        { level: 4, distance: 3000, speedScale: 1.5, label: 'Dragon Lord', isBoss: true },
    ],

    // Obstacle spawning
    SPAWN_INTERVAL_START: 1400,    // ms
    SPAWN_INTERVAL_MIN: 500,       // ms
    SPAWN_INTERVAL_DECREASE: 25,   // ms per speed tier

    // Collectibles
    SOUL_VALUE: 10,
    SOUL_SPAWN_CHANCE: 0.65,
    SOUL_CLUSTER_MIN: 4,
    SOUL_CLUSTER_MAX: 9,
    SOUL_SPACING: 44,

    // Parallax scroll speed multipliers (relative to game speed)
    PARALLAX_STARS: 0.05,
    PARALLAX_MOUNTAINS: 0.15,
    PARALLAX_TREES: 0.35,
    PARALLAX_FOG: 0.25,
    PARALLAX_GROUND: 1.0,

    // Colors
    BG: 0x0a0616,
    PLATFORM: 0x2a1a3a,
    PLATFORM_TOP: 0x3d2a50,
    PLAYER_ARMOR: 0x6a6a7a,
    PLAYER_DARK: 0x4a4a5a,
    PLAYER_GLOW: 0x9b59b6,
    PLAYER_VISOR: 0xbb88ff,
    SOUL_COLOR: 0xbb77ff,
    HEART_COLOR: 0xff4444,
    HEART_EMPTY: 0x3a2020,
    LOG_FILL: 0x6b4226,
    THORN_FILL: 0x2d8a4e,
    BRANCH_FILL: 0x5a3a1a,
    WOLF_FILL: 0x2a2a3a,
    WOLF_EYE: 0xff3333,
};

// Obstacle type definitions
const OBSTACLE_TYPES = {
    LOG: {
        key: 'obs_log',
        width: 60,
        height: 30,
        ground: true,     // sits on lane ground
        slidable: false,  // can't slide under
    },
    THORN: {
        key: 'obs_thorn',
        width: 35,
        height: 75,
        ground: true,
        slidable: false,
    },
    BRANCH: {
        key: 'obs_branch',
        width: 65,
        height: 25,
        ground: false,    // floats at head height
        slidable: true,   // slide under to dodge
    },
    WOLF: {
        key: 'obs_wolf',
        width: 50,
        height: 40,
        ground: true,
        slidable: false,
        isEnemy: true,
    },
};

// Level 2 Obstacle type definitions (Dragon's Keep)
const OBSTACLE_TYPES_L2 = {
    BOULDER: {
        key: 'obs2_boulder',
        width: 60,
        height: 30,
        ground: true,
        slidable: false,
    },
    SPIKE: {
        key: 'obs2_spike',
        width: 35,
        height: 75,
        ground: true,
        slidable: false,
    },
    CHAIN: {
        key: 'obs2_chain',
        width: 65,
        height: 25,
        ground: false,
        slidable: true,
    },
    DRAKE: {
        key: 'obs2_drake',
        width: 50,
        height: 40,
        ground: true,
        slidable: false,
        isEnemy: true,
    },
};

// Level 3 Obstacle type definitions (Shadow Citadel)
const OBSTACLE_TYPES_L3 = {
    BARREL: {
        key: 'obs3_barrel',
        width: 60,
        height: 30,
        ground: true,
        slidable: false,
    },
    SWORD: {
        key: 'obs3_sword',
        width: 35,
        height: 75,
        ground: true,
        slidable: false,
    },
    CHANDELIER: {
        key: 'obs3_chandelier',
        width: 65,
        height: 25,
        ground: false,
        slidable: true,
    },
    KNIGHT: {
        key: 'obs3_knight',
        width: 50,
        height: 40,
        ground: true,
        slidable: false,
        isEnemy: true,
    },
};

// Ground-only obstacle keys (for pattern generation)
const GROUND_OBSTACLE_KEYS = ['LOG', 'THORN', 'WOLF'];
const ALL_OBSTACLE_KEYS = ['LOG', 'THORN', 'BRANCH', 'WOLF'];
const GROUND_OBSTACLE_KEYS_L2 = ['BOULDER', 'SPIKE', 'DRAKE'];
const ALL_OBSTACLE_KEYS_L2 = ['BOULDER', 'SPIKE', 'CHAIN', 'DRAKE'];
const GROUND_OBSTACLE_KEYS_L3 = ['BARREL', 'SWORD', 'KNIGHT'];
const ALL_OBSTACLE_KEYS_L3 = ['BARREL', 'SWORD', 'CHANDELIER', 'KNIGHT'];
