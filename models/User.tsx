import mongoose, {Schema, model, models, mongo} from "mongoose";
import bcrypt from "bcryptjs";

export interface UserType{
    _id?: mongoose.Types.ObjectId,
    email: string,
    password: string,
    createdAt?: Date,
    updatedAt?: Date,
}

const userSchema = new Schema<UserType>(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function(){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    } 
})

const User = models?.User || model<UserType>("User", userSchema)

export default User