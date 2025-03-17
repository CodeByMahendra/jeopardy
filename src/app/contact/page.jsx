

"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactUs() {
  const [captchaValue, setCaptchaValue] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values) {
    if (!captchaValue) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }

    try {
      // Verify reCAPTCHA
      const captchaResponse = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaValue }),
      });

      const captchaData = await captchaResponse.json();
      if (!captchaResponse.ok || !captchaData.success) {
        toast.error("reCAPTCHA verification failed. Please try again.");
        return;
      }

      // Send Contact Form Data
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, recaptchaToken: captchaValue }),
      });

      let result;
      try {
        result = await response.json();
      } catch (err) {
        console.error("Invalid JSON response", err);
        toast.error("Server error: Invalid response format.");
        return;
      }

      if (response.ok) {
        toast.success("Message sent successfully!");
        form.reset();
        setCaptchaValue(null);
      } else {
        toast.error(result?.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred while sending the message.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-300 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-center">Contact Us</h2>
        <p className="text-center text-gray-600">We would love to hear from you!</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input {...form.register("name")} className="w-full border p-2 rounded" placeholder="Your Name" />
            <p className="text-red-500">{form.formState.errors.name?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input {...form.register("email")} className="w-full border p-2 rounded" placeholder="you@example.com" />
            <p className="text-red-500">{form.formState.errors.email?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Message</label>
            <textarea {...form.register("message")} className="w-full border p-2 rounded" placeholder="Type your message here..."></textarea>
            <p className="text-red-500">{form.formState.errors.message?.message}</p>
          </div>

          <div>
            <ReCAPTCHA
              sitekey="6LcU3PYqAAAAANbIvuohAW1zGIiUKrgsuD31rHcM" 
              onChange={(token) => setCaptchaValue(token)}
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
      </div>
    </div>
  );
}
