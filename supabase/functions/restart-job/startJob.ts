import { FunctionReturn } from '@shared/functions.types.ts'
import { getDenoEnv } from '@shared/mixed.ts'

type ListJobs = {
  job_definitions: {
    id: string,
    name: string
  }[]
}

const apiVersion = 'v1alpha2'
const apiBase = `https://api.scaleway.com/serverless-jobs/${apiVersion}`

export const startJob = async (job_name: string): FunctionReturn<{ statusCode: number }> => {
  const jobRegion = getDenoEnv('SCW_REGION')
  const jobDefinitionsUrl = `${apiBase}/regions/${jobRegion}/job-definitions`

  const headers = { 'X-Auth-Token': getDenoEnv('SCW_SECRET_KEY') }

  const jobDefinitions = await (await fetch(jobDefinitionsUrl, { headers })).json() as ListJobs

  const idByName = new Map(jobDefinitions.job_definitions.map(
    (definition) => [definition.name, definition.id]
  ))

  if (!idByName.has(job_name)) return {
    data: null,
    error: { message: `${job_name} not exist!`, code: 400 }
  }

  const response = await fetch(
    `${jobDefinitionsUrl}/${idByName.get(job_name)}/start`,
    { method: 'POST', headers }
  )

  return { data: { statusCode: response.status }, error: null }
}
