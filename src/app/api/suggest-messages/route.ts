
import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google'; 
export async function POST(req: Request) { 
    try {
        // const { messages } = await req.json(); // Usually you get messages from the frontend hook
        
        const prompt = "Create a list of three open -ended and enagaging questions fromatted as a single string. Each question should be seperated by '||' .These questions are for an anonymous social messaging platform , like qooh.me , and should be suitable fro a diverse audience . Avoid personal or sesitive topics , focusing instead on universal themes that encourage freiendly interactions. For example , your output should be structured like this : 'what's a hobby you've recently started ? || If you could have dinner with any historical figure , who would it be? || What's a simple thing that makes you happy ? ' . Ensure the questions are intriguing , foster  curiosity, and contribute to a positive and welcoming conversational enviroment ."

        const result = await streamText({
            model: google("gemini-2.5-flash"), 
            messages: [
                { role: "user", content: prompt },
                // ...await convertToModelMessages(prompt )
            ],  
        });

        // console.log( result.toUIMessageStreamResponse());

        return result.toUIMessageStreamResponse(); 
    } catch (error: any) {
        console.error("AI Error:", error);
        
        return Response.json({
            message: error.message || "An unexpected error occurred",
        }, { status: error.status || 500 });
    }
}