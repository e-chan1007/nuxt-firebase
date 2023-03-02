import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
  base: (process.env.BASE_URL as `/${string}/` | undefined) || '/',
  title: 'Nuxt Firebase',
  description: 'Integrate Firebase with Nuxt (3)',
  head: [
    ['meta', { name: 'google-site-verification', content: 'rzH-lFve_O6XXzhNiijEf4BZjsqeP_fGozFLwK1T-lQ' }]
  ],
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
        navbar: [
          {
            text: 'Guide',
            link: '/guide/getting-started'
          },
          {
            text: 'References',
            link: '/references/use-firebase'
          },
          {
            text: 'Examples',
            link: 'https://stackblitz.com/@e-chan1007/collections/nuxt-firebase-examples'
          }
        ],
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
              { text: 'useFirebase', link: '/references/use-firebase' },
              { text: 'useFirebaseAdmin', link: '/references/use-firebase-admin' },
              { text: 'useAuth', link: '/references/use-auth' },
              { text: 'useServerAuth', link: '/references/use-server-auth' },
              { text: 'useFCMToken', link: '/references/use-fcmtoken' }
            ]
          }
        ]
      },
      '/ja/': {
        selectLanguageName: '日本語',
        editLinkText: 'このページを編集する',
        lastUpdatedText: '最終更新',
        contributorsText: '著者',
        navbar: [
          {
            text: 'ガイド',
            link: '/ja/guide/getting-started'
          },
          {
            text: 'リファレンス',
            link: '/ja/references/use-firebase'
          },
          {
            text: 'サンプル',
            link: 'https://stackblitz.com/@e-chan1007/collections/nuxt-firebase-examples'
          }
        ],
        sidebar: [
          {
            text: 'ガイド',
            children: [
              { text: 'はじめる', link: '/ja/guide/getting-started' },
              { text: '設定', link: '/ja/guide/configuration' }
            ]
          },
          {
            text: 'リファレンス',
            children: [
              { text: 'useFirebase', link: '/ja/references/use-firebase' },
              { text: 'useFirebaseAdmin', link: '/ja/references/use-firebase-admin' },
              { text: 'useAuth', link: '/ja/references/use-auth' },
              { text: 'useServerAuth', link: '/ja/references/use-server-auth' },
              { text: 'useFCMToken', link: '/ja/references/use-fcmtoken' }
            ]
          }
        ]
      }
    },
  })
})
