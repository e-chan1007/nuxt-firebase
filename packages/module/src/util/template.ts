import { stat, readFile } from 'fs/promises'

export const getJSTemplateContents = (filePath: string) => async ({ options }: any): Promise<string> => {
  const template = await readTSSafe(filePath)
  return template.replace(
    /const options(: Options)? = {}/,
    [
      'const options = {',
      Object.entries(options)
        .map(([varName, value]) => `  ${varName}: ${typeof value === 'undefined' ? 'undefined' : JSON.stringify(value)}`)
        .join(',\n'),
      '}'
    ]
      .join('\n')
  )
}

export const readTSSafe = (filePath: string) =>
  readFile(filePath, 'utf-8')
    .catch(() => readFile(filePath + '.ts', 'utf-8'))
    .catch(() => readFile(filePath + '.mjs', 'utf-8'))
    .catch(() => readFile(filePath + '.js', 'utf-8'))
