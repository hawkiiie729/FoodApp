const { model } = require("mongoose");
const reviewModel = require("../models/reviewModel");
const planModel = require("../models/planModel");

module.exports.getAllReviews = async function getAllReviews(req, res) {
  try {
    const reviews = await reviewModel.find();
    if (reviews) {
      return res.json({
        message: "all reviews retrived",
        data: reviews,
      });
    } else {
      return res.json({
        message: "reviews not found",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.top3reviews = async function top3reviews(req, res) {
  try {
    let reviews = await reviewModel
      .find()
      .sort({
        rating: -1,
      })
      .limit(3);
    if (reviews) {
      return res.json({
        message: "top 3 reviews",
        data: reviews,
      });
    } else {
      return res.json({
        message: "reviews not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getPlanReviews = async function getPlanReviews(req, res) {
  try {
    let planid = req.params.id;
    let reviews = await reviewModel.find();
    // console.log("reviews",reviews);
    reviews = reviews.filter((review) => review.plan._id == planid);
    console.log(reviews);
    if (reviews) {
      return res.json({
        message: "reviews retrived for a particular plan",
        data: reviews,
      });
    } else {
      return res.json({
        message: "reviews not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.createReview = async function createReview(req, res) {
  try {
    let id = req.params.plan;
    let plan = await planModel.findById(id);
    let reviewData = req.body;
    let createdReview = await reviewModel.create(reviewData);
    plan.ratingsAverage = (plan.ratingsAverage + reviewData.rating) / 2;
    await plan.save();

    return res.json({
      message: "review created successfully",
      data: createdReview,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.updateReview = async function updateReview(req, res) {
  try {
    let planid = req.params.id;
    //review id from frontend
    let id = req.body.id;

    if (id) {
      let dataToBeUpdated = req.body;
      if (dataToBeUpdated) {
        let keys = [];

        for (let key in dataToBeUpdated) {
          if (key == "id") continue;
          keys.push(key);
        }
        let review = await reviewModel.findById(id);
        for (let i = 0; i < keys.length; i++) {
          review[keys[i]] = dataToBeUpdated[keys[i]];
        }

        await review.save();
        return res.json({
          message: "review updated successfully",
          data: review,
        });
      } else {
        return res.json({
          message: "data to be updated not provided",
        });
      }
    } else {
      return res.json({
        message: "id not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.deleteReview = async function deleteReview(req, res) {
  try {
    let planid = req.params.id;
    //review id from frontend
    let id = req.body.id;
    let deletedReview = await reviewModel.findByIdAndDelete(id);
    return res.json({
      message: "Review deleted successfully",
      data: deletedReview,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
