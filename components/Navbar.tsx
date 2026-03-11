"use client"
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

const Navbar = () => {

  const {data: session} = useSession()

  return (
    <div className='flex bg-amber-500 justify-around'>
      <div className="logo flex items-center h-10">
        <Link href={"/"}><h1 className='logo font-bold text-3xl text-orange-900'>My_Notes</h1></Link>
        <img src="/logo.png" alt="" className='w-7 h-7'/>
      </div>
      <ul className='flex items-center gap-10 font-semibold'>
        <li className='hover:text-amber-100 cursor-pointer'>Home</li>
        {session ? (
          <button onClick={()=>signOut()} className='bg-amber-300 p-2  rounded-md text-white cursor-pointer py-1'>Sign out</button>
        ) : (
          <>
            <button className='bg-amber-300 p-2  rounded-md text-white cursor-pointer py-1'><Link href={"/login"}>Login</Link></button>
            <button className='bg-amber-300 p-2  rounded-md text-white cursor-pointer py-1'><Link href={"/register"}>SignUp</Link></button>
          </>
        )
          
        
        }
      </ul>
    </div>
  )
}

export default Navbar
