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
  year:number,
  month:number,
  day:number,
  hour:number,
  minute:number,
  timeZone:string,
):number{
  const iso=`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;

  const formatter=new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })

  const utcDate=new Date(iso+"Z")
  const parts=formatter.formatToParts(utcDate)
  const map:Record<string,string>={}

  parts.forEach((p)=>{
    if(p.type!=="literal"){
      map[p.type]=p.value
    }
  })

  return Date.UTC(
    Number(map.year),
    Number(map.month)-1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  )
}