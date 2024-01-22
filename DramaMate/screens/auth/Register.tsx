import {
  View,
  Text,
  Button,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/Input";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AntDesign } from "@expo/vector-icons";
import supabaseClient from "../../lib/supabase";

const Register = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setProcessing(true);
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            avatar_url: `https://api.dicebear.com/7.x/initials/png?seed=${name}`,
          },
        },
      });

      if (error) {
        Alert.alert(error.message);
        setProcessing(false);
        return;
      }

      Alert.alert(
        "Success",
        `Welcome ${data.user?.user_metadata.full_name} Please Login to access your account`
      );
      setProcessing(false);
      navigation.goBack();
    } catch (err) {
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
            Register
          </Text>

          <Text className="text-gray-500 dark:text-gray-200 text-base font-light">
            Register to Drama Mate
          </Text>
        </View>

        <View className="flex flex-col space-y-8">
          <Input value={name} setValue={setName} placeholder="Name" />
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
          <Input
            value={confirmPassword}
            setValue={setConfirmPassword}
            placeholder="Re-enter Password"
            password
          />
          <TouchableOpacity
            className="bg-purple-500 dark:bg-purple-800 flex flex-row items-center justify-center space-x-4 p-3 rounded-xl"
            disabled={
              email.length === 0 ||
              password.length === 0 ||
              confirmPassword.length === 0 ||
              processing
            }
            onPress={handleRegister}
          >
            <AntDesign name="login" size={24} color="white" />
            <Text className="text-gray-100 dark:text-gray-100 text-lg">
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Button
            onPress={() => {
              navigation.goBack();
            }}
            title="Already Registered? Login"
            color={colorScheme === "dark" ? "#14b8a6" : "#2dd4bf"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
