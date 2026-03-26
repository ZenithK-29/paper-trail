import { NextResponse, NextRequest } from "next/server";

interface ContentType{
    title: string,
    description: string
}

export async function POST(request: NextRequest) {

    try {

        const {content}:{content: ContentType[]} = await request.json()

        if(content.length === 0 || !content){
            return NextResponse.json({error: true, message: "No notes received"}, {status: 400})
        }

        const combinedNotes = content.map((note, index)=>{
            return `
                Note: ${index + 1}:
                Title: ${note.title}
                Description: ${note.description}
            `
        }).join("\n")

        const response  = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:3000/dashboard', // Optional. Site URL for rankings on openrouter.ai.
            'X-OpenRouter-Title': 'Paper Trail', // Optional. Site title for rankings on openrouter.ai.
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'openrouter/auto',
            messages: [
                {
                    role: 'user',
                    content: `Summarize following group of notes or note:
                        ${combinedNotes}
                        - If the content is unclear, meaningless, or random, respond with:
                        "This note cannot be summarized meaningfully."
                        - Otherwise, give 3 to 4 bullet points
                        -make sure its either in bullet point that is new line or completely in paragraph`,
                },
            ],
        }),
        });

        const data = await response.json()

        if(!data){
            throw new Error("Couldnt get the response object for AI API")
        }

        const summary = data?.choices?.[0]?.message.content

        if(!summary){
            console.log("Summary error response: ", data)
            return NextResponse.json({error: true, message: "Error generating summary"}, {status: 500})
        }

        return NextResponse.json({error: false, message: "SuccessFully generated summary!", summary: summary}, {status:200})


    } catch (error) {
        console.log(error)
        return NextResponse.json({error: true, message: "Something went wrong!"}, {status:500})
    }

    
}

