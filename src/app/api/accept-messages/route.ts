import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {User} from "next-auth" ;
import mongoose from "mongoose";


export async function POST(request : Request){
    await dbConnect()
       const session = await getServerSession(authOptions)
       const user :User = session?.user as User

       if(!session || !session.user){
        return Response.json({
            success : false ,
            message : "Not Authenticated"
        }, {status : 401})
       } 

       const userId = user._id ;
       const {acceptMessages} = await request.json()
    //    console.log(acceptMessages)

       try{
        const updatedUser = await UserModel.findByIdAndUpdate(userId , {isAcceptingMessage : acceptMessages} , {new:true})
        // console.log(updatedUser)
        if(!updatedUser){
            return Response.json({
                success : true ,
                message : "Internal server error" ,
                updatedUser
            },{status : 500})
        }
         return Response.json({
                success : true ,
                message : "message acceptance status updated successully" ,
                updatedUser
            },{status : 200})
    
    
    }catch(error){
        console.log("failed to update user status to accept messages ")
        return Response.json({
            success : "false " ,
            message : "failed to update user status to accept messages"
        }, {status : 500})
       }


}

export async function GET (request : Request){
     await dbConnect()
       const session = await getServerSession(authOptions)
       const user :User = session?.user as User

       if(!session || !session.user){
        return Response.json({
            success : false ,
            message : "Not Authenticated"
        }, {status : 401})
       } 
       const userId = user._id ;
       
       try{
        const mongoUserId = new mongoose.Types.ObjectId(userId);

    const foundUser = await UserModel.findById(mongoUserId);
       if(!foundUser){
        return Response.json ({
            success : false ,
            message : "user not found "
        }, {status : 401})
       }
        return Response.json ({
            success : true ,
            isAcceptingMessages : foundUser.isAcceptingMessage,
        }, {status :200})
       }catch(error){
         console.log("failed to update user status to accept messages ")
        return Response.json({
            success : "false " ,
            message : "Error in getting message acceptance "
        }, {status : 500})
       }
    }