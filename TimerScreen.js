import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useFonts, BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

const Timer = () => {
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [secondsLeft, setSecondsLeft] = useState(workTime);
  const [isWork, setIsWork] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rainSound, setRainSound] = useState(null);
  const [userWorkTime, setUserWorkTime] = useState("25");
  const [userBreakTime, setUserBreakTime] = useState("5");

  const [fontsLoaded] = useFonts({ BebasNeue_400Regular });

  useEffect(() => {
    let interval;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      Vibration.vibrate(500);
      toggleSession();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleSession = () => {
    setIsWork(!isWork);
    setSecondsLeft(isWork ? breakTime : workTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const adjustTime = (amount) => {
    setSecondsLeft((prev) => Math.max(0, prev + amount));
  };

  const handleRainfallSound = async () => {
    if (isPlaying) {
      await rainSound.stopAsync();
      setIsPlaying(false);
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/rainfall.mp3")
      );
      setRainSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return rainSound ? () => rainSound.unloadAsync() : undefined;
  }, [rainSound]);

  const updateTimes = () => {
    const newWorkTime = parseInt(userWorkTime) * 60;
    const newBreakTime = parseInt(userBreakTime) * 60;
    setWorkTime(newWorkTime);
    setBreakTime(newBreakTime);
    setSecondsLeft(newWorkTime);
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={userWorkTime}
          onChangeText={setUserWorkTime}
          placeholder="Work Time (min)"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={userBreakTime}
          onChangeText={setUserBreakTime}
          placeholder="Break Time (min)"
        />
        <TouchableOpacity style={styles.button} onPress={updateTimes}>
          <Text style={styles.buttonText}>Set Times</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.timerContainer}>
        <Text style={styles.title}>{isWork ? "Work Time" : "Break Time"}</Text>
        <View style={styles.circle}>
          <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
        </View>
        <View style={styles.adjustButtons}>
          <TouchableOpacity
            onPress={() => adjustTime(60)}
            style={styles.adjustButton}
          >
            <Text style={styles.adjustText}>+1 min</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => adjustTime(-60)}
            style={styles.adjustButton}
          >
            <Text style={styles.adjustText}>-1 min</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsActive(!isActive)}
        >
          <Text style={styles.buttonText}>{isActive ? "Pause" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSecondsLeft(isWork ? workTime : breakTime)}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rainfallContainer}>
        <TouchableOpacity onPress={handleRainfallSound}>
          <MaterialIcons
            name="water-drop"
            size={50}
            color={isPlaying ? "#00f" : "#fff"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    margin: 5,
    width: 100,
    textAlign: "center",
  },
  timerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, color: "#fff", fontFamily: "BebasNeue_400Regular" },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 6,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  timer: { fontSize: 80, color: "#fff", fontFamily: "BebasNeue_400Regular" },
  adjustButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },
  adjustButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  adjustText: { color: "#fff", fontSize: 18 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "BebasNeue_400Regular",
  },
  rainfallContainer: { alignItems: "center", marginBottom: 20 },
});

export default Timer;
