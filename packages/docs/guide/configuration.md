---
prev: ./getting-started.md
---

# Configuration

```ts
export interface ModuleOptions {
  config?: FirebaseOptions | string,
  configEnvPrefix?: string
  recaptchaSiteKey?: string
  authSSR?: boolean
  adminSDKCredential?: string | ServiceAccount
  disableAdminSDK?: boolean
  injectMessagingServiceWorker?: boolean
  vapidKey?: string
  devtools?: boolean
}

const DEFAULTS: ModuleOptions = {
  authSSR: true,
  disableAdminSDK: false,
  injectMessagingServiceWorker: false,
  devtools: true
}
```

## `config` and `configEnvPrefix`

**client** SDK options.

*   If `FIREBASE_CONFIG` env is available, parse the value as JSON and pass it to `initializeSDK(config)`.
*   If `config` (as Object) is provided, pass the original value to `initializeSDK(config)`.
*   If `config` (as String) is provided, parse the value as JSON and pass it to `initializeSDK(config)`.
*   If `configEnvPrefix` is provided, read the config from environment variables.
    For example: (`configEnvPrefix`=`FIREBASE_`)

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

You might be able to omit some options which are for the service you don't use.

You can also use `.env`.

## `recaptchaSiteKey`

reCAPTCHA site key.\
If this option is provided, automatically enable `AppCheck`.

If `configEnvPrefix` is provided, read the value from `${configPrefix}RECAPTCHA_SITE_KEY`

## `authSSR`

Whether to use Service Worker for the authenticate session management.\
This option can be used without Admin SDK, but some features would be disabled.\
For security reasons, it is highly recommended to set Admin SDK credential, too.

::: tip
If you do Static Site Generation (`nuxi generate`), this option will automatically disabled.
:::

## `adminSDKCredential`

The credential of **Admin SDK** or its path.

The way to determine which credential to use:

1.  Use Application Default Credentials if undefined (Read the file defined in `GOOGLE_APPLICATION_CREDENTIALS`)
2.  Parse this value as JSON
3.  Parse this value as the file path of the JSON file
4.  Use this value as the credential

**If you use Admin SDK, be careful not to publish the credential file. Make sure that the file is `gitignored`.**

## `disableAdminSDK`

Whether to disable Admin SDK.

## `injectMessagingServiceWorker`

Whether to use builtin service worker for Cloud Messaging.

## `vapidKey`

VAPID (Voluntary Application Server Identification) key for Cloud Messaging
If `configEnvPrefix` is provided, read the value from `${configPrefix}VAPID_KEY`

## `devtools`

Whether to enable DevTools.
If you want to use this, you should also install [`@nuxt/devtools`](https://github.com/nuxt/devtools).
