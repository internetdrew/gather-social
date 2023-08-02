import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserProfile = () => {
  const { user } = useUser();

  return (
    <article className="flex w-[90%] flex-col items-center justify-between space-y-10 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <div className="flex flex-col items-center justify-center">
        {user && (
          <div className="h-16 w-16 overflow-hidden rounded-full">
            <Image
              src={user?.profileImageUrl}
              width={80}
              height={80}
              alt="user image"
            />
          </div>
        )}
        <p className="text-xl font-semibold">Hi, {user?.firstName}!</p>
        <p className="text-slate-500">You have X active events right now.</p>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row ">
        <Link href={"/new"} className="">
          <button className="h-full w-full rounded-xl bg-pink-500 px-4 py-2 font-semibold text-white transition-shadow hover:shadow-xl">
            Host an event
          </button>
        </Link>
        <Link href={"/join"} className=" ">
          <button className="h-full w-full rounded-xl px-4 py-2 font-semibold text-pink-500 ring-1 ring-pink-500 transition-shadow hover:shadow-xl">
            Join an event
          </button>
        </Link>
      </div>
    </article>
  );
};

const EventsFeed = () => {
  const events = [
    "Bob and lisa's wedding",
    "Some other event",
    "Storm the psych ward",
  ];

  return (
    <article className="flex w-[90%] flex-col space-y-2 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold">Active Events</h2>
      </div>
      <div>
        <h3 className="text-lg text-slate-500">Hosting</h3>
        {events?.map((event, idx) => (
          <div key={idx}>{event}</div>
        ))}
        <h3 className="mt-6 text-lg text-slate-500">Attending</h3>
        {events?.map((event, idx) => (
          <div key={idx}>{event}</div>
        ))}
      </div>
    </article>
  );
};

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Gather Social Dashboard</title>
        <meta
          name="description"
          content="See private social networks you're hosting and attending."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-10 pt-20">
          <UserProfile />
          <EventsFeed />
        </section>
      </main>
    </>
  );
};

export default Dashboard;
