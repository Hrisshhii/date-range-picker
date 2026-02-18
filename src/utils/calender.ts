export interface CalenderCell{
  instant:number;
  day:number;
  isCurrentMonth:boolean;
}

export function generateMonthGrid(
  year:number,
  month:number,
  timeZone:string,
):CalenderCell[]