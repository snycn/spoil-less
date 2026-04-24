import * as Notifications from 'expo-notifications';
import { db } from '../database/DatabaseManager';

async function notifs() {
  return {
    shouldShowAlert: true, 
    shouldPlaySound: true, 
    shouldSetBadge: false,
  };
}

// Expects an object with a property 'handleNotification', whose value is a function that returns an object with the notif settings
Notifications.setNotificationHandler({handleNotification: notifs});

export async function scheduleItemNotifications(item) {
    try {
        // Goes to notif_pref table to find the row that == profileId, then get enabled & daysBefore columns. If prefs are not enabled, return.
        const prefs = db.getFirstSync('SELECT enabled, daysBefore FROM notification_preferences WHERE profileId = ?', [item.profileId]);
        if (!prefs || !prefs.enabled) return;

        // Checks perms. If none, request. If not permitted then return.
        const perms = await Notifications.getPermissionsAsync();
        if (!perms.granted) {
          const request = await Notifications.requestPermissionsAsync();
          if (!request.granted) {
            return;
          }
        } 
        
        await cancelItemNotifications(item.id);

        // Destructures item's expr date into numbers, then creates the expiry date, as well as warning date. Both 9am.
        const [y, m, d] = item.expirationDate.split('-').map(Number);
        const expiryAt9am = new Date(y, m - 1, d, 9);
        const warningAt9am = new Date(y, m - 1, d - prefs.daysBefore, 9);
        const now = new Date();
        const data = { itemId: item.id, profileId: item.profileId };

        // If not passed warning date, schedule the notif.
        if (warningAt9am > now) {
            // Schedule the notif and pass object that describes notification request.
            await Notifications.scheduleNotificationAsync({
                identifier: `${item.id}-warning`,
                content: {
                    title: 'Expiring soon',
                    body: `${item.name} expires in ${prefs.daysBefore} day${prefs.daysBefore === 1 ? '' : 's'}.`,
                    data: data
                },
                trigger: { date: warningAt9am },
            });
        }

        // If not passed expiry date, schedule the notif.
        if (expiryAt9am > now) {
            // Schedule the notif and pass object that describes notification request.
            await Notifications.scheduleNotificationAsync({
                identifier: `${item.id}-expiry`,
                content: {
                    title: 'Expires today',
                    body: `${item.name} expires today.`,
                    data: data
                },
                trigger: { date: expiryAt9am },
            });
        }
    } 
    catch (err) {
        console.warn('scheduleItemNotifications failed:', err);
    }
}

export async function cancelItemNotifications(itemId) {
    try { 
        await Notifications.cancelScheduledNotificationAsync(`${itemId}-warning`); 
    } catch {}
    try { 
        await Notifications.cancelScheduledNotificationAsync(`${itemId}-expiry`); 
    } catch {}
    // Ignore err, if canceling fails the notif doesn't exist anyway works fine.
}

export async function cancelAllNotificationsForProfile(profileId) {
    try {
        // Retrieve all notifications from device. Then iterate through and cancel ones for specified profile.
        const all = await Notifications.getAllScheduledNotificationsAsync();
        for (const n of all) {
            if (n.content?.data?.profileId === profileId) {
                await Notifications.cancelScheduledNotificationAsync(n.identifier);
            }
        }
    } 
    catch (err) {
        console.warn('cancelAllNotificationsForProfile failed:', err);
    }
}

export async function rescheduleAllForProfile(profileId) {
    try {
        // Generates today date, then formats it in YYYY-MM-DD
        const t = new Date();
        const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
        
        // Looks through food_items where profileId === profileId and item has just expired, or is going to.
        const items = db.getAllSync("SELECT * FROM food_items WHERE profileId = ? AND status = 'active' AND expirationDate >= ?",
          [profileId, todayStr]);
        
        for (const item of items) {
            await scheduleItemNotifications(item);
        }
    } 
    catch (err) {
        console.warn('rescheduleAllForProfile failed:', err);
    }
}
