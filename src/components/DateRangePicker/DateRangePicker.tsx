import { useEffect, useMemo,useState } from "react"
import type { DateRangeConstraints, PartialRange, TimeZone } from "./DateRangePicker.types"
import { validateRange } from "./DateRangePicker.validation";
import { generateMonthGrid } from "../../utils/calender";
import CalendarGrid from "../Calender/CalendarGrid";
import TimeInput from "../TimeInput/TimeInput";
import Presets from "../Presets/Presets.tsx"
import { convertInstantToTimeZone } from "../../utils/timezone.ts";

interface Props{
  constraints?:DateRangeConstraints;
  defaultTimeZone?:TimeZone;
}

const DateRangePicker = ({constraints,defaultTimeZone="UTC"}:Props) => {
  const [range,setRange]=useState<PartialRange>({kind:"empty"});
  const [timeZone,setTimeZone]=useState<TimeZone>(defaultTimeZone);
  const validationError=validateRange(range,constraints);
  const [focusedInstant,setFocusedInstant]=useState<number|null>(null);
  const [anchorInstant, setAnchorInstant] = useState<number | null>(null)

  const today=new Date();
  const [visibleDate,setVisibleDate]=useState(new Date(Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),1)))
  const visibleYear=visibleDate.getUTCFullYear()
  const visibleMonth=visibleDate.getUTCMonth()

  const calendarCells=useMemo(()=>generateMonthGrid(visibleYear,visibleMonth,timeZone),[visibleYear,visibleMonth,timeZone]);

  const goToPrevMonth=()=>{
    setVisibleDate((prev)=>{
      const next=new Date(prev)
      next.setUTCMonth(prev.getUTCMonth()-1)
      return next
    });
  };

  const goToNextMonth=()=>{
    setVisibleDate((prev)=>{
      const next=new Date(prev)
      next.setUTCMonth(prev.getUTCMonth()+1)
      return next
    });
  };

  const selectInstant = (instant: number) => {
    setRange((prev) => {
      if (prev.kind === "empty") {
        setAnchorInstant(instant)
        return {
          kind: "selected-end",
          start: instant,
          timeZone,
        }
      }

      if (prev.kind === "selected-end") {
        const start = prev.start
        const end = instant

        const finalStart = end < start ? end : start
        const finalEnd = end < start ? start : end

        setAnchorInstant(finalStart)

        return {
          kind: "complete",
          start: finalStart,
          end: finalEnd,
          timeZone,
        }
      }

      // if already complete → start new selection
      setAnchorInstant(instant)
      return {
        kind: "selected-end",
        start: instant,
        timeZone,
      }
    })
  }

  useEffect(()=>{
    if(calendarCells.length>0){
      const first=calendarCells.find(c=>c.isCurrentMonth)?.instant??null;
      setFocusedInstant(first);
    }
  },[calendarCells]);

  const applyPreset=(start:number,end:number)=>{
    setRange({
      kind:"complete",
      start,
      end,
      timeZone
    })
  }

  const selectionAnnouncement=useMemo(()=>{
    if(range.kind!=="complete") return ""
    return `Selected from ${new Date(range.start).toUTCString()} to ${new Date(range.end).toUTCString()}`
  },[range])

  const resetSelection=()=>{
    setRange({kind:"empty"})
  };

  const extendRange = (toInstant: number) => {
    if (anchorInstant === null) return

    const start = anchorInstant
    const end = toInstant

    const finalStart = end < start ? end : start
    const finalEnd = end < start ? start : end

    setRange({
      kind: "complete",
      start: finalStart,
      end: finalEnd,
      timeZone,
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="relative w-[95%] max-w-xl">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 space-y-8">

          {/*Header*/}
          <header className="space-y-2">
            <h2 className="text-4xl font-semibold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
              Date Range Picker
            </h2>
            <p className="text-sm text-neutral-400 text-center">
              Timezone-aware · DST-safe · Accessible
            </p>
          </header>

          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {new Date(Date.UTC(visibleYear, visibleMonth)).toLocaleString("en-US", { month: "long", year: "numeric" })}
          </div>
          <div aria-live="polite" className="sr-only">
            {selectionAnnouncement}
          </div>

          {/*Timezone Select*/}
          <div className="space-y-2">
            <label htmlFor="timezone-select" className="text-sm font-medium text-neutral-300">
              Time Zone
            </label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value as TimeZone)}
              id="timezone-select"
              className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 cursor-pointer"
            >
              <option className="bg-neutral-900 text-white cursor-pointer" value="UTC">UTC</option>
              <option className="bg-neutral-900 text-white cursor-pointer" value="America/New_York">America/New_York</option>
              <option className="bg-neutral-900 text-white cursor-pointer" value="Europe/London">Europe/London</option>
              <option className="bg-neutral-900 text-white cursor-pointer" value="Asia/Kolkata">Asia/Kolkata</option>
            </select>
          </div>

          <Presets timeZone={timeZone} onApply={applyPreset}/>

          {/*Calendar*/}
          <div className="space-y-4">
            {/*Month Navigation*/}
            <div className="flex items-center justify-between">
              <button onClick={goToPrevMonth} className="px-3 py-2 rounded-lg transition bg-white/5 hover:bg-white/10">{`<`}</button>
              <h3 id="calender-heading" className="text-lg font-medium text-neutral-200">
                {new Date(Date.UTC(visibleYear,visibleMonth)).toLocaleString("en-US",{month:"long",year:"numeric",})}
              </h3>
              <button onClick={goToNextMonth} className="px-3 py-2 rounded-lg transition bg-white/5 hover:bg-white/10">{`>`}</button>
            </div>
          </div>

          {/*Calendar Grid*/}
          <CalendarGrid year={visibleYear} month={visibleMonth} timeZone={timeZone} range={range} 
          onSelect={selectInstant} focusedInstant={focusedInstant} setFocusedInstant={setFocusedInstant}
          goToPrevMonth={goToPrevMonth} goToNextMonth={goToNextMonth}
          onSelectReset={resetSelection} onExtendRange={extendRange} anchorInstant={anchorInstant}
          constraints={constraints} labelledBy="calender-heading"
          />

          {/*Time Input*/}
          <div className="flex justify-between">
            {range.kind!=="empty" && (
              <TimeInput instant={range.start} timeZone={timeZone} label="Start Time" 
              onChange={(newInstant)=>setRange((prev)=>prev.kind==="complete"?{...prev,start:newInstant}:{...prev,start:newInstant})}
              aria-describedby={validationError ? "range-error" : undefined} aria-invalid={!!validationError}/>
            )}

            {range.kind==="complete" && (
              <TimeInput instant={range.end} timeZone={timeZone} label="End Time" 
              onChange={(newInstant)=>setRange((prev)=>prev.kind==="complete"?{...prev,end:newInstant}:prev)}
              aria-describedby={validationError ? "range-error" : undefined} aria-invalid={!!validationError}/>
            )}
          </div>
          

          {/*Range Display*/}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 text-xs overflow-auto text-neutral-300">
            <pre>{JSON.stringify(range, null, 2)}</pre>
          </div>

          {/*Validation*/}
          {validationError && (
            <div
              id="range-error"
              role="alert"
              aria-live="assertive"
              className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3 text-sm"
            >
              Validation Error: {validationError}
            </div>
          )}


          {range.kind !== "empty" && (
            <div className="text-xs text-yellow-400 mt-2">
              Start Local:{" "}
              {JSON.stringify(convertInstantToTimeZone(range.start, timeZone))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default DateRangePicker