"use client";
import { supabase } from "@/lib/supabaseClient";
import { signIn } from "next-auth/react";

import { useState, useEffect } from "react";
import {axios} from 'axios'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInFormSchema } from "@/lib/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/game"); 
    }
  }, [router]);

  const form = useForm({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values), 
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/game");
        }
      } else {
        toast.error(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  
  
    // async function onSubmit(values) {
    //   setLoading(true);
  
    //   try {
    //     const { data } = await axios.post("/api/auth/login", values, {
    //       headers: { "Content-Type": "application/json" },
    //     });
  
    //     toast.success("Login successful!");
    //     localStorage.setItem("token", data.token);
    //     localStorage.setItem("user", JSON.stringify(data.user));
  
    //     if (data.user.role === "admin") {
    //       router.push("/admin");
    //     } else {
    //       router.push("/game");
    //     }
    //   } catch (error) {
    //     console.error("Login error:", error);
    //     toast.error(error.response?.data?.error || "Login failed.");
    //   } finally {
    //     setLoading(false);
    //   }
    // }
  
    
  



  //  async function handleGoogleSignIn() {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //       options: {
  //         redirectTo: `${window.location.origin}/dashboard`,
  //       },
  //     });
  
  //     if (error) {
  //       toast.error("Google Sign-In Failed!");
  //       console.error("Google Sign-In Error:", error);
  //     }
  //   }

  async function handleGoogleSignIn() {
    try {
      const result = await signIn("google", { callbackUrl: "/game" });
      if (!result?.error) {
        toast.success("Google Sign-In Successful!");
      }
    } catch (error) {
      toast.error("Google Sign-In Failed!");
      console.error("Google Sign-In Error:", error);
    }
  }
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
     

      <Card className="w-full max-w-md mx-auto ">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="mahi@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secretCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Code (Only for Admin Access)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter secret code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>


          <div className="mt-4 flex flex-col items-center">
          {/* <Button onClick={handleGoogleSignIn} className="w-full bg-red-500 hover:bg-red-600">
            Sign in with Google
          </Button> */}

<button onClick={handleGoogleSignIn} className="p-2 bg-blue-600 text-white rounded">
      Sign in with Google
    </button>
        </div>
     
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    
    </>
  );
}
