const express = require("express");
const userRouter = express.Router();
const multer = require("multer");

//const protectRoute = require("./authHelper");
const {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
  updateProfileImage,
} = require("../controller/userController");
const {
  login,
  signup,
  isAuthorised,
  protectRoute,
  forgetPassword,
  resetPassword,
  logout,
} = require("../controller/authController");

//user ke options
userRouter.route("/:id").patch(updateUser).delete(deleteUser);

userRouter.route("/signup").post(signup);

userRouter.route("/login").post(login);

userRouter.route("/forgetpassword").post(forgetPassword);
userRouter.route("/resetpassword/:token").post(resetPassword);

userRouter.route("/logout").get(logout);

//multer for file upload
//upload->storage,filter

//multerStorage->file kaha store hogi aur uska naam kya hoga
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}.jpeg`);
  },
});

const filter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an Image! Please Upload an Image", false));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: filter,
});

userRouter.post("/ProfileImage", upload.single("photo"), updateProfileImage);

userRouter.get("/ProfileImage", (req, res) => {
  res.sendFile("/home/sudhanshu/Desktop/FoodApp/backend/multer.html");
});

//profile page
userRouter.use(protectRoute); //protectroute is liye ki agr ap login ho toh apki hi profile aaye
userRouter.route("/userProfile").get(getUser);

//admin specific work
userRouter.use(isAuthorised(["admin"]));
userRouter.route("/").get(getAllUser);

module.exports = userRouter;
