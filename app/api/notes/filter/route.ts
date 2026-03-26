import { connectToDb } from "@/lib/db";
import Notes from "@/models/notes";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions)

    try {
        await connectToDb()

        if(!session){
            return NextResponse.json({error: true, message: "Not Authenticated"}, {status: 401})
        }

        const userId = session.user.id
        const { searchParams } = new URL(request.url)

        if(!searchParams){
            return NextResponse.json({error: true, message: "Didn't receive start or end date"}, {status: 400})
        }

        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")

        if(!startDate || !endDate){
            return NextResponse.json({error: true, message: "Unable to retrieve start or end date"}, {status: 400})
        }

        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

        const notes = await Notes.find({
            userId: userId,
            createdAt: {
                $gte: start,
                $lte: end
            }
        }).sort({createdAt: -1})

        return NextResponse.json({error: false, message: "Successfully retrieved your notes wihin your range!", content: notes}, {status: 200})

        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: true, message: "Something went wrong!"}, {status: 500})
    }

}