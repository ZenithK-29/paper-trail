"use client"
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { CalendarDemo } from '@/components/CalenderModule'
import { useState } from 'react'
import { NotesClient } from '../page'
import { useRouter } from 'next/navigation'
import { DateRange } from 'react-day-picker'
import "react-day-picker/dist/style.css"
import { Calendar } from '@/components/ui/calendar'
import SearchBar from '@/components/SearchBar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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

export type Mode = "date" | "range" | null


const Dashboard = () => {

  const { data: session, status } = useSession()
  const [selectedDate, setselectedDate] = useState<Date | undefined>()
  const [notes, setnotes] = useState<NotesClient[]>([])
  const [range, setrange] = useState<DateRange | undefined>()
  const [highlightedNotesDate, sethighlightedNotesDate] = useState<string[]>([])
  const [search, setsearch] = useState("")
  const [mode, setmode] = useState<Mode>(null)
  const [title, settitle] = useState("")
  const [description, setdescription] = useState("")
  const [editId, seteditId] = useState<string | null>(null)
  const [open, setopen] = useState(false)
  const [openId, setdOpenId] = useState<string | null>(null)
  const router = useRouter()



  useEffect(() => {

    if (status === "unauthenticated") {
      router.replace("/login")
    }

    if (!selectedDate || !session?.user?.id) return

    const fetchNotes = async () => {

      const res = await fetch(`/api/dashboard/?date=${selectedDate.toLocaleDateString("en-CA")}`)

      const data = await res.json()

      setnotes(data.content)

      console.log("Seleted: ", selectedDate.toLocaleDateString("en-CA"))
      console.log("Response data: ", data.content)
    }

    fetchNotes()
  }, [selectedDate, router, status, session])

  useEffect(() => {

    const fetchAllNotes = async () => {
      const res = await fetch("/api/notes/dates")
      const allNotesdata = await res.json()

      console.log("allNotesdate: ", allNotesdata.content)

      const parsed = [...new Set<string>(
        allNotesdata?.content?.map((note: any) => {
          const d = new Date(note.createdAt)

          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, "0")
          const day = String(d.getDate()).padStart(2, "0")

          return `${year}-${month}-${day}`
        })
      )]

      console.log("Parsed:", parsed)
      console.log("Example:", parsed[0])
      console.log("Length:", parsed.length)
      console.log("type:", typeof (parsed[0]))
      console.log(parsed.includes("2026-03-16"))



      sethighlightedNotesDate(parsed)
    }

    fetchAllNotes()
  }, [])

  useEffect(() => {

    console.log("my highlited notes", highlightedNotesDate)
  }, [highlightedNotesDate])



  useEffect(() => {

    if (search.length === 0 || search.length <= 2) {
      setnotes([])
      return
    }
    const fetchNotesBySeacrh = () => {

      const timer = setTimeout(async () => {
        const res = await fetch(`/api/notes/search?q=${search}`)
        const data = await res.json()
        console.log("Search query: ", data.content)
        setnotes(data.content)

      }, 300)

      return () => clearTimeout(timer)
    }

    fetchNotesBySeacrh()
  }, [search])




  const handleDateClick = async (date: Date | undefined) => {
    if (!date) return
    setselectedDate(date)
  }


  const handleRangedForm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!range?.from || !range?.to) return

    const startDate = range?.from?.toLocaleDateString("en-CA")
    const endDate = range?.to?.toLocaleDateString("en-CA")

    const res = await fetch(`/api/notes/filter?startDate=${startDate}&endDate=${endDate}`)

    const data = await res.json()


    setnotes(data.content)
    console.log("Ranged notes: ", data.content)
  }



  const editForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

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

      const data = await res.json()

      setnotes(prev =>
        prev.map(note =>
          note._id === editId ? data.content : note
        )
      )

      setdOpenId(null)

    }
  }

  const deleteNotes = async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "DELETE"
    })

    if (!res.ok) {
      alert("Failed to delete this note")
      return "Failed to delete the note"
    }

    setnotes(prev => prev.filter(note => note._id !== id))

    toast.info("Note Deleted Successfully!", {
      position: "top-right",
    });
  }




  return (
    <div className='bg-gray-200 min-h-screen'>
      <Navbar />
      <SearchBar search={search} setSearch={setsearch} mode={mode} setMode={setmode} />

      <div className='bg-gray-200 w-3/4 min-h-screen mx-auto flex flex-col justify-start items-center'>

        <Popover
          open={mode !== null}
          onOpenChange={(open) => {
            if (!open) setmode(null)
          }}

        >



          <PopoverTrigger>

            <div className='flex gap-4 items-center justify-center'>
              <p className='my-3 font-bold text-2xl'></p>

            </div>
          </PopoverTrigger>



          <PopoverContent className='w-auto p-0'>
            {mode === "date" && (

              <div className='my-2'>

                <CalendarDemo
                  key={highlightedNotesDate.join()}
                  mode='single'
                  selected={selectedDate as Date | undefined}
                  onSelect={handleDateClick}
                  modifiers={{
                    hasNotes: (date) => {
                      const y = date.getFullYear()
                      const m = String(date.getMonth() + 1).padStart(2, "0")
                      const d = String(date.getDate()).padStart(2, "0")
                      const formatted = `${y}-${m}-${d}`
                      return highlightedNotesDate.includes(formatted)
                    }
                  }}
                  modifiersClassNames={{
                    hasNotes: "bg-orange-300 rounded-full font-semibold"
                  }}
                />
              </div>
            )}

            {mode === "range" && (

              <div className='rangeditem mb-2'>

                <div className='w-fit m-auto'>
                  <Calendar
                    key={highlightedNotesDate.join()}
                    mode='range'
                    selected={range}
                    onSelect={setrange}
                    modifiers={{
                      hasNotes: (date) => {
                        const y = date.getFullYear()
                        const m = String(date.getMonth() + 1).padStart(2, "0")
                        const d = String(date.getDate()).padStart(2, "0")
                        const formatted = `${y}-${m}-${d}`
                        return highlightedNotesDate.includes(formatted)
                      }
                    }}
                    modifiersClassNames={{
                      hasNotes: "bg-orange-300 rounded-full font-semibold"
                    }}
                    className='bg-white rounded-md p-2'
                  />

                </div>

                <div>

                  <form onSubmit={handleRangedForm} className='flex gap-4 py-1.5'>
                    <input type="date" name="from" value={range?.from ? range.from.toLocaleDateString("en-CA") : ""} className='bg-slate-200 text-black rounded-md' readOnly />
                    <input type="date" name="to" value={range?.to ? range.to.toLocaleDateString("en-CA") : ""} className='bg-slate-200 text-black rounded-md' readOnly />
                    <button className='bg-orange-400 p-2 text-white rounded-xl cursor-pointer'>Sumbit</button>
                  </form>
                </div>
              </div>
            )}
          </PopoverContent>

        </Popover>


        <div className="cardContainer flex flex-wrap justify-center gap-4">
          {notes?.length === 0 ? (
            <p>No Notes to display</p>
          ) : (
            notes?.map((item) => (
              <Dialog key={item._id}
                open={openId === item._id}
                onOpenChange={(open) => {
                  if (!open) setdOpenId(null)
                }}>

                <DialogTrigger asChild>


                  <div
                    onClick={() => {
                      setdOpenId(item._id)
                      seteditId(item._id)
                      settitle(item.title)
                      setdescription(item.description)
                    }}
                    className="card group bg-white h-50 w-100 rounded-md flex flex-col shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 hover:border-orange-300">
                    <h1 className='text-orange-400 text-2xl uppercase font-semibold inline-flex justify-center items-center h-11'>{item.title}</h1>
                    <hr className='border-orange-300 w-3/4 mx-auto' />
                    <p className='p-2 flex-1 overflow-y-auto custom-scroll flex items-center justify-center'>{item.description}</p>
                  </div>

                </DialogTrigger>

                <DialogContent>

                  <form onSubmit={editForm}>

                    <DialogHeader>
                      <DialogTitle>Edit Note</DialogTitle>
                      <DialogDescription className='my-2'>Make changes to your note</DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title"
                          name="name"
                          value={title}
                          onChange={(e) => settitle(e.target.value)} />
                      </Field>
                      <Field>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description"
                          name="description"
                          value={description}
                          onChange={(e) => setdescription(e.target.value)} />
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
            ))
          )}
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
    </div >
  )
}

export default Dashboard