"use client"
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


type ResMssgContent = {
  error: boolean,
  message: string,
  content: NotesClient[],
  sessinfo: string
}

export type NotesClient = {
  _id: string,
  title: string,
  description: string
  createdAt?: Date,
  updatedAt?: Date,
}

export default function Home() {

  const [title, settitle] = useState<string>("")
  const [description, setdescription] = useState<string>("")
  const [newTitle, setnewTitle] = useState("")
  const [newDescription, setnewDescription] = useState("")
  const [notes, setnotes] = useState<NotesClient[]>([])
  const [editId, seteditId] = useState<string | null>(null)
  const [openId, setopenId] = useState<string | null>("")
  const { data: session } = useSession()
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


  const handleCreateNote = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!session) {
      alert("You must be logged in to add notes")
      return
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
        toast.warning("Warning Notification !", {
          position: "top-right",
        });
        return
      }

      else {
        setnotes(prev => [data.content, ...prev])
      }


      console.log("Created: ", data.content)

      settitle("")
      setdescription("")

      toast.success("Success Added Note !", {
        position: "top-right"
      });
    }
  }

  const handleEdit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (editId) {
      const res = await fetch(`/api/notes/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription
        })
      })


      seteditId(null)


      const data = await res.json()

      setnotes(prev => {
        return prev.map(note =>
          note._id === editId ? data.content : note
        )
      })

      setopenId(null)


    }
  }


  const cardClick = (note: NotesClient) => {
    seteditId(note._id)
    settitle(note.title)
    setdescription(note.description)
  }

  const deleteNotes = async (noteid: string) => {
    const res = await fetch(`/api/notes/${noteid}`, {
      method: "DELETE"
    })

    if (!res.ok) {
      toast.warning("Warning Notification !", {
        position: "top-left",
      });
      return "Failed to delete the note"
    }

    setnotes(prev => prev.filter(note => note._id !== noteid))

    toast.info("Note Deleted Successfully!", {
      position: "top-right",
    });
  }




  return (
    <div className="bg-gray-200">
      <Navbar />

      <div className="mainbody w-3/4 bg-gray-200 min-h-screen mx-auto flex flex-col justify-center items-center">

        <div className="mynotes mb-5 -mt-50 flex justify-center gap-5">

          {session ? (
            <>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>

                  {notes.slice(0, 3).map((item) => {


                    return (

                      <Dialog
                        key={item._id}
                        open={openId === item._id}
                        onOpenChange={(open) => {
                          if (!open) setopenId(null)

                        }}>

                        <DialogTrigger asChild>
                          <div
                            onClick={(e) => {
                              setopenId(item._id)
                              setnewTitle(item.title)
                              setnewDescription(item.description)
                              seteditId(item._id)
                            }}
                            key={item._id}
                            className="card group bg-white h-50 w-100 rounded-md flex flex-col shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 hover:border-orange-300">
                            <div className="text-orange-400 text-2xl uppercase font-semibold inline-flex justify-center items-center h-11">{item.title}</div>
                            <hr className='border-orange-300 w-3/4 mx-auto' />
                            <div className="p-2 flex-1 overflow-y-auto custom-scroll flex items-center justify-center">{item.description}</div>
                          </div>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-sm">
                          <form onSubmit={handleEdit}>
                            <DialogHeader>
                              <DialogTitle>Edit Notes</DialogTitle>
                              <DialogDescription>
                                Make changes to your Notes
                              </DialogDescription>
                            </DialogHeader>

                            <FieldGroup>
                              <Field>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={newTitle} onChange={(e) => { setnewTitle(e.target.value) }} />
                              </Field>
                              <Field>
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" name="description" value={newDescription} onChange={(e) => setnewDescription(e.target.value)} />
                              </Field>
                            </FieldGroup>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => deleteNotes(item._id)}>Delete</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button variant={"outline"}>Cancel</Button>
                              </DialogClose>
                              <Button type="submit">Save changes</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>

                      </Dialog>

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

        <div className="inputfields w-260 mx-auto">
          <h1 className="font-bold text-2xl my-5">Create Notes</h1>
          <form onSubmit={handleCreateNote} className="flex flex-col gap-5">
            <input type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              className="bg-white py-2 px-2 rounded-md transition-all duration-300 hover:scale-101" />

            <textarea name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              className="bg-white px-2 py-2 rounded-md transition-all duration-300 hover:scale-101"></textarea>

            <button type="submit" className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 box-border border border-transparent shadow-xs font-medium leading-5 rounded-base text-lg px-4 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 w-full cursor-pointer justify-center rounded-lg mx-auto">Add Notes</button>
          </form>
        </div>


      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />


    </div>
  )
}
