"use client";
import axios from "axios";
import { useEffect,useContext } from "react";
import { UserContext } from "@/context/UserContext"; 

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

export default function Register() {
  const router = useRouter();
    const { setUser } = useContext(UserContext); 
  

 

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
      // secretCode: "",
    },
  });

 



async function onSubmit(values) {
  console.log("Form Values Sent:", values);

  try {
    axios.defaults.withCredentials = true;
    const response = await axios.post("/api/auth/signup", values, { withCredentials: true });

    console.log("Signup Response:", response.data);
    if (response.status === 201) {
      toast.success("Signup successful!");
      localStorage.setItem("user", JSON.stringify(response.data.user));
         setUser(response.data.user);
 
      if (response.data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/users/game");
      }
    }
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    toast.error(error.response?.data?.error || "Signup failed.");
  }
}
 
  

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to get started.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Mahi Thakur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            
{/* 

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
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
              )}
            />
            {form.watch("role") === "ADMIN" && (
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
            )}
  */}



            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>

    
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}