'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/user"
import { toast } from "sonner"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Types } from "mongoose"
import { formatDistanceToNow } from 'date-fns';

type MessageCardProps = {
    message : Message,
    onMessageDelete : (messageId : string | Types.ObjectId) => void
}

const MessageCard = ({message  , onMessageDelete } : MessageCardProps) => {
    const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse> (`/api/delete-message/${message._id}`)
        toast.success(response.data.message)
        onMessageDelete(message._id)
    }
    
  return (
<Card className="bg-[url('/g1.png')]">
  <CardHeader >
<CardTitle className="  bg-cover text-md font-medium"> Recieved {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
   </CardTitle>
  </CardHeader>
  <CardContent className=' bg-[url("/g2.png")] bg-cover'>
    <p>{message.content}</p>
    </CardContent>
   <AlertDialog>
      <AlertDialogTrigger asChild>
<Button  size="icon" className=" mx-8 h-8 w-8 bg-black"> <X className="h-4 w-4" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deleting Message</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure , want to delete permanently ? 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick = {handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
</Card>  )
}

export default MessageCard