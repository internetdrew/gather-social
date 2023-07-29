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
          content="Create private social networks for your events."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-300">
        <input type="file" accept="image/x-png,image/jpeg,image/gif" />
        <SignInButton />
        <SignIn />
      </main>
    </>
  );
}
