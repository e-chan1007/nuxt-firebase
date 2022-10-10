import type { User } from 'firebase/auth'
import type { UserRecord } from 'firebase-admin/auth'

export type AuthUser = ({
  /**
   * If this property is `false`, this user is provided by Client-side Firebase SDK.
   */
  readonly isSSRData: false
} & User) | ({
  /**
   * If this property is `true`, this user is provided by Server-side Firebase SDK or JWT.
   */
  readonly isSSRData: true
} & Partial<UserRecord>);
