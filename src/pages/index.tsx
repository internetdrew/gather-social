import Head from "next/head";
import { SignIn } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/nextjs";

// import Link from "next/link";
// import { api } from "~/utils/api";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-400">
        <SignInButton mode="modal">
          <button className="rounded-full bg-[#CB4195] px-10 py-2 font-semibold text-white duration-300 hover:bg-pink-500 hover:shadow-lg">
            Sign in
          </button>
        </SignInButton>
      </main>
    </>
  );
}
