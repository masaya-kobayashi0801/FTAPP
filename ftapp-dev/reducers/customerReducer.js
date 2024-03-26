const initialState = {
  customer: "",
};
const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_CUSTOMER":
      return {
        ...state,
        customer: action.payload,
      };
    default:
      return state;
  }
};

export default customerReducer;
