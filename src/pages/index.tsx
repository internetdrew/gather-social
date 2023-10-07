import { SignInButton, useUser } from "@clerk/nextjs";
import { Modak } from "next/font/google";
import Link from "next/link";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

const modak = Modak({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const user = useUser();

  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center bg-famous-black px-3">
        <section>
          <p
            className={`${modak.className} text-center text-8xl text-pink-400`}
          >
            Gather
          </p>
          <h1 className="mb-5 text-center text-2xl font-semibold text-famous-white md:text-3xl">
            Create private social networks for your special events.
          </h1>
          <div className="flex flex-col items-center justify-center gap-6 text-famous-black md:flex-row">
            {user.isSignedIn ? (
              <Link href={"/home"}>
                <button className="prevent-select rounded-full bg-pink-400 px-10 py-2 text-lg font-semibold ring-1 ring-black transition-shadow duration-300 hover:shadow-md hover:shadow-pink-400/40">
                  See my events
                </button>
              </Link>
            ) : (
              <SignInButton mode="modal" redirectUrl="/home">
                <button className="prevent-select rounded-full bg-pink-400 px-10 py-2 text-lg font-semibold transition-shadow duration-300 hover:shadow-md hover:shadow-pink-400/40">
                  Get started
                </button>
              </SignInButton>
            )}
            <Link
              href={"/"}
              className="flex items-center justify-center rounded-full bg-famous-black px-9 py-2 text-lg font-semibold text-pink-400 ring-1 ring-pink-400 duration-300 hover:shadow-md hover:shadow-pink-400/40"
            >
              How it works
              <ArrowDownIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
