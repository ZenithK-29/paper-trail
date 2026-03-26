import { connectToDb } from "@/lib/db"
import { NotesType } from "@/models/notes"
import Notes from "@/models/notes"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"


type ParamsType = {
    params: Promise<{
        id: string
    }>
}

export async function PUT(request: Request, {params}: ParamsType){

    try {
        await connectToDb()

        const {id} = await params

        const body: NotesType = await request.json()

        console.log("PUT BODY: ", body)


        const updatedNote = await Notes.findByIdAndUpdate(id, 
            {
                title: body.title,
                description: body.description,
                imageUrl: body.imageUrl,
                imagePublicId: body.imagePublicId
            },
            {new: true}
        )

        return NextResponse.json({error: false, message: "Notes updated successfully!", content: updatedNote}, {status: 201})


    } catch (error) {   
        console.log(error)
        return NextResponse.json({error: true, message: "Error updating the note"}, {status: 500})
    }


}

export async function DELETE(request: Request, {params}: ParamsType){
    try {

        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({error: true, message: "Couldn't delete note"}, {status: 401})
        }
        await connectToDb()

        
        const {id} = await params

        const note = await Notes.findOne({
            _id: id,
            userId: session.user.id
        })


        if(!note){
            return NextResponse.json({error: true, message: "Couldn't find the note to delete"}, {status: 404})
        }

        if(note.imagePublicId){
            try {
                const result = await cloudinary.uploader.destroy(note.imagePublicId)
                console.log("Deleting cloudinary image: ", result)
            } catch (error) {
                console.log("Cloudinary delete failed: ", error)
            }
        }

        const deletedNote = await Notes.findOneAndDelete({
            _id: id,
            userId: session.user.id
        })

        if(deletedNote == null){
            return NextResponse.json({error: true, message: "Couldn't find the note to delete"}, {status: 404})
        }

        return NextResponse.json({error: false, message: "Note deleted successfully", content: deletedNote}, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: true, message: "Error deleting the note"}, {status: 500})
    }
}