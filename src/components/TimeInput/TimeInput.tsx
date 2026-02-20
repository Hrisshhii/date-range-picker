/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react"
import { buildZonedInstant, convertInstantToTimeZone } from "../../utils/timezone"

interface TimeInputProps {
  instant: number
  timeZone: string
  label: string
  onChange: (newInstant: number) => void
  "aria-describedby"?: string
  "aria-invalid"?: boolean
}

const TimeInput = ({ instant, timeZone, label, onChange,"aria-describedby": ariaDescribedBy,"aria-invalid": ariaInvalid }: TimeInputProps) => {

  const zoned = useMemo(
    () => convertInstantToTimeZone(instant, timeZone),
    [instant, timeZone]
  )


  const [hourInput, setHourInput] = useState(String(zoned.hour))
  const [minuteInput, setMinuteInput] = useState(String(zoned.minute))

  useEffect(() => {
    const newHour = String(zoned.hour)
    const newMinute = String(zoned.minute)

    setHourInput(prev => (prev !== newHour ? newHour : prev))
    setMinuteInput(prev => (prev !== newMinute ? newMinute : prev))
  }, [instant, timeZone, zoned.hour, zoned.minute])



  const commitHour = () => {
    const hour = Number(hourInput)
    if (Number.isNaN(hour) || hour < 0 || hour > 23) return

    const newInstant = buildZonedInstant(
      zoned.year,
      zoned.month - 1,
      zoned.day,
      hour,
      zoned.minute,
      timeZone
    )

    if (newInstant !== instant) {
      onChange(newInstant)
    }
  }

  const commitMinute = () => {
    const minute = Number(minuteInput)
    if (Number.isNaN(minute) || minute < 0 || minute > 59) return

    const newInstant = buildZonedInstant(
      zoned.year,
      zoned.month - 1,
      zoned.day,
      zoned.hour,
      minute,
      timeZone
    )

    if (newInstant !== instant) {
      onChange(newInstant)
    }
  }


  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg text-neutral-300">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={hourInput}
          onChange={(e) => setHourInput(e.target.value)}
          onBlur={commitHour}
          onKeyDown={(e) => e.key === "Enter" && commitHour()}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          className="w-16 px-2 py-1 rounded text-white bg-white/10 border border-white/20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />

        <span className="text-neutral-400">:</span>

        <input
          type="text"
          inputMode="numeric"
          value={minuteInput}
          onChange={(e) => setMinuteInput(e.target.value)}
          onBlur={commitMinute}
          onKeyDown={(e) => e.key === "Enter" && commitMinute()}
          className="w-16 px-2 py-1 rounded text-white bg-white/10 border border-white/20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </div>
    </div>
  )
}

export default TimeInput
