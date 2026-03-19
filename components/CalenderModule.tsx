"use client"

import { Calendar } from "@/components/ui/calendar"
import { DayPickerProps } from "react-day-picker"
type Props = DayPickerProps 

export function CalendarDemo(props: Props) {


  return (
    <Calendar
      {...props}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}
