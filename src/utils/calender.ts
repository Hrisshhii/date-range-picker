export function createZonedMidnightInstant(
  year:number,
  month:number,
  day:number,
  timeZone:string,
):number{
  const isoDate=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}T00:00:00`;
  const formatter=new Intl.DateTimeFormat("en-US",{
    timeZone,
    hour12:false,
    year:"numeric",
    month:"2-digit",
    day:"2-digit",
    hour:"2-digit",
    minute:"2-digit",
    second:"2-digit",
  });
  const utcDate=new Date(isoDate+"Z");
  const parts=formatter.formatToParts(utcDate);
  const map:Record<string,string>={};
  parts.forEach((p)=>{
    if(p.type!=="literal"){
      map[p.type]=p.value;
    }
  });
  return Date.UTC(
    Number(map.year),
    Number(map.month)-1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );
}

export interface CalenderCell{
  instant:number;
  day:number;
  isCurrentMonth:boolean;
}

export function generateMonthGrid(
  year:number,
  month:number,
  timeZone:string,
):CalenderCell[]{
  const cells:CalenderCell[]=[];

  const firstOfMonth=createZonedMidnightInstant(year,month,1,timeZone);
  const firstDate=new Date(firstOfMonth);
  const firstDayOfWeek=firstDate.getUTCDay();
  
  const daysInMonth=new Date(Date.UTC(year,month+1,0)).getUTCDate();
  const prevMonthDays=new Date(Date.UTC(year,month,0)).getUTCDate();

  for (let i=firstDayOfWeek-1;i>=0;i--){
    const day=prevMonthDays-i;
    cells.push({
      instant:createZonedMidnightInstant(
        year,month-1,day,timeZone
      ),
      day,
      isCurrentMonth:false,
    });
  }

  for(let day=1;day<=daysInMonth;day++){
    cells.push({
      instant:createZonedMidnightInstant(
        year,month,day,timeZone
      ),
      day,
      isCurrentMonth:true,
    });
  }

  let nextDay=1;

  while(cells.length<42){
    cells.push({
      instant:createZonedMidnightInstant(
        year,month+1,nextDay,timeZone
      ),
      day:nextDay,
      isCurrentMonth:false,
    });
    nextDay++;
  }
  return cells;
}