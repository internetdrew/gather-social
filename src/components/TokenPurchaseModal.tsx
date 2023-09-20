import React, { useRef, useState } from "react";
import { api } from "~/utils/api";

const TokenPurchaseModal = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [tokenCount, setTokenCount] = useState(1);

  const { mutate: createCheckoutSession } =
    api.checkout.createSession.useMutation();

  console.log(modalRef.current);

  return (
    <dialog
      ref={modalRef}
      className="top-1/2 flex h-64 w-[95%] -translate-y-1/2 items-center justify-center overflow-hidden rounded-3xl text-center ring-1 ring-black sm:w-1/2 lg:w-1/3"
    >
      <div className="w-3/4">
        <label htmlFor="count" className="font-medium">
          How many event credits would you like?
        </label>
        <input
          type="number"
          id="count"
          name="count"
          min={1}
          max={10}
          value={tokenCount}
          placeholder="Choose up to 10"
          className="mx-auto mt-4 w-3/4 rounded-lg border border-gray-600 p-4"
          onChange={(e) => setTokenCount(+e.target.value)}
        />
        <button
          className="mt-4 h-full w-3/4 rounded-full bg-pink-500 px-4 py-2 text-center font-semibold ring-1 ring-black duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={() => createCheckoutSession({ tokens: tokenCount })}
        >
          Go to checkout
        </button>
      </div>
    </dialog>
  );
};

export default TokenPurchaseModal;
