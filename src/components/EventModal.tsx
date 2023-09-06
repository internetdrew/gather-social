import {
  useRef,
  forwardRef,
  useImperativeHandle,
  type ForwardRefRenderFunction,
} from "react";
import { type Event } from "./EventCard";
import { api } from "~/utils/api";

interface EventModalProps {
  event: Event | null;
}

export interface EventModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const EventModal: ForwardRefRenderFunction<EventModalRef, EventModalProps> = (
  { event },
  ref
) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (modalRef.current) modalRef.current.showModal();
  };

  const closeModal = () => {
    if (modalRef.current) modalRef.current.close();
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  const ctx = api.useContext();

  const { mutate: activateEvent, isLoading } = api.events.activate.useMutation({
    onSuccess: async () => {
      closeModal();
      await ctx.events.getCurrentUserEvents.invalidate();
    },
    onError: (error) => console.error(error),
  });

  return (
    <dialog
      className="top-1/2 h-56 w-[95%] -translate-y-1/2 overflow-hidden rounded-3xl text-center font-semibold ring-1 ring-black sm:w-1/2 lg:w-1/3 xl:w-1/4"
      ref={modalRef}
    >
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col bg-slate-100 p-4">
          <p className="text-xl font-normal">
            Activate the event space for{" "}
            <span className="font-semibold">{event ? event.title : null}</span>?
          </p>
          <p className="mt-1">{"You'll have 30 days to use the space."}</p>
          <div className="mx-auto mt-auto flex w-[90%] items-center justify-between gap-4">
            <button
              className="w-full rounded-full bg-pink-500 px-4 py-2 ring-1 ring-black duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
              onClick={() => {
                if (event) activateEvent({ id: event.id });
              }}
            >
              Yes
            </button>
            <button
              className="w-full rounded-full px-4 py-2 ring-1 ring-black duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
              onClick={closeModal}
            >
              No
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default forwardRef(EventModal);
