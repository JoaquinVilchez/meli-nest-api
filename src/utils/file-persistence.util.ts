import * as fs from 'fs'
import * as path from 'path'

export class FilePersistenceUtil {
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath)
  }

  static async persistData<T>(
    filePath: string,
    data: T,
    options: { pretty?: boolean; spaces?: number } = {},
  ): Promise<void> {
    try {
      const { pretty = true, spaces = 2 } = options
      const jsonData = pretty ? JSON.stringify(data, null, spaces) : JSON.stringify(data)

      const dir = path.dirname(filePath)
      if (!this.fileExists(dir)) {
        throw new Error(`File not found: ${filePath}`)
      }

      await fs.promises.writeFile(filePath, jsonData, 'utf8')
    } catch (error) {
      console.error(`Error persisting data to ${filePath}:`, error)
      throw new Error(`Failed to persist data to file: ${filePath}`)
    }
  }

  static async readData<T>(filePath: string): Promise<T> {
    try {
      if (!this.fileExists(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      const fileContent = await fs.promises.readFile(filePath, 'utf8')
      return JSON.parse(fileContent) as T
    } catch (error) {
      console.error(`Error reading data from ${filePath}:`, error)
      throw new Error(`Failed to read data from file: ${filePath}`)
    }
  }
}
