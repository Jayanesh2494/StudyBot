import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const colors = ["#FF6F61", "#6B8E23", "#4682B4", "#DAA520", "#8A2BE2", "#FF4500"];

const ENotebook = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [notebookName, setNotebookName] = useState("");
  const [subtopicName, setSubtopicName] = useState("");
  const [noteText, setNoteText] = useState("");
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);

  const addNotebook = () => {
    if (notebookName.trim() !== "") {
      const color = colors[notebooks.length % colors.length];
      setNotebooks([
        ...notebooks,
        { id: Date.now().toString(), name: notebookName, subtopics: [], color },
      ]);
      setNotebookName("");
    }
  };

  const addSubtopic = () => {
    if (selectedNotebook && subtopicName.trim() !== "") {
      const updatedNotebooks = notebooks.map((notebook) => {
        if (notebook.id === selectedNotebook.id) {
          return {
            ...notebook,
            subtopics: [
              ...notebook.subtopics,
              { id: Date.now().toString(), name: subtopicName, notes: [] },
            ],
          };
        }
        return notebook;
      });
      setNotebooks(updatedNotebooks);
      setSubtopicName("");
    }
  };

  const addNote = () => {
    if (selectedNotebook && selectedSubtopic && noteText.trim() !== "") {
      const updatedNotebooks = notebooks.map((notebook) => {
        if (notebook.id === selectedNotebook.id) {
          return {
            ...notebook,
            subtopics: notebook.subtopics.map((subtopic) => {
              if (subtopic.id === selectedSubtopic.id) {
                return {
                  ...subtopic,
                  notes: [...subtopic.notes, noteText],
                };
              }
              return subtopic;
            }),
          };
        }
        return notebook;
      });
      setNotebooks(updatedNotebooks);
      setNoteText("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 My Notebooks</Text>
      {!selectedNotebook ? (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter notebook name..."
              placeholderTextColor="#555"
              value={notebookName}
              onChangeText={setNotebookName}
            />
            <TouchableOpacity onPress={addNotebook} style={styles.addButton}>
              <MaterialIcons name="add" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.notebooksGrid}>
            {notebooks.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.notebook, { backgroundColor: item.color }]}
                onPress={() => setSelectedNotebook(item)}
              >
                <Text style={styles.notebookText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : !selectedSubtopic ? (
        <>
          <Text style={styles.subtitle}>{selectedNotebook.name}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter subtopic name..."
              placeholderTextColor="#555"
              value={subtopicName}
              onChangeText={setSubtopicName}
            />
            <TouchableOpacity onPress={addSubtopic} style={styles.addButton}>
              <MaterialIcons name="add" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.notebooksGrid}>
            {selectedNotebook.subtopics.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                style={[styles.notebook, { backgroundColor: "#888" }]}
                onPress={() => setSelectedSubtopic(sub)}
              >
                <Text style={styles.notebookText}>{sub.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setSelectedNotebook(null)}
            style={styles.backButton}
          >
            <Text style={styles.backText}>⬅ Back</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>{selectedSubtopic.name}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter note..."
              placeholderTextColor="#555"
              value={noteText}
              onChangeText={setNoteText}
            />
            <TouchableOpacity onPress={addNote} style={styles.addButton}>
              <MaterialIcons name="add" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {selectedSubtopic.notes.map((note, index) => (
              <Text key={index} style={styles.note}>{`• ${note}`}</Text>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setSelectedSubtopic(null)}
            style={styles.backButton}
          >
            <Text style={styles.backText}>⬅ Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#222",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#333",
  },
  addButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  notebooksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  notebook: {
    width: "22%",
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  notebookText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
export default ENotebook;
