import React, { type ReactNode } from "react";
import { Navbar, Footer, CreatePostWizard } from "./";
import { useRouter } from "next/router";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isEventFeed = router.pathname.startsWith("/event/feed/");
  const eventId = router.query.eventId as string;

  return (
    <div className="flex flex-col">
      <Navbar isEventFeed={isEventFeed} />
      {eventId && <CreatePostWizard eventId={eventId} />}
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
