'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { User } from 'next-auth'
import { LogOut, Menu, User as UserIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const Navbar = () => {
  const { data: session } = useSession()
  const router = useRouter() 
  const pathname = usePathname()
  const user: User = session?.user as User
  const OpenDashboard = () =>{
  router.replace('/dashboard')
  }
  const OpenHomepage =() =>{
    router.replace ('/')
  }

  return (
    <nav className="bg-[url('/n1.png')] p-4 md:p-6 shadow-md bg-white/20 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo Section */}
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
          Mystery Message
        </Link>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {session ? (
            <>
              
              <span className="text-sm md:text-base font-medium flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Welcome, <span className="hidden sm:inline">{user?.username || user?.email}</span>
              </span>

              {(pathname === '/') ? 
              (<Button 
                onClick={() => OpenDashboard()} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <span>Dashboard</span>
              </Button>) : ''
                        }

              {(pathname === '/dashboard') ? 
              (<Button 
                onClick={() => OpenHomepage()} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <span>Home</span>
              </Button>) : ''
                        }            

              <Button 
                onClick={() => signOut({ callbackUrl: '/' })} // This forces redirect to home page
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
                </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar