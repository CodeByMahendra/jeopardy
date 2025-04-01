
import nodemailer from "nodemailer";

export async function sendDigitalProductEmail(userEmail, productName, fileUrl) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Your Digital Product: ${productName}`,
      html: `
        <p>Thank you for your purchase!</p>
        <p>Here is your digital product: <strong>${productName}</strong></p>
        <p>Click the link below to download your product:</p>
        <a href="${fileUrl}" target="_blank">Download ${productName}</a>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
}
