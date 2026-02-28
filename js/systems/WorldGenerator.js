// ============================================================
// World Generator — procedural obstacle & collectible spawning
// ============================================================

class WorldGenerator {

    constructor(scene, levelIndex) {
        this.scene = scene;
        this.levelIndex = levelIndex || 0;

        // Pick obstacle table & key arrays based on level
        if (this.levelIndex >= 2) {
            this.obstacleTable = OBSTACLE_TYPES_L3;
            this.allKeys = ALL_OBSTACLE_KEYS_L3;
            this.groundKeys = GROUND_OBSTACLE_KEYS_L3;
            this.soulTexture = 'soul3_crystal';
        } else if (this.levelIndex >= 1) {
            this.obstacleTable = OBSTACLE_TYPES_L2;
            this.allKeys = ALL_OBSTACLE_KEYS_L2;
            this.groundKeys = GROUND_OBSTACLE_KEYS_L2;
            this.soulTexture = 'soul2_gem';
        } else {
            this.obstacleTable = OBSTACLE_TYPES;
            this.allKeys = ALL_OBSTACLE_KEYS;
            this.groundKeys = GROUND_OBSTACLE_KEYS;
            this.soulTexture = 'soul_shard';
        }

        // Physics groups (managed by GameScene for overlap detection)
        this.obstacleGroup = scene.physics.add.group();
        this.soulGroup = scene.physics.add.group();

        // Timers
        this.lastSpawnTime = 0;
        this.spawnInterval = CONFIG.SPAWN_INTERVAL_START;

        // Difficulty tracking
        this.speedTier = 0;
    }

    // ---- MAIN UPDATE ---------------------------------------------

    update(time, dt, currentSpeed, distanceMeters) {
        // Adjust spawn interval based on speed tier
        const newTier = Math.floor(distanceMeters / CONFIG.SPEED_TIER_DISTANCE);
        if (newTier > this.speedTier) {
            this.speedTier = newTier;
            this.spawnInterval = Math.max(
                CONFIG.SPAWN_INTERVAL_MIN,
                CONFIG.SPAWN_INTERVAL_START - this.speedTier * CONFIG.SPAWN_INTERVAL_DECREASE
            );
        }

        // Spawn if enough time has passed
        if (time - this.lastSpawnTime >= this.spawnInterval) {
            this.spawnPattern(currentSpeed);
            this.lastSpawnTime = time;
        }

        // Move & recycle obstacles
        this._moveGroup(this.obstacleGroup, dt, currentSpeed);
        this._moveGroup(this.soulGroup, dt, currentSpeed);
    }

    // ---- SPAWNING PATTERNS ---------------------------------------

    spawnPattern(speed) {
        const r = Math.random();

        if (r < 0.30) {
            this._patternSingle();
        } else if (r < 0.50) {
            this._patternDouble();
        } else if (r < 0.70) {
            this._patternWithReward();
        } else if (r < 0.85) {
            this._patternSoulCluster();
        } else {
            this._patternGauntlet();
        }
    }

    /** Single obstacle in a random lane. */
    _patternSingle() {
        const lane = Phaser.Math.Between(0, 2);
        const typeKey = Phaser.Utils.Array.GetRandom(this.allKeys);
        this._spawnObstacle(lane, this.obstacleTable[typeKey]);
    }

    /** Two obstacles in different lanes — one lane is always free. */
    _patternDouble() {
        const lanes = Phaser.Utils.Array.Shuffle([0, 1, 2]);
        const t1 = Phaser.Utils.Array.GetRandom(this.groundKeys);
        const t2 = Phaser.Utils.Array.GetRandom(this.groundKeys);
        this._spawnObstacle(lanes[0], this.obstacleTable[t1]);
        this._spawnObstacle(lanes[1], this.obstacleTable[t2]);
    }

    /** Obstacle with soul shards after it as a reward. */
    _patternWithReward() {
        const lane = Phaser.Math.Between(0, 2);
        const typeKey = Phaser.Utils.Array.GetRandom(this.allKeys);
        this._spawnObstacle(lane, this.obstacleTable[typeKey]);

        // Soul cluster behind the obstacle
        const count = Phaser.Math.Between(2, 4);
        for (let i = 0; i < count; i++) {
            this._spawnSoul(lane, CONFIG.WIDTH + 120 + i * CONFIG.SOUL_SPACING);
        }
    }

    /** Pure soul cluster (no obstacle). */
    _patternSoulCluster() {
        const lane = Phaser.Math.Between(0, 2);
        const count = Phaser.Math.Between(CONFIG.SOUL_CLUSTER_MIN, CONFIG.SOUL_CLUSTER_MAX);
        for (let i = 0; i < count; i++) {
            this._spawnSoul(lane, CONFIG.WIDTH + 60 + i * CONFIG.SOUL_SPACING);
        }
    }

    /** Gauntlet: 3 waves of single obstacles coming quickly. */
    _patternGauntlet() {
        for (let w = 0; w < 3; w++) {
            const lane = Phaser.Math.Between(0, 2);
            const typeKey = Phaser.Utils.Array.GetRandom(this.groundKeys);
            this._spawnObstacle(lane, this.obstacleTable[typeKey], CONFIG.WIDTH + 60 + w * 220);
        }
    }

    // ---- OVERLAP CHECK -------------------------------------------

    /** Minimum horizontal gap (px) between any two items. */
    static MIN_GAP = 70;

    /** Horizontal window (px) considered "same column" for the all-lanes-blocked check. */
    static BLOCK_CHECK_RANGE = 100;

    /**
     * Returns true if placing an object at (x, lane) would overlap
     * an existing active obstacle or soul within MIN_GAP pixels.
     */
    _wouldOverlap(x, lane, width) {
        const halfW = (width || 60) / 2;
        const minDist = WorldGenerator.MIN_GAP + halfW;

        // Check obstacles
        const obs = this.obstacleGroup.getChildren();
        for (let i = 0; i < obs.length; i++) {
            const o = obs[i];
            if (!o.active) continue;
            if (o.lane !== lane) continue;
            if (Math.abs(o.x - x) < minDist) return true;
        }

        // Check souls
        const souls = this.soulGroup.getChildren();
        for (let i = 0; i < souls.length; i++) {
            const s = souls[i];
            if (!s.active) continue;
            if (s.lane !== lane) continue;
            if (Math.abs(s.x - x) < minDist) return true;
        }

        return false;
    }

    // ---- SPAWN HELPERS -------------------------------------------

    /**
     * Check if adding an obstacle at x in the given lane would cause
     * ALL 3 lanes to be blocked at the same horizontal position.
     * If so, skip the spawn to guarantee the player always has a path.
     */
    _wouldBlockAllLanes(x, lane) {
        const range = WorldGenerator.BLOCK_CHECK_RANGE;
        const blockedLanes = new Set();
        blockedLanes.add(lane); // the lane we're about to spawn into

        const obs = this.obstacleGroup.getChildren();
        for (let i = 0; i < obs.length; i++) {
            const o = obs[i];
            if (!o.active) continue;
            if (Math.abs(o.x - x) < range) {
                blockedLanes.add(o.lane);
            }
        }

        return blockedLanes.size >= CONFIG.LANES.length;
    }

    _spawnObstacle(lane, type, xOverride) {
        const x = xOverride || CONFIG.WIDTH + 60;

        // Skip if it would overlap an existing item
        if (this._wouldOverlap(x, lane, type.width)) return null;

        // Skip if this would block every lane at this X — must leave an escape route
        if (this._wouldBlockAllLanes(x, lane)) return null;

        const groundY = CONFIG.LANES[lane];

        // Y position depends on ground vs aerial
        let y;
        if (type.ground) {
            y = groundY; // bottom of sprite touches lane ground
        } else {
            // Aerial: float above the ground so sliding dodges it
            y = groundY - 32;
        }

        let obs = this._getInactive(this.obstacleGroup);
        if (obs) {
            obs.setTexture(type.key);
            obs.setActive(true).setVisible(true);
            obs.body.enable = true;
            obs.setPosition(x, y);
        } else {
            obs = this.obstacleGroup.create(x, y, type.key);
            obs.setOrigin(0.5, 1);
            obs.body.allowGravity = false;
            obs.body.setImmovable(true);
        }

        obs.setDepth(7);

        // Store metadata
        obs.obstacleType = type;
        obs.lane = lane;
        obs.body.setSize(type.width - 6, type.height - 4);
        return obs;
    }

    _spawnSoul(lane, xOverride) {
        const x = xOverride || CONFIG.WIDTH + 60;

        // Skip if it would overlap an existing item
        if (this._wouldOverlap(x, lane, 16)) return null;

        const groundY = CONFIG.LANES[lane];
        const y = groundY - 30; // float above ground
        const baseY = y;

        let soul = this._getInactive(this.soulGroup);
        if (soul) {
            soul.setTexture(this.soulTexture);
            soul.setActive(true).setVisible(true);
            soul.body.enable = true;
            soul.setPosition(x, y);
        } else {
            soul = this.soulGroup.create(x, y, this.soulTexture);
            soul.setOrigin(0.5, 0.5);
            soul.body.allowGravity = false;
        }
        soul.setDepth(7);
        soul.lane = lane;
        soul.baseY = baseY;
        soul.body.setSize(14, 14);
        return soul;
    }

    // ---- POOL & MOVEMENT -----------------------------------------

    _getInactive(group) {
        const children = group.getChildren();
        for (let i = 0; i < children.length; i++) {
            if (!children[i].active) return children[i];
        }
        return null;
    }

    _moveGroup(group, dt, speed) {
        group.getChildren().forEach(obj => {
            if (!obj.active) return;

            obj.x -= speed * dt;

            // Bobbing for soul shards
            if (obj.baseY !== undefined) {
                obj.y = obj.baseY + Math.sin(obj.x * 0.04) * 6;
            }

            // Off-screen recycle
            if (obj.x < -100) {
                obj.setActive(false).setVisible(false);
                obj.body.enable = false;
            }
        });
    }

    // ---- RESET ---------------------------------------------------

    reset() {
        this.obstacleGroup.getChildren().forEach(o => {
            o.setActive(false).setVisible(false);
            o.body.enable = false;
        });
        this.soulGroup.getChildren().forEach(s => {
            s.setActive(false).setVisible(false);
            s.body.enable = false;
        });
        this.lastSpawnTime = 0;
        this.spawnInterval = CONFIG.SPAWN_INTERVAL_START;
        this.speedTier = 0;
    }

    destroy() {
        this.obstacleGroup.destroy(true);
        this.soulGroup.destroy(true);
    }
}
