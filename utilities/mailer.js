const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail({ email, subject, text }) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: subject,
    text: text,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { transporter, sendMail };
