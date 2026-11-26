const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

if (process.env.SENDGRID_KEY && process.env.SENDGRID_KEY.startsWith("SG.")) {
  sgMail.setApiKey(process.env.SENDGRID_KEY);
}

const hasNodemailerCreds = Boolean(process.env.EMAIL && process.env.EMAIL_PASS);
const transporter = hasNodemailerCreds
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

async function sendOTP(email, otp) {
  const subject = "EcoBin - OTP Verification";
  const html = `<h1>This message is for OTP Verification</h1>
    <h2>Your OTP is: <b>${otp}</b></h2>
    <p>Valid for 5 minutes</p>
  `;

  if (process.env.SENDGRID_KEY && process.env.SENDGRID_KEY.startsWith("SG.")) {
    await sgMail.send({
      to: email,
      from: process.env.EMAIL_FROM || "vishal.j.khim@gmail.com",
      subject,
      html,
    });
    return { sent: true, channel: "sendgrid" };
  }

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject,
        html,
      });
      return { sent: true, channel: "nodemailer" };
    } catch (err) {
      console.error("Nodemailer error:", err.message);
    }
  }

  console.log(`[DEV OTP] Email: ${email} | OTP: ${otp}`);
  return { sent: false, channel: "console" };
}

module.exports = sendOTP;
