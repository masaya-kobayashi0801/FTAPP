const initialState = {
  paymentIntentId: "",
};
const paymentIntentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_PAYMENT_INTENT_ID":
      return {
        ...state,
        paymentIntentId: action.payload,
      };
    default:
      return state;
  }
};

export default paymentIntentReducer;
