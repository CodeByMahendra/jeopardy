export async function POST(req) {
    try {
      const { token } = await req.json();

      console.log("Token==",token)
  
      if (!token) {
        return new Response(JSON.stringify({ success: false, message: "reCAPTCHA token is missing" }), { status: 400 });
      }
  
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      if (!secretKey) {
        return new Response(JSON.stringify({ success: false, message: "reCAPTCHA secret key is missing" }), { status: 500 });
      }
  
      const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret:process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      });
  
      const recaptchaData = await recaptchaResponse.json();

      console.log("Recaptcha data==",recaptchaData)
  
      if (!recaptchaData.success) {
        return new Response(JSON.stringify({ success: false, message: "reCAPTCHA verification failed" }), { status: 400 });
      }
  
      return new Response(JSON.stringify({ success: true, message: "reCAPTCHA verified successfully" }), { status: 200 });
  
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      return new Response(JSON.stringify({ success: false, message: "Error verifying reCAPTCHA", error: error.message }), {
        status: 500,
      });
    }
  }