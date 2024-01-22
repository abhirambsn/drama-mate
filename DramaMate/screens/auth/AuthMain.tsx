import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Login from "./Login";
import Register from "./Register";

const AuthStack = createNativeStackNavigator();

const AuthMain = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
};

export default AuthMain;
