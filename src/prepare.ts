import * as core from '@actions/core'
import { execSync } from 'child_process'
import { Folders } from './types'

export async function prepare(commands: string[], folders: Folders) {
  const promises = Object.values(folders).map(folder => {
    return new Promise(async (resolve, reject) => {
      for (const command of commands) {
        core.info(`${folder}: ${command}`)
        execSync(command, { cwd: folder })
      }
      resolve(undefined)
    })
  })

  try {
    await Promise.all(promises)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) console.error(error.message)
  }
}