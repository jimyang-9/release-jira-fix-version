# Datadog Metrics Reporter Action

[![CI](https://github.com/jimyang-9/release-jira-fix-version/actions/workflows/test.yml/badge.svg)](https://github.com/jimyang-9/release-jira-fix-version/actions/workflows/test.yml) ![Package Version](https://img.shields.io/github/package-json/v/jimyang-9/release-jira-fix-version)

Get latest Jira version (released or unreleased) for a project.

## Usage

This action takes a Jira version id and marks the version as released.

e.g.

```yml
# ...

jobs:
 get-next-app-version:
    name: Get App Version Number
    runs-on: ubuntu-latest
    outputs:
      version-id: ${{ steps.get-version.outputs.id }}
    steps:
      ...gets the latest version

  release-next-app-version:
    name: Release Jira Version
    runs-on: ubuntu-latest
    steps:
      uses: jimyang-9/release-jira-fix-version@v1
      with:
        email: ${{ secrets.JIRA_EMAIL }}
        api-token: ${{ secrets.JIRA_TOKEN }}
        subdomain: example
        version-id: ${{ needs.get-next-app-version.outputs.version-id}}


### Inputs

| Name                    | Description                                                                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `email`                 | Email address associated with api-token (see [basic authentication](https://developer.atlassian.com/server/jira/platform/basic-authentication/) documentation for details) |
| `api-token`             | Api token associated with email address (see [basic authentication](https://developer.atlassian.com/server/jira/platform/basic-authentication/) documentation for details) |
| `subdomain`             | The subdomain of your Jira instance (see site-url in the [documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#version))                      |                                                                                   |
| `version-id`               | The id of the version to be released [documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#version))                         |

For more info: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-project-versions/#api-rest-api-3-project-projectidorkey-version-get
```
