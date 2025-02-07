import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import song1 from "./assets/song1.mp3";
import song2 from "./assets/song2.mp3";
import song3 from "./assets/song3.mp3";
import song4 from "./assets/song4.mp3";
import image1 from "./assets/song1.jpeg";
import image2 from "./assets/song2.gif";
import image3 from "./assets/song3.jpeg";
import image4 from "./assets/song4.jpeg";
import rainfall from "./assets/rainfall.mp3";

const songs = [
  {
    id: "1",
    title: "Song 1",
    artist: "Artist 1",
    uri: song1,
    image: {image1}, // Replace with your image URLs
  },
  {
    id: "2",
    title: "Song 2",
    artist: "Artist 2",
    uri: song2,
    image: {image2},
  },
  {
    id: "3",
    title: "Song 3",
    artist: "Artist 3",
    uri: song3,
    image: {image3},
  },
  {
    id: "4",
    title: "Song 4",
    artist: "Artist 4",
    uri: song4,
    image: {image4},
  },
  {
    id: "5",
    title: "Song 5",
    artist: "Artist 5",
    uri: rainfall,
    image: "https://placekitten.com/204/204",
  },
];

const FrequencyScreen = () => {
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSong = async (uri) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(newSound);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.songTitle}>{item.title}</Text>
      <Text style={styles.artist}>{item.artist}</Text>
      <TouchableOpacity
        onPress={() => playSong(item.uri)}
        style={styles.playButton}
      >
        <MaterialIcons name="play-arrow" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frequency</Text>
      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3} // Reduce grid item size with 3 columns
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  gridItem: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    minWidth: 100,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  songTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  artist: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "center",
  },
  playButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 50,
    marginTop: 5,
  },
});

export default FrequencyScreen;
