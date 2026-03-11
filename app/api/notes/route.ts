import { connectToDb } from "@/lib/db";
import Notes, {NotesType} from "@/models/notes";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export async function GET(){
    try {

        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({error: true, message: "User not logged in"}, {status: 401})
        }
        await connectToDb()

        const notes: NotesType[] = await Notes.find({userId: session?.user?.id}).sort({createdAt: -1}).lean()

        return NextResponse.json({error: false, message: "Notes fetched", content: notes, sessinfo: session?.user?.id}, {status: 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: true, message: "Unable to fetch notes"}, {status: 500})
    }
}

export async function POST(request: Request) {
    try {

        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({error: true, message: "User not verified to upload"}, {status: 401})
        }

        await connectToDb()

        const body: NotesType = await request.json()

        if(!body.title || !body.description){
            return NextResponse.json({error: true, message: "Missing fields"}, {status: 400})
        }

        const nodeData = {
            ...body,
            userId: session?.user?.id
        }

        const newNote = await Notes.create(nodeData)

        return NextResponse.json({error: false, message: "Entry created successfully", content: newNote}, {status: 201})

        
    } catch (error: any) {
        console.log(error)

        if(error.code===11000){
            return NextResponse.json({error: true, message: "Title already exists"}, {status: 500})
        }

        return NextResponse.json({error: true, message: "Couldnt create entry"}, {status: 500})
    }
}

