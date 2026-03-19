import { connectToDb } from "@/lib/db";
import Notes from "@/models/notes";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(request: NextRequest) {
    try {
        await connectToDb()

        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({error: true, message: "User not authenticated"}, {status: 401})
        }
        
        const userId = session.user.id
        const selectedDate = new Date(request.nextUrl.searchParams.get("date")!)
        
        if(!selectedDate){
            return NextResponse.json({error: true, message: "Didn't receive Date"}, {status: 400})
        }
        
        const start = new Date(selectedDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(selectedDate)
        end.setHours(23, 59, 59, 999)
        const note = await Notes.find({
            userId: userId,
            createdAt: {
                $gte: start,
                $lte: end
            }
        }).sort({createdAt: -1})

        if(!note){
            return NextResponse.json({error: true, message: "Error retrieving the note"}, {status: 404})
        }

        return NextResponse.json({error: false, message: "Successfull retrieved the data", content: note}, {status: 200})


    } catch (error) {
        console.log("Dashboard APIR error: ", error)
        return NextResponse.json({error: true, message: "Something whent wrong"}, {status: 500})
    }
}