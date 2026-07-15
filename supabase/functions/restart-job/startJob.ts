import { FunctionReturn } from '@shared/functions.types.ts'

type ListJobs = {
  job_definitions: {
    id: string,
    name: string
  }[]
}

const apiVersion = 'v1alpha2'
const apiBase = `https://api.scaleway.com/serverless-jobs/${apiVersion}`

type StartJobReturn = FunctionReturn<{ statusCode: number }>
export const startJob = async ( jobName: string, jobRegion: string,
                                scwSecretKey: string ): StartJobReturn => {

  const jobDefinitionsUrl = `${apiBase}/regions/${jobRegion}/job-definitions`

  const headers = { 'X-Auth-Token': scwSecretKey }

  const jobDefinitions = await (await fetch(jobDefinitionsUrl, { headers })).json() as ListJobs

  const idByName = new Map(jobDefinitions.job_definitions.map(
    (definition) => [definition.name, definition.id]
  ))

  if (!idByName.has(jobName)) return {
    data: null,
    error: { message: `${jobName} not exist!`, code: 400 }
  }

  const response = await fetch(
    `${jobDefinitionsUrl}/${idByName.get(jobName)}/start`,
    { method: 'POST', headers }
  )

  return { data: { statusCode: response.status }, error: null }
}
