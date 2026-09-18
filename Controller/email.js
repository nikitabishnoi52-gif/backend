const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nikitabishnoi52@gmail.com",
    pass: "ortoapztskdlgfyk"
  }
});

const sendEmail = async (to, subject, message) => {
  try {
    await transporter.verify();

    const info = await transporter.sendMail({
      from: "nikitabishnoi52@gmail.com",
      to: to,
      subject: subject,
      text: message
    });

    console.log("EMAIL SENT:", info.response);
    return true;

  } catch (error) {
    console.log("EMAIL ERROR:", error);
    return false;
  }
};

module.exports = {
  sendEmail
};