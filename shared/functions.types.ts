type Error = {
  message: string
  code: number
}

export type FunctionReturn<T> = Promise<{
  data: T
  error: null
} | {
  data: null
  error: Error
}>

type NotAllowed = {
  alreadySet: false  // deprecated, maintained for front-end compatibility
  DayNotAllowed: true  // deprecated, maintained for front-end compatibility
  allowedDays: number[]
  startTime: number
  openingTime: number
}

export type AttendancesExtra = {
  state: 'already-set'
  alreadySet: true  // deprecated, maintained for front-end compatibility
  groupSetted: number
  daySetted: number
  daySettedPlainDate: string
} | (
  { state: 'day-not-allowed' } & NotAllowed
) | (
  { state: 'midweek-holiday' } & NotAllowed
) | {
  state: 'settable'
  alreadySet: false  // deprecated, maintained for front-end compatibility
  DayNotAllowed: false  // deprecated, maintained for front-end compatibility
  dayOfWeek: number
  dayToMarkPlainDate: string
}

export type LeaderboardExtra = {
  first_name: string
  last_name: string
  apg: number
}[]

export type ResponseBody<T> = {
  message: string
  code: number
  extra: T | null
  catched_error?: unknown
}
