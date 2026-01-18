import {z} from 'zod'  ;

export const usernameValidation = z
    .string()
    .min(2 , "username must be atleast two characters ")
    .max(20 , "username must be not more than 20")
    .regex(/^[a-zA-Z0-9]+$/ , "username must not contain special character ")



export const signUpSchema = z.object ({
    username : usernameValidation ,
    email : z.string().email({message : "invalid email address"}) ,
    password : z.string().min(6 , {message : "password must be atleast 6 characters"})
})    