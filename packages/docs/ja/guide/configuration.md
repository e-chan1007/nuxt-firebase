---
prev: ./getting-started.md
---

# 設定

```ts
export interface ModuleOptions {
  config?: FirebaseOptions | string,
  configEnvPrefix?: string
  adminSDKCredential?: string | ServiceAccount
  recaptchaSiteKey?: string
  vapidKey?: string  
  useAdminSDK?: boolean
  useAuthSSR?: boolean      
  useDevtools?: boolean
  useMessagingServiceWorker?: boolean
}

const DEFAULTS: ModuleOptions = {
  useAdminSDK: false,
  useAuthSSR: true,  
  useMessagingServiceWorker: false,
  useDevtools: true
}
```

## `config`, `configEnvPrefix`

**クライアントSDK**の設定

*   環境変数 `FIREBASE_CONFIG` が存在する場合、JSONとして読み込み`initializeSDK(config)`に渡します
*   設定がオブジェクトとして渡された場合、`initializeSDK(config)`にそのまま渡します
*   設定が文字列として渡された場合、JSONとして読み込まれて`initializeSDK(config)`に渡します
*   `configPrefix` が設定されている場合は、環境変数から設定を読み込みます\
    例: `configPrefix`が`FIREBASE_`に設定されているとき

```properties
FIREBASE_API_KEY=value
FIREBASE_AUTH_DOMAIN=value
FIREBASE_PROJECT_ID=value
FIREBASE_STORAGE_BUCKET=value
FIREBASE_MESSAGING_SENDER_ID=value
FIREBASE_APP_ID=value
FIREBASE_DATABASE_URL=value
FIREBASE_MEASUREMENT_ID=value
```

使用しないサービスに関する設定は省略できることがあります。

`.env`を使って環境変数を管理することもできます。

## `adminSDKCredential`

**Admin SDK** の認証情報またはそのパス

使用する認証情報は以下の通りです。

1.  値が設定されていない場合、アプリケーションのデフォルト認証情報を利用 (環境変数 `GOOGLE_APPLICATION_CREDENTIALS`を参照)
2.  設定値をJSONとして処理
3.  設定値を認証情報が書かれたJSONファイルへのパスとして処理
4.  このオプションをそのまま認証情報として利用

**Admin SDKの認証情報が公開されないように注意してください。`.gitignore`への追記もお忘れなく。**

## `recaptchaSiteKey`

reCAPTCHAのサイトキー

値が設定されている場合、自動的に`AppCheck`を有効にします。\
`configEnvPrefix`が設定されている場合は、環境変数`${configEnvPrefix}RECAPTCHA_SITE_KEY`から値を取得します。

## `vapidKey`

FCM用のVAPID (Voluntary Application Server Identification)鍵

`configEnvPrefix`が設定されている場合は、環境変数`${configEnvPrefix}VAPID_KEY`から値を取得します。

## `useAdminSDK`

Admin SDKを利用するか

## `useAuthSSR`

Service Workerを利用したセッション管理をするか

この設定はAdmin SDKが無効であっても利用できますが、いくつかの機能が制限されることがあります。\
セキュリティ上の理由から、この設定を有効にする場合はAdmin SDKも同時に有効化することを推奨します。

::: tip
サイトを静的に生成する場合(`nuxi generate`)、この設定は自動で無効化されます。
:::

## `useDevtools`

DevToolsを利用するか

この機能を利用するためには、[`@nuxt/devtools`](https://github.com/nuxt/devtools)のインストールも必要です。

## `useMessagingServiceWorker`

モジュールに組み込まれたFirebase Cloud Messaging(FCM)用のService Workerを有効化します。
