import { db } from '../database/DatabaseManager';
import { addFoodItem } from './foodItemRepository';

export function getShoppingList(profileId) {
    return db.getAllSync('SELECT * FROM shopping_list_items WHERE profileId = ? ORDER BY createdAt ASC', [profileId]);
}

export function getShoppingListItemById(id) {
    return db.getFirstSync('SELECT * FROM shopping_list_items WHERE id = ?', [id]);
}

export function addShoppingListItem(profileId, name) {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Flag is for the UI notice, insert still happens regardless of duplicate.
    db.runSync('INSERT INTO shopping_list_items (id, profileId, name, createdAt) VALUES (?, ?, ?, ?)', [id, profileId, name, createdAt]);

    // Checks is this profile already has an active entry with the same name. Returns obj if exist, null if not.
    const duplicate = db.getFirstSync("SELECT id FROM food_items WHERE profileId = ? AND name = ? COLLATE NOCASE AND status = 'active'",
        [profileId, name]);

    return { item: getShoppingListItemById(id), duplicateExists: !!duplicate };
}

export function removeShoppingListItem(id) {
    db.runSync('DELETE FROM shopping_list_items WHERE id = ?', [id]);
}

export function moveToTracking(shoppingListItemId, itemData) {
    let newItem;
    db.withTransactionSync(() => {
        // Calls fooditemrepository to add to food_items table, while deleting from shopping_list_itemsl.
        newItem = addFoodItem(itemData);
        db.runSync('DELETE FROM shopping_list_items WHERE id = ?', [shoppingListItemId]);
    });
    return newItem;
}
