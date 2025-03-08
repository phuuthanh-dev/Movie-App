import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, Text } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from './../screens/ProfileScreen';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FavoriteScreen from "../screens/FavortieScreen";

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#001c29",
          height: Platform.OS === "ios" ? 88 : 68,
          borderTopWidth: 0,
          elevation: 0,
          position: "absolute",
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, size }) => {
          let icon;
          size = 24;
          switch (route.name) {
            case "Home":
              icon = <Entypo name="home" size={size} color={focused ? "#ffb703" : "white"} />
              break;
            case "Search":
              icon = <AntDesign name="search1" size={size} color={focused ? "#ffb703" : "white"} />;
              break;
            case "Favorite":
              icon = <MaterialIcons name="favorite" size={size} color={focused ? "#ffb703" : "white"} />
              break;
            case "Profile":
              icon = <FontAwesome5 name="user" size={size} color={focused ? "#ffb703" : "white"} />
              break;
          }
          return icon;
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarLabel({ focused }) {
          return (
            <Text
              style={{
                color: focused ? "#ffb703" : "white",
                fontSize: 12,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              {route.name}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorite" component={FavoriteScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
