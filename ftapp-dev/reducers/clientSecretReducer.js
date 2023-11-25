const initialState = {
  clientSecret: "",
};
const clientSecretReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_CLIENT_SECRET":
      return {
        ...state,
        clientSecret: action.payload,
      };
    default:
      return state;
  }
};

export default clientSecretReducer;
