import React, { useState } from "react";
import { View, Button } from "react-native";
import { StripeProvider, CardField } from "@stripe/stripe-react-native";
import { createPaymentIntent } from "../firebase";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import { useDispatch } from "react-redux";
import { createCardDetails } from "../actions/cardDetailsActions";
import { createClientSecret } from "../actions/clientSecretAction";

const CreditScreen = () => {
  const [cardDetails, setCardDetails] = useState({});
  const dispatch = useDispatch();

  const handleRegisterCard = async () => {
    try {
      const response = await createPaymentIntent({
        amount: 1000,
        currency: "usd",
      });
      const clientSecret = response.data.clientSecret;
      dispatch(createCardDetails(cardDetails));
      dispatch(createClientSecret(clientSecret));
      console.log("Card registered successfully!");
    } catch (error) {
      console.error("Error registering card:", error);
    }
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <View>
        <CardField
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
        <Button title="Register Card" onPress={handleRegisterCard} />
      </View>
    </StripeProvider>
  );
};

export default CreditScreen;
