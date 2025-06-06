
"use client";
import axios from "axios";
import { useContext } from "react";
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
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { setUser } = useContext(UserContext) || {}; 

  const form = useForm({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    console.log("Form Values Sent:", values);

    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      console.log("Login Response:", res);
      console.log("Login Response Status:", res.data);

      if (res?.error) {
        toast.error("Login failed: " + res.error);
      } else {
        toast.success("Login successful!");
    
        if (setUser) setUser(values); 

        router.push("/game");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/game" });
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      toast.error("Google Sign-in failed!");
    }
  };

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

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-sm text-muted-foreground">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <Button onClick={handleGoogleSignIn} className="w-full bg-red-500 hover:bg-red-600">
          Sign in with Google
        </Button>
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




// "use client";
// import axios from "axios";
// import { useContext, useState } from "react";
// import { useRouter } from "next/navigation";
// import { UserContext } from "@/context/UserContext"; 
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { signInFormSchema } from "@/lib/auth-schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { signIn } from "next-auth/react";

// export default function Login() {
//   const router = useRouter();
//   const { setUser  } = useContext(UserContext) || {}; 
//   const [rememberMe, setRememberMe] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(signInFormSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (values) => {
//     console.log("Form Values Sent:", values);
//     console.log("Remember Me:", rememberMe);
//     console.log("Remember Me (String):", rememberMe.toString());
//     try {
//       const res = await signIn("credentials", {
//         email: values.email,
//         password: values.password,
//         rememberMe: rememberMe.toString(), // Send rememberMe as string
//         redirect: false,
//       });
      
//       if (res?.error) {
//         toast.error("Login failed: " + res.error);
//       } else {
//         toast.success("Login successful!");
//         if (setUser ) setUser (values);
//         router.push("/game");

//         if (!rememberMe) {
//           setTimeout(() => {
//             document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//             console.log("Session cookie deleted after 1 minute.");
//           }, 60000); // 60000 milliseconds = 1 minute
//         }
//       }
//     } catch (error) {
//       console.error("Login error:", error.message);
//       toast.error("An unexpected error occurred.");
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       await signIn("google", { callbackUrl: "/game" });
//     } catch (error) {
//       console.error("Google Sign-in Error:", error);
//       toast.error("Google Sign-in failed!");
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle>Sign In</CardTitle>
//       </CardHeader>

//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input placeholder="mahi@mail.com" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input type="password" placeholder="Enter your password" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Remember Me Checkbox */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="rememberMe"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//               />
//               <label htmlFor="rememberMe" className="ml-2 text-sm">Remember Me</label>
//             </div>

//             <Button className="w-full" type="submit">
//               Submit
//             </Button>
//           </form>
//         </Form>

//         <Button onClick={handleGoogleSignIn} className="w-full bg-red-500 hover:bg-red-600">
//           Sign in with Google
//         </Button>
//       </CardContent>

//       <CardFooter className="flex justify-center">
//         <p className="text-sm">
//           Forgot password?{" "}
//           <Link href="/forgot-password" className="text-primary hover:underline">
//             Click here
//           </Link>
//         </p>
//       </CardFooter>

//           <CardFooter className="flex justify-center">
//               <p className="text-sm text-muted-foreground">
//                 Don't have an account?{" "}
//                 <Link href="/sign-up" className="text-primary hover:underline">
//                   Sign up
//                 </Link>
//               </p>
//             </CardFooter>
//     </Card>
//   );
// }