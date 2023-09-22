import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
// import Link from "next/link";
import { api } from "~/utils/api";

interface SuccessPageProps {
  sessionId: string;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ sessionId }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const { data: tokens } = api.checkout.getTokenPurchaseQuantity.useQuery({
    sessionId: sessionId,
  });

  const { mutate: addTokensToDb } = api.tokens.addToDatabase.useMutation({
    onError: (err) => console.log(err),
    onSuccess: () => {
      void router.replace("/home");
    },
  });

  useEffect(() => {
    if (tokens?.qty) {
      const qty: number = tokens.qty;
      addTokensToDb({ sessionId, qty });
    }
  }, [addTokensToDb, sessionId, tokens?.qty]);

  return (
    <main className=" flex h-full items-center justify-center">
      <div className="mx-auto w-[95%] rounded-lg bg-slate-100 p-6 text-center ring-1 ring-black md:w-1/3 lg:w-1/4">
        <h1 className="text-2xl font-semibold">
          {isLoaded ? `Thanks, ${user?.firstName}!` : null}
        </h1>
        {/* <p className="mb-4 animate-pulse">
          {tokenCount.count
            ? `Now adding ${tokenCount} new ${
                tokenCount === 1 ? "token" : "tokens"
              } to your account...`
            : null}
        </p> */}
        {/* <Link
          href="/home"
          className="rounded-2xl bg-pink-500 px-4 py-2 font-medium ring-1 ring-black duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
        >
          Back to home
        </Link> */}
      </div>
    </main>
  );
};

export function getServerSideProps(context: { query: { session_id: string } }) {
  const sessionId = context.query.session_id;

  return {
    props: {
      sessionId,
    },
  };
}

export default SuccessPage;
