import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import { createPaymentIntent } from "../firebase";
import { STRIPE_PUBLISHABLE_KEY } from "@env";

const CreditScreen = () => {
  const { handleCardAction, createToken } = useStripe(); // createTokenを追加
  const [clientSecret, setClientSecret] = useState("");
  const [paymentResult, setPaymentResult] = useState("");
  const [cardDetails, setCardDetails] = useState({});

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
      const { token, error: errorToken } = await createToken({
        type: "card",
        card: cardDetails
        // {
        //   number: "4242424242424242",
        //   expMonth: 11,
        //   expYear: 26,
        //   cvc: "223",
        //   type: 'Visa'
        // },
      }); // トークンを生成する
      if (errorToken) {
        console.error("Error creating token:", errorToken);
        setPaymentResult("Payment failed");
      } else {
        const { error } = await handleCardAction(clientSecret, token); // トークンを渡す
        if (error) {
          console.error("Error processing payment:", error);
          setPaymentResult("Payment failed");
        } else {
          console.log("Payment successful!");
          setPaymentResult("Payment successful!");
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentResult("Payment failed");
    }
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <View>
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: "1234 5678 9012 3456",
            expiration: "MM/YY",
            cvc: "CVC",
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
            console.log("cardDetails", cardDetails);
            setCardDetails(cardDetails);
          }}
        />
        <Button title="Register Card" onPress={handleRegisterCard} />
        <Button title="Pay" onPress={handlePayPress} />
        <Text>{paymentResult}</Text>
      </View>
    </StripeProvider>
  );
};

export default CreditScreen;
