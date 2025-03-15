


// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
// import axios from "axios";
// import { useForm } from "react-hook-form";


// import { zodResolver } from "@hookform/resolvers/zod";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { signInFormSchema } from "@/lib/auth-schema";

// export default function Login() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   // useEffect(() => {
//   //   const storedUser = localStorage.getItem("user");
//   //   if (storedUser) {
//   //     const user = JSON.parse(storedUser);
//   //     router.push(user.role === "admin" ? "/admin/create-blog" : "/users/game");
//   //   }
//   // }, [router]);

//   const form = useForm({
//     resolver: zodResolver(signInFormSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       secretCode: "", 
//     },
//   });

// async function onSubmit(values) {
//   setLoading(true);
//   try {
//     const response = await axios.post("/api/auth/login", values);

//     console.log("Data=", response.data);

//     toast.success("Login successful!");
//     localStorage.setItem("token", response.data.token);
//     localStorage.setItem("user", JSON.stringify(response.data.user));

//     if (response.data.user.role === "ADMIN") {
//       router.push("/admin/create-blog");
//     } else {
//       router.push("/users/game");
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     toast.error(error.response?.data?.error || "Something went wrong!");
//   } finally {
//     setLoading(false);
//   }
// }






//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />

//       <Card className="w-full max-w-md mx-auto">
//         <CardHeader>
//           <CardTitle>Login</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input placeholder="mahi@mail.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="Enter your password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="secretCode"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Secret Code (For Admins Only)</FormLabel>
//                     <FormControl>
//                       <Input type="text" placeholder="Enter secret code" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button className="w-full" type="submit" disabled={loading}>
//                 {loading ? "Logging in..." : "Login"}
//               </Button>
//             </form>
//           </Form>

//           <div className="mt-4 flex flex-col items-center">
//             <button onClick={handleGoogleSignIn} className="p-2 bg-blue-600 text-white rounded">
//               Sign in with Google
//             </button>
//           </div>
//         </CardContent>

//         <CardFooter className="flex justify-center">
//           <p className="text-sm">
//             Forgot Password?{" "}
//             <Link href="/forgot-password" className="text-primary hover:underline">
//               Click here
//             </Link>
//           </p>
//         </CardFooter>
//         <CardFooter className="flex justify-center">
//           <p className="text-sm">
//             Don't have an account?{" "}
//             <Link href="/sign-up" className="text-primary hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
    const router = useRouter();
    const [values, setValues] = useState({
        email: "",
        password: "",
        secretCode: "",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            console.log("Sending Login Request:", values);
            const response = await axios.post("/api/auth/login", values);

            console.log("Login Response:", response.data);

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                if (response.data.user.role === "ADMIN") {
                    console.log("Redirecting to /admin/create-blog");
                    router.push("/admin/create-blog");
                } else {
                    console.log("Redirecting to /users/game");
                    router.push("/users/game");
                }
            }
        } catch (err) {
            console.error("Login Error:", err.response?.data?.error || err.message);
            setError(err.response?.data?.error || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="secretCode"
                    placeholder="Admin Secret Code (Only for Admins)"
                    value={values.secretCode}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}


// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { signInFormSchema } from "@/lib/auth-schema";

// export default function Login() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const response = await axios.get("/api/auth/me");
//         const user = response.data;
//         if (user.role === "admin") {
//           router.push("/admin/create-blog");
//         } else {
//           router.push("/game");
//         }
//       } catch (error) {
//         console.log("User not logged in");
//       }
//     };
//     checkUser();
//   }, [router]);

//   const form = useForm({
//     resolver: zodResolver(signInFormSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       secretCode: "", 
//     },
//   });

//   async function onSubmit(values) {
//     setLoading(true);
//     try {
//       const response = await axios.post("/api/auth/login", values);

//       toast.success("Login successful!");
//       router.refresh();
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error(error.response?.data?.error || "Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />

//       <Card className="w-full max-w-md mx-auto">
//         <CardHeader>
//           <CardTitle>Login</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input placeholder="mahi@mail.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="Enter your password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="secretCode"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Secret Code (For Admins Only)</FormLabel>
//                     <FormControl>
//                       <Input type="text" placeholder="Enter secret code" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button className="w-full" type="submit" disabled={loading}>
//                 {loading ? "Logging in..." : "Login"}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>

//         <CardFooter className="flex justify-center">
//           <p className="text-sm">
//             Forgot Password?{" "}
//             <Link href="/forgot-password" className="text-primary hover:underline">
//               Click here
//             </Link>
//           </p>
//         </CardFooter>
//         <CardFooter className="flex justify-center">
//           <p className="text-sm">
//             Don't have an account?{" "}
//             <Link href="/sign-up" className="text-primary hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </>
//   );
// }
