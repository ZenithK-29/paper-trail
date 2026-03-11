"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { useState } from 'react'

const Register = () => {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault()

      try {
        if(password != confirmPassword){
            alert("Password doesnt match")
            return
        }

        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const data = await res.json()

        if(!res.ok){
            alert(data.message)
            console.log("Data: ", data)
            throw new Error(data.error || "Resgistration failed")
        }

        router.push("/login")

        
      } catch (error) {
        console.log(error)
        throw new Error("Resgistration error!")
      }
    }
    

  return (
    <div className='min-h-screen flex'>
      <div className='w-1/2 text-center bg-slate-50'>
        
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 pt-50 items-center '>
            <h1 className='font-bold text-2xl text-blue-300 py-10'>Sign in to your account</h1>
            <input 
            type="email"
            value={email}
            onChange={(e)=>setemail(e.target.value)} 
            placeholder='Email' 
            className='border border-slate-500 p-2 rounded-md w-100'/>

            <input 
            type="password"
            value={password}
            onChange={(e)=>setpassword(e.target.value)} 
            placeholder='Password' 
            className='border border-slate-500 p-2 rounded-md w-100'/>

            <input type="password"
            value={confirmPassword} 
            onChange={(e)=>setconfirmPassword(e.target.value)}
            placeholder='Confirm Password' 
            className='border border-slate-500 p-2 rounded-md w-100'/>

            <button className='bg-blue-400 w-100 p-2 text-white rounded-2xl font-semibold'>Sign in</button>
        </form>

        <p className='p-20'>Already have an account? <a href="/login" className='text-cyan-300'>Login</a> </p>
      </div>

      <div className="image w-1/2">
        <img src="/register.jpg" alt="" className='w-full h-full blur-[0px]'/>
      </div>
    </div>
  )
}

export default Register
