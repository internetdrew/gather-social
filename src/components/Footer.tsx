import { useRef } from "react";
import { useUser } from "@clerk/nextjs";
import FeedbackModal from "./FeedbackModal";
import type { FeedbackModalRef } from "./FeedbackModal";

const Footer = () => {
  const user = useUser();
  const feedbackModalRef = useRef<FeedbackModalRef | null>(null);

  const openFeedbackModal = () => {
    if (feedbackModalRef.current) {
      feedbackModalRef.current.openModal();
    }
  };

  return (
    <footer className="mt-auto w-full py-4">
      <div
        className={`mx-auto flex w-full max-w-screen-lg items-center ${
          user.isSignedIn ? "justify-between" : "justify-center"
        } text-center text-lg font-semibold text-pink-400`}
      >
        <p className="text-famous-white">
          Made by{" "}
          <a
            href="https://internetdrew.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-pink-400 hover:underline hover:underline-offset-4"
          >
            Internet Drew
          </a>{" "}
        </p>

        {user.isSignedIn && (
          <button
            className="rounded-xl bg-pink-400 px-4 py-2 text-sm font-semibold text-famous-black duration-300 hover:shadow-2xl active:scale-95"
            onClick={openFeedbackModal}
          >
            Leave feedback
          </button>
        )}
      </div>
      <FeedbackModal ref={feedbackModalRef} />
    </footer>
  );
};

export default Footer;
