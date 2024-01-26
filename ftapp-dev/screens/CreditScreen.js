import React, { useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { StripeProvider, CardField } from "@stripe/stripe-react-native";
import { createPaymentIntent } from "../firebase";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { createCardDetails } from "../actions/cardDetailsActions";
import { createClientSecret } from "../actions/clientSecretAction";

const CreditScreen = () => {
  const cardFieldRef = useRef();
  const [cardDetails, setCardDetails] = useState({});
  const dispatch = useDispatch();
  const clientSecret = useSelector((state) => state.clientSecret.clientSecret);

  const handleClear = () => {
    // CardFieldの値をクリア
    cardFieldRef.current.clear();
  };

  const handleRegisterCard = async () => {
    try {
      const response = await createPaymentIntent({
        amount: 1000,
        currency: "usd",
      });
      const newClientSecret = response.data.clientSecret;
      dispatch(createCardDetails(cardDetails));
      dispatch(createClientSecret(newClientSecret));
      console.log("Card registered successfully!");
      handleClear();
    } catch (error) {
      console.error("Error registering card:", error);
    }
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <View>
        <CardField
          ref={cardFieldRef}
          postalCodeEnabled={false}
          placeholders={{
            number: "4242 4242 4242 4242",
          }}
          cardStyle={{
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
          }}
          style={{
            width: "100%",
            height: 50,
            marginVertical: 30,
          }}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails);
          }}
          onFocus={(focusedField) => {
            console.log("focusField", focusedField);
          }}
        />
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            { backgroundColor: clientSecret ? "#808080" : "#2196F3" },
          ]}
          onPress={handleRegisterCard}
          disabled={!!clientSecret}
        >
          <Text style={styles.buttonText}>Register Card</Text>
        </TouchableOpacity>
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "50%",
    alignSelf: "center", // 中央に配置する
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});

export default CreditScreen;
