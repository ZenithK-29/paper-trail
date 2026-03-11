import { connectToDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request: NextRequest){
    try {
        const {email, password} = await request.json()
        if(!email || !password){
            return NextResponse.json(
            {
                error: true,
                message: "Email and password are required"
            },
        {
            status: 400
        })
        }

        await connectToDb()

        const existingUser = await User.findOne({email: email})

        if(existingUser){
            return NextResponse.json(
            {
                error: true,
                message: 'User already exists'
            },
            {
                status: 409
            }
            )
        }

        await User.create({email: email, password: password})

        return NextResponse.json(
            {
            error: false,
            message: "User created successfully"
        
            }, 
            {
                status: 201
            })
    } catch (error) {
        console.log("Resgitration error: ", error)
        return NextResponse.json(
            {
                error: true,
                message: "Something went wrong"
            }, 
            {
                status: 500}
        )
    }
}