import { buildZonedInstant, convertInstantToTimeZone } from "../../utils/timezone";
import type {PartialRange,ValidationError,DateRangeConstraints} from "./DateRangePicker.types";

export function validateRange(
  range:PartialRange,
  constraints?:DateRangeConstraints
):ValidationError{
  if(range.kind!=="complete") return null;

  const {start,end}=range;

  if(end<start){
    return "END_BEFORE_START";
  }
  if(constraints?.min && start<constraints.min){
    return "MIN_VIOLATION";
  }
  if(constraints?.max && end>constraints.max){
    return "MAX_VIOLATION";
  }
  
  const duration=end-start;

  if(constraints?.minDurationMs && duration<constraints.minDurationMs){
    return "DURATION_VIOLATION";
  }
  if(constraints?.maxDurationMs && duration>constraints.maxDurationMs){
    return "DURATION_VIOLATION";
  }

  if(constraints?.blackoutDates?.length){
    const blackoutSet=new Set(constraints.blackoutDates)

    let cursor = start
    while (cursor <= end) {
      if (blackoutSet.has(cursor)) return "BLACKOUT_VIOLATION"

      const zoned = convertInstantToTimeZone(cursor, range.timeZone)

      cursor = buildZonedInstant(
        zoned.year,
        zoned.month - 1,
        zoned.day + 1,
        0,
        0,
        range.timeZone
      )
    }
  }

  return null;
}