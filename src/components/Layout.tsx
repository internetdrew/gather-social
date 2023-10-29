import React, { useRef, type ReactNode } from "react";
import { Navbar, Footer, CreatePostWizard } from "./";
import { useRouter } from "next/router";
import { type PostWizardRef } from "./CreatePostWizard";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const postWizardRef = useRef<PostWizardRef | null>(null);
  const isEventFeed = router.pathname.startsWith("/event/feed/");
  const eventId = router.query.eventId as string;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isEventFeed={isEventFeed} postWizardRef={postWizardRef} />
      {eventId && <CreatePostWizard eventId={eventId} ref={postWizardRef} />}
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
