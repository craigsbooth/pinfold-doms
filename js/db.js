// Firebase Database Layer
// Replaces localStorage with Firestore for shared multi-user data

const firebaseConfig = {
    apiKey: "AIzaSyA_ZDCvN_a2MrwHoJ952vGoZyieggseJZE",
    authDomain: "pinfold-doms.firebaseapp.com",
    projectId: "pinfold-doms",
    storageBucket: "pinfold-doms.firebasestorage.app",
    messagingSenderId: "263130163574",
    appId: "1:263130163574:web:38a6a66634e69441263257"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Database abstraction - reads/writes to Firestore with local cache
const DB = {
    _cache: {},
    _loaded: false,

    // All our data lives in a single collection "club" with known document IDs
    _docs: [
        'player_registry', 'availability', 'team_selections',
        'match_results', 'duty_overrides', 'extra_finances',
        'custom_seasons', 'active_season', 'fixtures_overrides', 'settings'
    ],

    // Load all data from Firestore on startup
    async loadAll() {
        const promises = this._docs.map(async (docId) => {
            try {
                const snap = await db.collection('club').doc(docId).get();
                if (snap.exists) {
                    this._cache[docId] = snap.data().value;
                }
            } catch (e) {
                console.warn('Failed to load', docId, e);
            }
        });
        await Promise.all(promises);
        this._loaded = true;
    },

    // Get a value (from cache)
    get(key) {
        return this._cache[key] !== undefined ? this._cache[key] : null;
    },

    // Set a value (write to cache + Firestore)
    set(key, value) {
        this._cache[key] = value;
        // Fire-and-forget write to Firestore
        db.collection('club').doc(key).set({ value: value, updated: new Date().toISOString() })
            .catch(e => console.warn('Write failed:', key, e));
    },

    // Convenience: get with default
    getOrDefault(key, defaultVal) {
        const v = this.get(key);
        return v !== null ? v : defaultVal;
    },

    // Real-time listener - refreshes cache and triggers callback on changes
    _listeners: [],
    _onChangeCallback: null,

    onChange(callback) {
        this._onChangeCallback = callback;
    },

    startListening() {
        this._docs.forEach(docId => {
            const unsub = db.collection('club').doc(docId).onSnapshot(snap => {
                if (snap.exists) {
                    const newVal = snap.data().value;
                    const oldVal = JSON.stringify(this._cache[docId]);
                    this._cache[docId] = newVal;
                    // Only trigger refresh if value actually changed and wasn't from us
                    if (this._loaded && JSON.stringify(newVal) !== oldVal && this._onChangeCallback) {
                        this._onChangeCallback(docId);
                    }
                }
            }, err => { console.warn('Listener error:', docId, err); });
            this._listeners.push(unsub);
        });
    }
};

// Seed initial data if Firestore is empty
async function seedIfEmpty() {
    // Check if player registry exists
    if (!DB.get('player_registry')) {
        DB.set('player_registry', CLUB_DATA.playerRegistry);
    }
    if (!DB.get('availability')) {
        DB.set('availability', CLUB_DATA.availability_25_26);
    }
    if (!DB.get('active_season')) {
        DB.set('active_season', '25-26');
    }
    if (!DB.get('settings')) {
        DB.set('settings', { adminPin: '1875' });
    }
}
