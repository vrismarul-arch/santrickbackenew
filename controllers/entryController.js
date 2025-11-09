import Entry from "../models/Entry.js";
import nodemailer from "nodemailer";

export const addEntry = async (req, res) => {
  try {
    const data = req.body;

    // Convert addOns if needed
    if (typeof data.addOns === "string") {
      data.addOns = JSON.parse(data.addOns);
    }

    // Files support
    data.images = req.files?.map(file => file.filename) || [];

    // Save to DB
    const entry = await Entry.create(data);

    // Send Email Only if user provided email
    if (data.contactEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Sandtricks Team" <${process.env.EMAIL_USER}>`,
        to: data.contactEmail,
        subject: "🎉 Booking Confirmed - Thank You for Choosing Sandtricks!",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fafafa; border-radius: 10px;">
          <div style="text-align: center;">
            <h1 style="color: #d97706;">✨ Sandtricks Sand Art Booking ✨</h1>
          </div>

          <p style="font-size: 16px;">Hi <strong>${data.contactName}</strong>,</p>

          <p style="font-size: 15px; line-height: 1.6;">
            Thank you for booking <strong>Sand Art Performance</strong> with us! 🎨  
            We have successfully received your request.
          </p>

          <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px; border: 1px solid #eee;">
            <h3 style="margin-top: 0; color: #444;">Booking Summary:</h3>
            <p><strong>Event Type:</strong> ${data.eventType}</p>
            <p><strong>Event Date:</strong> ${data.date}</p>
            <p><strong>Venue:</strong> ${data.venue || "Not Provided"}</p>
            <p><strong>Duration:</strong> ${data.duration}</p>
            <p><strong>Add-ons:</strong> ${(Object.keys(data.addOns).filter(k => data.addOns[k]).join(", ") || "No Add-ons Selected")}</p>
          </div>

          <p style="margin-top: 20px; font-size: 15px;">
            📩 Our representative will contact you shortly to finalize details.  
            Meanwhile, feel free to check out our portfolio!
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://instagram.com/sandtricks" 
              style="background: #d97706; padding: 10px 18px; color: white; text-decoration: none; border-radius: 6px;">
              View Portfolio
            </a>
          </div>

          <p style="margin-top: 30px; font-size: 14px; text-align: center; color: #666;">
            Thank you for choosing <strong>Sandtricks</strong> 💛 <br>
            We look forward to making your event magical!
          </p>
        </div>
        `,
      });

      console.log("📨 Confirmation Email Sent to", data.contactEmail);
    }

    return res.status(200).json({ message: "Booking saved & confirmation email sent ✅", entry });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};
