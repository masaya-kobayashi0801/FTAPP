import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import { createPaymentIntent } from "../firebase";

const CreditScreen = () => {
  const { handleCardAction } = useStripe();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentResult, setPaymentResult] = useState("");
  const [cardDetails, setCardDetails] = useState({});

  const handleCardFieldChange = (event) => {
    if (event.complete) {
      setCardDetails(event.values);
    }
  };

  const handleRegisterCard = async () => {
    try {
      const response = await createPaymentIntent({
        amount: 1000,
        currency: "usd",
      });
      const clientSecret = response.data.clientSecret;
      setClientSecret(clientSecret);
      console.log("Card registered successfully!");
    } catch (error) {
      console.error("Error registering card:", error);
    }
  };

  const handlePayPress = async () => {
    try {
      await handleRegisterCard(); // クレジット情報を登録
      const { error } = await handleCardAction(clientSecret, cardDetails);
      if (error) {
        console.error("Error processing payment:", error);
        setPaymentResult("Payment failed");
      } else {
        console.log("Payment successful!");
        setPaymentResult("Payment successful!");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentResult("Payment failed");
    }
  };

  return (
    <StripeProvider publishableKey="">
      <View>
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: "1234 5678 9012 3456",
            expiration: "MM/YY",
            cvc: "CVC",
          }}
          onCardChange={handleCardFieldChange}
        />
        <Button title="Register Card" onPress={handleRegisterCard} />
        <Button title="Pay" onPress={handlePayPress} />
        <Text>{paymentResult}</Text>
      </View>
    </StripeProvider>
  );
};

export default CreditScreen;
