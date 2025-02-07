import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import TimerScreen from "./TimerScreen";
import FrequencyScreen from "./FrequencyScreen";
import ENotebookScreen from "./ENotebookScreen";
import StudyBotScreen from "./StudyBotScreen";
import AlertScreen from "./AlertScreen";

const Tab = createBottomTabNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Timer") {
              iconName = focused ? "time" : "time-outline";
            } else if (route.name === "E Notebook") {
              iconName = focused ? "book" : "book-outline";
            } else if (route.name === "Study Bot") {
              iconName = focused ? "robot" : "md-robot";
            } else if (route.name === "Frequency") {
              iconName = focused ? "wifi" : "wifi-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#f8f8f8", paddingBottom: 5 },
          headerStyle: { backgroundColor: "#6200ee" },
          headerTitleStyle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        })}
      >
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="E Notebook" component={ENotebookScreen} />
        <Tab.Screen name="Study Bot" component={StudyBotScreen} />
        <Tab.Screen name="Frequency" component={FrequencyScreen} />
        <Tab.Screen name ="Alert" component={AlertScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default App;
