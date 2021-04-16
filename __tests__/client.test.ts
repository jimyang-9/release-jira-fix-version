import {getJiraVersion, releaseJiraFixVersion} from '../src/client'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {UNRELEASED_VERSION, AUTH_ERROR} from '../src/mocks'

const EMAIL = 'test@email.example'
const API_TOKEN = 'abc123'
const SUBDOMAIN = 'a-cool-subdomain'
const VERSION_ID = '1337'

const getHandler = rest.get(
  'https://:subdomain.atlassian.net/rest/api/3/version/:versionId',
  (req, res, ctx) => {
    const {subdomain, versionId} = req.params
    if (subdomain === SUBDOMAIN && versionId === VERSION_ID) {
      return res(ctx.json(UNRELEASED_VERSION))
    } else {
      return res(ctx.status(404), ctx.json(AUTH_ERROR))
    }
  }
)

const putHandler = rest.put(
  'https://:subdomain.atlassian.net/rest/api/3/version/:versionId',
  (req, res, ctx) => {
    const {subdomain} = req.params
    if (subdomain === SUBDOMAIN) {
      return res(ctx.json(req.body))
    } else {
      return res(ctx.status(404), ctx.json(AUTH_ERROR))
    }
  }
)

const server = setupServer(getHandler, putHandler)

beforeAll(() => {
  // Establish requests interception layer before all tests.
  server.listen()
})

afterAll(() => {
  // Clean up after all tests are done, preventing this
  // interception layer from affecting irrelevant tests.
  server.close()
})

describe('getJiraVersion', () => {
  it('can fetch the jira version of a project when passed in the domain and version id', async () => {
    const version = await getJiraVersion(
      EMAIL,
      API_TOKEN,
      SUBDOMAIN,
      VERSION_ID
    )
    expect(version.released).toEqual(false)
  })

  it('errors correctly when authorization fails', async () => {
    try {
      await getJiraVersion(EMAIL, 'OOPS', SUBDOMAIN, VERSION_ID)
    } catch (e) {
      expect(e.message).toMatch('this may be due to a missing/invalid API key')
    }
  })
})

describe('releaseJiraFixVersion', () => {
  it('marks the version passed in as released and returns it', async () => {
    const releasedVersion = await releaseJiraFixVersion(
      EMAIL,
      API_TOKEN,
      SUBDOMAIN,
      UNRELEASED_VERSION
    )
    expect(releasedVersion).toEqual({
      self: 'https://foo.atlassian.net/rest/api/3/version/1',
      id: '1',
      name: '1.0.0',
      archived: false,
      released: true,
      startDate: '2020-10-01',
      releaseDate: '2021-01-08',
      userStartDate: '30/Sep/20',
      userReleaseDate: '07/Jan/21',
      projectId: 123
    })
  })

  it('errors correctly when authorization fails', async () => {
    try {
      await releaseJiraFixVersion(EMAIL, 'OOPS', SUBDOMAIN, UNRELEASED_VERSION)
    } catch (e) {
      expect(e.message).toMatch('this may be due to a missing/invalid API key')
    }
  })
})
