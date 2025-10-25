export type Extra = {
  groupSetted?: number
  daySetted?: number
  day_of_week?: number
}

type Error = {
  message: string
  code: number
  extra?: Extra
}

export type FunctionReturn = Promise<{
  data?: { userId: string }
  error: Error | null
}>

export type ResponseBody = {
  message: string
  code: number
  extra?: Extra
} | {
  catched_error: unknown
  code: number
}
