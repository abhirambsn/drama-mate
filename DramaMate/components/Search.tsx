import {
  View,
  Text,
  TextInput,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
};

const Search = ({ setValue, value, onSearch }: Props) => {
  const colorScheme = useColorScheme();

  return (
    <View className="mt-2 flex flex-row justify-between p-4 space-x-3 bg-gray-200 rounded-xl dark:bg-slate-900">
      <AntDesign
        name="search1"
        size={18}
        color={colorScheme === "dark" ? "white" : "black"}
      />
      <TextInput
        editable
        maxLength={40}
        onChangeText={(text) => setValue(text)}
        value={value}
        placeholder="Search for Dramas"
        keyboardType="default"
        style={{ width: "80%" }}
        className="text-gray-500 dark:text-gray-300 placeholder:text-gray-500 dark:placeholder:text-gray-300"
        placeholderTextColor={colorScheme == "dark" ? "#d1d5db" : "#6b7280"}
      />
      <TouchableOpacity onPress={onSearch}>
        <AntDesign
          name="arrowright"
          size={16}
          color={colorScheme === "dark" ? "white" : "black"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
