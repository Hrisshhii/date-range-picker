import { buildZonedInstant, convertInstantToTimeZone } from "./timezone"

export function createZonedMidnightInstant(
  year: number,
  month: number,
  day: number,
  timeZone: string
): number {
  return buildZonedInstant(
    year,
    month,
    day,
    0,
    0,
    timeZone
  )
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
  const firstZoned = convertInstantToTimeZone(firstOfMonth, timeZone);

  // Build a UTC date from zoned components
  const zonedDate = new Date(Date.UTC(
    firstZoned.year,
    firstZoned.month - 1,
    firstZoned.day
  ));

const firstDayOfWeek = zonedDate.getUTCDay();

  
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