import { readFile } from 'fs/promises'

export const getJSTemplateContents = (filePath: string) => async ({ options }: any): Promise<string> => {
  const template = (
    await readFile(filePath)
      .catch(() => readFile(filePath + '.ts'))
      .catch(() => readFile(filePath + '.mjs'))
      .catch(() => readFile(filePath + '.js'))
  ) .toString('utf-8')
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
