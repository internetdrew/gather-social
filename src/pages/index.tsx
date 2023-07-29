import Head from "next/head";
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
          <button className=" hover:shadow-3xl rounded-full bg-[#CB4195] px-10 py-2 text-xl font-semibold text-white transition-colors duration-300 hover:bg-[#FFA7E4] hover:text-blue-500">
            Sign in
          </button>
        </SignInButton>
      </main>
    </>
  );
}
