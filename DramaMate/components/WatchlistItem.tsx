import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { removeFromWatchlist } from "../lib/apiHandler";

type Props = {
  item: WatchListData;
  access_token: string;
};

const WatchlistItem = ({ item, access_token }: Props) => {
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();

  const deleteFromWatchlist = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this title from your watchlist?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            await removeFromWatchlist(item.link as string, access_token);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View className="my-2 flex flex-row items-center justify-between">
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DramaDetail", {
            title: item.name,
            image: item.image,
            link: item.link,
          })
        }
        className="flex flex-row space-x-4"
      >
        <Image
          source={{ uri: item.image }}
          style={{ objectFit: "contain" }}
          className="w-10 h-10 object-contain rounded-lg"
        />
        <View className="flex flex-col space-y-1">
          <Text className="text-gray-800 dark:text-gray-200">
            {item.name.length >= 30
              ? item.name.slice(0, 30) + "..."
              : item.name}
          </Text>
          <Text className="text-gray-800 dark:text-gray-200">{item.state}</Text>
          {item.recommended_by && (
            <Text className="text-gray-800 dark:text-gray-200">
              {item.recommended_by}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View className="flex flex-row space-x-4">
        <TouchableOpacity>
          <AntDesign
            name="edit"
            size={24}
            color={colorScheme === "dark" ? "gray" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteFromWatchlist}>
          <MaterialIcons name="delete" size={24} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WatchlistItem;
