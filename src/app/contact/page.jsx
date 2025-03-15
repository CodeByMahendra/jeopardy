

"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  captcha: z.string(),
});

export default function ContactUs() {
  const [captchaCode, setCaptchaCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCaptchaCode(generateCaptcha());
    }
  }, []);

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async function onSubmit(values) {
    if (values.captcha !== captchaCode) {
      toast.error("Invalid CAPTCHA. Please try again.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setCaptchaCode(generateCaptcha()); 
        form.reset();
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred while sending the message.");
    }
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      captcha: "",
    },
  });

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
            <label className="block font-medium">Enter CAPTCHA: {captchaCode}</label>
            <input {...form.register("captcha")} className="w-full border p-2 rounded" placeholder="Enter CAPTCHA" />
            <p className="text-red-500">{form.formState.errors.captcha?.message}</p>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
      </div>
    </div>
  );
}
