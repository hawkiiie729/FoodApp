const express = require("express");
const { get } = require("lodash");
const { protectRoute } = require("../controller/authController");
const reviewRouter = express.Router();
const {
  getAllReviews,
  top3reviews,
  getPlanReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controller/reviewController");

reviewRouter.route("/all").get(getAllReviews);

reviewRouter.route("/top3").get(top3reviews);

reviewRouter.route("/:id").get(getPlanReviews);

reviewRouter.use(protectRoute);
reviewRouter
  .route("/crud/:plan")
  .post(createReview)
  .patch(updateReview)
  .delete(deleteReview);

// reviewRouter.use(protectRoute);
// reviewRouter.route("/crud/:id")

module.exports = reviewRouter;
