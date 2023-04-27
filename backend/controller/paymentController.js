let SK =
  "sk_test_51N0kCRSDuFPXRZ3maHvBiegSTQqnzpdx5peNl2pF4LRl7gtu6fGbADQrJu7xaPuNchJzdQhdhWEeGPOuNhNGseW400hLSBp9kt";
const stripe = require("stripe")(SK);
const planModel = require("../models/planModel");
const userModel = require("../models/userModel");

module.exports.createSession = async function createSession(req, res) {
  try {
    let userId = req.id;
    let planId = req.params.id;

    const user = await userModel.findById(userId);
    const plan = await planModel.findById(planId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      client_reference_id: plan.id,
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          name: plan.name,
          description: plan.description,
          amount: plan.price * 10,
          currency: "inr",
          quantity: 1,
        },
      ],
      // mode: "payment",

      success_url: `${req.protocol}://${req.get("host")}/profile`,
      cancel_url: `${req.protocol}://${req.get("host")}/profile`,
    });
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};
