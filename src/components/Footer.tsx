import { useUser } from "@clerk/nextjs";

const Footer = () => {
  const user = useUser();

  return (
    <footer className="fixed bottom-0 w-full p-3">
      <div
        className={`mx-auto mt-auto flex w-full max-w-screen-lg items-center ${
          user.isSignedIn ? "justify-between" : "justify-center"
        } text-center text-lg font-semibold text-pink-400`}
      >
        <p className="text-famous-white">
          Made with love by{" "}
          <a
            href="https://internetdrew.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-pink-400 hover:underline hover:underline-offset-4"
          >
            Internet Drew
          </a>
        </p>

        {user.isSignedIn && (
          <button className="hover:underline hover:underline-offset-4">
            Leave Feedback
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
