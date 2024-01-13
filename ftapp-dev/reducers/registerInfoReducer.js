const initialState = {
  isRegister: false,
};
const registerInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_REGISTER_INFO":
      return {
        ...state,
        isRegister: action.payload,
      };
    default:
      return state;
  }
};

export default registerInfoReducer;
