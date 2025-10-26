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

export type Extra = {
  alreadySet: true
  groupSetted: number
  daySetted: number
} | {
  alreadySet: false
  DTnotAllowed: true
  allowedDays: number[]
  startTime: number
} | {
  alreadySet: false
  DTnotAllowed: false
  dayOfWeek: number
}

export type ResponseBody = {
  message: string
  code: number
  extra: Extra | null
  catched_error?: unknown
}
