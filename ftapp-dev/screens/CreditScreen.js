import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { Button } from "react-native";
import { createPaymentIntent } from "../firebase";

const CreditScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [clientSecret, setClientSecret] = useState();

  useEffect(() => {
    fetchClientSecret();
  }, []);

  const fetchClientSecret = async () => {
    try {
      const response = await createPaymentIntent({
        amount: 1000,
        currency: "usd",
      });
      console.log(response);

      const clientSecret  = response.data.clientSecret;
      setClientSecret(clientSecret);
    } catch (error) {
      console.error(error);
    }
  };


  const handlePayPress = async () => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName:'FTAPP'
    });
    console.log("dbg001" + JSON.stringify(error));
    // 支払いシートの初期化が成功した場合
    if (!error) {
      const result = await presentPaymentSheet({ clientSecret });
      if (result.error) {
        console.log("Error:", result.error);
      } else {
        console.log("Success:", result);
      }
    }
  };
  return (
    <StripeProvider publishableKey="pk_test_51NLmv2L6bJX7Rc74BmprifyOxugWuyUSiRVhMnV5GgJ9c6Df8aWASAP5fjcsMAhFxmax2jdsEp7xPEQ5YiDnjnhK00ldQfphTf">
      <CardField postalCodeEnabled={false} />
      <Button title="Pay" onPress={handlePayPress} />
    </StripeProvider>
  );
};

export default CreditScreen;
