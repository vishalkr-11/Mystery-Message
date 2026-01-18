'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const page = () => {

// const previouspagelink = document.referrer ;
const searchParams = useSearchParams()
const previouspagelink = searchParams.get('from')
const username = previouspagelink ? previouspagelink.split('/').pop() : "";


  return (
    <div className='items-center mt-3 text-3xl w-full gap-4 bg-[url("/dbgimg.png")] bg-cover bg-center min-h-screen '>
        {previouspagelink ? "Message sent successfully ! " : ""}
    <div className = " mt-3 text-center flex-col items-center justify-center">
        <h1 className='text-6xl'>  MysteryMessage </h1>
        </div>
            <div className=' mt-4 items-center justify-center' > 
           <h2 className='text-xl '> ---  Sending anonymous Message to your freinds without knowing them your identity</h2> 
             <h2 className='text-xl '> ---  Anyone can send any message through their profile link </h2>
            <h2 className='text-xl '> --- For sharing your profile link First , you have to create your profile  </h2>  
            </div>
                       
           {username && (
      <div className="text-center mt-4">
        <Button asChild>
          <Link href={`/u/${username}`}>
            Send Message Again
          </Link>
        </Button>
      </div>
    )}
             <div className = "text-center mt-4 ">
            < Button><Link href = "/sign-up">Create Your Own Profile</Link></Button>
            </div>
    </div>
  )
}
export default page