const userModel = require("../models/userModel");

module.exports.getUser = async function getUser(req, res) {
  let id = req.id;
  // console.log("user ki id",id);
  let user = await userModel.findById(id);
  if (user) {
    return res.json(user);
  } else {
    res.json({
      message: "user not found",
    });
  }
};

//   module.exports.postUser=function postUser(req,res){
//       console.log(req.body); //post me jo bhi data bjegw from front end  to backend  wo req ki BOdy me pda hoga
//       users=req.body;
//       res.json({
//           message:"data received successfully",
//           user:req.body
//       });
//   }
module.exports.updateUser = async function updateUser(req, res) {
  //console.log('req.body->',req.body);
  //update data in user obj
  try {
    let id = req.params.id;
    console.log("updateuser me user id", id);
    let user = await userModel.findById(id);
    console.log("user->", user);
    let dataToBeUpdated = req.body;

    if (user) {
      //agr user mil gya h toh
      const keys = [];
      for (let key in dataToBeUpdated) {
        keys.push(key);
      }

      for (let i = 0; i < keys.length; i++) {
        user[keys[i]] = dataToBeUpdated[keys[i]];
      }
      const updatedData = await user.save();
      return res.json({
        message: "data updated successfully",
        data: updatedData,
      });
    } else {
      res.json({
        message: "user not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.deleteUser = async function deleteUser(req, res) {
  // users={};
  try {
    let id = req.params.id;
    let user = await userModel.findByIdAndDelete(id);
    if (!user) {
      res.json({
        message: "user not found",
      });
    }
    res.json({
      message: "data has been deleted",
      data: user,
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.getAllUser = async function getAllUser(req, res) {
  //console.log(req.params.id);
  let users = await userModel.find();
  console.log("get all users me users", users);
  if (users) {
    res.json({
      message: "users retrived",
      data: users,
    });
  }
  res.send("user id recieved");
};

module.exports.updateProfileImage = function updateProfileImage(req, res) {
  res.json({
    message: "File uploaded successfully!",
  });
};

//   function setCookies(req,res){
//     // res.setHeader('Set-Cookie','isloggedIn=true')//(anything like set cookie,cookie ka name with value)
//     res.cookie('isLoggedIn',false,{maxAge:1000*60*60*24,secure:true,httpOnly:true});
//     res.send('cookies has been set')
// }

// function getCookies(req,res){
//   let cookies=req.cookies;
//   console.log(cookies);
//   res.send('cookies received')
// }

//controllers k andr logic hoga func ya mini app ka
