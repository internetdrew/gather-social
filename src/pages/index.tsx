import Head from "next/head";
import { SignInButton } from "@clerk/nextjs";
import { Modak } from "next/font/google";

const modak = Modak({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Gather Social</title>
        <meta
          name="description"
          content="Create private social networks for your special events."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-400 px-2">
        <p className={`${modak.className} text-8xl text-[#FFA7E4]`}>Gather</p>
        <h1 className="mb-5 text-center text-3xl text-white">
          Create private social networks for your special events.
        </h1>
        <SignInButton mode="modal">
          <button className="hover:shadow-3xl rounded-2xl bg-[#FFA7E4] px-10 py-2 text-xl font-semibold text-white transition-colors duration-300 hover:bg-[#CB4195]">
            Get started
          </button>
        </SignInButton>
      </main>
    </>
  );
}
