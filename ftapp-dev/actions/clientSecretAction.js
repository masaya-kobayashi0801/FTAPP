export const createClientSecret = (clientSecret) => {
  console.log("Dispatching createCardDetails action with:", clientSecret);
  return {
    type: "CREATE_CLIENT_SECRET",
    payload: clientSecret,
  };
};
