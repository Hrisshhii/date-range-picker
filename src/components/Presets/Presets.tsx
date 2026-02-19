import type { TimeZone } from "../DateRangePicker/DateRangePicker.types"
import {presets} from "./presets"
interface Props{
  timeZone: TimeZone
  onApply:(start:number,end:number)=>void
}

const Presets=({timeZone,onApply}:Props)=>{
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset)=>(
        <button key={preset.id}
          onClick={()=>{
            const now=Date.now()
            const {start,end}=preset.compute(now,timeZone)
            onApply(start,end)
          }} 
          className="px-3 py-1 text-sm rounded-xl bg-white/5 border border-white/10 hover:bg-blue-500/20 transition text-white cursor-pointer"
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}

export default Presets