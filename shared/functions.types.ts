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
  DTnotAllowed: true
  allowedDays: number[]
  startTime: number
} | {
  alreadySet: false
  DTnotAllowed: false
  dayOfWeek: number
  dayToMarkPlainDate: string
}

export type LeaderboardExtra = {
  first_name: string
  apg: number
}[]

export type ResponseBody<T> = {
  message: string
  code: number
  extra: T | null
  catched_error?: unknown
}
