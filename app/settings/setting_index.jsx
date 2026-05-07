import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "@/src/database/DatabaseManager";
import { cancelAllNotifications, rescheduleAll, sendTestNotification } from "@/src/services/notificationScheduler";

export default function Setting_Index() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [daysBefore, setDaysBefore] = useState(3);
  const [expiryThreshold, setExpiryThreshold] = useState(3);

  useFocusEffect(useCallback(() => {
      const prefs = db.getFirstSync('SELECT enabled, daysBefore, expiryThreshold FROM notification_preferences WHERE id = 1');
      if (prefs) { setNotificationsEnabled(!!prefs.enabled); setDaysBefore(prefs.daysBefore); setExpiryThreshold(prefs.expiryThreshold); }
  }, []));

  const handleThresholdChange = (text) => {
      const val = parseInt(text);
      setExpiryThreshold(text);
      if (!isNaN(val) && val > 0) db.runSync('UPDATE notification_preferences SET expiryThreshold = ? WHERE id = 1', [val]);
  };

  const handleDaysBeforeChange = (text) => {
      const val = parseInt(text);
      setDaysBefore(text);
      if (!isNaN(val) && val > 0) {
          db.runSync('UPDATE notification_preferences SET daysBefore = ? WHERE id = 1', [val]);
          if (notificationsEnabled) rescheduleAll();
      }
  };

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
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: "#3e3e3e", true: "#007bff" }}
            thumbColor={notificationsEnabled ? "#fff" : "#aaa"}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Days before expiry</Text>
          <TextInput
            style={styles.valueBox}
            value={String(daysBefore)}
            onChangeText={handleDaysBeforeChange}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>

        {/* expiring soon */}
        <Text style={styles.sectionTitle}>Expiring Soon Threshold</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Days to show as "soon"</Text>
          <TextInput
            style={styles.valueBox}
            value={String(expiryThreshold)}
            onChangeText={handleThresholdChange}
            keyboardType="numeric"
            maxLength={2}
          />
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
    backgroundColor: "#151B20",
    minHeight: "100%",
  },

  // header
  settingsHeader: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#1C262E",
    borderBottomWidth: 1,
    borderColor: "#2D3848",
    alignItems: "center",
  },

  settingsHeaderText: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    color: "#f0f0f0",
  },

  // content
  content: {
    padding: 20,
    paddingBottom: 120,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    marginTop: 25,
    marginBottom: 10,
    color: "#f0f0f0",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    color: "#f0f0f0",
    fontFamily: "Poppins_400Regular",
  },

  valueBox: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#24323D",
    borderRadius: 6,
    fontFamily: "Poppins_400Regular",
    color: "#f0f0f0",
  },

  button: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: "#2D3848",
    borderRadius: 8,
  },

  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#f0f0f0",
  },

  // footer
  footer: {
    position: "absolute",
    bottom: 50,
    left: 14,
    right: 14,
    height: 60,
    backgroundColor: "#1C262E",
    borderRadius: 12,
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
    color: "#f0f0f0",
    fontFamily: "Poppins_600SemiBold",
  },

  separator: {
    width: 1,
    height: "60%",
    backgroundColor: "#32404D",
  },
});
