import React, { useEffect, useState } from 'react'

interface TypingtextProp{
    text: string,
    speed: number
}

const TypingText = ({text , speed}: TypingtextProp) => {

    const [dipslay, setdipslay] = useState("")

    useEffect(() => {
      if(!text) return

      setdipslay("")
    
      
      const interval = setInterval(()=>{
        setdipslay(prev=> {
         

          if(prev.length >= text.length){
            clearInterval(interval)
            return prev
          }

          return prev + text[prev.length]
        })
      }, speed)
    
      return ()=> clearInterval(interval)
    }, [text])
    

  return (
    <div>
      {dipslay}
    </div>
  )
}

export default TypingText
