const functions = require("firebase-functions");
const Stripe = require("stripe");
// Stripeの秘密APIキーをセットアップ
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2020-08-27",
});

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  const amount = data.amount;
  const currency = data.currency;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
});
