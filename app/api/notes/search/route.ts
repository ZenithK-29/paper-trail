import { connectToDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import Notes from "@/models/notes";
import { authOptions } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest){

    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({error: true, message: "Unauthorized user searching"}, {status: 401})
        }

        const userId = session.user.id

        await connectToDb()

        const {searchParams} = new URL(request.url)
        const query = searchParams.get("q")

        if(!query || query.trim().length < 2){
            return NextResponse.json({error: true, message: "Invalid search query"}, {status: 400})
        }

        const notes = await Notes.find({
            userId,
            $or: [
                {title: {$regex: query, $options: "i"}},
                {description: {$regex: query, $options: "i"}}
            ]
        })

        if(notes.length === 0){
            return NextResponse.json({error: true, message: "Unable to fetch Notes"}, {status: 404})
        }

        return NextResponse.json({error: false, message: "Notes fetched successfully from seacrh query", content: notes}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: true, message: "Something went wrong"}, {status: 500})
    }
}