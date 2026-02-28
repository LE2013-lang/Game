// ============================================================
// Save Manager — localStorage persistence
// ============================================================

class SaveManager {

    static STORAGE_KEY = 'shadow_realm_runner_save';

    static DEFAULT_DATA = {
        highScore: 0,
        totalSouls: 0,
        totalRuns: 0,
        totalDistance: 0,
        totalEnemiesKilled: 0,
        levelsCompleted: 0,
        hardModeLevels: [],
        settings: {
            musicVolume: 0.7,
            sfxVolume: 0.8,
            screenShake: true,
        },
    };

    /** Load saved data (returns a merged copy with defaults). */
    static load() {
        try {
            const raw = localStorage.getItem(SaveManager.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                // Merge with defaults to handle new fields
                return Object.assign({}, SaveManager.DEFAULT_DATA, parsed);
            }
        } catch (e) {
            console.warn('SaveManager: failed to load', e);
        }
        return Object.assign({}, SaveManager.DEFAULT_DATA);
    }

    /** Persist data object. */
    static save(data) {
        try {
            localStorage.setItem(SaveManager.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('SaveManager: failed to save', e);
        }
    }

    /** Update only the fields provided. */
    static update(partial) {
        const data = SaveManager.load();
        Object.assign(data, partial);
        SaveManager.save(data);
        return data;
    }

    /** Check and update high score. Returns true if new record. */
    static submitRun(distance, soulsEarned) {
        const data = SaveManager.load();
        data.totalRuns++;
        data.totalDistance += distance;
        data.totalSouls += soulsEarned;
        const isNew = distance > data.highScore;
        if (isNew) data.highScore = distance;
        SaveManager.save(data);
        return isNew;
    }
}
