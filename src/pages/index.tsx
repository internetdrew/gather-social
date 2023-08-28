import Head from "next/head";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Modak } from "next/font/google";
import Link from "next/link";

const modak = Modak({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const user = useUser();

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
      <main className="flex h-screen flex-col items-center justify-center overflow-y-hidden bg-blue-500 px-3">
        <p className={`${modak.className} text-8xl text-pink-500`}>Gather</p>
        <h1 className="mb-5 text-center text-2xl font-semibold text-white md:text-3xl">
          Create private social networks for your special events.
        </h1>
        {user.isSignedIn ? (
          <Link href={"/home"}>
            <button className="prevent-select rounded-full bg-pink-500 px-10 py-2 text-lg font-semibold ring-1 ring-black transition-shadow hover:shadow-2xl">
              See my events
            </button>
          </Link>
        ) : (
          <SignInButton mode="modal" redirectUrl="/home">
            <button className="prevent-select rounded-full bg-pink-500 px-10 py-2 text-xl font-semibold text-white transition-shadow hover:shadow-2xl">
              Get started
            </button>
          </SignInButton>
        )}
      </main>
    </>
  );
}
