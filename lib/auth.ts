import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDb } from "./db";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text", placeholder: "someone@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Email and password required!")
                }

                try {
                    await connectToDb()

                    const findUser = await User.findOne({email: credentials.email})

                    if(!findUser){
                        throw new Error("User not found!")
                    }

                    const isValid = await bcrypt.compare(credentials.password, findUser.password)

                    if(!isValid){
                        throw new Error("Password doesnt match!")
                    }

                    return {
                        id: findUser._id.toString(),
                        email: findUser.email
                    }
                } catch (error) {
                    console.log("Auth error: ", error)
                    throw error
                }
            }
        })
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({user, token}) {
            if(user){
                token.id = user.id
            }
            return token
        },

        async session({session, token}) {
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        }
    },

    secret: process.env.NEXTAUTH_SECRET
}