// src/app/(auth)/sign-in/view.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, OctagonAlertIcon, GithubIcon, ChromeIcon } from "lucide-react";


import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(1, { message: "Password is required." }),
});

export const SignInView = () => {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null);
        setIsSubmitting(true);

        authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/",
        }, {        
            onError: (error: any) => {
                setError(error.message || "Invalid email or password");
                setIsSubmitting(false);
            },
            onSuccess: () => {
                setIsSubmitting(false);
                router.push("/");
            }
        });
    }

    const onSocial = (provider: "github" | "google") => {
        setIsSubmitting(true);
        setError(null);
        authClient.signIn.social(
            { provider : provider,
                callbackURL: "/",
            }, {
            onError: (error: any) => {
                setError(error.message || "Authentication Failed");
                setIsSubmitting(false);
            },
            onSuccess: () => {
                setIsSubmitting(false);
                router.push("/");
            }
        });
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen"> 
            <Card className="w-full max-w-md p-2">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center gap-2 mb-6">
                        <img src="/logo.svg" alt="logo" className="h-16 w-16"/>
                        <p className="text-xl font-bold">Agent Connect</p>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                        <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            {error && (
                                <Alert variant="destructive">
                                    <OctagonAlertIcon className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="you@example.com" {...field} />
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
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </Form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => onSocial("github")}><GithubIcon className="mr-2 h-4 w-4" />GitHub</Button>
                        <Button variant="outline" onClick={() => onSocial("google")}><ChromeIcon className="mr-2 h-4 w-4" />Google</Button>
                    </div>

                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="underline">Sign up</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};