import Entry from "../models/Entry.js";
import nodemailer from "nodemailer";

export const addEntry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newEntry = new Entry({ name, email, phone, message });
    await newEntry.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Form Submitted Successfully ✅",
      text: `Hello ${name},\n\nThank you for contacting us.\n\nMessage:\n${message}\n\nWe will reply soon.`
    });

    res.json({ success: true, message: "Saved & Email Sent ✅" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
