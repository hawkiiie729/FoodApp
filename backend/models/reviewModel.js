const mongoose = require("mongoose");

//mongodb
const db_link =
  "mongodb://sachin_729:9935759084@ac-kqqsa4e-shard-00-00.s3snlca.mongodb.net:27017,ac-kqqsa4e-shard-00-01.s3snlca.mongodb.net:27017,ac-kqqsa4e-shard-00-02.s3snlca.mongodb.net:27017/?ssl=true&replicaSet=atlas-lvhxfz-shard-0&authSource=admin&retryWrites=true&w=majority";

try {
  mongoose
    .connect(db_link)
    .then(function (db) {
      // console.log(db);
      console.log(" review db connected");
    })
    .catch(function (err) {
      console.log(err);
    });
} catch (err) {
  console.log(err.message);
}

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "review is required"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "rating is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(), //tym lake dega jb review likha gya hoga
  },
  //review ka user aur plan k sth relation define krna imp h
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: [true, "review must belong to a user"],
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: "planModel",
    required: [true, "review must belong to a plan"],
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage",
  }).populate("plan");
  next();
});

const reviewModel = mongoose.model("reviewModel", reviewSchema);
console.log("review model", reviewModel);

module.exports = reviewModel;
