import * as Crypto from 'expo-crypto';
import { db } from '../database/DatabaseManager';
import { addFoodItem } from './foodItemRepository';

export function getShoppingList() {
    return db.getAllSync('SELECT * FROM shopping_list_items ORDER BY createdAt ASC');
}

export function getShoppingListItemById(id) {
    return db.getFirstSync('SELECT * FROM shopping_list_items WHERE id = ?', [id]);
}

export function addShoppingListItem(name) {
    const id = Crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Flag is for the UI notice, insert still happens regardless of duplicate.
    db.runSync('INSERT INTO shopping_list_items (id, name, createdAt) VALUES (?, ?, ?)', [id, name, createdAt]);

    // Checks if there's already an active entry with the same name. Returns obj if exist, null if not.
    const duplicate = db.getFirstSync("SELECT id FROM food_items WHERE name = ? COLLATE NOCASE AND status = 'active'",
        [name]);

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
