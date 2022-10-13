import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
  base: (process.env.BASE_URL as `/${string}/` | undefined) || '/',
  title: 'Nuxt Firebase',
  description: 'Integrate Firebase with Nuxt (3)',
  locales: {
    '/': {
      lang: 'en-US'
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
        selectLanguageName: 'English',
        sidebar: [
          {
            text: 'Guide',
            children: [
              { text: 'Getting Started', link: '/guide/getting-started' },
              { text: 'Configuration', link: '/guide/configuration' }
            ]
          },
          {
            text: 'References',
            children: [
              { text: 'useFirebase', link: '/reference/use-firebase' },
              { text: 'useFirebaseAdmin', link: '/reference/use-firebase-admin' },
              { text: 'useAuth', link: '/reference/use-auth' },
              { text: 'useServerAuth', link: '/reference/use-server-auth' },
            ]
          }
        ]
      },
      '/ja/': {
        selectLanguageName: '日本語',
        sidebar: [
          {
            text: 'Guide',
            children: [
              { text: 'はじめる', link: '/ja/guide/getting-started' },
              { text: 'コンフィギュレーション', link: '/ja/guide/configuration' }
            ]
          },
          {
            text: 'リファレンス',
            children: [
              { text: 'useFirebase', link: '/ja/reference/use-firebase' },
              { text: 'useFirebaseAdmin', link: '/ja/reference/use-firebase-admin' },
              { text: 'useAuth', link: '/ja/reference/use-auth' },
              { text: 'useServerAuth', link: '/ja/reference/use-server-auth' },
            ]
          }
        ]
      }
    },
  })
})
