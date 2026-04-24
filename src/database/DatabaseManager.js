import * as SQLite from 'expo-sqlite';

// Creates database file, or opens if already exists, then returns database object db.
export const db = SQLite.openDatabaseSync('spoil-less.db');

// Creates the tables if they do not exist. Blocks until it finishes.
export function initializeDatabase() {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            createdAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS storage_locations (
            id TEXT PRIMARY KEY,
            profileId TEXT NOT NULL,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            profileId TEXT NOT NULL,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS food_items (
            id TEXT PRIMARY KEY,
            profileId TEXT NOT NULL,
            name TEXT NOT NULL,
            expirationDate TEXT NOT NULL,
            storageLocationId TEXT NOT NULL,
            categoryId TEXT,
            note TEXT,
            photoUri TEXT,
            status TEXT NOT NULL,
            usedDefaultExpiry INTEGER NOT NULL,
            createdAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS shopping_list_items (
            id TEXT PRIMARY KEY,
            profileId TEXT NOT NULL,
            name TEXT NOT NULL,
            createdAt TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS notification_preferences (
            profileId TEXT PRIMARY KEY,
            enabled INTEGER NOT NULL,
            daysBefore INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS default_expiry_lookup (
            itemName TEXT PRIMARY KEY,
            defaultDays INTEGER NOT NULL
        );
    `);

    // Count number of rows from profiles table, returned as object e.g. {count: 5}
    const { count } = db.getFirstSync('SELECT COUNT(*) as count FROM profiles');

    // If count is 0 then there are no profiles. Create one along with creation date.
    if (count === 0) {
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();
        db.runSync('INSERT INTO profiles (id, name, createdAt) VALUES (?, ?, ?)', [id, 'My Profile', createdAt]);
        db.runSync('INSERT INTO notification_preferences (profileId, enabled, daysBefore) VALUES (?, ?, ?)',[id, 1, 3]);
    }

    // Default expiries
    const expiryData = [
        ['Apples', 30],
        ['Avocado', 5],
        ['Bacon', 7],
        ['Bananas', 7],
        ['Bell peppers', 10],
        ['Blueberries', 10],
        ['Bread', 7],
        ['Broccoli', 7],
        ['Butter', 30],
        ['Carrots', 21],
        ['Celery', 14],
        ['Chicken breast', 2],
        ['Cottage cheese', 7],
        ['Cream cheese', 14],
        ['Cucumber', 7],
        ['Deli meat', 5],
        ['Eggs', 21],
        ['Fish', 2],
        ['Garlic', 30],
        ['Ground beef', 2],
        ['Ham', 5],
        ['Heavy cream', 7],
        ['Hot dogs', 7],
        ['Hummus', 10],
        ['Lemons', 21],
        ['Lettuce', 7],
        ['Milk', 7],
        ['Mushrooms', 7],
        ['Onions', 30],
        ['Orange juice', 7],
        ['Oranges', 21],
        ['Potatoes', 30],
        ['Salmon', 2],
        ['Sour cream', 14],
        ['Spinach', 7],
        ['Steak', 3],
        ['Strawberries', 5],
        ['Tofu', 5],
        ['Tomatoes', 7],
        ['Yogurt', 14],
    ];

    // Enhanced for loop. Destructures inner arrays.
    for (const [itemName, defaultDays] of expiryData) {
        db.runSync('INSERT OR IGNORE INTO default_expiry_lookup (itemName, defaultDays) VALUES (?, ?)', [itemName, defaultDays]);
    }
}
