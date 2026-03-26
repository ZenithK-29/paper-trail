import cloudinary from "@/lib/cloudinary";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(request: NextRequest){
    const session = getServerSession(authOptions)

    if(!session){
        return NextResponse.json({error: true, message: "Unauthenticated User"}, {status: 401})
    }

    try {
        const body = await request.json()
        const {image} = body

        if(!image){
            return NextResponse.json({error: true, message: "Didn't receive image"}, {status: 400})
        }

        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "notes_app"
        })

        if(!uploadResponse){
            return NextResponse.json({error: true, message: "Unable to upload the image"}, {status: 400})
        }

        return NextResponse.json({error: false, message: "Successfully uploaded image in database", content: uploadResponse}, {status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: true, message: "Something went wrong"}, {status: 500})
    }
}