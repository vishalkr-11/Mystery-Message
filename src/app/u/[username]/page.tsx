'use client'
// import {  useForm,  } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@react-email/components'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams , usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const page = () => {
  const router = useRouter()
  const pathname = usePathname();
  const Params =  useParams() 
  const username = Params.username 

 const [isSubmitting , setIsSubmitting] = useState(false)
 const form = useForm<z.infer<typeof messageSchema>> ({
       resolver : zodResolver(messageSchema),
     })
 
       const onSubmit = async(data : z.infer<typeof messageSchema>) => {
       setIsSubmitting(true)
        try {
            const response = await axios.post('/api/send-message', {
              username : username ,
              content : data.content 
            })
             router.replace(`/mysterymessage?from=${pathname}`)
            console.log(response)
        } catch (error) {
const axiosError = error as AxiosError<ApiResponse>;  
const errorMessage = axiosError.response?.data.message || 
           "Something went wrong while sending the message.";

    toast.error(errorMessage);
        }
       }
 
 
 
    return (
    <>
    <div className = "  bg-[url('/bgimg.png')] flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md '>
        <div className='text-center'>
        <h1 className = "text-4xl font-extrabold tracking-tight lg: text-5xl mb-6 ">
          Send Anonymous Message 
        </h1>
        <p className='mb-4'> Send any message without your Identity</p>
        <p>You are sending message to {username}</p>

      </div>

     <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit) } className =  "space-y-6">
    {/* <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field}
                  />
                   </FormControl>
                  {isCheckingUsername  &&  <Loader2 className='animate-spin ' /> }
                  <p className = {`text-sm ${usernameMessage === "username is unique" ?  " text-green-500" :"text-red-500" }`}>test {usernameMessage}</p>
                <FormMessage />
              </FormItem>
  )}
/> */}
 

         <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                 <Input placeholder="Send Anonymous Message" {...field} />
                </FormControl>
              </FormItem>
  )}
/>
            
          { <Button type = "submit" disabled = {isSubmitting}>
            {
              isSubmitting?
              (
                <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Sending Message
                </>
              ) : ('Send')
            }
            
            </Button>         }
        </form>
      </Form>
            <div className = "text-center mt-4" >
              <p>
                Want your own page where random people can send anonymous message  ?{''}
                <Link href = "/sign-up" className= " text-blue-600  hover:text-blue-800 " >Make Your own profile</Link>          
                 </p>
              </div>
              
            </div>
    </div>
    </>
  )
}

export default page