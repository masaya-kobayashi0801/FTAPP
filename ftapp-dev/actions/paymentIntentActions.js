export const createPaymentIntentId = (paymentIntentId) => {
  console.log(
    "Dispatching createPaymentIntentId action with:",
    paymentIntentId
  );
  return {
    type: "CREATE_PAYMENT_INTENT_ID",
    payload: paymentIntentId,
  };
};
