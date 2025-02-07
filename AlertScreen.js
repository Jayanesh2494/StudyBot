import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Audio } from "expo-av";

const AlertPage = () => {
  const [alertTime, setAlertTime] = useState(null);
  const [alertName, setAlertName] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
    })();
  }, []);

  useEffect(() => {
    const checkAlarm = setInterval(async () => {
      if (!alertTime) return;
      const now = new Date();
      const alarmTime = new Date(alertTime);
      if (
        now.getHours() === alarmTime.getHours() &&
        now.getMinutes() === alarmTime.getMinutes() &&
        now.getSeconds() === alarmTime.getSeconds()
      ) {
        console.log("⏰ ALARM TRIGGERED!");
        clearInterval(checkAlarm);
        await triggerAlert();
      }
    }, 1000);
    return () => clearInterval(checkAlarm);
  }, [alertTime]);

  const triggerAlert = async () => {
    Alert.alert("⏰ Alarm!", `Time for: ${alertName || "Unnamed Alarm"}`);
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/buzzer.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleSetAlert = () => {
    if (!selectedTime) {
      Alert.alert("⚠️ Error", "Please pick a time first!");
      return;
    }
    setAlertTime(selectedTime);
    Alert.alert(
      "✅ Alarm Set",
      `Alarm for ${alertName || "Unnamed"} at ${selectedTime.toLocaleTimeString()}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ Set Your Alarm</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Alarm Name"
        placeholderTextColor="#ccc"
        value={alertName}
        onChangeText={setAlertName}
      />

      {/* 🖥️ Web Version - Uses <input type="time"> */}
      {Platform.OS === "web" ? (
        <input
          type="time"
          onChange={(e) => setSelectedTime(new Date(`1970-01-01T${e.target.value}:00`))}
          style={styles.webTimeInput}
        />
      ) : (
        // 📱 Mobile Version - Uses DateTimePicker
        <TouchableOpacity style={styles.button} onPress={() => setShowPicker(true)}>
          <Text style={styles.buttonText}>Pick Alarm Time</Text>
        </TouchableOpacity>
      )}

      {selectedTime && (
        <Text style={styles.alertText}>
          Selected Time: {selectedTime.toLocaleTimeString()}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSetAlert}>
        <Text style={styles.buttonText}>Set Alert</Text>
      </TouchableOpacity>

      {alertTime && (
        <Text style={styles.alertText}>
          Alarm Set for: {new Date(alertTime).toLocaleTimeString()} ({alertName || "Unnamed Alarm"})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    width: "80%",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  alertText: {
    marginTop: 20,
    fontSize: 18,
    color: "#fff",
  },
  webTimeInput: {
    padding: 10,
    margin: 10,
    fontSize: 18,
  },
});

export default AlertPage;
