import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import { createPaymentIntent } from "../firebase";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import { useClientSecret } from "../context/ClientSecretContext";

const CreditScreen = () => {
  const stripe = useStripe();
  // const [clientSecret, setClientSecret] = useState("");
  const {clientSecret, setClientSecret} = useClientSecret();
  console.log(clientSecret);
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
      const { paymentMethod, error: errorPaymentMethod } = await stripe.createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: cardDetails
      });

      if (errorPaymentMethod) {
        console.error("Error creating payment method:", errorPaymentMethod);
        setPaymentResult("Payment failed");
      } else {
        const { error } = await stripe.confirmPayment(clientSecret, paymentMethod);
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
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          console.log('cardDetails', cardDetails);
          setCardDetails(cardDetails);
        }}
        onFocus={(focusedField) => {
          console.log('focusField', focusedField);
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
