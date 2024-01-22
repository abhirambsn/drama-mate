import {
  View,
  Text,
  SafeAreaView,
  Button,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import supabaseClient from "../../lib/supabase";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const logos = {
  google:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1920px-Google_%22G%22_logo.svg.png",
  discord:
    "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
  email: "",
};

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [manageOpen, setManageOpen] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();

  const unlink = async (provider: string) => {
    setLoading(true);
    const identity = user?.identities.find((i: any) => i.provider === provider);
    if (!identity) return;
    const { error } = await supabaseClient.auth.unlinkIdentity(identity);
    if (error) {
      Alert.alert("Error Occurred", error.message);
      setLoading(false);
      return;
    }
    Alert.alert("Success", "Identity unlinked successfully!");
    setRefresh(true);
    setLoading(false);
  };
  const unlinkID = async (provider: string) => {
    if (!user) return;

    Alert.alert(
      "Unlink Identity",
      `Are you sure you want to unlink your ${
        provider.charAt(0).toUpperCase() + provider.substring(1)
      } identity?`,
      [
        { text: "Cancel" },
        {
          text: "Unlink",
          style: "destructive",
          onPress: async () => await unlink(provider),
        },
      ]
    );
  };

  const logout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await supabaseClient.auth.signOut();
          navigation.navigate("Auth", { screen: "Login" });
        },
      },
    ]);
  };

  const handleClearWatchlist = async () => {
    Alert.alert(
      "Clear Watchlist",
      "Are you sure you want to clear your watchlist?",
      [
        { text: "Cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await supabaseClient
              .from("watchlist")
              .update({ watch_list: [] })
              .match({ user_id: user?.id });
            Alert.alert("Success", "Watchlist cleared successfully!");
            setRefresh(true);
          },
        },
      ]
    );
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        alert(error.message);
        return;
      }
      if (data.session) {
        setUser({
          ...data.session.user,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        setLoading(false);
        setRefresh(false);
        console.log({
          ...data.session.user,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }
    })();
  }, [refresh]);
  return (
    <SafeAreaView
      className={`min-h-screen min-w-screen bg-gray-100 dark:bg-gray-950`}
    >
      {loading && (
        <ActivityIndicator
          size="large"
          className="text-gray-800 dark:text-gray-200"
        />
      )}

      {!loading && (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                setLoading(true);
                setRefresh(true);
              }}
            />
          }
          className="h-full w-full p-5 flex flex-col space-y-10"
        >
          <Text className="text-gray-800 dark:text-gray-100 text-2xl font-bold">
            Profile
          </Text>

          <View className="flex flex-row items-start space-x-4">
            <Image
              source={{ uri: user?.user_metadata?.avatar_url }}
              style={{ objectFit: "contain" }}
              className="h-20 w-20 rounded-xl object-contain"
            />
            <View className="flex flex-col">
              <Text className="font-bold text-lg text-gray-800 dark:text-gray-100">
                {user?.user_metadata?.full_name}
              </Text>
              <Text className="font-semibold text-gray-800 dark:text-gray-100">
                Linked Accounts:{" "}
                {user?.app_metadata?.providers
                  .map(
                    (e: string) =>
                      e.substring(0, 1).toUpperCase() + e.substring(1)
                  )
                  .join(", ")}
              </Text>
              <Text className="font-light text-gray-600 dark:text-gray-200">
                Joined on: {new Date(user?.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View className="flex flex-col space-y-4">
            <Text className="text-gray-800 dark:text-gray-100 text-2xl font-bold">
              Settings
            </Text>

            <View className="flex flex-col">
              <TouchableOpacity onPress={() => setManageOpen(true)}>
                <View className="p-2 flex flex-row items-center justify-between space-x-2">
                  <View className="flex flex-row items-center space-x-3">
                    <View className="p-1 items-center flex justify-center bg-sky-500 rounded-xl w-8 h-8">
                      <FontAwesome name="id-card" size={16} color="white" />
                    </View>
                    <Text className="text-gray-800 dark:text-gray-100">
                      Manage ID Providers
                    </Text>
                  </View>
                  <Entypo
                    name="chevron-right"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearWatchlist}>
                <View className="p-2 flex flex-row items-center justify-between space-x-2">
                  <View className="flex flex-row items-center space-x-3">
                    <View className="p-1 items-center flex justify-center bg-amber-500 rounded-xl w-8 h-8">
                      <Feather name="delete" size={16} color="white" />
                    </View>
                    <Text className="text-gray-800 dark:text-gray-100">
                      Clear Watchlist
                    </Text>
                  </View>
                  <Entypo name="chevron-right" size={24} color={colorScheme === "dark" ? "white" : "black"} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <View className="p-2 flex flex-row items-center justify-between space-x-2">
                  <View className="flex flex-row items-center space-x-3">
                    <View className="p-1 items-center flex justify-center bg-red-600 rounded-xl w-8 h-8">
                      <AntDesign name="deleteuser" size={16} color="white" />
                    </View>
                    <Text className="text-gray-800 dark:text-gray-100">
                      Delete Account
                    </Text>
                  </View>
                  <Entypo name="chevron-right" size={24} color={colorScheme === "dark" ? "white" : "black"} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View className="border-t border-gray-300 dark:border-gray-600 items-center flex flex-col justify-end">
            <Button onPress={logout} title="Logout" color="#dc2626" />
          </View>
        </ScrollView>
      )}

      <Modal
        visible={manageOpen}
        onRequestClose={() => setManageOpen(false)}
        presentationStyle="pageSheet"
        animationType="slide"
      >
        <SafeAreaView className="bg-gray-100 dark:bg-gray-950">
          <View className="h-full w-full p-5 space-y-10">
            <Text className="text-gray-800 dark:text-gray-100 text-2xl font-bold">
              Manage ID Providers
            </Text>

            <View className="space-y-2">
              {user?.app_metadata?.providers.map((e: string) => (
                <View
                  className="p-2 flex flex-col space-y-8 items-start justify-between bg-gray-200 dark:bg-gray-800 rounded-xl"
                  key={e}
                >
                  <View className="flex flex-row items-center justify-center space-x-3">
                    {e !== "email" ? (
                      <Image
                        source={{
                          uri: e === "google" ? logos.google : logos.discord,
                        }}
                        style={{ objectFit: "contain" }}
                        className="h-8 w-8"
                      />
                    ) : (
                      <MaterialIcons name="email" size={32} color={colorScheme === 'dark' ? "white" : "black"} />
                    )}
                    <Text className="text-gray-800 dark:text-gray-200 text-xl font-semibold">
                      {e.substring(0, 1).toUpperCase() + e.substring(1)}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center justify-center space-x-5">
                    <Image
                      style={{ objectFit: "contain" }}
                      className="h-10 w-10 rounded-full"
                      source={{
                        uri: user?.identities.find((i: any) => i.provider === e)
                          .identity_data.avatar_url || user?.user_metadata?.avatar_url,
                      }}
                    />
                    <View>
                      <View className="flex flex-row">
                        <Text className="text-gray-800 dark:text-gray-200 font-bold">
                          Email ID:{" "}
                        </Text>
                        <Text className="text-gray-800 dark:text-gray-200">
                          {e === "email"
                            ? user?.email
                            : user?.identities.find(
                                (i: any) => i.provider === e
                              )?.email}
                        </Text>
                      </View>

                      <View className="flex flex-row">
                        <Text className="text-gray-800 dark:text-gray-200 font-bold">
                          Name:{" "}
                        </Text>
                        <Text className="text-gray-800 dark:text-gray-200">
                          {
                            user?.identities.find((i: any) => i.provider === e)
                              .identity_data.name
                          }
                        </Text>
                      </View>

                      <View className="flex flex-row">
                        <Text className="text-gray-800 dark:text-gray-200 font-bold">
                          Linked on:{" "}
                        </Text>
                        <Text className="text-gray-800 dark:text-gray-200">
                          {new Date(
                            user?.identities.find(
                              (i: any) => i.provider === e
                            ).created_at
                          ).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => unlinkID(e)}
                    className="w-full"
                  >
                    <View className="p-1 space-x-2 flex-row w-full items-center flex justify-center border-t border-gray-300">
                      <MaterialIcons name="delete" size={24} color="#dc2626" />
                      <Text className="text-base text-[#dc2626]">
                        Unlink Identity
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
