export function convertInstantToTimeZone(instant:number,timeZone:string){
  const formatter=new Intl.DateTimeFormat("en-US",{
    timeZone,
    hour12:false,
    year:"numeric",
    month:"2-digit",
    day:"2-digit",
    hour:"2-digit",
    minute:"2-digit",
    second:"2-digit",
  })
  const parts=formatter.formatToParts(new Date(instant));

  const map:Record<string,string>={};

  parts.forEach(part=>{
    if(part.type!=="literal"){
      map[part.type]=part.value;
    }
  });

  return {
    year:Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

export function buildZonedInstant(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): number {

  const utcGuess = Date.UTC(year, month, day, hour, minute, 0)

  const zoned = convertInstantToTimeZone(utcGuess, timeZone)

  const diffMinutes =
    (hour - zoned.hour) * 60 +
    (minute - zoned.minute)

  const corrected = utcGuess + diffMinutes * 60_000

  const verify = convertInstantToTimeZone(corrected, timeZone)

  // If local time doesn't match intended time,
  // it means DST gap → snap forward automatically
  if (
    verify.year !== year ||
    verify.month !== month + 1 ||
    verify.day !== day ||
    verify.hour !== hour ||
    verify.minute !== minute
  ) {
    return corrected
  }

  return corrected
}

