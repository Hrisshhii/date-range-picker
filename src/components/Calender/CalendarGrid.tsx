import { useEffect, useMemo, useRef } from "react"
import type { DateRangeConstraints, PartialRange } from "../DateRangePicker/DateRangePicker.types"
import { generateMonthGrid } from "../../utils/calender"
import { createZonedMidnightInstant } from "../../utils/calender"
import { convertInstantToTimeZone } from "../../utils/timezone"

interface CalendarGridProps {
  year: number
  month: number
  timeZone: string
  range: PartialRange
  onSelect: (instant: number)=>void
  focusedInstant: number | null
  setFocusedInstant: (instant: number)=>void
  labelledBy:string
  goToPrevMonth:()=>void
  goToNextMonth:()=>void
  constraints?:DateRangeConstraints
  onSelectReset:()=>void
  onExtendRange: (toInstant: number) => void
  anchorInstant: number | null
}

const CalendarGrid = ({
  year,
  month,
  timeZone,
  range,
  onSelect,
  focusedInstant,
  setFocusedInstant,
  labelledBy,
  goToPrevMonth,
  goToNextMonth,
  constraints,
  onSelectReset,
  onExtendRange,
  anchorInstant
}: CalendarGridProps) => {
  const cellRefs=useRef<Record<number, HTMLButtonElement | null>>({})

  const calendarCells = useMemo(
    () => generateMonthGrid(year, month, timeZone),
    [year, month, timeZone]
  )

  const weeks=[]
  for(let i=0;i<calendarCells.length;i+=7){
    weeks.push(calendarCells.slice(i,i+7))
  }

  // Focus DOM when focusedInstant changes
  useEffect(() => {
    if (focusedInstant) {
      const el = cellRefs.current[focusedInstant]
      el?.focus()
    }
  }, [focusedInstant])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (focusedInstant === null) return
    const currentIndex = calendarCells.findIndex((c) => c.instant === focusedInstant)

    switch (e.key) {
      case "ArrowRight":
      case "ArrowLeft":
      case "ArrowUp":
      case "ArrowDown": {
        e.preventDefault()

        const offsetMap: Record<string, number> = {
          ArrowRight: 1,
          ArrowLeft: -1,
          ArrowUp: -7,
          ArrowDown: 7,
        }

        const offset = offsetMap[e.key]
        if (offset === undefined) break

        if (focusedInstant === null) break

        const currentIndex = calendarCells.findIndex(
          (c) => c.instant === focusedInstant
        )

        if (currentIndex === -1) break

        const nextIndex = currentIndex + offset
        const nextCell = calendarCells[nextIndex]

        if (!nextCell) break

        setFocusedInstant(nextCell.instant)

        if (
          e.shiftKey &&
          anchorInstant !== null &&
          (range.kind === "selected-end" || range.kind === "complete")
        ) {
          onExtendRange(nextCell.instant)
        }

        break
      }
      case "Home": {
        e.preventDefault()
        const startOfWeek = currentIndex - (currentIndex % 7)
        const target = calendarCells[startOfWeek]
        if (target) setFocusedInstant(target.instant)
        break
      }
      case "End": {
        e.preventDefault()
        const endOfWeek = currentIndex + (6 - (currentIndex % 7))
        const target = calendarCells[endOfWeek]
        if (target) setFocusedInstant(target.instant)
        break
      }
      case "PageUp":
        e.preventDefault()
        goToPrevMonth()
        break
      case "PageDown":
        e.preventDefault()
        goToNextMonth()
        break
      case "Escape":
        e.preventDefault();
        onSelectReset();
        break;
      case "Enter":
      case " ":
        e.preventDefault()
        if(!isBlackout(focusedInstant)){
          onSelect(focusedInstant)
        }
        break
    }
  }

  const isStart=(instant: number)=>range.kind!=="empty" && range.start===instant

  const isEnd=(instant: number)=>range.kind==="complete" && range.end===instant

  const isInRange=(instant: number)=>range.kind==="complete" && instant>range.start && instant<range.end

  const isOutOfRange=(instant:number)=>{
    if(!constraints) return false
    if(constraints.min && instant<constraints.min) return true
    if(constraints.max && instant>constraints.max) return true
    return false
  }

  const isBlackout=(instant:number)=>constraints?.blackoutDates?.includes(instant)??false

  // eslint-disable-next-line react-hooks/purity
  const todayZoned = convertInstantToTimeZone(Date.now(), timeZone)

  const todayInstant = createZonedMidnightInstant(
    todayZoned.year,
    todayZoned.month - 1,
    todayZoned.day,
    timeZone
  )

  return (
    <div
      role="grid"
      aria-labelledby={labelledBy}
      aria-rowcount={6}
      aria-colcount={7}
      onKeyDown={handleKeyDown}
      className="outline-none"
      aria-multiselectable="true"
    >
      {/* Column Headers */}
      <div role="row" className="grid grid-cols-7 text-xs text-neutral-400 mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d)=>(
          <div
            key={d}
            role="columnheader"
            className="text-center py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Rows */}
      {weeks.map((week, weekIndex)=>(
        <div
          key={weekIndex}
          role="row"
          className="grid grid-cols-7"
        >
          {week.map((cell)=>(
            <button
              key={cell.instant}
              role="gridcell"
              tabIndex={cell.instant===focusedInstant?0:-1}
              aria-selected={
                range.kind === "complete" &&
                cell.instant >= range.start &&
                cell.instant <= range.end
              }
              ref={(el)=>{
                cellRefs.current[cell.instant]=el
              }}
              onClick={()=>{
                if(isBlackout(cell.instant)) return
                onSelect(cell.instant)
              }}
              onFocus={()=>setFocusedInstant(cell.instant)}
              disabled={isBlackout(cell.instant) || isOutOfRange(cell.instant)}
              aria-disabled={isBlackout(cell.instant) || isOutOfRange(cell.instant)}
              aria-current={cell.instant===todayInstant?"date":undefined}
              className={`aspect-square rounded-lg text-sm transition m-1 
                ${cell.isCurrentMonth?"text-neutral-200 hover:bg-blue-500/20":"text-neutral-500"}
                ${(isStart(cell.instant) || isEnd(cell.instant))?"bg-blue-500 text-white":""}
                ${isInRange(cell.instant)?"bg-blue-500/20":""}
                ${cell.instant===focusedInstant?"ring-2 ring-blue-400":""}
                ${isBlackout(cell.instant)?"opacity-30 cursor-not-allowed":""}
                ${isOutOfRange(cell.instant)?"opacity-30 cursor-not-allowed":""}
                ${cell.instant===todayInstant?"ring-1 ring-yellow-400":""}
              `}
            >
              {cell.day}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default CalendarGrid
