import * as Crypto from 'expo-crypto';
import { db } from '../database/DatabaseManager';
import { getDefaultExpirationDate } from '../services/expirationService';
import { cancelItemNotifications, scheduleItemNotifications } from '../services/notificationScheduler';

export function getAllDefaultItems() {
    return db.getAllSync('SELECT itemName, defaultDays FROM default_expiry_lookup ORDER BY itemName ASC');
}

export function getFoodItemById(id) {
    return db.getFirstSync('SELECT * FROM food_items WHERE id = ?', [id]);
}

export function getActiveFoodItems() {
    return db.getAllSync("SELECT * FROM food_items WHERE status = 'active' ORDER BY expirationDate ASC");
}

export function getItemsByLocation(storageLocationId) {
    return db.getAllSync("SELECT * FROM food_items WHERE storageLocationId = ? AND status = 'active' ORDER BY expirationDate ASC",
        [storageLocationId]);
}

export function getItemsByCategory(categoryId) {
    return db.getAllSync("SELECT * FROM food_items WHERE categoryId = ? AND status = 'active' ORDER BY expirationDate ASC",
        [categoryId]);
}

export function getExpiringSoonItems(thresholdDays) {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + thresholdDays);
    const thresholdDate = threshold.toISOString().split('T')[0];

    // Return array of objs of all columns where expiration date <= threshold.
    return db.getAllSync("SELECT * FROM food_items WHERE status = 'active' AND expirationDate <= ? ORDER BY expirationDate ASC",
        [thresholdDate]);
}

// Accepts an item and destructures its properties. Assign default parameter values for the optional fields.
export function addFoodItem({ name, expirationDate, storageLocationId, categoryId = null, note = null, photoUri = null, usedDefaultExpiry = false }) {
    const id = Crypto.randomUUID();
    const createdAt = new Date().toISOString();

    let finalExpDate = expirationDate;
    let useDefault = usedDefaultExpiry ? 1 : 0;

    // If expiry is not given, set finalexpdate to default.
    if (!finalExpDate) {
        finalExpDate = getDefaultExpirationDate(name);
        useDefault = 1;
    }

    db.runSync(`INSERT INTO food_items
        (id, name, expirationDate, storageLocationId, categoryId, note, photoUri, status, usedDefaultExpiry, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
        [id, name, finalExpDate, storageLocationId, categoryId, note, photoUri, useDefault, createdAt]);

    // Schedules and returns item
    const item = getFoodItemById(id);
    scheduleItemNotifications(item);
    return item;
}

export function updateFoodItem(id, updates) {
    const current = getFoodItemById(id);
    // If expiry was not updated by user, updates object won't have that property so false.
    const expiryChanged = updates.expirationDate && updates.expirationDate !== current.expirationDate;

    db.runSync(`UPDATE food_items SET name = ?, expirationDate = ?, storageLocationId = ?, categoryId = ?, note = ?, photoUri = ? WHERE id = ?`,
        [
            // Unknown what user has updated, so use noalish coalescing op to decide. If update exists, use it, if not just use what's already there.
            updates.name ?? current.name,
            updates.expirationDate ?? current.expirationDate,
            updates.storageLocationId ?? current.storageLocationId,
            // Check if the properties are in the updates object at all. If so, use it.
            'categoryId' in updates ? updates.categoryId : current.categoryId,
            'note' in updates ? updates.note : current.note,
            'photoUri' in updates ? updates.photoUri : current.photoUri,
            id
        ]
    );

    if (expiryChanged) {
        cancelItemNotifications(id);
        scheduleItemNotifications(getFoodItemById(id));
    }
}

export function markAsUsed(id) {
    db.runSync("UPDATE food_items SET status = 'used' WHERE id = ?", [id]);
    cancelItemNotifications(id);
}

export function markAsDiscarded(id) {
    db.runSync("UPDATE food_items SET status = 'discarded' WHERE id = ?", [id]);
    cancelItemNotifications(id);
}

export function deleteFoodItem(id) {
    cancelItemNotifications(id);
    db.runSync('DELETE FROM food_items WHERE id = ?', [id]);
}