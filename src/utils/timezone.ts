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