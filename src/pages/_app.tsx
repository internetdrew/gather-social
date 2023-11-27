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
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Gather Social</title>

        <meta property="og:title" content="Gather Social" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Create private social networks for your special events."
        />
        <meta
          property="og:image"
          content="https://www.gather-social.com/testing.jpg"
        />
        <meta property="og:url" content="https://www.gather-social.com/" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:site_name" content="Gather Social" />
        <meta name="twitter:image:alt" content="Alt text for image" />

        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <ClerkProvider {...pageProps}>
        <RecoilRoot>
          <Toaster />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RecoilRoot>
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
