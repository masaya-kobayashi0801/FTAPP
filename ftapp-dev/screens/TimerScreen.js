import React from "react";
import { View,Text } from "react-native";
// FirebaseとStripeのモジュールをインポートする
import 'firebase/auth';
import 'firebase/firestore';

const TimerScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Timer Screen</Text>
    </View>
  );
};

export default TimerScreen;
