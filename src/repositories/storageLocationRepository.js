import * as Crypto from 'expo-crypto';
import { db } from '../database/DatabaseManager';

export function getStorageLocations(profileId) {
    return db.getAllSync('SELECT * FROM storage_locations WHERE profileId = ? ORDER BY name ASC', [profileId]);
}

export function getStorageLocationById(id) {
    return db.getFirstSync('SELECT * FROM storage_locations WHERE id = ?', [id]);
}

export function getActiveItemCount(locationId) {
  // Count all rows in table that belongs to specified storage location and is active.
    const { count } = db.getFirstSync("SELECT COUNT(*) as count FROM food_items WHERE storageLocationId = ? AND status = 'active'", 
      [locationId]);
    return count;
}

export function addStorageLocation(profileId, name) {
    const id = Crypto.randomUUID();
    db.runSync('INSERT INTO storage_locations (id, profileId, name) VALUES (?, ?, ?)', [id, profileId, name]);
    return getStorageLocationById(id);
}

export function renameStorageLocation(id, newName) {
    db.runSync('UPDATE storage_locations SET name = ? WHERE id = ?', [newName, id]);
}

export function deleteStorageLocation(id) {
    // Will not delete storage location if it still contains active items. Returns.
    const itemCount = getActiveItemCount(id);
    if (itemCount > 0) return { success: false, reason: 'not_empty', itemCount };

    // Otherwise, delete the entire row with that ID.
    db.runSync('DELETE FROM storage_locations WHERE id = ?', [id]);
    return { success: true };
}
