import { useEffect, useMemo, useRef } from "react"
import type { PartialRange } from "../DateRangePicker/DateRangePicker.types"
import { generateMonthGrid } from "../../utils/calender"

interface CalendarGridProps {
  year: number
  month: number
  timeZone: string
  range: PartialRange
  onSelect: (instant: number)=>void
  focusedInstant: number | null
  setFocusedInstant: (instant: number)=>void
}

const CalendarGrid = ({
  year,
  month,
  timeZone,
  range,
  onSelect,
  focusedInstant,
  setFocusedInstant
}: CalendarGridProps) => {
  const cellRefs=useRef<Record<number, HTMLButtonElement | null>>({})

  const calendarCells = useMemo(
    () => generateMonthGrid(year, month, timeZone),
    [year, month, timeZone]
  )

  // Focus DOM when focusedInstant changes
  useEffect(() => {
    if (focusedInstant) {
      const el = cellRefs.current[focusedInstant]
      el?.focus()
    }
  }, [focusedInstant])

  const moveFocus = (offset: number) => {
    if (!focusedInstant) return

    const currentIndex = calendarCells.findIndex(
      (c) => c.instant === focusedInstant
    )
    if (currentIndex === -1) return

    const nextIndex = currentIndex + offset
    if (nextIndex >= 0 && nextIndex < calendarCells.length) {
      const nextCell=calendarCells[nextIndex]
      if(!nextCell) return
      setFocusedInstant(nextCell.instant)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault()
        moveFocus(1)
        break
      case "ArrowLeft":
        e.preventDefault()
        moveFocus(-1)
        break
      case "ArrowUp":
        e.preventDefault()
        moveFocus(-7)
        break
      case "ArrowDown":
        e.preventDefault()
        moveFocus(7)
        break
      case "Enter":
      case " ":
        e.preventDefault()
        if (focusedInstant) onSelect(focusedInstant)
        break
    }
  }

  const isStart = (instant: number) =>
    range.kind !== "empty" && range.start === instant

  const isEnd = (instant: number) =>
    range.kind === "complete" && range.end === instant

  const isInRange = (instant: number) =>
    range.kind === "complete" &&
    instant > range.start &&
    instant < range.end

  return (
    <div
      role="grid"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="grid grid-cols-7 gap-1 outline-none"
    >
      {calendarCells.map((cell) => (
        <button
          key={cell.instant}
          role="gridcell"
          tabIndex={cell.instant === focusedInstant ? 0 : -1}
          aria-selected={
            range.kind === "complete" &&
            cell.instant >= range.start &&
            cell.instant <= range.end
          }
          ref={(el) => {
            cellRefs.current[cell.instant] = el
          }}
          onClick={() => onSelect(cell.instant)}
          onFocus={() => setFocusedInstant(cell.instant)}
          className={`aspect-square rounded-lg text-sm transition 
            ${
              cell.isCurrentMonth
                ? "text-neutral-200 hover:bg-blue-500/20"
                : "text-neutral-500"
            }
            ${
              isStart(cell.instant) || isEnd(cell.instant)
                ? "bg-blue-500 text-white"
                : ""
            }
            ${isInRange(cell.instant) ? "bg-blue-500/20" : ""}
            ${cell.instant === focusedInstant ? "ring-2 ring-blue-400" : ""}
          `}
        >
          {cell.day}
        </button>
      ))}
    </div>
  )
}

export default CalendarGrid
