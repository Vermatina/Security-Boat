const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /send-receipt endpoint
router.post("/", async (req, res) => {
  const { email, subject, text } = req.body;

  // Create Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,

    auth: {
      user: "tinaverma1310@gmail.com", // Your Gmail email address
      pass: "nuxsrqhrpgcmndjg", // Your Gmail password (or app-specific password)
    },
  });

  // Mail options
  let mailOptions = {
    from: "tinaverma1310@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error });
    }
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent", info });
  });
});

module.exports = router;
