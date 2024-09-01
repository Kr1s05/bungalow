/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    authority: string
    clientId: string
    redirectUri: string
    postLogoutRedirectUri: string
    backendUrl: string
  }
  export const config: Config
  export type Config = IConfig
}
