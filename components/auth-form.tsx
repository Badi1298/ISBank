"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(9),
});

export default function AuthForm({ type }: { type: string }) {
    const [user, setUser] = useState(null);

    // 1. Define your form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

    return (
        <section className="auth-form">
            <header className="flex flex-col gap-5 md:gap-8">
                <Link
                    href="/"
                    className="flex cursor-pointer items-center gap-1"
                >
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="is logo"
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                        ISBank
                    </h1>
                </Link>

                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                        {user
                            ? "Link Account"
                            : type === "sign-in"
                            ? "Sign In"
                            : "Sign Up"}
                    </h1>
                    <p className="text-base font-normal text-gray-600">
                        {user
                            ? "Link your account to get started"
                            : "Please enter your details"}
                    </p>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4">{/* PlaidLink */}</div>
            ) : (
                <>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <div className="form-item">
                                        <FormLabel className="form-label">
                                            Email
                                        </FormLabel>
                                        <div className="flex w-full flex-col">
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your email"
                                                    className="input-class"
                                                    type="text"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="form-message mt-2" />
                                        </div>
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <div className="form-item">
                                        <FormLabel className="form-label">
                                            Password
                                        </FormLabel>
                                        <div className="flex w-full flex-col">
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your password"
                                                    className="input-class"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="form-message mt-2" />
                                        </div>
                                    </div>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </>
            )}
        </section>
    );
}
