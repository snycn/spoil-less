import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../database/DatabaseManager';
import { cancelAllNotificationsForProfile } from '../services/notificationScheduler';

const ACTIVE_PROFILE_KEY = '@spoil-less/active-profile-id';

// Returns arr of objs of all profiles, ascending order.
export function getAllProfiles() {
    return db.getAllSync('SELECT * FROM profiles ORDER BY createdAt ASC');
}

// Returns profile object.
export function getProfileById(id) {
    return db.getFirstSync('SELECT * FROM profiles WHERE id = ?', [id]);
}

// Creates profile then returns it.
export function addProfile(name) {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.runSync('INSERT INTO profiles (id, name, createdAt) VALUES (?, ?, ?)', [id, name, createdAt]);
    db.runSync('INSERT INTO notification_preferences (profileId, enabled, daysBefore) VALUES (?, ?, ?)', [id, 1, 3]);

    return getProfileById(id);
}

export function renameProfile(id, newName) {
    db.runSync('UPDATE profiles SET name = ? WHERE id = ?', [newName, id]);
}

export async function deleteProfile(id) {
    // Makes sure last remaining profile isn't deleted.
    const { count } = db.getFirstSync('SELECT COUNT(*) as count FROM profiles');
    if (count <= 1) return { success: false, reason: 'last_profile' };

    // Delete all rows associated with this profile. withTransactionSync requires all succeeds to prevent inconsistent half deleted state.
    db.withTransactionSync(() => {
        db.runSync('DELETE FROM food_items WHERE profileId = ?', [id]);
        db.runSync('DELETE FROM storage_locations WHERE profileId = ?', [id]);
        db.runSync('DELETE FROM categories WHERE profileId = ?', [id]);
        db.runSync('DELETE FROM shopping_list_items WHERE profileId = ?', [id]);
        db.runSync('DELETE FROM notification_preferences WHERE profileId = ?', [id]);
        db.runSync('DELETE FROM profiles WHERE id = ?', [id]);
    });

    await cancelAllNotificationsForProfile(id);

    // If the deleted profile was active, switch to the oldest remaining one.
    const currentActive = await AsyncStorage.getItem(ACTIVE_PROFILE_KEY);
    if (currentActive === id) {
        const fallback = db.getFirstSync('SELECT id FROM profiles ORDER BY createdAt ASC LIMIT 1');
        // Replace active prof key with the one retrieved above.
        await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, fallback.id);
    }
    return { success: true };
}

export async function getActiveProfileId() {
    const stored = await AsyncStorage.getItem(ACTIVE_PROFILE_KEY);
    if (stored) return stored;

    // No stored value yet (first launch). Fine since databasemanager creates a default profile if there are none.
    const first = db.getFirstSync('SELECT id FROM profiles ORDER BY createdAt ASC LIMIT 1');
    if (!first) return null;

    await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, first.id);
    return first.id;
}

export async function setActiveProfileId(id) {
    await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, id);
}
