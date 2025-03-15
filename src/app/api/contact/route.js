

import Brevo from "@getbrevo/brevo";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!process.env.BREVO_API_KEY) {
      throw new Error("Brevo API key is missing");
    }

    const emailApi = new Brevo.TransactionalEmailsApi();
    emailApi.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

    //  Admin ke liye email
    const adminEmailData = {
      sender: { email: "mahendrathakur0040@gmail.com", name: "Contact Form" },
      to: [{ email: "mahendrachandel040@gmail.com" }], 
      subject: "New Contact Form Submission",
      htmlContent: `<h3>New Contact Request</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>`,
    };

    //  User ke liye  email
    const userEmailData = {
      sender: { email: "mahendrathakur0040@gmail.com", name: "Support Team" },
      to: [{ email: email }], 
      subject: "Thank You for Contacting Us",
      htmlContent: `<h3>Hi ${name},</h3>
        <p>Thank you for reaching out to us. We have received your message and will get back to you soon. Banna </p>
        <p><b>Your Message:</b> ${message}</p>
        <p>Best Regards,<br/>Support Team</p>`,
    };

    //  Dono emails  me bhej do
    await Promise.all([
      emailApi.sendTransacEmail(adminEmailData),
      emailApi.sendTransacEmail(userEmailData)
    ]);

    return new Response(JSON.stringify({ success: true, message: "Emails sent successfully" }), { status: 200 });

  } catch (error) {
    console.error("Brevo API Error:", error.response ? error.response.data : error.message);
    return new Response(JSON.stringify({ success: false, message: "Error sending email", error: error.message }), { status: 500 });
  }
}
