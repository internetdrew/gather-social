import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Head from "next/head";
import { Layout } from "~/components";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Gather Social</title>
        <meta
          name="description"
          content="Create private social networks for your special events."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RecoilRoot>
        <Toaster />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
