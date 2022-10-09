import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
  base: (process.env.BASE_URL as `/${string}/` | undefined) || '/',
  title: 'Nuxt Monaco Editor',
  description: 'The easist way to get along with Monaco Editor.',
  locales: {
    '/': {
      lang: 'en-US',
    },
    '/ja/': {
      lang: 'ja-JP'
    }
  },
  theme: defaultTheme({
    repo: 'e-chan1007/nuxt-firebase',
    docsBranch: 'main',
    docsDir: 'packages/docs',
    editLinkPattern: ':repo/edit/:branch/:path',
    locales: {
      '/': {
        selectLanguageName: 'English'
      },
      '/ja/': {
        selectLanguageName: '日本語',
        editLinkText: 'このページを編集する'
      }
    },
  })
})
