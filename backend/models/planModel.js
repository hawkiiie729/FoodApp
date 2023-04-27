//mongoose k through connect mongoDb
const mongoose = require("mongoose");

//mongodb

const db_link =
"mongodb://sachin_729:9935759084@ac-kqqsa4e-shard-00-00.s3snlca.mongodb.net:27017,ac-kqqsa4e-shard-00-01.s3snlca.mongodb.net:27017,ac-kqqsa4e-shard-00-02.s3snlca.mongodb.net:27017/?ssl=true&replicaSet=atlas-lvhxfz-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(db_link).then(function (db) {
    // console.log(db);
    console.log("plan db connected");
  }).catch(function (err) {
    console.log(err);
  });

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: [20, "name should not exceed 20 characters"],
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: [true,"price not entered"]
  },
  ratingsAverage:{
    type:Number
  },
  discount:{
    type:Number,
    validate:[function(){
        return this.discount<100
    },"discount shoud not exceed price"]
  }
});

//model
const planModel = mongoose.model("planModel", planSchema);
console.log(planModel);

//just to check

// (async function createPlan(){
//     let planObj={
//      name:"SuperFood10",
//      duration:30,
//      price:2000,
//      ratingsAverage:4,
//      discount:20,
//     }
// //now will create a new documnet from the above plan object
// const doc=new planModel(planObj);
// await doc.save();

// console.log("plan->",doc);

// })();//invoking this func

module.exports = planModel;
