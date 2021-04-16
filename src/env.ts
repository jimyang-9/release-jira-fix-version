import * as core from '@actions/core'
import dotenv from 'dotenv'
dotenv.config()

export const EMAIL: string = core.getInput('email', {required: true})
export const API_TOKEN: string = core.getInput('api-token', {required: true})
export const SUBDOMAIN: string = core.getInput('subdomain', {required: true})
export const VERSION_ID: string = core.getInput('version-id', {required: true})
