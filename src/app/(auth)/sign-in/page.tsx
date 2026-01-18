'use client'

import React, { Suspense } from 'react' // 1. Added Suspense
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter, useSearchParams } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'
import { toast } from "sonner"

// --- SUB-COMPONENT: The actual Form logic ---
const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // This is the line that causes the build error

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    });

    if (result?.error) {
      // Handling the specific "Invalid credentials" or generic errors
      toast.error(result.error === 'CredentialsSignin' ? "Invalid username or password" : "Login Failed");
    }

    if (result?.url) {
      router.replace(callbackUrl);
    }
  };

  return (
    <div className="bg-[url('/bgimg.png')] flex justify-center items-center min-h-screen bg-gray-100">
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className='mb-4'>Sign In to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full'>
              SignIn
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT: Exported to Next.js ---
const Page = () => {
  return (
    // 2. This Suspense boundary fixes the Vercel Prerender Error
    <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen">
            Loading Login...
        </div>
    }>
      <SignInForm />
    </Suspense>
  )
}

export default Page;