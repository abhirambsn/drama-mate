import { Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

type Props = {
  title: string;
  image: string;
  link: string;
};

const SearchResult = ({ title, image, link }: Props) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("DramaDetail", {
          title,
          image,
          link,
          recommended_by: null,
        } as DramaDetailRouteParams)
      }
      className="mt-4 flex flex-row items-center space-x-5"
    >
      <Image
        source={{ uri: image }}
        style={{objectFit: 'contain'}}
        className="h-20 w-20 object-contain rounded-lg"
      />

      <Text className="text-gray-800 text-lg dark:text-gray-200">{title}</Text>
    </TouchableOpacity>
  );
};

export default SearchResult;
