const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nikitabishnoi52@gmail.com",
    pass: "ortoapztskdlgfyk"
  }
});
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

module.exports = {sendEmail};


