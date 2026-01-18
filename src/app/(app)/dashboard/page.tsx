
'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message, User } from '@/model/user'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
 




const Page = () => {
  const [messages  ,setMessages] = useState<Message[]>([])
  const [isLoading , setIsLoading] = useState(false)
  const [isSwitchLoading , setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId : string | any) => {
    setMessages(messages.filter((message) => message._id.toString()!== messageId.toString()))
  }
  const {data : session } = useSession()
  const form = useForm({
    resolver : zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false
    }
  })
  const {register , setValue , watch} = form  ;
  const acceptMessages = watch ('acceptMessages');
  const fetchAcceptMessage = useCallback(async() => {
    setIsSwitchLoading(true) 
    try {
      const response = await axios.get('/api/accept-messages') 
      setValue('acceptMessages' , response.data.isAcceptingMessage)
    } catch (error) {
     const axiosError = error as AxiosError<ApiResponse> 
     toast.error(axiosError.response?.data.message  || "failed to fetch message settings")
    }finally{
      setIsSwitchLoading(false)
    }
  } , [setValue])

  const fetchMessages = useCallback(async(refresh : boolean = false) =>{
    setIsLoading(true)
    setIsSwitchLoading(false) 
    try {
      const response = await axios.get("/api/get-messages")
      setMessages(response.data.messages ||[])
      if(refresh){
        toast.success( "Showing latest messages")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse> 
     toast.error(axiosError.response?.data.message  || "failed to fetch message settings")
    }finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  } ,[setIsLoading , setMessages])

  useEffect (() =>{
    if(!session || !session.user) return ;
    fetchAcceptMessage()
    fetchMessages()

  } , [ session , setValue , fetchAcceptMessage , fetchMessages])

  //handleswitch change 
  const handleSwitchChange = async() => {
    try {
     const response = await axios.post<ApiResponse>('/api/accept-messages' , {
      acceptMessages : !acceptMessages
     })
     setValue('acceptMessages' , !acceptMessages)
     toast.success(response.data.message);
    } catch (error) {
      
    }
  }


  const [profileUrl, setProfileUrl] = useState('')

  useEffect(() => {
    // This code ONLY runs in the browser
    const origin = window.location.origin 
    const username = session?.user?.username
    setProfileUrl(`${origin}/u/${username}`)
  }, [session])

  //  const user = session?.user as User
  //   const username = user?.username;
  //   const origin = window.location.origin 
  //  const profileUrl = `${origin}/u/${username}`

  //  const  baseUrl = `${window.location.protocol}//${window.location.host}`
  //  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl) 
    const tmsg = "URL copied succesfully " ;
    toast.success(tmsg)
  }


  if(!session || !session.user){
    return <div>Please Login</div>
  }


  return (
    
<div className='   w-full min-h-[calc(100vh-4rem)] bg-[url("/1b1.png")] bg-cover r bg-no-repeat p-4 md:p-8'> 
<div className="max-w-6xl mx-auto">
 <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1> 
<div className='mb-4'>
  <h2 className='text-lg font-semibold mn-2 '>Copy Your Unique Link </h2>{''}
  <div className='flex items-center'>
<input 
type = "text"
value = { profileUrl} 
disabled
className='input input-boardered w-full p-2 mr-2 ' />
<Button onClick = {copyToClipboard} >Copy</Button>
  </div>
</div>
<div className='mb-4'>
  <Switch {...register('acceptMessages')}
  checked = {acceptMessages}
  onCheckedChange = {handleSwitchChange}
  disabled = {isSwitchLoading}/>
  <span className = "ml-2" > Accept Messages  : {acceptMessages ? 'On' : 'Off'}</span>
</div>
<Separator />
<Button 
className='mt-4' 
variant = "outline"
onClick = {(e) =>{
  e.preventDefault();
  fetchMessages(true);
}}
>
  { isLoading ? (<Loader2 className = " h-4 w-4 animate-spin "/>) : (<RefreshCcw className = " h-4 w-4" />) }

</Button>
<div className='mt-4 grid grid-cols-1 md: grid-cols-2 gap-6'>
  {messages.length > 0 ?( 
    messages.map((message , index) => (
      <MessageCard 
      key = { message._id.toString()}
      message = {message } 
      onMessageDelete = { handleDeleteMessage}
      />
    ))
  ) : (<p> No messages to display. </p>)}

    </div>
    </div>
</div>
  );
}

export default Page
