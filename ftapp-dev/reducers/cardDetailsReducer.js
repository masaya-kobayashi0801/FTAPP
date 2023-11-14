const initialState = {
  cardDetails: {},
};
const cardDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_CARD_DETAILS":
      return {
        ...state,
        cardDetails: action.payload,
      };
    default:
      return state;
  }
};

export default cardDetailsReducer;
