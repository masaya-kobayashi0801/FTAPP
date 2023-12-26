import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import CreditScreen from "./screens/CreditScreen";
import { auth } from "./firebase";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Ionicons from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

async function loadFonts() {
  await Font.loadAsync({
    ...Ionicons.font,
  });
}

export default function App() {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setUser(user);
      } else {
        setUser("");
      }
    });
    loadFonts().then(() => setFontsLoaded(true));
    return () => unsubscribe();
  }, []);
  if (!fontsLoaded || loading) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                      iconName = focused
                        ? "md-checkbox"
                        : "md-checkbox-outline";
                    } else if (route.name === "Timer") {
                      iconName = focused ? "md-timer" : "md-timer-outline";
                    } else if (route.name === "Credit") {
                      iconName = focused ? "card" : "card-outline";
                    }
                    return (
                      <Ionicons name={iconName} size={size} color={color} />
                    );
                  },
                  tabBarActiveTintColor: "#2196F3",
                  tabBarInactiveTintColor: "gray",
                })}
              >
                {user ? (
                  <>
                    <Stack.Screen name="Home" component={HomeScreen} />
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
        </PersistGate>
      </Provider>
    );
  }
}
