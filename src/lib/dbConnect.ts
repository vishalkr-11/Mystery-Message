import mongoose from "mongoose" ;


type ConnectionObject = {
     isConnected?: number      //? -> indicates optional
}

const connection : ConnectionObject ={}       //INTIALISING CONECTIONoBJECT


 async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log("already connected to database");
        return 
    }
    
    try{
        const db =  await mongoose.connect(process.env.MONGODB_URL || '')

        connection.isConnected = db.connections[0].readyState
        console.log("db connected successfully");
    }catch(error){
    console.log("database connecton failed");
    process.exit(1)
 }
 }


 export default dbConnect ;
 





