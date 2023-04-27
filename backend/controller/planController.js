const planModel = require("../models/planModel");

module.exports.getallPlans = async function getallPlans(req, res) {
  console.log("HI this is all plans");
  try {
    let plans = await planModel.find();
    if (plans) {
      return res.json({
        message: "all plans retrived",
        data: plans,
      });
    } else {
      return res.json({
        message: "plans not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getPlan = async function getPlan(req, res) {
  try {
    let id = req.params.id;
    let plan = await planModel.findById(id);
    if (plan) {
      return res.json({
        message: " plan retrived",
        data: plan,
      });
    } else {
      return res.json({
        message: "plan not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.createPlan = async function createPlan(req, res) {
  try {
    let planData = req.body;
    let createdPlan = await planModel.create(planData);
    return res.json({
      message: "Plan created successfully",
      data: createdPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.deletePlan = async function deletePlan(req, res) {
  try {
    let id = req.params.id;
    let deletedPlan = await planModel.findByIdAndDelete(id);
    return res.json({
      message: "Plan deleted successfully",
      data: deletedPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.updatePlan = async function updatePlan(req, res) {
  try {
    let id = req.params.id;
    if (id) {
      let dataToBeUpdated = req.body;
      if (dataToBeUpdated) {
        let keys = [];

        for (let key in dataToBeUpdated) {
          keys.push(key);
        }
        let plan = await planModel.findById(id);
        for (let i = 0; i < keys.length; i++) {
          plan[keys[i]] = dataToBeUpdated[keys[i]];
        }

        await plan.save();
        return res.json({
          message: "plan updated successfully",
          data: plan,
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

module.exports.top3plans = async function top3plans(req, res) {
  try {
    let plans = await planModel.find()
      .sort({
        ratingsAverage: -1,
      })
      .limit(3);
    return res.json({
      message: "top 3 plans",
      data: plans,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
