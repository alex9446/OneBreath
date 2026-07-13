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
  state: 'already-set'
  groupSetted: number
  daySetted: number
  daySettedPlainDate: string
} | {
  state: 'day-not-allowed'
  isMidweekHoliday: boolean
  allowedDays: number[]
  startTime: number
  openingTime: number
} | {
  state: 'settable'
  dayOfWeek: number
  dayToMarkPlainDate: string
}

export type LeaderboardExtra = {
  fullname: string
  attendances: number
}[]

export type ResponseBody<T> = {
  message: string
  code: number
  extra: T | null
  catched_error?: unknown
}
