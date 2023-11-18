const initialState = {
  cardDetails: {},
};
const cardDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_CARD_DETAILS":
      return {
        ...state,
        cardDetails: action.payload,
      };
    default:
      return state;
  }
};

export default cardDetailsReducer;
