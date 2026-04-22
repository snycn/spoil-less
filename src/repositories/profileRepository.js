import { db } from "../database/DatabaseManager";

export function addProfile(profile) {
    db.runSync('INSERT INTO profiles (id, name, createdAt) VALUES (?, ?, ?)', [profile.id, profile.name, profile.createdAt]);
}