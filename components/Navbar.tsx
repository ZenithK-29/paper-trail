"use client"
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react' 
import { useRouter } from "next/navigation";

const Navbar = () => {

  const {data: session} = useSession()
  const router = useRouter()

  return (
    <div className='flex bg-slate-50 justify-around'>
      <div className="logo flex items-center h-12 gap-2">
        <img src="/logo.png" alt="" className='w-7 h-7'/>
        <Link href={"/"}><h1 className='logo font-bold text-3xl text-orange-400'>PaperTrail</h1></Link>
      </div>
      <ul className='flex items-center gap-10 font-semibold'>
        <Link href={"/"}><li className='hover:text-orange-400 cursor-pointer trasnition-all duration-170'>Home</li></Link>
        {session ? (
          <>
          <button onClick={()=>signOut()} className='bg-orange-400 p-2  rounded-md text-white cursor-pointer py-1'>Sign out</button>
          <button onClick={()=>{router.push("/dashboard")}} className='text-white bg-orange rounded-md bg-orange-400 p-2 cursor-pointer py-1'>Welcome {session.user.email}</button>
          </>
        ) : (
          <>
            <button className='text-white bg-orange rounded-md bg-orange-400 p-2 cursor-pointer'><Link href={"/login"}>Login</Link></button>
            <button className='text-white bg-orange rounded-md bg-orange-400 p-2 cursor-pointer'><Link href={"/register"}>SignUp</Link></button>
          </>
        )
          
        
        }
      </ul>
    </div>
  )
}

export default Navbar
