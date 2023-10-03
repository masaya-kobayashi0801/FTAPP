import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import TimerScreen from "./screens/TimerScreen";
import CreditScreen from "./screens/CreditScreen";
import { auth } from "./firebase";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLISHABLE_KEY } from "@env";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        console.log(user);
        setUser(user);
      } else {
        setUser("");
      }
    });
    return () => unsubscribe();
  }, []);
  if (loading) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "Home") {
                  iconName = focused ? "md-checkbox" : "md-checkbox-outline";
                } else if (route.name === "Timer") {
                  iconName = focused ? "md-timer" : "md-timer-outline";
                } else if (route.name === "Credit") {
                  iconName = focused ? "card" : "card-outline";
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#2196F3",
              tabBarInactiveTintColor: "gray",
            })}
          >
            {user ? (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Timer" component={TimerScreen} />
                <Stack.Screen name="Credit" component={CreditScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}
          </Tab.Navigator>
        </NavigationContainer>
        {/* //{" "} */}
      </StripeProvider>
    );
  }
}
