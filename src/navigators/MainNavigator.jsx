import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import MovieDetailScreen from "../screens/movie-detail/MovieDetailScreen";
import WatchMovieScreen from './../screens/WatchMovieScreen';
import ActorDetailScreen from "../screens/actor-detail/ActorDetailScreen";

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="Main" component={DrawerNavigator} /> */}
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="MovieDetailScreen" component={MovieDetailScreen} />
      <Stack.Screen name="WatchMovieScreen" component={WatchMovieScreen} />
      <Stack.Screen name="ActorDetailScreen" component={ActorDetailScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
