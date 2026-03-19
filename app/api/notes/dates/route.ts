import { NextRequest, NextResponse } from "next/server";
import Notes from "@/models/notes";
import { connectToDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({error: true, message: "User not authenticated to retrieve notes"}, {status: 401})
        }
        const userId = session.user.id
        await connectToDb()

        const allNotes = await Notes.find({userId}).sort({createdAt: -1})

        if(!allNotes){
            return NextResponse.json({error: true, message: "Couldn't fetch notes"}, {status: 404})
        }

        return NextResponse.json({error: false, message: "Successfully fetched all your notes", content: allNotes}, {status: 200})

    } catch (error) {
        console.log(error)                                          
        return NextResponse.json({error: true, message: "Something went wrong!"}, {status: 500})
    }
}