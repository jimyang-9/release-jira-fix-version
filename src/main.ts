import * as core from '@actions/core'
import {EMAIL, API_TOKEN, SUBDOMAIN, VERSION_ID} from './env'
import {getJiraVersion, releaseJiraFixVersion} from './client'

async function run(): Promise<void> {
  try {
    const version = await getJiraVersion(
      EMAIL,
      API_TOKEN,
      SUBDOMAIN,
      VERSION_ID
    )

    if (!version) {
      core.setFailed('Could not find version')
    }

    if (version?.released === true) {
      core.setFailed('Version is already released')
    }

    const releasedVersion = await releaseJiraFixVersion(
      EMAIL,
      API_TOKEN,
      SUBDOMAIN,
      version
    )

    if (!releasedVersion || !releasedVersion?.released) {
      core.setFailed('Could not release version')
    }

    core.startGroup('Released Version')
    for (const key in releasedVersion) {
      const value = releasedVersion[key as keyof typeof releasedVersion]
      core.info(`${key}: ${value}`)
      core.setOutput(key, value)
    }
    core.endGroup()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
