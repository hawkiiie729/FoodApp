"use strict";
const nodemailer = require("nodemailer");
const { getMaxListeners } = require("process");

module.exports.sendMail = async function sendMail(str, data) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "mishra.firehawk729@gmail.com", // generated ethereal user
      pass: "uomtibzloxybvofk", // generated ethereal password
    },
  });

  let Osubject, Otext, Ohtml;
  if (str == "signup") {
    Osubject = `Thank you for singing in ${data.name}`;
    Ohtml = `
      <h1>Welcome to foodapp.com</h1>
      Hope you have a good time!
      Here are your details
      Name-${data.name} 
      Email-${data.email}
      `;
  } else if (str == "resetpassword") {
    Osubject = `Reset Password`;
    Ohtml = `
      <h1>Foodapp.com</h1>
      Here is your link to reset password!
      ${data.resetPasswordLink}
      `;
  }
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"FoodAPP 👻" <mishra.firehawk729@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: Osubject, // Subject line
    //text: "Hello world?", // plain text body
    html: Ohtml, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
