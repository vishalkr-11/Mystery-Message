
import {z} from "zod" 



export const messageSchema = z.object ({ 
content : z
    .string()
    .min(10, {message : "content must be at least of 10 characteers"})
    .max(300 ,{ message : "Contentn must not exceed 300 characters !"})
})


