import axios, { AxiosInstance } from "axios";
import { useAuth } from "oidc-react";
import { PropsWithChildren, createContext } from "react";
import { config } from "node-config-ts";

// @ts-expect-error context value starts as undefined
export const ClientContext = createContext<AxiosInstance>(undefined);
export function AxiosClientProvider(props: PropsWithChildren) {
  const auth = useAuth();
  const client = axios.create({
    baseURL: config.backendUrl,
    withCredentials: true,
  });
  client.defaults.headers.common.Authorization =
    "Bearer " + auth.userData?.access_token;
  return (
    <div>
      <ClientContext.Provider value={client}>
        {props.children}
      </ClientContext.Provider>
    </div>
  );
}
