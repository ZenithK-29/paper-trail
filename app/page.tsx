"use client"
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ResMssgContent = {
  error: boolean,
  message: string,
  content: NotesClient[],
  sessinfo: string
}

type NotesClient = {
  _id: string,
  title: string,
  description: string
  createdAt?: Date,
  updatedAt?: Date,
}

export default function Home() {

  const [title, settitle] = useState<string>("")
  const [description, setdescription] = useState<string>("")
  const [notes, setnotes] = useState<NotesClient[]>([])
  const [editId, seteditId] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setloading] = useState(true)


  const fetchUser = async () => {

    try {
      const res = await fetch("/api/notes")
      const data: ResMssgContent = await res.json()

      if (res.status === 401) {
        router.push("/login")
        return
      }

      if (!res.ok) {
        throw new Error(data.message)
      }


      setnotes(data.content)
      setloading(false)

    } catch (error) {
      console.log(error)
      alert("Something went wrong")
    }

  }


  useEffect(() => {
    fetchUser()
  }, [])


  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!session) {
      alert("You must be logged in to add notes")
      return
    }


    if (editId) {
      const res = await fetch(`/api/notes/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description
        })
      })

      settitle("")
      setdescription("")
      seteditId(null)

      const data = await res.json()

      setnotes(prev => {
        return prev.map(note =>
          note._id === editId ? data.content : note
        )
      })

    }

    else {

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description
        })
      })

      const data = await res.json()

      if (!res.ok) {
        console.log("Message: ", data.message)
        alert(data.message)
      }

      else {
        alert("Form Submitted!")
        setnotes(prev => [data.content, ...prev])
      }


      console.log("Created: ", data.content)

      settitle("")
      setdescription("")
    }

  }

  const cardClick = (note: NotesClient) => {
    seteditId(note._id)
    settitle(note.title)
    setdescription(note.description)
  }

  const deleteNote = async (noteid: string) => {
    const res = await fetch(`/api/notes/${noteid}`, {
      method: "DELETE"
    })

    if (!res.ok) {
      return "Failed to delete the note"
    }

    setnotes(prev => prev.filter(note => note._id !== noteid))
  }




  return (
    <div className="bg-amber-100">
      <Navbar />

      <div className="mainbody w-3/4 bg-amber-200 min-h-screen mx-auto flex flex-col justify-center items-center">

        <div className="inputfields w-260 mx-auto">
          <h1 className="font-bold text-2xl my-5">Create Notes</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              className="bg-white py-2 px-2 rounded-md transition-all duration-300 hover:scale-101" />

            <textarea name="dexcription"
              placeholder="Description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              className="bg-white px-2 py-2 rounded-md transition-all duration-300 hover:scale-101"></textarea>

            <button type="submit" className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 box-border border border-transparent shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 w-full cursor-pointer justify-center rounded-lg mx-auto">Add Notes</button>
          </form>
        </div>

        <div className="mynotes my-10 flex flex-wrap justify-center gap-5">

          {session ? (
            <>
            {loading ? (
              <p>Loading...</p>
            ): (
              <>
                {notes.map((item) => {

                if (item._id === editId) return null

                return (
                  <div key={item._id} className="card bg-amber-100 h-50 w-50 rounded-2xl flex flex-col shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <div className="bg-amber-600 rounded-t-2xl font-semibold h-9 flex items-center justify-center uppercase">{item.title}</div>
                    <div className="p-2 flex-1 overflow-y-auto custom-scroll flex items-center justify-center">{item.description}</div>

                    <div className="buttons flex gap-4 justify-center mb-1">
                      <button onClick={() => cardClick(item)} type="button" className="text-white bg-linear-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-small font-bold rounded-base text-sm px-3 py-1 rounded-md text-center leading-5">Edit</button>
                      <button onClick={() => deleteNote(item._id)} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-small font-bold rounded-base text-sm px-3 py-1 text-center leading-5 rounded-md ">Delete</button>
                    </div>
                  </div>

                )
              })}
              </>
            )}
              
            </>
          ) : (
            <div>
              
            </div>
          )}

        </div>

      </div>


    </div>
  )
}
