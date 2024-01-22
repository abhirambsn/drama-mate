import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Input from "../../components/Input";
import supabaseClient from "../../lib/supabase";
import * as WebBrowser from "expo-web-browser";
import { getTokensFromURLFragment } from "../../lib/authManager";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const colorScheme = useColorScheme();
  const [processing, setProcessing] = useState<boolean>(false);

  const redirectURI = Linking.createURL("/");
  useEffect(() => {
    (async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (!data.session || error) {
        return;
      }
      navigation.navigate("HomeMain", { screen: "Home" });
    })();
    console.log(`Redirect URI: ${redirectURI}`);
  }, []);

  const handleEmailLogin = async () => {
    setProcessing(true);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      setProcessing(false);
      return;
    }
    setProcessing(false);
    navigation.navigate("HomeMain", { screen: "Home" });
  };
  const handleDiscordLogin = async () => {
    try {
      setProcessing(true);
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: redirectURI,
        },
      });
      if (error) {
        alert(error.message);
        setProcessing(false);
        return;
      }
      const result = await WebBrowser.openAuthSessionAsync(data.url);
      if (result?.type !== "success") {
        throw result;
      }
      const { accessToken, refreshToken } = getTokensFromURLFragment(
        result.url
      );
      await supabaseClient.auth.setSession({
        access_token: accessToken as string,
        refresh_token: refreshToken as string,
      });
      setProcessing(false);
      navigation.navigate("HomeMain", { screen: "Home" });
    } catch (error: any) {
      console.error(error);
      if (error?.type === "cancel") {
        Alert.alert("Error", "User Cancelled the Operation", [
          { text: "OK", onPress: () => console.log("OK") },
        ]);
      }
      setProcessing(false);
    }
  };
  const handleGoogleLogin = async () => {
    setProcessing(true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectURI,
        },
      });

      if (error) {
        console.log("Got Error");
        throw error;
      }
      const result = await WebBrowser.openAuthSessionAsync(data.url);
      if (result?.type !== "success") {
        throw result;
      }
      const { accessToken, refreshToken } = getTokensFromURLFragment(
        result.url
      );
      await supabaseClient.auth.setSession({
        access_token: accessToken as string,
        refresh_token: refreshToken as string,
      });
      setProcessing(false);
      navigation.navigate("HomeMain", { screen: "Home" });
    } catch (error: any) {
      if (error?.type === "cancel") {
        Alert.alert("Error", "User Cancelled the Operation", [
          { text: "OK", onPress: () => console.log("OK") },
        ]);
      }
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView
      className={`min-h-screen min-w-screen bg-gray-100 dark:bg-gray-950`}
    >
      <View className="h-full w-full p-5 flex flex-col space-y-10">
        <View className="space-y-2">
          <Text className="text-gray-800 dark:text-gray-100 text-4xl font-bold">
            Login
          </Text>

          <Text className="text-gray-500 dark:text-gray-200 text-base font-light">
            Login to your account
          </Text>
        </View>

        <View className="flex flex-col space-y-8">
          <Input
            email={true}
            value={email}
            setValue={setEmail}
            placeholder="Email ID"
          />
          <Input
            value={password}
            setValue={setPassword}
            placeholder="Password"
            password
          />
          <TouchableOpacity
            className="bg-teal-500 dark:bg-teal-800 flex flex-row items-center justify-center space-x-4 p-3 rounded-xl"
            disabled={email.length === 0 || processing}
            onPress={handleEmailLogin}
          >
            <AntDesign name="login" size={24} color="white" />
            <Text className="text-gray-100 dark:text-gray-100 text-lg">
              Login
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center font-light text-lg text-gray-800 dark:text-gray-200">
          OR
        </Text>

        {/* Sign in With Discord */}
        <View className="space-y-4">
          <TouchableOpacity
            disabled={processing}
            onPress={handleDiscordLogin}
            className="bg-[#7289da] flex flex-row items-center justify-center space-x-4 p-3 rounded-lg"
          >
            <Fontisto name="discord" size={24} color="white" />
            <Text className="text-base text-gray-100">
              Sign in with Discord
            </Text>
          </TouchableOpacity>
          {/* Sign in with Google */}
          <TouchableOpacity
            disabled={processing}
            onPress={handleGoogleLogin}
            className="bg-gray-200 dark:bg-gray-900 flex flex-row items-center justify-center space-x-4 p-3 rounded-lg"
          >
            <Fontisto
              name="google"
              size={24}
              color={colorScheme == "dark" ? "white" : "black"}
            />
            <Text className="text-base text-gray-800 dark:text-gray-100">
              Sign in with Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            className="bg-purple-500 dark:bg-purple-800 flex flex-row items-center justify-center space-x-4 p-3 rounded-lg"
          >
            <AntDesign name="adduser" size={24} color="white" />
            <Text className="text-base text-gray-100">Register with Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
