const mongoose=require('mongoose')
const emailValidator=require('email-validator');
const bcrypt = require('bcrypt');

//mongodb

const db_link="mongodb+srv://admin:aUUcilA6QEzOk69B@cluster0.paqcs9r.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(db_link)
.then(function(db){
    // console.log(db);
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
});

//Schema
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true, //koi duplicate email id ni use kr pyega
        validate: function(){
            return emailValidator.validate(this.email)//this me schema bn k aata h..usme se email nikal do
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    confirmPassword:{
        type:String,
        required:true,
        minLength:8,
        validate:function(){
          return  this.confirmPassword==this.password;
        }
    }
})

//pre post hooks
//before dsave event occurs in db
// userSchema.pre('save',function(){
//     console.log("before saving in db");
// })

// //after save event occur in db
// userSchema.post('save',function(doc){
//     console.log("after saving in db",doc);
// })

userSchema.pre('save',function(){
    this.confirmPassword=undefined;//ab ye db me save ni hoga
})

//Salt gen --->HASHING
userSchema.pre('save',async function(){
 let salt=await bcrypt.genSalt();
 let hashedString=await bcrypt.hash(this.password,salt);
 console.log(hashedString);
 this.password=hashedString;
})



//model
const userModel=mongoose.model('userModel',userSchema);
console.log(userModel);

// ( async function createUser(){
    module.exports=userModel;