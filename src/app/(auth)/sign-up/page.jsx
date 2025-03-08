
"use client";
import { useEffect } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { formSchema } from "@/lib/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Register() {
  const router = useRouter();
  

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/game"); 
      }
    }, [router]);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
      secretCode: "",
    },
  });
  
  async function onSubmit(values) {
    console.log(" Form Values :", values);
    
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  
    const data = await response.json();
    console.log(" Signup Response:", data);
  
    if (response.ok) {
      toast.success("Signup successful!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push(values.role === "ADMIN" ? "/admin" : "/sign-in");
    } else {
      toast.error("Signup failed." || "Signup failed.");
    }
  }

  async function handleGoogleSignIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      toast.error("Google Sign-In Failed!");
    } else {
      await fetch("/api/auth/callback", { method: "POST" });
      toast.success("Google Sign-In Successful!");
      router.push("/dashboard");
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto ">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to get started.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl><Input placeholder="Mahi Thakur" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input placeholder="mahi@mail.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" placeholder="Enter your password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md">
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.watch("role") === "ADMIN" && (
              <FormField control={form.control} name="secretCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Code (Only for Admin Access)</FormLabel>
                  <FormControl><Input type="text" placeholder="Enter secret code" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            <Button className="w-full" type="submit">Submit</Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Or sign up with</p>
          <Button className="mt-2 w-full bg-red-500 hover:bg-red-600" onClick={handleGoogleSignIn}>
            Sign Up with Google
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account? <Link href="/sign-in" className="text-primary hover:underline">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
