

"use client";
import axios from "axios";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext"; 
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

export default function Login() {
  const router = useRouter();
  const { setUser } = useContext(UserContext); 

  const form = useForm({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    console.log("Form Values Sent:", values);

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post("/api/auth/login", values, { withCredentials: true });

      console.log("Login Response:", response.data);
      if (response.status === 200) {
        toast.success("Login successful!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);

        if (response.data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/users/game");
        }
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Login failed.");
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your details to get started.</CardDescription>
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

            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Forgot password?{" "}
          <Link href="/forgot-password" className="text-primary hover:underline">
            Click here
          </Link>
        </p>
      </CardFooter>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign-up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
