
'use client'
import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay' 
import { Message } from "@/model/user"
import { useState , useCallback , useEffect} from 'react'
import { useSession } from "next-auth/react"
import axios from "axios"
import { formatDistanceToNow } from 'date-fns';


const Homepage = () => {
const [isMounted, setIsMounted] = useState(false);
  const [messages  ,setMessages] = useState<Message[]>([])
  const [isLoading , setIsLoading] = useState(false)
  const{data : session} = useSession()

  const fetchMessages =  useCallback (async() => {
    setIsLoading(true)
   try {const response = await axios.get('/api/get-messages')
    setMessages(response.data.messages || [])
   }catch(error){
    console.log("Error Fetching Messages" , error)
   }finally{
    setIsLoading(false)
   }
  }, [setIsLoading , setMessages])

  useEffect(() =>{
    if(!session || !session.user) return ;
    fetchMessages()
          setIsMounted(true);

  } , [fetchMessages])

  if(!session){
    return <div>Please Login!</div>
  }

//   useEffect(() => {
//   setIsMounted(true);
// }, []);

if (!isMounted) return <div className="h-64 flex items-center justify-center">Loading Carousel...</div>;
  // console.log(messages)
  return (
    <>
   <main className='  w-full min-h-[calc(100vh-4rem)] bg-[url("/1b1.png")] bg-cover flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
    <section className = " text-center mb-8 md:mb-12 ">
      <h1 className = " text-3xl md:text-5xl font-bold "> Dive into the World of Anonymous Conversations</h1>
      <p className = "mt-3 md:mt-4 text-base  ">Explore MysteryMessage - where your identity remains a secret.</p>
    </section>
          <h1 className = " text-xl md:text-5xl font-bold ">Your Messages </h1>

 <Carousel className="  w-full max-w-xs bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl rounded-xl" plugins={[Autoplay({delay:2000})]}>
      <CarouselContent>
        {messages.map((message , index)=>(
          <CarouselItem key={index}>
            <div className=" bg-[url('/1b1.png')] bg-blue-400/20 border-blue-200/30 backdrop-blur-md p-1">
              <Card>
                <CardHeader >
                  {index+1 }. Recieved {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </CardHeader>
                <CardContent className="  bg-[url('/b1.png')]  backdrop-blur-md flex aspect-square items-center justify-center p-6">
                  <span className="text-lg font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
   </main>
  <footer className="  text-center p-4 md:p-6">
    <div  className=" bg-black-500" >
        @2026 Mystery Message. All rights reserved. 
        </div>
  </footer>

</>
  )
}

export default Homepage