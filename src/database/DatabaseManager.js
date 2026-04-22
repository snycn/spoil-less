import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('spoil-less.db');

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

        CREATE TABLE IF NOT EXISTS food_items (
            id TEXT PRIMARY KEY,
            profileId TEXT NOT NULL,
            name TEXT NOT NULL,
            expirationDate TEXT NOT NULL,
            storageLocations TEXT NOT NULL,
            status TEXT NOT NULL
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
}