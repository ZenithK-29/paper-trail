import mongoose, { Schema, model, models } from "mongoose"

export interface NotesType {
    _id?: mongoose.Types.ObjectId,
    title: string,
    description: string,
    createdAt?: Date,
    updatedAt?: Date,
    userId?: string,
    imageUrl?: string,
    imagePublicId?: string
}

const notesSchema =  new Schema<NotesType>(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        userId: {type: String, required: true},
        imageUrl: {type: String},
        imagePublicId: {type: String},
    },
    {
        timestamps: true
    }
)

const Notes = models?.Notes || model<NotesType>("Notes", notesSchema)

export default Notes