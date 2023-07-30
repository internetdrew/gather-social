import { UserButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import React from "react";

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
        <nav className="mx-auto flex max-w-5xl justify-end p-6">
          <div className="ml-auto">
            <UserButton />
          </div>
        </nav>
        <section className="mx-auto flex max-w-2xl justify-center pt-20"></section>
      </main>
    </>
  );
};

export default Dashboard;
