const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utility/nodemailer");

const JWT_KEY = "aodoij32509809ltjgwlewjg";
//sign up user
module.exports.signup = async function signup(req, res) {
  try {
    let dataObj = req.body;
    let user = await userModel.create(dataObj); //user created
    sendMail("signup", user);
    if (user) {
      res.json({
        message: "user signed up",
        data: user,
      });
    } else {
      res.json({
        message: "error",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

//login user
module.exports.login = async function loginUser(req, res) {
  try {
    let data = req.body;
    if (data.email) {
      let user = await userModel.findOne({ email: data.email });
      if (user) {
        //bcrypt->compare func
        if (user.password == data.password) {
          let uid = user["_id"]; //uid
          let token = jwt.sign({ payload: uid }, JWT_KEY);
          res.cookie("login", token, { httpOnly: true });
          return res.json({
            message: "user has logged in",
            userDetails: data,
          });
        } else {
          return res.json({
            message: "wrong password",
          });
        }
      } else {
        return res.json({
          message: "user not found",
        });
      }
    } else {
      return res.json({
        message: "Empty field found",
      });
    }
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

//isAuthorised->to check the user's role [admin,restrauntowner,customer,deliveryboy etc]
module.exports.isAuthorised = function isAuthorised(roles) {
  console.log("this is isautho");
  return function (req, res, next) {
    console.log("req.role->", req.role);
    console.log("roles->".roles);
    if (roles.includes(req.role) == true) next();
    else {
      res.status(401).json({
        message: "operation not allowed",
      });
    }
  };
};

//protectRoute
module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    let token;
    if (req.cookies.login) {
      // console.log(req.cookies);
      token = req.cookies.login;
      let payload = jwt.verify(token, JWT_KEY);
      // console.log(payload);
      if (payload) {
        // console.log("payload token", payload);
        const user = await userModel.findById(payload.payload);
        req.role = user.role;
        req.id = user.id;
        // console.log(user);
        next();
      } else {
        //browser
        const client = req.get("User-Agent");
        if (client.includes("Mozilla") == true) {
          return res.redirect("/login");
        }

        //postman
        return res.json({
          message: "please Login again",
        });
      }
    } else {
      res.json({
        message: "please Login",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

//forget Password
module.exports.forgetPassword = async function forgetPassword(req, res) {
  let { email } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      //createResetToken is used to create a new token
      const resetToken = user.createResetToken();
      //resetpassword link
      let resetPasswordLink = `${req.protocol}://${req.get(
        "host"
      )}/resetpassword/${resetToken}`;
      //send email to user
      //nodemailer
      let obj = {
        resetPasswordLink: resetPasswordLink,
        email: email,
      };
      sendMail("resetpassword", obj);
      return res.json({
        message: "reset link has been sent to your email",
      });
    } else {
      return res.json({
        message: "please Sign up",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//reset password
module.exports.resetPassword = async function resetPassword(req, res) {
  try {
    const token = req.params.token;
    let { password } = req.body;
    const user = await userModel.findOne({ resetToken: token });
    if (user) {
      //resetPasswordHandler will update passeord in db
      user.resetPasswordHandler(password);
      await user.save();
      res.json({
        message: "Password Updated Successfully",
      });
    } else {
      res.json({
        message: "user not found",
      });
    }
  } catch (err) {
    message: err.message;
  }
};

module.exports.logout = function logout(req, res) {
  res.cookie("login", " ", { maxAge: 1 });
  res.json({
    message: "User logged out successfully",
  });
};
