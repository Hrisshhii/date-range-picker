import type { Instant, TimeZone } from "../DateRangePicker/DateRangePicker.types"

export interface PresetDefinition{
  id:string
  label:string
  compute:(now:Instant,timeZone:TimeZone)=>{
    start:Instant
    end:Instant
  }
}