import { db } from "../database/DatabaseManager";

export function addFoodItem(item) {
    db.runSync('INSERT INTO food_items (id, name) VALUES (?, ?)', [item.id, item.name]);
}