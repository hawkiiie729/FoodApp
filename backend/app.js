const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

//app is an instance of express

//middleware function ->post ki req me kaam aata hai to convert the front end data to json format
app.use(express.json());
app.listen(3000);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

//mini app--
const userRouter = require("./Routers/userRouter");
const planRouter = require("./Routers/planRouter");
const reviewRouter = require("./Routers/reviewRouter");
const paymentRouter = require("./Routers/paymentRouter");
//const authRouter = require("./Routers/authRouter");

//base url,router to use
app.use("/user", userRouter);
app.use("/plans", planRouter);
app.use("/reviews", reviewRouter);
app.use("/payment", paymentRouter);

// app.use("/auth", authRouter); //global midddleware

//const planModel = require("./models/planModel");

//PARAMS->as it is data ..db me se utha ke de dega
