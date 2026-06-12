import { FunctionsHttpError, type FunctionInvokeOptions } from '@supabase/supabase-js'
import type { SupabaseClientDB } from '@shared/shortcut.types'

const invokeFunctions = async ( supabaseClient: SupabaseClientDB,
                                functionName: string,
                                body: FunctionInvokeOptions['body'] ) => {
  const { data, error } = await supabaseClient.functions.invoke(functionName, { body })
  if (error instanceof FunctionsHttpError) return await error.context.json()
  if (error) throw error
  return data
}

export default invokeFunctions
