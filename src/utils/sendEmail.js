import nodemailer from "nodemailer";

export async function sendDigitalDownloadEmail(email, productName, fileUrl) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: false,  // ✅ Secure ko false rakho
      tls: {
        rejectUnauthorized: false,  // ✅ SSL Certificate Errors Ignore karne ke liye
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Download Your Digital Product: ${productName}`,
      html: `
        <p>Dear User,</p>
        <p>Thank you for your purchase. You can download <strong>${productName}</strong> using the link below:</p>
        <a href="${fileUrl}" target="_blank" style="background: #4CAF50; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">Download Now</a>
        <p>If you have any issues, feel free to contact us.</p>
        <p>Best regards,<br>Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Digital Product Email Sent to:", email);
  } catch (error) {
    console.error("❌ Email Sending Error:", error);
    throw new Error("Email Sending Failed");
  }
}
