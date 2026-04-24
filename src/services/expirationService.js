import { db } from '../database/DatabaseManager';

const DEFAULT_SHELF_LIFE_DAYS = 21;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getDefaultExpirationDate(itemName) {
    // Tries to retrieve default expiry from table for specified item. If fails, row is undef and just use 21.
    const row = db.getFirstSync('SELECT defaultDays FROM default_expiry_lookup WHERE itemName = ? COLLATE NOCASE', [itemName]);
    const days = row ? row.defaultDays : DEFAULT_SHELF_LIFE_DAYS;

    // Gets date adds shelf life and returns it formated YYYY-MM-DD
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

export function getDaysUntilExpiration(expirationDate) {
    // Retrieve current time and set to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Retrieve expiry date and set to midnight
    const expiry = new Date(expirationDate);
    expiry.setHours(0, 0, 0, 0);

    // Expiry - today to get days in milisec, then / by MS_PER_DAY to get days. Rounded.
    return Math.round((expiry - today) / MS_PER_DAY);
}

export function getExpirationStatus(expirationDate, thresholdDays = 3) {
    // If user does not pass threshold, use default of 3 days.
    const days = getDaysUntilExpiration(expirationDate);
    if (days < 0) return 'expired';
    if (days <= thresholdDays) return 'expiring_soon';
    return 'active';
}
