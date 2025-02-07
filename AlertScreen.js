import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Audio } from "expo-av";

const AlertPage = () => {
  const [alertTime, setAlertTime] = useState(null); // Initially null until user sets time
  const [showPicker, setShowPicker] = useState(false);
  const [sound, setSound] = useState(null);
  const [alertTriggered, setAlertTriggered] = useState(false); // Prevent multiple alerts

  useEffect(() => {
    const checkAlert = setInterval(async () => {
      if (!alertTime) return; // Skip if no time is set

      const now = new Date();
      const alertDateTime = new Date(alertTime);

      if (
        now.getHours() === alertDateTime.getHours() &&
        now.getMinutes() === alertDateTime.getMinutes() &&
        now.getSeconds() === alertDateTime.getSeconds()
      ) {
        if (!alertTriggered) {
          setAlertTriggered(true);
          await triggerAlert();
        }
      } else {
        setAlertTriggered(false); // Reset flag once the second has passed
      }
    }, 1000);

    return () => clearInterval(checkAlert);
  }, [alertTime, alertTriggered]);

  const triggerAlert = async () => {
    Alert.alert("⏰ Time's Up!", "Your alert time has been reached.");
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/buzzer.mp3")
      );
      setSound(sound);
      await sound.playAsync();

      // Ensure the sound stops after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setAlertTime(selectedTime);
      setAlertTriggered(false); // Reset alert flag when a new time is set
    }
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ Set Your Alert</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.buttonText}>Pick Alert Time</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={alertTime || new Date()} // Default to current time
          mode="time"
          display="spinner"
          is24Hour={false} // Enables AM/PM format
          onChange={handleTimeChange}
        />
      )}

      {alertTime && (
        <Text style={styles.alertText}>
          Alert Set for:{" "}
          {new Date(alertTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
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
  button: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 8,
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
});

export default AlertPage;
