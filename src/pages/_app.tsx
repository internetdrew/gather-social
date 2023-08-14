import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
