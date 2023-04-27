const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//mongodb
const db_link =
"mongodb://sachin_729:9935759084@ac-kqqsa4e-shard-00-00.s3snlca.mongodb.net:27017,ac-kqqsa4e-shard-00-01.s3snlca.mongodb.net:27017,ac-kqqsa4e-shard-00-02.s3snlca.mongodb.net:27017/?ssl=true&replicaSet=atlas-lvhxfz-shard-0&authSource=admin&retryWrites=true&w=majority";

try {
  mongoose
    .connect(db_link)
    .then(function (db) {
      // console.log(db);
      console.log("user db connected");
    })
    .catch(function (err) {
      console.log(err);
    });
} catch(err){
  console.log(err.message);
}

//Schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, //koi duplicate email id ni use kr pyega
    validate: function () {
      return emailValidator.validate(this.email); //this me schema bn k aata h..usme se email nikal do
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  // confirmPassword: {
  //   type: String,
  //   required: true,
  //   minLength: 8,
  //   validate: function () {
  //     return this.confirmPassword == this.password;
  //   },
  // },
  role: {
    type: String,
    enum: ["user", "admin", "restaurantowner", "deliveryboy"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: "img/users/default.jpg",
  },
  resetToken: String,
});

//pre post hooks
//before dsave event occurs in db
// userSchema.pre('save',function(){
//     console.log("before saving in db");
// })

// //after save event occur in db
// userSchema.post('save',function(doc){
//     console.log("after saving in db",doc);
// })

userSchema.pre("save", function () {
  this.confirmPassword = undefined; //ab ye db me save ni hoga
});

//Salt gen --->HASHING
// userSchema.pre('save',async function(){
//  let salt=await bcrypt.genSalt();
//  let hashedString=await bcrypt.hash(this.password,salt);
//  console.log(hashedString);
//  this.password=hashedString;
// })

userSchema.methods.createResetToken = function () {
  //creating unique token using crypto
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = resetToken;
  return resetToken;
};

userSchema.methods.resetPasswordHandler = function (password) {
  this.password = password;
  this.resetToken = undefined;
};

//model
const userModel = mongoose.model("userModel", userSchema);
console.log("usermodel->", userModel);

// ( async function createUser(){
module.exports = userModel;
