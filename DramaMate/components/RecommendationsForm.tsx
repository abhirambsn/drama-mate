import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";

type Props = {
  language: string;
  type: string;
  num: number;
  setLanguage: (language: string) => void;
  setType: (type: string) => void;
  setNum: (num: number) => void;
};

const RecommendationsForm = ({
  language,
  setLanguage,
  type,
  setType,
  num,
  setNum,
}: Props) => {
  const colorScheme = useColorScheme();
  return (
    <View className="mt-2 w-full">
      <View className="flex flex-row w-full">
        <View className="flex-grow">
          <Text className="text-lg text-center text-gray-800 dark:text-gray-200">
            Language
          </Text>
          <Picker
            selectedValue={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <Picker.Item
              color={colorScheme === "dark" ? "#e5e7eb" : "#1f2937"}
              label="Japanese"
              value="japanese"
            />
            <Picker.Item
              color={colorScheme === "dark" ? "#e5e7eb" : "#1f2937"}
              label="Korean"
              value="korean"
            />
            <Picker.Item
              color={colorScheme === "dark" ? "#e5e7eb" : "#1f2937"}
              label="Chinese"
              value="chinese"
            />
          </Picker>
        </View>

        <View className="flex-grow">
          <Text className="text-lg text-center text-gray-800 dark:text-gray-200">
            Type
          </Text>
          <Picker
            selectedValue={type}
            onValueChange={(value) => setType(value)}
          >
            <Picker.Item
              color={colorScheme === "dark" ? "#e5e7eb" : "#1f2937"}
              label="Drama"
              value="drama"
            />
            <Picker.Item
              color={colorScheme === "dark" ? "#e5e7eb" : "#1f2937"}
              label="Movie"
              value="movie"
            />
          </Picker>
        </View>
      </View>

      <View className="flex flex-row items-center justify-between">
        <Text className="text-lg text-gray-800 dark:text-gray-200">
          Recommendations Required
        </Text>
        <View className="flex flex-row items-center justify-center space-x-3">
          <TouchableOpacity
            disabled={num === 0}
            onPress={() => {
              if (num > 0) {
                setNum(num - 1);
              }
            }}
          >
            <Text className="text-lg text-gray-800 dark:text-gray-200">-</Text>
          </TouchableOpacity>
          <Text className="text-lg text-gray-800 dark:text-gray-200">
            {num}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setNum(num + 1);
            }}
          >
            <Text className="text-lg text-gray-800 dark:text-gray-200">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RecommendationsForm;
