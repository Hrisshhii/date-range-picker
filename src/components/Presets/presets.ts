import { createZonedMidnightInstant } from "../../utils/calender"
import type { PresetDefinition } from "./Presets.types"

/**
 * Deterministic Rounding Rules:
 *
 * - Date-based presets use zoned midnight for start.
 * - End of day is computed as start + 24h - 1ms.
 * - Rolling presets use exact `now` instant without rounding.
 * - No implicit timezone coercion.
 */

const MS_IN_DAY=24*60*60*1000
export const presets:PresetDefinition[]=[
  {
    id:"today",
    label:"Today",
    compute:(now,tz)=>{
      const d=new Date(now)
      const start=createZonedMidnightInstant(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        tz
      )
      return {
        start,
        end:start+MS_IN_DAY-1
      }
    }
  },
  {
    id:"last7",
    label:"Last 7 Days",
    compute:(now,tz)=>{
      const d=new Date(now)
      const todayStart=createZonedMidnightInstant(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        tz
      )
      return {
        start:todayStart-6*MS_IN_DAY,
        end:todayStart+MS_IN_DAY-1
      }
    }
  },
  {
    id:"last24",
    label:"Last 24 Hours",
    compute:(now)=>{
      return{
        start:now-MS_IN_DAY,
        end:now
      }
    }
  },
]