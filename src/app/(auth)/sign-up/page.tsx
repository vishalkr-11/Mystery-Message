'use client'
import React, { useEffect, useState } from 'react'
import {zodResolver}from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod" 
import Link from "next/link"
import {useDebounceValue , useDebounceCallback} from'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signupSchema'
import axios , {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
// import dbConnect from '@/lib/dbConnect'
// import UserModel from "@/models/User";

const page =() =>{
    // dbConnect()
     const [username , setUsername] = useState('')
    const [usernameMessage , setUsernameMessage]  = useState('')
    const[isCheckingUsername , setIsCheckingUsername] = useState(false)
    const [isSubmitting , setIsSubmitting] = useState(false)


     const debounced= useDebounceCallback(setUsername , 300);
    const router = useRouter();

    //zod implementation 
    const form = useForm<z.infer<typeof signUpSchema>> ({
      resolver : zodResolver(signUpSchema),
      defaultValues :{
        username : '',
        email : '' ,
        password : ''
            }
    })
      useEffect(() => {
        const checkUsernameUnique = async () => {
          if(username){
            setIsCheckingUsername(true)
            setUsernameMessage('')
            try {
              const response = await axios.get(`/api/check-username-unique?username=${username}`)
              console.log(response.data.message)
              let message = response.data.message;
              setUsernameMessage(message);
            } catch (error) {
              const AxiosError = error as AxiosError<ApiResponse>;
              setUsernameMessage (
                AxiosError.response?.data.message ?? "Error Checking Username"
              )
            } finally{
              setIsCheckingUsername(false)
            }
          }
        }
        checkUsernameUnique()
      },[username])

      const onSubmit = async(data : z.infer<typeof signUpSchema>) => {
      setIsSubmitting(true)
      try {
        const response = await axios.post<ApiResponse>('/api/sign-up' , data)
       console.log(response);
        toast.success(response.data.message)
        router.replace(`/sign-in`)
        setIsSubmitting(false)
      } catch (error) {
        console.error("Error in signup of user " , error )
        const AxiosError = error as AxiosError<ApiResponse>;
        let errorMessage = AxiosError.response?.data.message 
        toast.error( errorMessage )
        setIsSubmitting(false)
      }
      }


  return (
    <div className = "  bg-[url('/bgimg.png')] flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md '>
        <div className='text-center'>
        <h1 className = "text-4xl font-extrabold tracking-tight lg: text-5xl mb-6 ">
          Join Mystery Message 
        </h1>
        <p className='mb-4'> Sign up to start your anonymous adventure</p>
      </div>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit) } className =  "space-y-6"> 
       
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field}
                  onChange = {(e) => {
                    field.onChange(e) 
                     debounced(e.target.value)
                  }}
                  />
                   </FormControl>
                  {isCheckingUsername  &&  <Loader2 className='animate-spin ' /> }
                  <p className = {`text-sm ${usernameMessage === "username is unique" ?  " text-green-500" :"text-red-500" }`}>test {usernameMessage}</p>
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
                  <Input placeholder="email" {...field}
                  />
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
                  <Input type = "password" placeholder="password" {...field}

                  />
                </FormControl>
                <FormMessage />
              </FormItem>
  )}
/>      
          <Button type = "submit" disabled = {isSubmitting}>
            {
              isSubmitting?(
                <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                </>
              ) : ('signup')
            }
            
            </Button>        
        </form>
      </Form>
            <div className = "text-center mt-4" >
              <p>
                Already a member?{''}
                <Link href = "/sign-in" className= " text-blue-600  hover:text-blue-800 " >SignIn</Link>          
                 </p>
              
               </div>
      </div>
    </div>
  )
}
 
export default page  ;