const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nikitabishnoi52@gmail.com",
    pass: "ortoapztskdlgfyk"
  }
});


// ==========================================
// SEND EMAIL
// ==========================================

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: "nikitabishnoi52@gmail.com",
      to: to,
      subject: subject,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.response);

    return true;

  } catch (error) {
    console.log("Error sending email:", error);

    return false;
  }
};


// ==========================================
// SEND OTP EMAIL
// ==========================================

const sendOTP = async (to, otp) => {
  try {

    const mailOptions = {
      from: "nikitabishnoi52@gmail.com",
      to: to,
      subject: "Your Login OTP",
      text: `Your OTP for login is ${otp}.

This OTP is valid for 5 minutes.

Do not share this OTP with anyone.`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("OTP email sent successfully:", info.response);

    return true;

  } catch (error) {
    console.log("Error sending OTP:", error);

    return false;
  }
};


module.exports = {
  sendEmail,
  sendOTP
};