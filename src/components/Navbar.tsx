import React from "react";
import { Modak } from "next/font/google";
// import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { type PostWizardRef } from "./CreatePostWizard";

const modak = Modak({ weight: "400", subsets: ["latin"] });

interface NavbarProps {
  isEventFeed: boolean;
  postWizardRef?: React.RefObject<PostWizardRef | null>;
}

const Navbar: React.FC<NavbarProps> = ({ isEventFeed, postWizardRef }) => {
  const user = useUser();

  const handleClick = () => {
    if (postWizardRef?.current) {
      postWizardRef.current.openModal();
    }
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-famous-black px-8 py-4">
      <div className="mx-auto flex max-w-screen-lg items-center justify-between">
        <div
          className={`${modak.className} text-3xl text-pink-400  sm:text-4xl`}
        >
          <Link href={user.isSignedIn ? "/home" : "/"}>Gather</Link>
        </div>
        <div className="flex items-center gap-4">
          {!isEventFeed && (
            <Link
              href={"/#how-it-works"}
              className="text-lg font-semibold text-pink-400"
            >
              How it works
            </Link>
          )}
          {isEventFeed ? (
            <button
              className="rounded-xl bg-pink-400 px-4 py-2 text-sm font-semibold duration-300 hover:shadow-2xl active:scale-95"
              onClick={handleClick}
            >
              New Post
            </button>
          ) : null}
          <SignedIn>
            <span className="duration-300 hover:scale-105">
              <UserButton afterSignOutUrl="/" />
            </span>
          </SignedIn>

          {/* <button className="sm:hidden">
            <Bars3Icon className="h-8 w-8 stroke-pink-400 stroke-2" />
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
