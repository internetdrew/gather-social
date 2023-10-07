import { useUser } from "@clerk/nextjs";

const Footer = () => {
  const user = useUser();

  return (
    <footer className="w-full p-3">
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
            className="text-pink-400 hover:shadow-md hover:shadow-pink-400/40"
          >
            Internet Drew
          </a>
        </p>

        {user.isSignedIn && (
          <button className="hover:shadow-md hover:shadow-pink-400/40">
            Leave Feedback
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
