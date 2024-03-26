const initialState = {
  paymentMethods: "",
};
const paymentMethodsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_PAYMENTMETHODS":
      return {
        ...state,
        paymentMethods: action.payload,
      };
    default:
      return state;
  }
};

export default paymentMethodsReducer;
