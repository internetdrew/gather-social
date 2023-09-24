import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
    onError: (err) => console.error(err),
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
        <p className="mb-4 animate-pulse">
          {tokens?.qty
            ? `Now adding ${tokens.qty} new ${
                tokens.qty === 1 ? "token" : "tokens"
              } to your account...`
            : null}
        </p>
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
