import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {User} from "next-auth" ;
import mongoose from "mongoose";


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

       const userId = new mongoose.Types.ObjectId(user._id)
      try {
  // Use the aggregation pipeline with the corrected _id field
  const userMessages = await UserModel.aggregate([
    { $match: { _id: userId } }, // Fixed: Added underscore to _id
    { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } }, // Fixed: Handle empty message arrays
    { $sort: { 'messages.createdAt': -1 } },
    { $group: { _id: '$_id', messages: { $push: '$messages' } } }
  ]);

  // console.log("Aggregated User:", userMessages);

  // Check if user was found
  if (!userMessages || userMessages.length === 0) {
    return Response.json({
      success: false,
      message: "User not found",
    }, { status: 404 }); // Better status for missing resource
  }

  return Response.json({
    success: true,
    // If the user has no messages, userMessages[0].messages might contain [null] due to unwind
    // We filter out nulls or return empty array
    messages: userMessages[0].messages,
  }, { status: 200 });

} catch (error) {
  console.log("Aggregation Error: ", error);
  return Response.json({
    success: false,
    message: "Failed to fetch messages",
  }, { status: 500 });
}
 
}
          