import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { createCardDetails } from "../actions/cardDetailsActions";
import { createClientSecret } from "../actions/clientSecretAction";
import { createCustomer } from "../actions/customerAction";
import { createPaymentMethods } from "../actions/paymentMethodsAction";
import {
  createPaymentSheet,
  createPaymentIntent,
  getPaymentMethods,
} from "../firebase";

const CreditScreen = () => {
  const cardFieldRef = useRef();
  // useState
  const [cardDetails, setCardDetails] = useState({});
  const [loading, setLoading] = useState(false);
  // redux
  const dispatch = useDispatch();
  const clientSecret = useSelector((state) => state.clientSecret.clientSecret);
  const customerId = useSelector((state) => state.customer.customer);
  const paymentMethods = useSelector(
    (state) => state.paymentMethods.paymentMethods
  );
  // stripe
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleClear = () => {
    // CardFieldの値をクリア
    cardFieldRef.current.clear();
  };

  // カードの登録のみを行う
  const handleRegisterCard = async () => {
    try {
      dispatch(createCardDetails(cardDetails));
      console.log("Card registered successfully!");
      // handleClear();
    } catch (error) {
      console.error("Error registering card:", error);
    }
  };
  // 後ほど削除
  const initState = () => {
    dispatch(createCardDetails({}));
    dispatch(createClientSecret(""));
    dispatch(createCustomer(""));
  };

  // PaymentSheetからパラメーター取得
  const fetchPaymentSheetParams = async () => {
    const response = await createPaymentSheet();
    const { setupIntent, ephemeralKey, customer } = response.data;

    return {
      setupIntent,
      ephemeralKey,
      customer,
    };
  };
  // paymentSheet初期化
  const initializePaymentSheet = async () => {
    const { setupIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();
    // storeにdispatchする
    dispatch(createCustomer(customer));

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
    });
    console.log("error", error);
    if (!error) {
      setLoading(true);
    }
  };

  // presentPaymentSheetの呼び出し
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      console.log(error);
    } else {
      try {
        // 登録した顧客のpaymentMethodを取得する
        const response = await getPaymentMethods(customerId);
        const paymentMethods = response.data;
        // storeにdispatchする
        dispatch(createPaymentMethods(paymentMethods));
      } catch (e) {
        console.error("Error creating payment methods:", e);
      }
    }
  };
  // テスト用
  const handleCheckout = async () => {
    try {
      await createPaymentIntent({
        // storeから取得するけどテストでuseStateから取得
        customerId: customerId,
        paymentMethodId: paymentMethods.data[0].id,
      });
      // 成功した場合の追加の処理をここに記述する
      console.log("成功しました");
    } catch (error) {
      // エラーが発生した場合の処理をここに記述する
      console.error("エラーが発生しました:", error);
      // エラーをユーザーに通知するなどの適切な処理を行う
    }
  };

  useEffect(() => {
    if (!customerId) {
      initializePaymentSheet();
    }
  }, []);

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
        <TouchableOpacity style={[styles.buttonContainer]} onPress={initState}>
          <Text style={styles.buttonText}>initState</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonContainer]}
          disabled={!loading}
          onPress={openPaymentSheet}
        >
          {/* テキスト名変更する */}
          <Text style={styles.buttonText}>Set Up</Text>
        </TouchableOpacity>
        {/* テスト用 */}
        <TouchableOpacity
          style={[styles.buttonContainer]}
          disabled={!loading}
          onPress={handleCheckout}
        >
          <Text style={styles.buttonText}>決済テスト</Text>
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
