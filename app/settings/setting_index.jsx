import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { db } from "@/src/database/DatabaseManager";
import { cancelAllNotifications, rescheduleAll, sendTestNotification } from "@/src/services/notificationScheduler";

export default function Setting_Index() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [daysBefore, setDaysBefore] = useState(3);

  useFocusEffect(useCallback(() => {
      const prefs = db.getFirstSync('SELECT enabled, daysBefore FROM notification_preferences WHERE id = 1');
      if (prefs) { setNotificationsEnabled(!!prefs.enabled); setDaysBefore(prefs.daysBefore); }
  }, []));

  const handleToggle = (value) => {
      setNotificationsEnabled(value);
      db.runSync('UPDATE notification_preferences SET enabled = ? WHERE id = 1', [value ? 1 : 0]);
      if (value) rescheduleAll(); else cancelAllNotifications();
  };

  return (
    <View style={styles.container}>

      {/* header */}
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsHeaderText}>Settings</Text>
      </View>

      {/* settings content */}
      <View style={styles.content}>

        {/* notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Enable notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={handleToggle} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Days before expiry</Text>
          <Text style={styles.valueBox}>{daysBefore}</Text>
        </View>

        {/* expiring soon */}
        <Text style={styles.sectionTitle}>Expiring Soon Threshold</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Days to show as "soon"</Text>
          <Text style={styles.valueBox}>3</Text>
        </View>

        <TouchableOpacity style={styles.button}
        onPress={() => router.push("/settings/locations")}>
          <Text style={styles.buttonText}>Manage Storage Locations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => sendTestNotification(5)}>
          <Text style={styles.buttonText}>Send test notification (5s)</Text>
        </TouchableOpacity>

      </View>

      {/* footer */}
      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("/shopping-list")}
        >
          <Text style={styles.footerText}>Shopping</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("/")}
        >
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push("/settings/setting_index")}
        >
          <Text style={styles.footerText}>Settings</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  // main container
  container: {
    flex: 1,
    backgroundColor: "#fff",
    minHeight: "100%",
  },

  // header
  settingsHeader: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },

  settingsHeaderText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },

  // content
  content: {
    padding: 20,
    paddingBottom: 120,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
  },

  valueBox: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 6,
  },

  button: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },

  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  // footer
  footer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    height: 60,
    backgroundColor: "#f2f2f2",
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  footerItem: {
    flex: 1,
    alignItems: "center",
  },

  footerText: {
    fontSize: 16,
    color: "#333",
  },

  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#ccc",
  },
});
