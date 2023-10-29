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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta name="robots" content="index,follow" />

        <link rel="canonical" href="https://www.gather-social.com/" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gather Social" />
        <meta
          property="og:description"
          content="Create private social networks for your special events."
        />
        <meta property="og:url" content="https://www.gather-social.com/" />
        <meta property="og:image" content="/Gather Social Image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gather Social" />
        <meta
          name="twitter:description"
          content="Create private social networks for your special events."
        />
        <meta name="twitter:image" content="/Gather Social Image.png" />
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
