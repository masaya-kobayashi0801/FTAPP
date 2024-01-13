// actions/registerInfoActions.js
export const registerInfoAction = (isRegister) => {
  console.log("Dispatching registerInfoAction action with:", isRegister);
  return {
    type: "CREATE_REGISTER_INFO",
    payload: isRegister,
  };
};
