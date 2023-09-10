import React from "react";
import { Modak } from "next/font/google";
// import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { type PostWizardRef } from "./CreatePostWizard";

const modak = Modak({ weight: "400", subsets: ["latin"] });

interface NavbarProps {
  isEventFeed: boolean;
  postWizardRef?: React.RefObject<PostWizardRef | null>;
}

const Navbar: React.FC<NavbarProps> = ({ isEventFeed, postWizardRef }) => {
  const handleClick = () => {
    if (postWizardRef?.current) {
      postWizardRef.current.openModal();
    }
  };

  return (
    <nav className="sticky top-0 bg-[#3b82f6]">
      <div className="mx-auto flex max-w-screen-lg items-center justify-between bg-transparent p-4">
        <div
          className={`${modak.className} text-3xl text-pink-500  sm:text-4xl`}
        >
          <Link href={"/home"}>Gather</Link>
        </div>
        <div className="flex items-center gap-4">
          {isEventFeed ? (
            <button
              className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold duration-300 hover:shadow-2xl active:scale-95"
              onClick={handleClick}
            >
              New Post
            </button>
          ) : null}
          <SignedIn>
            <span className="duration-300 hover:scale-105">
              <UserButton />
            </span>
          </SignedIn>
          {/* <button className="sm:hidden">
            <Bars3Icon className="h-8 w-8 stroke-pink-500 stroke-2" />
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
