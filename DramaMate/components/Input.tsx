import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";

type Props = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  password?: boolean;
  email?: boolean;
};

const Input = ({ password, setValue, value, placeholder, email }: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] =
    React.useState<boolean>(false);

  const colorScheme = useColorScheme();

  return (
    <View className="mt-2 flex flex-row justify-between p-4 bg-gray-200 rounded-xl dark:bg-slate-900">
      <TextInput
        editable
        maxLength={40}
        onChangeText={(text) => setValue(text)}
        value={value}
        placeholder={placeholder}
        keyboardType={password ? "default" : email ? "email-address" : "default"}
        style={{ width: "90%" }}
        secureTextEntry={(password as boolean) && !isPasswordVisible}
        className="text-gray-500 dark:text-gray-300 placeholder:text-gray-500 dark:placeholder:text-gray-300"
        textContentType={password ? "password" : "emailAddress"}
        placeholderTextColor={colorScheme == "dark" ? "#d1d5db" : "#6b7280"}
      />
      {password && (
        <TouchableOpacity onPress={() => setIsPasswordVisible((p) => !p)}>
          {isPasswordVisible ? (
            <Entypo
              name="eye-with-line"
              size={24}
              color={colorScheme == "dark" ? "white" : "black"}
            />
          ) : (
            <Entypo
              name="eye"
              size={24}
              color={colorScheme == "dark" ? "white" : "black"}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;
