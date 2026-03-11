"use client"
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'


const Login = () => {

    const [email, setemail] = useState<string>("")
    const [password, setpassword] = useState<string>("")
    const router = useRouter()

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault()

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
    })

    console.log(result)

    if(!result?.ok){
        alert("Invalid credentials!")
    }
    else{
      alert("Logged in successfully!")
        router.push("/")
    }
    }
    


  return (
    <div className='min-h-screen flex'>
      <div className='w-1/2 text-center bg-slate-50'>
        
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 pt-50 items-center '>
            <h1 className='font-bold text-2xl text-blue-300 py-10'>Log In to your account</h1>
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


            <button className='bg-blue-400 w-100 p-2 text-white rounded-2xl font-semibold'>Log in</button>
        </form>

        <p className='p-20'>Dont have an account? <a href="/register" className='text-cyan-300'>Sign In</a> </p>
      </div>

      <div className="image w-1/2">
        <img src="/register.jpg" alt="" className='w-full h-full blur-[0px]'/>
      </div>
    </div>
  )
}

export default Login
