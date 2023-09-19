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

// import React, { useState, useEffect } from "react";
// import "firebase/functions";
// import { View, Text, Button } from "react-native";
// import {
//   initStripe,
//   CardField,
//   useStripe,
//   // useConfirmPayment,
// } from "@stripe/stripe-react-native";

// const PUBLISHABLE_KEY =
//   "pk_test_51NLmv2L6bJX7Rc74BmprifyOxugWuyUSiRVhMnV5GgJ9c6Df8aWASAP5fjcsMAhFxmax2jdsEp7xPEQ5YiDnjnhK00ldQfphTf";

// const CreditScreen = () => {
//   // カード情報や支払い状態を管理するステートを作ります
//   const [cardDetails, setCardDetails] = useState();
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");
//   // stripeのフックを使って、支払い処理に必要な関数を取得します
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();

//   useEffect(() => {
//     initStripe({
//       publishableKey: PUBLISHABLE_KEY,
//     });
//   }, []);

//   // 支払いボタンが押されたときの処理を定義します
//   const handlePayPress = async () => {
//     // ローディング状態にします
//     setLoading(true);
//     // サーバーから支払い情報を取得します（ここでは仮のデータを使います）
//     const paymentInfo = await fetchPaymentInfo();
//     console.log(paymentInfo);

//     const { error } = await initPaymentSheet({
//       paymentIntentClientSecret: paymentInfo.clientSecret,
//     });
//     // エラーがなければ、支払いシートを表示します
//     if (!error) {
//       presentPaymentSheet({ clientSecret: paymentInfo.clientSecret })
//         .then((result) => {
//           // 支払いが成功したら、ステータスを更新します
//           if (result.paymentResultType === "Succeeded") {
//             setStatus("支払が完了しました");
//           }
//         })
//         .catch((error) => {
//           // 支払いが失敗したら、エラーを表示します
//           setStatus(`支払に失敗しました：${error.code}`);
//         })
//         .finally(() => {
//           // ローディング状態を解除します
//           setLoading(false);
//         });
//     } else {
//       // 初期化に失敗したら、エラーを表示します
//       setStatus(`支払いシートの初期化に失敗しました: ${error.code}`);
//       setLoading(false);
//     }
//   };
//   // カード情報が変更されたときの処理を定義します
//   const handleCardChange = (details) => {
//     // カード情報をステートに保存します
//     setCardDetails(details);
//   };

//   // サーバーから支払い情報を取得する関数を定義します（ここでは仮のデータを返します）
//   const fetchPaymentInfo = async () => {
//     try {
//       console.log("success");
//       const response = await fetch(PUBLISHABLE_KEY);
//       console.log("dbg001" + response);
//       const { clientSecret, amount, currency } = await response.json();
//       return {
//         clientSecret,
//         amount,
//         currency,
//       };
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // カード情報が有効かどうかを判定します
//   const isCardValid = cardDetails?.complete;

//   // 支払いボタンのテキストを決めます
//   const payButtonText = loading ? "処理中..." : "支払う";

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>Credit Screen</Text>
//       <Text>クレジット画面</Text>
//       <Text>{status}</Text>
//       <CardField
//         onCardChange={handleCardChange}
//         postalCodeEnabled={false}
//         placeholders={{
//           number: "4242 4242 4242 4242",
//         }}
//         style={{
//           width: "100%",
//           height: 50,
//           marginVertical: 30,
//         }}
//         cardStyle={{
//           backgroundColor: "#FFFFFF",
//           textColor: "#000000",
//         }}
//       />
//       <Button
//         title={payButtonText}
//         onPress={handlePayPress}
//         disabled={!isCardValid || loading}
//       />
//     </View>
//   );
// };

// export default CreditScreen;
