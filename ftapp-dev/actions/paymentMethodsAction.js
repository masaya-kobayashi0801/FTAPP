// actions/paymentMethodsActions.js
export const createPaymentMethods = (paymentMethods) => {
  console.log("Dispatching createPaymentMethods action with:", paymentMethods);
  return {
    type: "CREATE_PAYMENTMETHODS",
    payload: paymentMethods,
  };
};
