import { readFile } from 'fs/promises'

export const getJSTemplateContents = (filePath: string) => async ({ options }: any): Promise<string> => {
  const template = (await readFile(filePath)).toString('utf-8')
  return template.replace(
    '/* [ Inject Variables Here ] */',
    Object.entries(options)
      .map(([varName, value]) => `const ${varName} = ${JSON.stringify(value)}`)
      .join('\n')
  )
}
