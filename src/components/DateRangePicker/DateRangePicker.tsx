import { useEffect, useMemo,useState } from "react"
import type { DateRangeConstraints, PartialRange, TimeZone } from "./DateRangePicker.types"
import { validateRange } from "./DateRangePicker.validation";
import { generateMonthGrid } from "../../utils/calender";
import CalendarGrid from "../Calender/CalendarGrid";

interface Props{
  constraints?:DateRangeConstraints;
  defaultTimeZone?:TimeZone;
}

const DateRangePicker = ({constraints,defaultTimeZone="UTC"}:Props) => {
  const [range,setRange]=useState<PartialRange>({kind:"empty"});
  const [timeZone,setTimeZone]=useState<TimeZone>(defaultTimeZone);
  const validationError=validateRange(range,constraints);
  const [focusedInstant,setFocusedInstant]=useState<number|null>(null);

  const today=new Date();
  const [visibleYear,setVisibleYear]=useState(today.getUTCFullYear());
  const [visibleMonth,setVisibleMonth]=useState(today.getUTCMonth());

  const calendarCells=useMemo(()=>generateMonthGrid(visibleYear,visibleMonth,timeZone),[visibleYear,visibleMonth,timeZone]);

  const goToPrevMonth=()=>{
    setVisibleMonth((prev)=>{
      if(prev===0){
        setVisibleYear((y)=>y-1);
        return 11;
      }
      return prev-1;
    });
  };

  const goToNextMonth=()=>{
    setVisibleMonth((prev)=>{
      if(prev===11){
        setVisibleYear((y)=>y+1);
        return 0;
      }
      return prev+1;
    });
  };

  const selectInstant=(instant:number)=>{
    setRange((prev)=>{
      if(prev.kind==="empty"){
        return {
          kind:"selected-end",
          start:instant,
          timeZone,
        };
      }

      if(prev.kind==="selected-end"){
        const start=prev.start;
        const end=instant;

        if(end<start){
          return {
            kind:"complete",
            start:end,
            end:start,
            timeZone,
          };
        }
        return {
          kind:"complete",
          start,end,
          timeZone,
        }
      }

      return {
        kind:"selected-end",
        start:instant,
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
          onSelect={selectInstant} focusedInstant={focusedInstant} setFocusedInstant={setFocusedInstant} labelledBy="calender-heading"/>

          {/*Range Display*/}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 text-xs overflow-auto text-neutral-300">
            <pre>{JSON.stringify(range, null, 2)}</pre>
          </div>

          {/*Validation*/}
          {validationError && (
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-300 rounded-xl p-3 text-sm">
              Validation Error: {validationError}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default DateRangePicker