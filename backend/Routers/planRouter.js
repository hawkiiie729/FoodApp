const express = require("express");
const { protectRoute, isAuthorised } = require("../controller/authController");
const planRouter = express.Router();
const {
  getPlan,
  getallPlans,
  createPlan,
  updatePlan,
  deletePlan,
  top3plans
} = require("../controller/planController");

//all plans leke ayega
planRouter.route("/allPlans").get(getallPlans);

//own plan ->logged in hona neccessary hai
planRouter.use(protectRoute);
planRouter.route("/plan/:id").get(getPlan);

//CRUD operations
planRouter.use(isAuthorised(["admin", "restaurantowner"]));
planRouter.route("/crudPlan").post(createPlan)

planRouter.use(isAuthorised(["admin", "restaurantowner"]));
planRouter.route("/crudPlan/:id").patch(updatePlan).delete(deletePlan);

planRouter.route("/top3plans").get(top3plans);

module.exports = planRouter;
