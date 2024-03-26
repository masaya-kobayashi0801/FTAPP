const functions = require("firebase-functions");
const Stripe = require("stripe");
// Stripeの秘密APIキーをセットアップ
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2022-11-15",
});

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  const amount = 1000;
  const currency = "jpy";
  const customer = data.customerId;
  const payment_method = data.paymentMethodId;

  try {
    await stripe.paymentIntents.create({
      amount,
      currency,
      customer,
      payment_method,
      off_session: true,
      confirm: true,
    });
  } catch (e) {
    // Error code will be authentication_required if authentication is needed
    console.log("Error code is: ", e.code);
    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
      e.raw.payment_intent.id
    );
    console.log("PI retrieved: ", paymentIntentRetrieved.id);
  }
});

exports.createPaymentSheet = functions.https.onCall(async (data, context) => {
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-11-15" }
    );
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });

    return {
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: functions.config().stripe.public,
    };
  } catch (error) {
    console.error("Error creating payment sheet:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error creating payment sheet"
    );
  }
});

exports.getPaymentMethods = functions.https.onCall(async (customerId) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    return paymentMethods;
  } catch (e) {
    console.error("Error creating payment methods:", e);
    throw new functions.https.HttpsError(
      "internal",
      "Error getting payment methods"
    );
  }
});
