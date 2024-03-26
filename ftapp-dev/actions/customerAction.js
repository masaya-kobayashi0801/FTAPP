// actions/customerActions.js
export const createCustomer = (customer) => {
  console.log("Dispatching createCustomer action with:", customer);
  return {
    type: "CREATE_CUSTOMER",
    payload: customer,
  };
};
