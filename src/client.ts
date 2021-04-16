import * as core from '@actions/core'
import axios, {AxiosError} from 'axios'
import {Version} from './models'

const toMoreDescriptiveError = (error: unknown): Error | unknown => {
  if (
    isAxiosError(error) &&
    error.response?.status === 404 &&
    Array.isArray(error.response.data?.errorMessages)
  ) {
    return new Error(
      `${error.response.data?.errorMessages[0]} (this may be due to a missing/invalid API key)`
    )
  } else {
    core.debug(`error: ${error}`)
    return error
  }
}

export const getJiraVersion = async (
  email: string,
  apiToken: string,
  domain: string,
  versionId: string
): Promise<Version> => {
  try {
    core.debug('getting version...')
    const response = await axios.get(
      `https://${domain}.atlassian.net/rest/api/3/version/${versionId}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString(
            'base64'
          )}`,
          Accept: 'application/json'
        }
      }
    )
    return response?.data
  } catch (error: unknown) {
    throw toMoreDescriptiveError(error)
  }
}

export const releaseJiraFixVersion = async (
  email: string,
  apiToken: string,
  domain: string,
  version: Version
): Promise<Version> => {
  try {
    core.debug('releasing...')
    const response = await axios.put(
      `https://${domain}.atlassian.net/rest/api/3/version/${version.id}`,
      {...version, released: true},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString(
            'base64'
          )}`,
          Accept: 'application/json'
        }
      }
    )

    return response?.data
  } catch (error: unknown) {
    throw toMoreDescriptiveError(error)
  }
}

const isAxiosError = (error: any): error is AxiosError =>
  error?.isAxiosError ?? false
