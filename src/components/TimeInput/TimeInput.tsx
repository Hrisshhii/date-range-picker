import { useMemo } from "react"
import { buildZonedInstant, convertInstantToTimeZone } from "../../utils/timezone"


interface TimeInputProps{
  instant:number
  timeZone:string
  label:string
  onChange:(newInstant:number)=>void
}

const TimeInput=({instant,timeZone,label,onChange}:TimeInputProps)=>{
  const zoned=useMemo(()=>convertInstantToTimeZone(instant,timeZone),[instant,timeZone])

  const handleHourChange=(value:string)=>{
    const hour=Number(value)
    if(Number.isNaN(hour)||hour<0||hour>23) return
    const newInstant=buildZonedInstant(
      zoned.year,
      zoned.month-1,
      zoned.day,
      hour,
      zoned.minute,
      timeZone
    )
    onChange(newInstant)
  }

  const handleMinuteChnage=(value:string)=>{
    const minute=Number(value)
    if(Number.isNaN(minute)||minute<0||minute>59) return

    const newInstant=buildZonedInstant(
      zoned.year,
      zoned.month-1,
      zoned.day,
      zoned.hour,
      minute,
      timeZone
    )
    onChange(newInstant)
  }

  return(
    <div className="flex flex-col gap-2">
      <label className="text-lg text-neutral-300">{label}</label>
        <div className="flex items-center gap-2">
          <input type="number" min={0} max={23} value={zoned.hour} onChange={e=>handleHourChange(e.target.value)}
            className="w-16 px-2 py-1 rounded text-white bg-white/10 border border-white/20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none"/>
          <span className="text-neutral-400">:</span>
          <input type="number" min={0} max={59} value={zoned.minute} onChange={e=>handleMinuteChnage(e.target.value)}
          className="w-16 px-2 py-1 rounded text-white bg-white/10 border border-white/20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none"/>
        </div>
        
    </div>
  )
}

export default TimeInput