import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Sparkles } from "lucide-react"
import { NotesType } from '@/models/notes'
import { NotesClient } from '@/app/page'
import TypingText from './TypingText'

interface ChatBubbleProps {
  someNotes: NotesClient[] | NotesType[]
}

export const ChatBubble = ({ someNotes }: ChatBubbleProps) => {

  const [value, setvalue] = useState("")
  const [gotNotes, setgotNotes] = useState(false)
  const [loading, setloading] = useState(false)
  const summarizeNotes = async () => {
    setloading(true)
    setgotNotes(false)
    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content: someNotes })
    })

    const data = await res.json()

    setvalue(data.summary ?? "")

    setgotNotes(true)
    setloading(false)
  }


  return (
    <div className='fixed bottom-6 right-6 '>
      <Popover>
        <PopoverTrigger asChild>
          <Sparkles />
        </PopoverTrigger>

        <PopoverContent className='h-100 w-100 mr-3'>
          <Button onClick={()=>summarizeNotes()} variant={"outline"} disabled={loading} className='disabled:bg-gray-300'>{loading? "Summarzizng..." : "Summarize"}</Button>
          <p className='text-gray-400 my-2'>Click on the button to summarize the notes on your screen</p>

          {gotNotes && <div className='bg-slate-100 p-1 w-fit rounded-lg overflow-auto'>{value.split("*").map((line, i)=> (
            <div key={i}>
              <TypingText text={line} speed={50}/>
            </div>
          ))}</div>}
          
        </PopoverContent>
      </Popover>
    </div>
  )
}


