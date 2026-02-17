export type Instant=number;

export type TimeZone=string;

export type PartialRange=|{kind:"empty"}
|{
  kind:"selected-end";
  start:Instant;
  timeZone:TimeZone;
}
|{
  kind:"complete";
  start:Instant;
  end:Instant;
  timeZone:TimeZone;
};

export type ValidationError=
|"END_BEFORE_START"
|"MIN_VIOLATION"
|"MAX_VIOLATION"
|"BLACKOUT_VIOLATION"
|"DURATION_VIOLATION"
|null;

export interface DateRangeConstraints{
  min?:Instant;
  max?:Instant;
  minDurationMs?:number;
  maxDurationMs?:number;
  blackoutDates?:Instant[];
}