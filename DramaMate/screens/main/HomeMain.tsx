import { View, useColorScheme, Image } from "react-native";
import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "./Dashboard";
import MyList from "./MyList";
import Profile from "./Profile";
import supabaseClient from "../../lib/supabase";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import DramaDetail from "./DramaDetail";

const HomeMainTab = createBottomTabNavigator();

const HomeMain = () => {
  const colorScheme = useColorScheme();
  const [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        alert(error.message);
        return;
      }
      setUser(data.session?.user);
    })();
  }, []);

  return (
    <HomeMainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#030712" : "#f3f4f6",
        },
      }}
    >
      <HomeMainTab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            !focused ? (
              <AntDesign
                name="home"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            ) : (
              <Entypo
                name="home"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            ),
          tabBarLabel: () => null,
        }}
        component={Dashboard}
      />
      <HomeMainTab.Screen
        name="MyList"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View className={`${!focused && "opacity-50"}`}>
              <Entypo
                name="list"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
        component={MyList}
      />
      <HomeMainTab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={{ uri: user?.user_metadata?.avatar_url }}
              className={`h-9 w-9 object-contain ${
                !focused && "opacity-50"
              } rounded-full`}
              style={{objectFit: 'contain'}}
            />
          ),
          tabBarLabel: () => null,
        }}
        component={Profile}
      />
    </HomeMainTab.Navigator>
  );
};

export default HomeMain;
