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

import { Loader2 } from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import SignUp from "@/app/(auth)/sign-up/page";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

type AuthFormType = "sign-in" | "sign-up";

interface AuthFormProps {
    type: AuthFormType;
}

const getFormSchema = (type: AuthFormType) => {
    return z.object({
        // Sign Up fields
        firstName:
            type === "sign-in" ? z.string().optional() : z.string().min(3),
        lastName:
            type === "sign-in" ? z.string().optional() : z.string().min(3),
        address1:
            type === "sign-in" ? z.string().optional() : z.string().max(50),
        city: type === "sign-in" ? z.string().optional() : z.string().max(50),
        state:
            type === "sign-in"
                ? z.string().optional()
                : z.string().min(2).max(2),
        postalCode:
            type === "sign-in"
                ? z.string().optional()
                : z.string().min(3).max(6),
        dob: type === "sign-in" ? z.string().optional() : z.string().date(),
        ssn: type === "sign-in" ? z.string().optional() : z.string().min(3),
        // Both fields
        email: z.string().email(),
        password: z.string().min(9),
    });
};

export default function AuthForm({ type }: AuthFormProps) {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = getFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            // sign up with Appwrite & create plaid token

            if (type === "sign-up") {
                const newUser = await signUp(data);

                setUser(newUser);
            }

            if (type === "sign-in") {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                });

                if (response) {
                    router.push("/");
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
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
                            {type === "sign-up" && (
                                <>
                                    <div className="flex items-center gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <div className="form-item">
                                                    <FormLabel className="form-label">
                                                        First Name
                                                    </FormLabel>
                                                    <div className="flex w-full flex-col">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter your first name"
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
                                            name="lastName"
                                            render={({ field }) => (
                                                <div className="form-item">
                                                    <FormLabel className="form-label">
                                                        Last Name
                                                    </FormLabel>
                                                    <div className="flex w-full flex-col">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter your last name"
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
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="address1"
                                        render={({ field }) => (
                                            <div className="form-item">
                                                <FormLabel className="form-label">
                                                    Address
                                                </FormLabel>
                                                <div className="flex w-full flex-col">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your address"
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
                                        name="city"
                                        render={({ field }) => (
                                            <div className="form-item">
                                                <FormLabel className="form-label">
                                                    City
                                                </FormLabel>
                                                <div className="flex w-full flex-col">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your city"
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
                                    <div className="flex items-center gap-4">
                                        <FormField
                                            control={form.control}
                                            name="state"
                                            render={({ field }) => (
                                                <div className="form-item">
                                                    <FormLabel className="form-label">
                                                        State
                                                    </FormLabel>
                                                    <div className="flex w-full flex-col">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Example: NY"
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
                                            name="postalCode"
                                            render={({ field }) => (
                                                <div className="form-item">
                                                    <FormLabel className="form-label">
                                                        Postal Code
                                                    </FormLabel>
                                                    <div className="flex w-full flex-col">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Example: 11101"
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
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dob"
                                            render={({ field }) => (
                                                <div className="form-item">
                                                    <FormLabel className="form-label">
                                                        Date Of Birth
                                                    </FormLabel>
                                                    <div className="flex w-full flex-col">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="YYYY-MM-DD"
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
                                            name="ssn"
                                            render={({ field }) => (
                                                <div className="form-item">
                                                    <FormLabel className="form-label">
                                                        SSN
                                                    </FormLabel>
                                                    <div className="flex w-full flex-col">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Example: 1234"
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
                                    </div>
                                </>
                            )}
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
                            <div className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    className="form-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2
                                                size={20}
                                                className="animate-spin"
                                            />{" "}
                                            &nbsp; Loading...
                                        </>
                                    ) : type === "sign-in" ? (
                                        "Sign In"
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <footer className="flex justify-center gap-1">
                        <p className="text-sm font-normal text-gray-600">
                            {type === "sign-in"
                                ? "Don't have an account?"
                                : "Already have an account?"}
                        </p>
                        <Link
                            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                            className="form-link"
                        >
                            {type === "sign-in" ? "Sign Up" : "Sign In"}
                        </Link>
                    </footer>
                </>
            )}
        </section>
    );
}
