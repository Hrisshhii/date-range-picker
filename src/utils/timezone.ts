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

  // Create a Date object pretending local time is UTC
  const utcDate = new Date(Date.UTC(year, month, day, hour, minute, 0));

  // Get actual timezone offset in minutes at that instant
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  });

  const parts = formatter.formatToParts(utcDate);

  const tzPart = parts.find(p => p.type === "timeZoneName")?.value;

  if (!tzPart) return utcDate.getTime();

  // Extract offset like "GMT-4"
  const match = tzPart.match(/GMT([+-]\d+)/);

  if (!match) return utcDate.getTime();

  const offsetHours = Number(match[1]);

  const offsetMs = offsetHours * 60 * 60 * 1000;

  return utcDate.getTime() - offsetMs;
}
