// actions/cardDetailsActions.js
export const createCardDetails = (cardDetails) => {
  console.log("Dispatching createCardDetails action with:", cardDetails);
  return {
    type: "CREATE_CARD_DETAILS",
    payload: cardDetails,
  };
};
