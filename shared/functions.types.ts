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

export type AttendancesExtra = {
  alreadySet: true
  groupSetted: number
  daySetted: number
  daySettedPlainDate: string
} | {
  alreadySet: false
  DTnotAllowed: true  // deprecated, maintained for front-end compatibility
  DayNotAllowed: true
  allowedDays: number[]
  startTime: number
  openingTime: number
} | {
  alreadySet: false
  DTnotAllowed: false // deprecated, maintained for front-end compatibility
  DayNotAllowed: false
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
