declare module "node-config-ts" {
  interface IConfig {
    authority: string;
    clientId: string;
    redirectUri: string;
    postLogoutRedirectUri: string;
    backendUrl: string;
    appUrl: undefined;
  }
  export type Config = IConfig;
  export const config: Config;
}
